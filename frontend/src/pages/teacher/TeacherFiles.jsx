import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadTeacherFile,
  getAssignedStudents,
  getFiles,
} from "../../store/slices/teacherSlice";

import {
  ArrowDownToLine,
  File,
  FileArchive,
  FileSpreadsheet,
  FileText,
  LayoutGrid,
  List,
  Search,
  Files,
  Code2,
  Image as ImageIcon,
  Presentation,
  UserRound,
} from "lucide-react";

const TeacherFiles = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const dispatch = useDispatch();

  const filesFromStore = useSelector((state) => state.teacher.files) || [];
  const assignedStudents =
    useSelector((state) => state.teacher.assignedStudents) || [];

  useEffect(() => {
    dispatch(getFiles());
    dispatch(getAssignedStudents());
  }, [dispatch]);

  const deriveTypeFormatName = (name) => {
    if (!name) return "other";

    const parts = name.split(".");

    return (parts[parts.length - 1] || "").toLowerCase();
  };

  const normalizeFile = (f) => {
    const type = deriveTypeFormatName(f.originalName) || f.fileType || "other";

    let category = "other";

    if (["pdf", "doc", "docx"].includes(type)) {
      category = "report";
    } else if (["ppt", "pptx"].includes(type)) {
      category = "presentation";
    } else if (
      ["zip", "rar", "7z", "js", "ts", "html", "css", "json"].includes(type)
    ) {
      category = "code";
    } else if (["jpeg", "jpg", "png", "gif", "avif"].includes(type)) {
      category = "image";
    }

    return {
      id: f._id,
      name: f.originalName || "Unknown File",
      type: type.toUpperCase(),
      size: f.size || "-",
      studentId: f.studentId || f.student?._id || f.studentEmail || f.studentName,
      student: f.studentName || "Unknown Student",
      studentEmail: f.studentEmail || "",
      uploadedDate: f.uploadedAt || f.createdAt || null,
      category,
      projectId: f.projectId || f.project?._id,
      projectTitle: f.projectTitle || "Project",
      fileId: f._id,
    };
  };

  const files = useMemo(
    () => (filesFromStore || []).map(normalizeFile),
    [filesFromStore],
  );

  const students = useMemo(() => {
    const byId = new Map();

    for (const student of assignedStudents || []) {
      const id = student._id || student.id || student.email;
      if (!id) continue;

      byId.set(id.toString(), {
        id: id.toString(),
        name: student.name || "Unknown Student",
        email: student.email || "",
        projectTitle: student.project?.title || "No active project",
        projectStatus: student.project?.status || "No project",
        fileCount: 0,
      });
    }

    for (const file of files) {
      const id = (file.studentId || file.studentEmail || file.student).toString();
      const existing = byId.get(id);

      if (existing) {
        existing.fileCount += 1;
      } else {
        byId.set(id, {
          id,
          name: file.student,
          email: file.studentEmail,
          projectTitle: file.projectTitle,
          projectStatus: "Has files",
          fileCount: 1,
        });
      }
    }

    return Array.from(byId.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [assignedStudents, files]);

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId,
  );

  const selectedStudentFiles = files.filter((file) => {
    const fileStudentId = (
      file.studentId ||
      file.studentEmail ||
      file.student
    ).toString();

    return selectedStudentId ? fileStudentId === selectedStudentId : false;
  });

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;

      case "doc":
      case "docx":
        return <FileText className="w-8 h-8 text-blue-500" />;

      case "ppt":
      case "pptx":
        return <FileSpreadsheet className="w-8 h-8 text-orange-500" />;

      case "zip":
      case "rar":
      case "7z":
        return <FileArchive className="w-8 h-8 text-yellow-500" />;

      default:
        return <File className="w-8 h-8 text-slate-500" />;
    }
  };

  const filteredFiles = selectedStudentFiles.filter((file) => {
    const matchesType =
      filterType === "all" ? true : file.category === filterType;

    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch =
      file.name?.toLowerCase().includes(normalizedSearch) ||
      file.projectTitle?.toLowerCase().includes(normalizedSearch);

    return matchesSearch && matchesType;
  });

  const handleDownloadFile = async (file) => {
    try {
      await dispatch(
        downloadTeacherFile({
          projectId: file.projectId,
          fileId: file.fileId,
          fileName: file.name,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewStudentFiles = (studentId) => {
    setSelectedStudentId(studentId);
    setSearchTerm("");
    setFilterType("all");
  };

  const handleCloseStudentFiles = () => {
    setSelectedStudentId(null);
    setSearchTerm("");
    setFilterType("all");
  };

  const fileStats = [
    {
      label: "Total Files",
      count: selectedStudentFiles.length,
      icon: Files,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      textColor: "text-blue-900",
      subColor: "text-blue-600",
    },

    {
      label: "Reports",
      count: selectedStudentFiles.filter((f) => f.category === "report").length,
      icon: FileText,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      textColor: "text-emerald-900",
      subColor: "text-emerald-600",
    },

    {
      label: "Presentations",
      count: selectedStudentFiles.filter((f) => f.category === "presentation")
        .length,
      icon: Presentation,
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      textColor: "text-amber-900",
      subColor: "text-amber-600",
    },

    {
      label: "Code Files",
      count: selectedStudentFiles.filter((f) => f.category === "code").length,
      icon: Code2,
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
      textColor: "text-purple-900",
      subColor: "text-purple-600",
    },

    {
      label: "Images",
      count: selectedStudentFiles.filter((f) => f.category === "image").length,
      icon: ImageIcon,
      bg: "bg-pink-50",
      border: "border-pink-200",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-700",
      textColor: "text-pink-900",
      subColor: "text-pink-600",
    },
  ];

  const tableHeadData = [
    "File Name",
    "Student",
    "Type",
    "Upload Date",
    "Actions",
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Student Files</h1>

            <p className="text-slate-500 mt-2">
              Select a student to view the files they uploaded.
            </p>
          </div>

          <div className="bg-slate-100 border border-slate-200 px-5 py-3 rounded-2xl">
            <p className="text-sm font-medium text-slate-700">
              {students.length} Students / {files.length} Files
            </p>
          </div>
        </div>
      </div>

      {/* STUDENT LIST */}
      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800">Students</h2>
            <p className="text-sm text-slate-500 mt-1">
              Assigned students under your supervision
            </p>
          </div>

          <div className="p-4 space-y-3 max-h-[650px] overflow-y-auto">
            {students.length === 0 ? (
              <div className="py-12 text-center">
                <UserRound className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No assigned students</p>
              </div>
            ) : (
              students.map((student) => {
                const isSelected = selectedStudentId === student.id;

                return (
                  <div
                    key={student.id}
                    className={`w-full rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-blue-200 bg-blue-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-blue-100" : "bg-slate-100"
                          }`}
                        >
                          <UserRound
                            className={`w-5 h-5 ${
                              isSelected ? "text-blue-700" : "text-slate-600"
                            }`}
                          />
                        </div>

                        <div className="min-w-0 text-left">
                          <p
                            className={`font-semibold truncate ${
                              isSelected ? "text-blue-950" : "text-slate-800"
                            }`}
                          >
                            {student.name}
                          </p>
                          <p
                            className={`text-xs truncate mt-1 ${
                              isSelected ? "text-blue-700" : "text-slate-500"
                            }`}
                          >
                            {student.email || student.projectTitle}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          isSelected
                            ? handleCloseStudentFiles()
                            : handleViewStudentFiles(student.id)
                        }
                        className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                          isSelected
                            ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isSelected ? "Close" : "View"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span
                        className={`text-xs ${
                          isSelected ? "text-blue-700" : "text-slate-500"
                        }`}
                      >
                        {student.projectTitle}
                      </span>
                      <span
                        className={`text-xs font-semibold rounded-full px-3 py-1 ${
                          isSelected
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {student.fileCount} files
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          {!selectedStudent ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm min-h-[360px] flex flex-col items-center justify-center text-center">
              <UserRound className="w-16 h-16 text-slate-300 mb-4" />
              <h2 className="text-2xl font-bold text-slate-800">
                Select a Student
              </h2>
              <p className="text-slate-500 mt-2 max-w-md">
                Click a student from the list to view only the files uploaded by
                that student.
              </p>
            </div>
          ) : (
            <>
      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <select
              className="border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Files</option>

              <option value="report">Reports</option>

              <option value="presentation">Presentations</option>

              <option value="code">Code</option>

              <option value="image">Images</option>
            </select>

            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-4 top-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search this student's files..."
                className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-2xl transition ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-2xl transition ${
                viewMode === "list"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {fileStats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label || index}
              className={`${item.bg} ${item.border} border rounded-3xl p-5 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${item.subColor}`}>
                    {item.label}
                  </p>

                  <h3 className={`text-3xl font-bold mt-2 ${item.textColor}`}>
                    {item.count}
                  </h3>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILES */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-5">{getFileIcon(file.type)}</div>

                <h3
                  className="font-semibold text-slate-800 truncate w-full"
                  title={file.name}
                >
                  {file.name}
                </h3>

                <p className="text-sm text-slate-500 mt-2">{file.student}</p>

                <p className="text-sm text-slate-400 mt-1">{file.type}</p>

                <p className="text-sm text-slate-400 mt-1">
                  {file.uploadedDate
                    ? new Date(file.uploadedDate).toLocaleDateString()
                    : "No Date"}
                </p>

                <button
                  onClick={() => handleDownloadFile(file)}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-medium flex items-center justify-center gap-2 transition"
                >
                  <ArrowDownToLine className="w-5 h-5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {tableHeadData.map((item, index) => (
                    <th
                      key={item || index}
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}

                        <span className="font-medium text-slate-800">
                          {file.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">{file.student}</td>

                    <td className="px-6 py-4 text-slate-600">{file.type}</td>

                    <td className="px-6 py-4 text-slate-600">
                      {file.uploadedDate
                        ? new Date(file.uploadedDate).toLocaleDateString()
                        : "No Date"}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFiles.length === 0 && (
              <div className="py-20 text-center">
                <File className="w-14 h-14 text-slate-300 mx-auto mb-4" />

                <h3 className="text-xl font-semibold text-slate-700">
                  No Files Found
                </h3>

                <p className="text-slate-500 mt-2">
                  No files matched your current filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherFiles;
