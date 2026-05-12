import { asyncHandler } from "../middleware/asyncHandler.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/user.js";
import * as userServices from "../services/userServices.js";
import * as projectService from "../services/projectServices.js";
import * as requestService from "../services/requestServices.js";
import * as notificationService from "../services/notificationServices.js";
import { Project } from "../models/project.js";
import { Notification } from "../models/notification.js";
import * as fileServices from "../services/fileServices.js";
import mongoose from "mongoose";
import {
  ALLOWED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_FILES,
  MAX_UPLOAD_FILE_SIZE,
} from "../middleware/upload.js";
import path from "path";
import fs from "fs";

const cleanupUploadedFiles = (files = []) => {
  for (const file of files) {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

export const getStudentProject = asyncHandler(async (req, res, next) => {
  const studentId = req.user._id;

  const project = await projectService.getProjectByStudent(studentId);

  if (!project) {
    return res.status(200).json({
      success: true,
      data: { project: null },
      message: "No project found for this student",
    });
  }
  return res.status(200).json({
    success: true,
    data: { project },
  });
});

export const submitProposal = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const studentId = req.user._id;

  const existingProject = await projectService.getProjectByStudent(studentId);

  if (existingProject && existingProject.status !== "rejected") {
    return next(
      new ErrorHandler(
        "You already have an active project. You can only submit a new proposal if the previous one was rejected.",
        400,
      ),
    );
  }

  if (existingProject && existingProject.status === "rejected") {
    await Project.findByIdAndDelete(existingProject._id);
  }

  const projectData = {
    student: studentId,
    title,
    description,
  };
  const project = await projectService.createProject(projectData);

  await User.findByIdAndUpdate(studentId, { project: project._id });

  res.status(201).json({
    success: true,
    data: { project },
    message: "Project proposal submitted successfully",
  });
});

export const uploadFiles = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const studentId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    cleanupUploadedFiles(req.files);
    return next(new ErrorHandler("Invalid project ID", 400));
  }

  const project = await projectService.getProjectById(projectId);

  if (!project || project.student._id.toString() !== studentId.toString()) {
    cleanupUploadedFiles(req.files);
    return next(
      new ErrorHandler("Not authorized to upload files to this project", 403),
    );
  }

  if (project.status !== "approved") {
    cleanupUploadedFiles(req.files);
    return next(
      new ErrorHandler("Files can only be uploaded for approved projects", 400),
    );
  }

  if (!req.files || req.files.length === 0) {
    return next(new ErrorHandler("No files uploaded", 400));
  }

  if (req.files.length > MAX_UPLOAD_FILES) {
    cleanupUploadedFiles(req.files);
    return next(
      new ErrorHandler(`You can upload a maximum of ${MAX_UPLOAD_FILES} files at once`, 400),
    );
  }

  const invalidFile = req.files.find((file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    return (
      !ALLOWED_UPLOAD_EXTENSIONS.includes(ext) ||
      file.size > MAX_UPLOAD_FILE_SIZE
    );
  });

  if (invalidFile) {
    cleanupUploadedFiles(req.files);
    return next(
      new ErrorHandler(
        `${invalidFile.originalname} is not allowed or exceeds the 10MB limit`,
        400,
      ),
    );
  }

  const existingNames = new Set(
    (project.files || []).map((file) => file.originalName?.toLowerCase()),
  );
  const uploadedNames = new Set();
  const duplicateFile = req.files.find((file) => {
    const name = file.originalname.toLowerCase();
    if (existingNames.has(name) || uploadedNames.has(name)) return true;
    uploadedNames.add(name);
    return false;
  });

  if (duplicateFile) {
    cleanupUploadedFiles(req.files);
    return next(
      new ErrorHandler(`${duplicateFile.originalname} has already been selected or uploaded`, 400),
    );
  }

  const updatedProject = await projectService.addFilesToProject(
    projectId,
    req.files,
  );

  res.status(200).json({
    success: true,
    message: "Files uploaded successfully",
    data: { project: updatedProject },
  });
});

export const getAvailableSupervisors = asyncHandler(async (req, res, next) => {
  const supervisors = await User.find({ role: "Teacher" })
    .select("name email department experties")
    .lean();

  res.status(200).json({
    success: true,
    data: { supervisors },
    message: "Available supervisros fetched successfully",
  });
});

export const getSupervisor = asyncHandler(async (req, res, next) => {
  const studentId = req.user._id;
  const student = await User.findById(studentId).populate(
    "supervisor",
    "name email department experties",
  );

  if (!student.supervisor) {
    return res.status(200).json({
      success: true,
      data: { supervisor: null },
      message: "No supervisor assigned yet",
    });
  }

  res.status(200).json({
    success: true,
    data: { supervisor: student.supervisor },
  });
});

export const requestSupervisor = asyncHandler(async (req, res, next) => {
  const { supervisorId, message } = req.body;
  const studentId = req.user._id;

  if (!supervisorId) {
    return next(new ErrorHandler("Supervisor ID is required", 400));
  }

  const student = await User.findById(studentId);

  if (student.supervisor) {
    return next(
      new ErrorHandler("You already have a supervisor assigned.", 400),
    );
  }

  const supervisor = await User.findById(supervisorId);

  if (!supervisor || supervisor.role !== "Teacher") {
    return next(new ErrorHandler("Invalid supervisor selected.", 400));
  }

  if (
    supervisor.maxStudents &&
    supervisor.assignedStudents &&
    supervisor.maxStudents === supervisor.assignedStudents.length
  ) {
    return next(
      new ErrorHandler(
        "Selected supervisor has reached maximum student capacity.",
        400,
      ),
    );
  }

  const requestData = {
    student: studentId,
    supervisor: supervisorId,
    message,
  };

  const request = await requestService.createRequest(requestData);

  await notificationService.notifyUser(
    supervisorId,
    `${student.name} has requested ${supervisor.name} to be their supervisor.`,
    "request",
    "/teacher/requests",
    "medium",
  );

  res.status(201).json({
    success: true,
    data: { request },
    message: "Supervisor request submitted successfully",
  });
});

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const studentId = req.user._id;

  const project = await Project.findOne({ student: studentId })
    .sort({ createdAt: -1 })
    .populate("supervisor", "name")
    .lean();

  const now = new Date();
  const upcomingDeadlines = await Project.find({
    student: studentId,
    deadline: { $gte: now },
  })
    .select("title description deadline")
    .sort({ deadline: -1 })
    .limit(3)
    .lean();

  const topNotifications = await Notification.find({ user: studentId })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const feedbackNotifications =
    project?.feedback && project?.feedback.length > 0
      ? project.feedback
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
      : [];

  const supervisorName = project?.supervisor?.name || null;

  res.status(200).json({
    success: true,
    message: "Dashboard stats fetched successfully",
    data: {
      project,
      upcomingDeadlines,
      topNotifications,
      feedbackNotifications,
      supervisorName,
    },
  });
});

export const getFeedback = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const studentId = req.user._id;

  const project = await projectService.getProjectById(projectId);

  if (!project || project.student._id.toString() !== studentId.toString()) {
    return next(
      new ErrorHandler("Not authorized to view feedback for this project", 403),
    );
  }

  const sortedFeedback = project.feedback
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((f) => ({
      _id: f._id,
      title: f.title,
      message: f.message,
      type: f.type,
      createdAt: f.createdAt,
      supervisorName: f.supervisorId?.name,
      supervisorEmail: f.supervisorId?.email,
    }));

  res.status(200).json({
    success: true,
    data: { feedback: sortedFeedback },
  });
});

export const downloadFile = asyncHandler(async (req, res, next) => {
  const { projectId, fileId } = req.params;
  const studentId = req.user._id;

  const project = await projectService.getProjectById(projectId);
  if (!project) return next(new ErrorHandler("Project not found", 404));
  if (project.student._id.toString() !== studentId.toString()) {
    return next(new ErrorHandler("Not authorized to download file", 403));
  }
  const file = project.files.id(fileId);
  if (!file) return next(new ErrorHandler("File not found", 404));

  fileServices.streamDownload(file.fileUrl, res, file.originalName);
});

export const deleteFile = asyncHandler(async (req, res, next) => {
  const { projectId, fileId } = req.params;
  const studentId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return next(new ErrorHandler("Invalid project ID", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return next(new ErrorHandler("Invalid file ID", 400));
  }

  const project = await projectService.getProjectById(projectId);

  if (!project || project.student._id.toString() !== studentId.toString()) {
    return next(
      new ErrorHandler("Not authorized to delete files from this project", 403),
    );
  }

  if (project.status === "completed") {
    return next(
      new ErrorHandler("Files cannot be deleted after the project is completed", 400),
    );
  }

  const file = project.files.id(fileId);

  if (!file) {
    return next(new ErrorHandler("File not found", 404));
  }

  const filePath = file.fileUrl;
  project.files.pull(fileId);
  await project.save();

  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.status(200).json({
    success: true,
    message: "File deleted successfully",
    data: { project },
  });
});
