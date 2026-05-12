// import { AlertTriangle, CheckCircle2, FileDown, Folder, X } from "lucide-react";
// import { useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   approveProject,
//   getProject,
//   rejectProject,
// } from "../../store/slices/adminSlice";
// import { downloadProjectFile } from "../../store/slices/projectSlice";

// const ProjectsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [filterSupervisor, setFilterSupervisor] = useState("all");
//   const [isReportsOpen, setIsReportsOpen] = useState(false);
//   const [reportSearch, setReportSearch] = useState("");
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [currentProject, setCurrentProject] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     description: "",
//     deadline: "",
//   });

//   const [isSaving, setIsSaving] = useState(false);

//   const dispatch = useDispatch();
//   const { projects } = useSelector((state) => state.admin);

//   const supervisors = useMemo(() => {
//     const set = new Set(
//       projects?.map((p) => p?.supervisor?.name).filter(Boolean),
//     );
//     return Array.from(set);
//   }, [projects]);

//   const filteredProjects = projects?.filter((project) => {
//     const matchesSearch =
//       (project.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (project.student?.name || "")
//         .toLowerCase()
//         .inlcudes(searchTerm.toLowerCase());

//     const matchesStatus =
//       filterStatus === "all" || project.status === filterStatus;
//     const matchesSupervisor =
//       filterSupervisor === "all" ||
//       project.supervisor?.name === filterSupervisor;

//     return matchesSearch && matchesStatus && matchesSupervisor;
//   });

//   const files = useMemo(() => {
//     return (projects || []).flatMap((p) =>
//       (p.files || []).map((f) => ({
//         projectId: p._id,
//         fileId: f._id,
//         originalName: f.originalName,
//         uploadedAt: f.uploadedAt,
//         projectTitle: p.title,
//         studentName: p.student?.name,
//       })),
//     );
//   }, [projects]);

//   const filteredFiles = files?.filter(
//     (file) =>
//       (file.originalName || "")
//         .toLowerCase()
//         .imcludes(reportSearch.toLowerCase()) ||
//       (file.projectTitle || "")
//         .toLowerCase()
//         .imcludes(reportSearch.toLowerCase()) ||
//       (file.studentName || "")
//         .toLowerCase()
//         .imcludes(reportSearch.toLowerCase()),
//   );

//   const handleDownloadFile = async (file) => {
//     const res = await dispatch(
//       downloadProjectFile({ projectId: file.projectId, fileId: file.fileId }),
//     ).then((res) => {
//       const { blob } = res.payload;
//       const url = window.URL.createObjectURL(new Blob([blob]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", file.originalName || "download");
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "approved":
//         return "bg-blue-100 text-blue-800";

//       case "pending":
//         return "bg-orange-100 text-orange-800";
//       case "rejected":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const handleStatusChange = async (projectId, newStatus) => {
//     if (newStatus === "approved") {
//       dispatch(approveProject(projectId));
//     } else if (newStatus === "rejected") {
//       dispatch(rejectProject(projectId));
//     }
//   };

//   const projectStats = [
//     {
//       title: "Total Projects",
//       value: projects.length,
//       bg: "bg-blue-100",
//       iconColor: "text-blue-600",
//       Icon: Folder,
//     },
//     {
//       title: "Pending Review",
//       value: projects.filter((p) => p.status === "pending").length,
//       bg: "bg-orange-100",
//       iconColor: "text-orange-600",
//       Icon: AlertTriangle,
//     },
//     {
//       title: "Completed",
//       value: projects.filter((p) => p.status === "completed").length,
//       bg: "bg-green-100",
//       iconColor: "text-green-600",
//       Icon: CheckCircle2,
//     },
//     {
//       title: "Rejected",
//       value: projects.filter((p) => p.status === "rejected").length,
//       bg: "bg-red-100",
//       iconColor: "text-red-600",
//       Icon: X,
//     },
//   ];

//   return (
//     <>
//       <div className="space-y-6">
//         {/* HEADER */}
//         <div className="card">
//           <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
//             <div>
//               <h1 className="card-title">All Projects</h1>
//               <p className="card-subtitle">
//                 View and manage all student projects across the platform.
//               </p>
//             </div>
//             <button
//               onClick={() => dispatch(setIsReportOpen(true))}
//               className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
//             >
//               <FileDown className="w-5 h-5" />
//               <span>Download Reports</span>
//             </button>
//           </div>
//         </div>

//         {/* STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {projectStats.map((item, index) => {
//             return (
//               <div key={index} className="card">
//                 <div className="flex items-center">
//                   <div className={`p-3 ${item.bg} rounded-lg`}>
//                     <item.Icon className={`w-6 h-6 ${item.iconColor}`} />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-slate-600">
//                       {item.title}
//                     </p>
//                     <p className="text-lg font-semibold text-slate-800">
//                       {item.value}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* FILTERS */}
//         <div className="card">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Search Projects
//               </label>
//               <input
//                 type="text"
//                 className="input w-full"
//                 placeholder="Search by project title or student name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Filter by Status
//               </label>
//               <select
//                 className="input w-full"
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//               >
//                 <option value="all">All Projects</option>
//                 <option value="pending">Pending Projects</option>
//                 <option value="approved">Approved Projects</option>
//                 <option value="completed">Completed Projects</option>
//                 <option value="rejected">Rejected Projects</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Filter Supervisor
//               </label>
//               <select
//                 className="input w-full"
//                 value={filterSupervisor}
//                 onChange={(e) => setFilterSupervisor(e.target.value)}
//               >
//                 <option value="all">All Supervisors</option>
//                 {supervisors.map((supervisor) => {
//                   return (
//                     <option key={supervisor} value={supervisor}>
//                       {supervisor}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* PROJECTS TABLE */}
//         <div className="card">
//           <div className="card-header">
//             <h2 className="card-title">Projects Overview</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50">
//                 <tr>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-slate-500
//                   uppercase tracking-wider"
//                   >
//                     Project Details
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-slate-500
//                   uppercase tracking-wider"
//                   >
//                     Student
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-slate-500
//                   uppercase tracking-wider"
//                   >
//                     Supervisor
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-slate-500
//                   uppercase tracking-wider"
//                   >
//                     Deadline
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-slate-500
//                   uppercase tracking-wider"
//                   >
//                     Status
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-slate-500
//                   uppercase tracking-wider"
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-slate-200">
//                 {filteredProjects.map((project) => (
//                   <tr key={project._id} className="hover:bg-slate-50">
//                     <td className="px-6 py-3">
//                       <div>
//                         <div className="text-sm font-medium text-slate-900">
//                           {project.title}
//                         </div>
//                         <div className="text-sm text-slate-500 max-w-xs truncate">
//                           {project.description}
//                         </div>
//                         <div className="text-xs text-slate-400">
//                           Due:{" "}
//                           {project.deadline && project.deadline.split("T")[0]}
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <div className="text-sm font-medium text-slate-900">
//                         {project?.student?.name}
//                       </div>
//                       <div className="text-xs  text-slate-500">
//                         Last Update:{" "}
//                         {project?.uploadedAt
//                           ? new Date(project?.uploadedAt).toLocaleDateString()
//                           : "N/A"}
//                       </div>
//                     </td>

//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <div
//                         className="text-sm text-slate-900 inline-flex items-center
//                       px-2.5 py-0.5 rounded-full font-medium"
//                       >
//                         {project.supervisor?.name ? (
//                           <span className="bg-green-100 text-green-800">
//                             {project.supervisor?.name}
//                           </span>
//                         ) : (
//                           "Unassigned"
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-6 py-3 whitespace-nowrap">
//                       {project.deadline
//                         ? new Date(project.deadline).toLocaleDateString()
//                         : "N/A"}
//                     </td>

//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <span
//                         className={`inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs
//                         font-medium ${getStatusColor(project.status)}`}
//                       >
//                         {project.status}
//                       </span>
//                     </td>

//                     <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={async () => {
//                             const res = await dispatch(getProject(project._id));
//                             if (!getProject.fulfilled.match(res)) return;
//                             const detail = res.payload?.project || res.payload;
//                             setCurrentProject(detail);
//                             setShowViewModal(true);
//                           }}
//                           className="btn-primary"
//                         >
//                           View
//                         </button>
//                         {project.status === "pending" && (
//                           <>
//                             <button
//                               className="btn-secondary"
//                               onClick={() =>
//                                 handleStatusChange(project._id, "approved")
//                               }
//                             >
//                               Approve
//                             </button>
//                             <button
//                               className="btn-danger"
//                               onClick={() =>
//                                 handleStatusChange(project._id, "rejected")
//                               }
//                             >
//                               Reject
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filteredProjects.length === 0 && (
//             <div className="text-center py-8 text-slate-500">
//               No projects found matching your criteria.
//             </div>
//           )}
//         </div>

//         {/* VIEW MODAL */}
//         {showViewModal && currentProject && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-slate-900">
//                   Project Details
//                 </h3>
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="text-slate-400 hover:text-slate-600"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="label">Title</label>
//                   <div className="input bg-slate-50">
//                     {currentProject?.title || "-"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="label">Description</label>
//                   <div className="input bg-slate-50">
//                     {currentProject?.description || "-"}
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">Student</label>
//                     <div className="input bg-slate-50">
//                       {currentProject?.student?.name || "-"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="label">Supervisor</label>
//                     <div className="input bg-slate-50">
//                       {currentProject?.supervisor?.name || "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">Status</label>
//                     <div className="input bg-slate-50 capitalize">
//                       {currentProject?.status}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="label">Deadline</label>
//                     <div className="input bg-slate-50">
//                       {currentProject?.deadline
//                         ? new Date(currentProject.deadline).toLocaleDateString()
//                         : "N/A"}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="label">Files</label>
//                   {(currentProject.files || []).length === 0 ? (
//                     <div className="text-slate-500 text-sm">
//                       No files uploaded
//                     </div>
//                   ) : (
//                     <ul className="list-disc list-inside text-sm text-slate-700">
//                       {currentProject.files.map((file) => (
//                         <li key={file._id || file.fileUrl}>
//                           {file.originalName}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* VIEW MODAL */}
//         {isReportsOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-slate-900">
//                   All Files
//                 </h3>
//                 <button
//                   onClick={() => setIsReportsOpen(false)}
//                   className="text-slate-400 hover:text-slate-600"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="mb-4">
//                 <input
//                   type="text"
//                   className="input w-full"
//                   placeholder="Search by file name, project title or student name"
//                   value={reportSearch}
//                   onChange={(e) => setReportSearch(e.target.value)}
//                 />
//               </div>

//               {filteredFiles.length === 0 ? (
//                 <div className="text-slate-500">No files found.</div>
//               ) : (
//                 <div className="space-y-2">
//                   {filteredFiles.map((f) => {
//                     return (
//                       <div
//                         key={`${f.projectId}-${f.fileId}`}
//                         className="flex items-center justify-between p-3 bg-slate-50 rounded"
//                       >
//                         <div>
//                           <div className="font-medium text-slate-800">
//                             {f.originalName}
//                           </div>
//                           <div className="text-sm text-slate-500">
//                             {f.projectTitle} - {f.studentName}
//                           </div>
//                         </div>
//                         <button
//                           className="btn-outline btn-small"
//                           onClick={() => handleDownloadFile(f)}
//                         >
//                           Download
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ProjectsPage;

import {
  AlertTriangle,
  CheckCircle2,
  FileDown,
  Folder,
  Search,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  approveProject,
  getProject,
  rejectProject,
} from "../../store/slices/adminSlice";

import { downloadProjectFile } from "../../store/slices/projectSlice";

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSupervisor, setFilterSupervisor] = useState("all");

  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const [reportSearch, setReportSearch] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);

  const [currentProject, setCurrentProject] = useState(null);

  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.admin);

  const supervisors = useMemo(() => {
    const set = new Set(
      projects?.map((p) => p?.supervisor?.name).filter(Boolean),
    );

    return Array.from(set);
  }, [projects]);

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      (project.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.student?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;

    const matchesSupervisor =
      filterSupervisor === "all" ||
      project.supervisor?.name === filterSupervisor;

    return matchesSearch && matchesStatus && matchesSupervisor;
  });

  const files = useMemo(() => {
    return (projects || []).flatMap((p) =>
      (p.files || []).map((f) => ({
        projectId: p._id,
        fileId: f._id,
        originalName: f.originalName,
        uploadedAt: f.uploadedAt,
        projectTitle: p.title,
        studentName: p.student?.name,
      })),
    );
  }, [projects]);

  const filteredFiles = files?.filter(
    (file) =>
      (file.originalName || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()) ||
      (file.projectTitle || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()) ||
      (file.studentName || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()),
  );

  const handleDownloadFile = async (file) => {
    try {
      await dispatch(
        downloadProjectFile({
          projectId: file.projectId,
          fileId: file.fileId,
          fileName: file.originalName,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";

      case "approved":
        return "bg-blue-50 text-blue-700 border border-blue-200";

      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";

      case "rejected":
        return "bg-red-50 text-red-700 border border-red-200";

      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    if (newStatus === "approved") {
      dispatch(approveProject(projectId));
    } else if (newStatus === "rejected") {
      dispatch(rejectProject(projectId));
    }
  };

  const projectStats = [
    {
      title: "Total Projects",
      value: projects.length,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      textColor: "text-blue-900",
      subColor: "text-blue-600",
      Icon: Folder,
    },

    {
      title: "Pending Review",
      value: projects.filter((p) => p.status === "pending").length,
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      textColor: "text-amber-900",
      subColor: "text-amber-600",
      Icon: AlertTriangle,
    },

    {
      title: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      textColor: "text-emerald-900",
      subColor: "text-emerald-600",
      Icon: CheckCircle2,
    },

    {
      title: "Rejected",
      value: projects.filter((p) => p.status === "rejected").length,
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-700",
      textColor: "text-red-900",
      subColor: "text-red-600",
      Icon: X,
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Projects</h1>

            <p className="text-slate-500 mt-2">
              View and manage all student projects across the platform.
            </p>
          </div>

          <button
            onClick={() => setIsReportsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-5 py-3 flex items-center gap-2 font-medium transition"
          >
            <FileDown className="w-5 h-5" />
            Download Reports
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {projectStats.map((item, index) => {
          const Icon = item.Icon;

          return (
            <div
              key={index}
              className={`${item.bg} ${item.border} border rounded-3xl p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${item.subColor}`}>
                    {item.title}
                  </p>

                  <h3 className={`text-3xl font-bold mt-2 ${item.textColor}`}>
                    {item.value}
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

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search projects..."
              className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>

            <option value="pending">Pending</option>

            <option value="approved">Approved</option>

            <option value="completed">Completed</option>

            <option value="rejected">Rejected</option>
          </select>

          <select
            className="border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            value={filterSupervisor}
            onChange={(e) => setFilterSupervisor(e.target.value)}
          >
            <option value="all">All Supervisors</option>

            {supervisors.map((supervisor) => (
              <option key={supervisor} value={supervisor}>
                {supervisor}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  "Project",
                  "Student",
                  "Supervisor",
                  "Deadline",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-5">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {project.title}
                      </h3>

                      <p className="text-sm text-slate-500 max-w-xs truncate mt-1">
                        {project.description}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div>
                      <p className="font-medium text-slate-800">
                        {project?.student?.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Updated:{" "}
                        {project?.uploadedAt
                          ? new Date(project.uploadedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {project.supervisor?.name ? (
                      <span className="px-3 py-1 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium">
                        {project.supervisor?.name}
                      </span>
                    ) : (
                      <span className="text-slate-500">Unassigned</span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-2xl text-xs font-semibold capitalize ${getStatusColor(
                        project.status,
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={async () => {
                          const res = await dispatch(getProject(project._id));

                          if (!getProject.fulfilled.match(res)) return;

                          const detail = res.payload?.project || res.payload;

                          setCurrentProject(detail);

                          setShowViewModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        View
                      </button>

                      {project.status === "pending" && (
                        <>
                          <button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                            onClick={() =>
                              handleStatusChange(project._id, "approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                            onClick={() =>
                              handleStatusChange(project._id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center text-slate-500">
              No projects found.
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && currentProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Project Details
                </h3>

                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* TITLE */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Project Title</p>

                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                    {currentProject?.title || "-"}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Description</p>

                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 whitespace-pre-wrap">
                    {currentProject?.description || "-"}
                  </div>
                </div>

                {/* STUDENT + SUPERVISOR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Student</p>

                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                      {currentProject?.student?.name || "-"}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-2">Supervisor</p>

                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                      {currentProject?.supervisor?.name || "Not Assigned"}
                    </div>
                  </div>
                </div>

                {/* STATUS + DEADLINE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Status</p>

                    <div
                      className={`inline-flex px-4 py-2 rounded-2xl text-sm font-semibold capitalize ${getStatusColor(
                        currentProject?.status,
                      )}`}
                    >
                      {currentProject?.status}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-2">Deadline</p>

                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                      {currentProject?.deadline
                        ? new Date(currentProject.deadline).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>

                {/* CREATED + UPDATED */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Created At</p>

                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                      {currentProject?.createdAt
                        ? new Date(currentProject.createdAt).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-2">Last Updated</p>

                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                      {currentProject?.updatedAt
                        ? new Date(currentProject.updatedAt).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                </div>

                {/* FILES */}
                <div>
                  <p className="text-sm text-slate-500 mb-3">Uploaded Files</p>

                  {(currentProject.files || []).length === 0 ? (
                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 text-slate-500">
                      No files uploaded
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentProject.files.map((file) => (
                        <div
                          key={file._id || file.fileUrl}
                          className="border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >
                          <div>
                            <h4 className="font-medium text-slate-800">
                              {file.originalName}
                            </h4>

                            <p className="text-sm text-slate-500 mt-1">
                              Uploaded:{" "}
                              {file.uploadedAt
                                ? new Date(file.uploadedAt).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              handleDownloadFile({
                                projectId: currentProject._id,
                                fileId: file._id,
                                originalName: file.originalName,
                              })
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS MODAL */}
      {isReportsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200">
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Project Files
                </h3>

                <button
                  onClick={() => setIsReportsOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Search files..."
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200 mb-5"
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
              />

              {filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No files found.
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredFiles.map((f) => (
                    <div
                      key={`${f.projectId}-${f.fileId}`}
                      className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium text-slate-800">
                          {f.originalName}
                        </h4>

                        <p className="text-sm text-slate-500 mt-1">
                          {f.projectTitle} • {f.studentName}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDownloadFile(f)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
