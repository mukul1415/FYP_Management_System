// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   getAllUsers,
//   assignSupervisor as assignSupervisorThunk,
// } from "../../store/slices/adminSlice";
// import { AlertTriangle, CheckCircle, Users } from "lucide-react";

// const AssignSupervisor = () => {
//   const dispatch = useDispatch();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [selectedSupervisor, setSelectedSupervisor] = useState({});

//   const { users, projects } = useSelector((state) => state.admin);

//   useEffect(() => {
//     if (!users || !users.length === 0) {
//       dispatch(getAllUsers());
//     }
//   }, [dispatch]);

//   const teachers = useMemo(() => {
//     const teacherUsers = (users || []).filter(
//       (u) => (u.role || "").toLowerCase() === "teacher",
//     );
//     return teacherUsers.map((t) => ({
//       ...t,
//       assignedCount: Array.isArray(t.assignedStudents)
//         ? t.assignedStudents.length
//         : 0,
//       capacityLeft:
//         (typeof t.maxStudents === "number" ? t.maxStudents : 0) -
//         (Array.isArray(t.assignedStudents) ? t.assignedStudents.length : 0),
//     }));
//   }, [users]);

//   const studentProjects = useMemo(() => {
//     return (projects || [])
//       .filter((p) => !!p.student?._id)
//       .map((p) => ({
//         projectId: p._id,
//         title: p.title,
//         status: p.status,
//         supervisor: p.supervisor?.name || null,
//         supervisorId: p.supervisor?._id || null,
//         studentId: p.student?._id || "Unknown",
//         studentName: p.student?.name || "-",
//         studentEmail: p.student?.email || "-",
//         deadline: p.deadline
//           ? new Date(p.deadline).toISOString().slice(0, 10)
//           : "-",
//         updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-",
//         isApproved: p.status === "approved",
//       }));
//   }, [projects]);

//   const filtered = studentProjects.filter((row) => {
//     const matchesSearch =
//       (row.studentName || "")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       (row.title || "").toLowerCase().includes(searchTerm.toLowerCase());

//     const status = row.supervisor ? "assigned" : "unassigned";
//     const matchesFilter = filterStatus === "all" || status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const [pendingFor, setPendingFor] = useState(null);

//   const handleSupervisorSelect = (projectId, supervisorId) => {
//     setSelectedSupervisor((prev) => ({
//       ...prev,
//       [projectId]: supervisorId,
//     }));
//   };

//   const handleAssign = async (projectId, studentId, projectStatus) => {
//     const supervisorId = selectedSupervisor[projectId];
//     if (!studentId || !supervisorId) {
//       toast.error("Please select a supervisor first");
//       return;
//     }
//     if (projectStatus === "rejected") {
//       toast.error("Cannot assign supervisor to a rejected project");
//       return;
//     }
//     if (projectStatus !== "approved") {
//       toast.error("Cannot assign supervisor to a rejected project");
//       return;
//     }
//     setPendingFor(projectId);
//     const res = await dispatch(
//       assignSupervisorThunk({ studentId, supervisorId }),
//     );
//     setPendingFor(null);

//     if (assignSupervisorThunk.fulfilled.match(res)) {
//       setSelectedSupervisor((prev) => {
//         const newState = { ...prev };
//         delete newState[projectId];
//         return newState;
//       });
//       dispatch(getAllUsers());
//       dispatch(getAllProjects());
//     } else {
//       toast.error("Failed to assign supervisor");
//     }
//   };

//   const dashboardCards = [
//     {
//       title: "Assigned Students",
//       value: studentProjects.filter((r) => !!r.supervisor).length,
//       icon: CheckCircle,
//       bg: "bg-green-100",
//       color: "text-green-600",
//     },
//     {
//       title: "Unassigned Students",
//       value: studentProjects.filter((r) => !r.supervisor).length,
//       icon: AlertTriangle,
//       bg: "bg-red-100",
//       color: "text-red-600",
//     },
//     {
//       title: "Available Teachers",
//       value: teachers.filter(
//         (t) => (t.assignedCount ?? 0) < (t.maxStudents ?? 0),
//       ).length,
//       icon: Users,
//       bg: "bg-blue-100",
//       color: "text-blue-600",
//     },
//   ];

//   // TABLE HEADER
//   const headers = [
//     "Student",
//     "Project Title",
//     "Supervisor",
//     "Deadline",
//     "Updated",
//     "Assign Supervisor",
//     "Actions",
//   ];

//   const Badge = ({ color, children }) => {
//     return (
//       <span
//         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
//       >
//         {children}
//       </span>
//     );
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         <div className="card">
//           <div className="card-header">
//             <h1 className="card-title">Assign Supervisor</h1>
//             <p className="card-subtitle">
//               Manage supervisor assignments for students and projects
//             </p>
//           </div>
//         </div>

//         {/* FILTER */}
//         <div className="card">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Search Students
//               </label>
//               <input
//                 type="text"
//                 placeholder="Search by student name or project title..."
//                 className="input-field w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="w-full md:w-48">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Filter Status
//               </label>
//               <select
//                 className="input-field w-full"
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//               >
//                 <option value="all">All Students</option>
//                 <option value="assigned">Assigned</option>
//                 <option value="unassigned">Unassigned</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="card">
//           <div className="card-header">
//             <h2 className="card-title">Student Assignments</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50">
//                 <tr>
//                   {headers.map((h) => {
//                     return (
//                       <th
//                         key={h}
//                         className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
//                       >
//                         {h}
//                       </th>
//                     );
//                   })}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-slate-200">
//                 {filtered.map((row) => (
//                   <tr key={row.projectId} className="hover:bg-slate-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-slate-900">
//                           {row.studentName}
//                         </div>
//                         <div className="text-sm text-slate-500">
//                           {row.studentEmail}
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">{row.title}</td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         {row.supervisor ? (
//                           <Badge
//                             color={"bg-green-100 text-green-800"}
//                             children={row.supervisor}
//                           />
//                         ) : (
//                           <Badge
//                             color={"bg-red-100 text-red-800"}
//                             children={
//                               row.status === "rejected"
//                                 ? "Rejected"
//                                 : "Not Assigned"
//                             }
//                           />
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">{row.deadline}</td>

//                     <td className="px-6 py-4">{row.updatedAt}</td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <select
//                         className="input-field w-full"
//                         value={selectedSupervisor[row.projectId] || ""}
//                         disabled={
//                           !!row.supervisor ||
//                           row.status === "rejected" ||
//                           !row.isApproved
//                         }
//                         onChange={(e) =>
//                           handleSupervisorSelect(row.projectId, e.target.value)
//                         }
//                       >
//                         <option value="" disabled>
//                           Select Supervisor
//                         </option>
//                         {teachers
//                           .filter((t) => t.capacityLeft > 0)
//                           .map((t) => (
//                             <option value={t._id} key={t._id}>
//                               {t.name} {t.department ? `- ${t.department}` : ""}
//                             </option>
//                           ))}
//                       </select>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         className="btn-primary text-sm w-40"
//                         onClick={() =>
//                           handleAssign(row.projectId, row.studentId, row.status)
//                         }
//                         disabled={
//                           pendingFor === row.projectId ||
//                           !!row.supervisor ||
//                           row.status === "rejected" ||
//                           !row.isApproved ||
//                           !selectedSupervisor[row.projectId]
//                         }
//                       >
//                         {pendingFor === row.projectId
//                           ? "Assigning..."
//                           : row.supervisor
//                             ? "Assigned"
//                             : row.status === "rejected"
//                               ? "Rejected"
//                               : !row.isApproved
//                                 ? "Not Approved"
//                                 : "Assign"}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filtered.length === 0 && (
//               <div className="text-center py-8 text-slate-500">
//                 No students found matching your criteria
//               </div>
//             )}
//           </div>
//         </div>

//         {/* SUMMARY */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {dashboardCards.map((card, index) => {
//             const Icon = card.icon;
//             return (
//               <div key={index} className="card">
//                 <div className="flex items-center">
//                   <div className={`p-3 ${card.bg} rounded-lg`}>
//                     <Icon className={`w-6 h-6 ${card.color}`} />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-slate-600">
//                       {card.title}
//                     </p>
//                     <p className="text-lg font-semibold text-slate-800">
//                       {card.value}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// };

// export default AssignSupervisor;

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getAllUsers,
  assignSupervisor as assignSupervisorThunk,
  getAllProjects,
} from "../../store/slices/adminSlice";

import {
  AlertTriangle,
  CheckCircle,
  Users,
  Search,
  UserCheck,
  Clock3,
} from "lucide-react";

const AssignSupervisor = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedSupervisor, setSelectedSupervisor] = useState({});

  const [pendingFor, setPendingFor] = useState(null);

  const { users, projects } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch]);

  const teachers = useMemo(() => {
    const teacherUsers = (users || []).filter(
      (u) => (u.role || "").toLowerCase() === "teacher",
    );

    return teacherUsers.map((t) => ({
      ...t,
      assignedCount: Array.isArray(t.assignedStudents)
        ? t.assignedStudents.length
        : 0,

      capacityLeft:
        (typeof t.maxStudents === "number" ? t.maxStudents : 0) -
        (Array.isArray(t.assignedStudents) ? t.assignedStudents.length : 0),
    }));
  }, [users]);

  const studentProjects = useMemo(() => {
    return (projects || [])
      .filter((p) => !!p.student?._id)
      .map((p) => ({
        projectId: p._id,
        title: p.title,
        status: p.status,
        supervisor: p.supervisor?.name || null,
        supervisorId: p.supervisor?._id || null,
        studentId: p.student?._id || "Unknown",
        studentName: p.student?.name || "-",
        studentEmail: p.student?.email || "-",
        deadline: p.deadline
          ? new Date(p.deadline).toISOString().slice(0, 10)
          : "-",
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-",
        isApproved: p.status === "approved",
      }));
  }, [projects]);

  const filtered = studentProjects.filter((row) => {
    const matchesSearch =
      (row.studentName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (row.title || "").toLowerCase().includes(searchTerm.toLowerCase());

    const status = row.supervisor ? "assigned" : "unassigned";

    const matchesFilter = filterStatus === "all" || status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleSupervisorSelect = (projectId, supervisorId) => {
    setSelectedSupervisor((prev) => ({
      ...prev,
      [projectId]: supervisorId,
    }));
  };

  const handleAssign = async (projectId, studentId, projectStatus) => {
    const supervisorId = selectedSupervisor[projectId];

    if (!studentId || !supervisorId) {
      toast.error("Please select a supervisor first");
      return;
    }

    if (projectStatus === "rejected") {
      toast.error("Cannot assign supervisor to a rejected project");
      return;
    }

    if (projectStatus !== "approved") {
      toast.error("Project must be approved first");
      return;
    }

    setPendingFor(projectId);

    const res = await dispatch(
      assignSupervisorThunk({
        studentId,
        supervisorId,
      }),
    );

    setPendingFor(null);

    if (assignSupervisorThunk.fulfilled.match(res)) {
      setSelectedSupervisor((prev) => {
        const newState = { ...prev };

        delete newState[projectId];

        return newState;
      });

      dispatch(getAllUsers());

      dispatch(getAllProjects());
    } else {
      toast.error("Failed to assign supervisor");
    }
  };

  const dashboardCards = [
    {
      title: "Assigned Students",
      value: studentProjects.filter((r) => !!r.supervisor).length,
      icon: UserCheck,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      textColor: "text-emerald-900",
      subColor: "text-emerald-600",
    },

    {
      title: "Unassigned",
      value: studentProjects.filter((r) => !r.supervisor).length,
      icon: AlertTriangle,
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-700",
      textColor: "text-red-900",
      subColor: "text-red-600",
    },

    {
      title: "Available Teachers",
      value: teachers.filter(
        (t) => (t.assignedCount ?? 0) < (t.maxStudents ?? 0),
      ).length,
      icon: Users,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      textColor: "text-blue-900",
      subColor: "text-blue-600",
    },

    {
      title: "Approved Projects",
      value: studentProjects.filter((p) => p.isApproved).length,
      icon: CheckCircle,
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      textColor: "text-amber-900",
      subColor: "text-amber-600",
    },
  ];

  const headers = [
    "Student",
    "Project Title",
    "Supervisor",
    "Deadline",
    "Updated",
    "Assign Supervisor",
    "Actions",
  ];

  const Badge = ({ color, children }) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-2xl text-xs font-semibold ${color}`}
      >
        {children}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Assign Supervisor
            </h1>

            <p className="text-slate-500 mt-2">
              Manage project supervision assignments for students.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className={`${card.bg} ${card.border} border rounded-3xl p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${card.subColor}`}>
                    {card.title}
                  </p>

                  <h3 className={`text-3xl font-bold mt-2 ${card.textColor}`}>
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search student or project..."
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
            <option value="all">All Students</option>

            <option value="assigned">Assigned</option>

            <option value="unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.projectId}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-5">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {row.studentName}
                      </div>

                      <div className="text-sm text-slate-500 mt-1">
                        {row.studentEmail}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="font-medium text-slate-800">
                      {row.title}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {row.supervisor ? (
                      <Badge color="bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {row.supervisor}
                      </Badge>
                    ) : (
                      <Badge color="bg-red-50 text-red-700 border border-red-200">
                        {row.status === "rejected"
                          ? "Rejected"
                          : "Not Assigned"}
                      </Badge>
                    )}
                  </td>

                  <td className="px-6 py-5 text-slate-700">{row.deadline}</td>

                  <td className="px-6 py-5 text-sm text-slate-500">
                    {row.updatedAt}
                  </td>

                  <td className="px-6 py-5">
                    <select
                      className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                      value={selectedSupervisor[row.projectId] || ""}
                      disabled={
                        !!row.supervisor ||
                        row.status === "rejected" ||
                        !row.isApproved
                      }
                      onChange={(e) =>
                        handleSupervisorSelect(row.projectId, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Supervisor
                      </option>

                      {teachers
                        .filter((t) => t.capacityLeft > 0)
                        .map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name}
                            {t.department ? ` - ${t.department}` : ""}
                          </option>
                        ))}
                    </select>
                  </td>

                  <td className="px-6 py-5">
                    <button
                      className={`w-40 rounded-2xl py-3 text-sm font-medium transition
                      ${
                        row.supervisor
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                          : row.status === "rejected"
                            ? "bg-red-100 text-red-600 cursor-not-allowed"
                            : !row.isApproved
                              ? "bg-amber-100 text-amber-700 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      onClick={() =>
                        handleAssign(row.projectId, row.studentId, row.status)
                      }
                      disabled={
                        pendingFor === row.projectId ||
                        !!row.supervisor ||
                        row.status === "rejected" ||
                        !row.isApproved ||
                        !selectedSupervisor[row.projectId]
                      }
                    >
                      {pendingFor === row.projectId
                        ? "Assigning..."
                        : row.supervisor
                          ? "Assigned"
                          : row.status === "rejected"
                            ? "Rejected"
                            : !row.isApproved
                              ? "Not Approved"
                              : "Assign"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No students found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignSupervisor;
