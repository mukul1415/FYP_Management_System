import express from "express";
import multer from "multer";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";
import {
  createStudent,
  deleteStudent,
  updateStudent,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getAllUsers,
  getAllProjects,
  getDashboardStats,
  assignSupervisor,
  getProject,
  updateProjectStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.post(
  "/create-student",
  isAuthenticated,
  isAuthorized("Admin"),
  createStudent,
);

router.put(
  "/update-student/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateStudent,
);

router.delete(
  "/delete-student/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteStudent,
);

router.post(
  "/create-teacher",
  isAuthenticated,
  isAuthorized("Admin"),
  createTeacher,
);

router.put(
  "/update-teacher/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateTeacher,
);

router.delete(
  "/delete-teacher/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteTeacher,
);

router.get("/users", isAuthenticated, isAuthorized("Admin"), getAllUsers);

router.get("/projects", isAuthenticated, isAuthorized("Admin"), getAllProjects);

router.get(
  "/fetch-dashboard-stats",
  isAuthenticated,
  isAuthorized("Admin"),
  getDashboardStats,
);

router.post(
  "/assign-supervisor",
  isAuthenticated,
  isAuthorized("Admin"),
  assignSupervisor,
);

router.put(
  "/project/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateProjectStatus,
);

router.get("/project/:id", isAuthenticated, isAuthorized("Admin"), getProject);

export default router;
