// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createDeadline } from "../../store/slices/deadlineSlice";
// import { X } from "lucide-react";

// const DeadlinesPage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [formData, setFormData] = useState({
//     projectTitle: "",
//     studentName: "",
//     supervisor: "",
//     deadlineDate: "",
//     description: "",
//   });
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [query, setQuery] = useState("");

//   const dispatch = useDispatch();
//   const { projects } = useSelector((state) => state.admin);

//   const [viewProjects, setViewProjects] = useState(projects || []);
//   useEffect(() => {
//     setViewProjects(projects || []);
//   }, [projects]);

//   const projectRows = useMemo(() => {
//     return (viewProjects || []).map((p) => ({
//       _id: p._id,
//       title: p.title,
//       studentName: p.student?.name || "-",
//       studentEmail: p.student?.email || "-",
//       studentDept: p.student?.department || "-",
//       supervisor: p.supervisor?.name || "-",
//       deadline: p.deadline
//         ? new Date(p.deadline).toISOString().slice(0, 10)
//         : "-",
//       updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-",
//       raw: p,
//     }));
//   }, [viewProjects]);

//   const filteredProjects = projectRows.filter((row) => {
//     const matchesSearch =
//       (row.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (row.studentName || "").toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedProject || !formData.deadlineDate) return;

//     let deadlineData = {
//       name: selectedProject?.student?.name,
//       dueDate: formData.deadlineDate,
//       project: selectedProject?._id,
//     };

//     try {
//       const updated = await dispatch(
//         createDeadline({ id: selectedProject._id, data: deadlineData }),
//       ).unwrap();
//       const updatedProject = updated?.project || updated;

//       if (updatedProject?._id) {
//         setViewProjects((prev) =>
//           prev.map((p) =>
//             p._id === updatedProject._id ? { ...p, ...updatedProject } : p,
//           ),
//         );
//       }
//     } finally {
//       setShowModal(false);
//       setFormData({
//         projectTitle: "",
//         studentName: "",
//         supervisor: "",
//         deadlineDate: "",
//         description: "",
//       });
//       setSelectedProject(null);
//       setQuery("");
//     }
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         {/* HEADER */}
//         <div className="card">
//           <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
//             <div>
//               <h1 className="card-title">Manage Deadlines</h1>
//               <p className="card-subtitle">
//                 Create and monitor project deadlines
//               </p>
//             </div>
//             <button
//               onClick={() => setShowModal(true)}
//               className="btn-primary mt-4 md:mt-0"
//             >
//               Create / Update Deadline
//             </button>
//           </div>
//         </div>

//         {/* FILTERS */}
//         <div className="card">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Search Deadlines
//               </label>
//               <input
//                 type="text"
//                 placeholder="Search by project or student..."
//                 className="input-field w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header">
//             <h2 className="card-title">Project Deadlines</h2>
//           </div>

//           <div className="overflow-y-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Student
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Project Title
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Supervisor
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Deadline
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Updated
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="bg-white divide-y divide-slate-200">
//                 {filteredProjects.map((row) => {
//                   return (
//                     <tr key={row._id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-slate-900">
//                             {row.studentName}
//                           </div>
//                           <div className="text-sm text-slate-500">
//                             {row.studentEmail}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">{row.title}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {row.supervisor !== "-" ? (
//                           <span
//                             className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
//                            font-medium bg-green-100 text-green-800"
//                           >
//                             {row.supervisor}
//                           </span>
//                         ) : (
//                           <span
//                             className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
//                            font-medium bg-gray-100 text-gray-800"
//                           >
//                             Not Assigned
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">{row.deadline}</td>
//                       <td className="px-6 py-4">{row.updatedAt}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {filteredProjects.length === 0 && (
//             <div className="text-center py-8 text-slate-500">
//               No projects found matching your criteria.
//             </div>
//           )}
//         </div>

//         {/* MODAL */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-slate-900">
//                   Create or Update Deadline
//                 </h3>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-slate-400 hover:text-slate-600"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="label">Project Title</label>
//                   <input
//                     type="text"
//                     className="input"
//                     placeholder="Start typing to search projects..."
//                     value={query}
//                     onChange={(e) => {
//                       setQuery(e.target.value);
//                       setSelectedProject(null);
//                       setFormData({
//                         ...formData,
//                         projectTitle: e.target.value,
//                       });
//                     }}
//                   />
//                   {query && !selectedProject && (
//                     <div className="mt-2 border border-slate-200 rounded-md max-h-56 overflow-y-auto">
//                       {(projects || [])
//                         .filter((p) =>
//                           (p.title || "")
//                             .toLowerCase()
//                             .includes(query.toLowerCase()),
//                         )
//                         .slice(0, 8)
//                         .map((p) => (
//                           <button
//                             type="button"
//                             key={p._id}
//                             className="w-full text-left px-3 py-2 hover:bg-slate-50"
//                             onClick={() => {
//                               setSelectedProject(p);
//                               setQuery(p.title);
//                               setFormData({
//                                 ...formData,
//                                 projectTitle: p.title,
//                                 deadlineDate: p.deadline
//                                   ? new Date(p.deadline)
//                                       .toISOString()
//                                       .slice(0, 10)
//                                   : "",
//                               });
//                             }}
//                             title={p.title}
//                           >
//                             <div className="text-sm font-medium text-slate-800 truncate">
//                               {p.title}
//                             </div>
//                             <div className="text-xs  text-slate-500 truncate">
//                               {p.student?.name || "-"}{" "}
//                               {p.supervisor?.name || "-"}
//                             </div>
//                           </button>
//                         ))}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="label">Deadline</label>
//                   <input
//                     type="date"
//                     className="input-field w-full"
//                     disabled={!selectedProject}
//                     value={formData.deadlineDate}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         deadlineDate: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {selectedProject && (
//                   <div className="mt-4 border border-slate-200 rounded-lg p-4 bg-slate-50">
//                     <div className="mb-2">
//                       <div className="text-sm font-semibold text-slate-900">
//                         Project Details
//                       </div>
//                       <div
//                         className="text-sm truncate text-slate-700"
//                         title={selectedProject.description || ""}
//                       >
//                         {(selectedProject.description || "").length > 160
//                           ? `${selectedProject.description.slice(0, 160)}...`
//                           : selectedProject.description}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       <div>
//                         <div className="text-xs text-slate-500">Status</div>
//                         <div className="text-sm font-medium text-slate-800">
//                           {selectedProject.status || "Unknown"}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-slate-500">Supervisor</div>
//                         <div className="text-sm font-medium text-slate-800">
//                           {selectedProject.supervisor?.name || "Unknown"}
//                         </div>
//                       </div>
//                       <div className="md:cols-span-2">
//                         <div className="text-xs text-slate-500">Student</div>
//                         <div className="text-sm font-medium text-slate-800">
//                           {selectedProject.student?.name || "-"} -
//                           {selectedProject.student?.email || "-"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="btn-secondary"
//                   >
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn-primary">
//                     Save Deadline
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default DeadlinesPage;

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDeadline } from "../../store/slices/deadlineSlice";

import { X, CalendarDays, Clock3, FolderKanban, Search } from "lucide-react";

const DeadlinesPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    projectTitle: "",
    studentName: "",
    supervisor: "",
    deadlineDate: "",
    description: "",
  });

  const [selectedProject, setSelectedProject] = useState(null);

  const [query, setQuery] = useState("");

  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.admin);

  const [viewProjects, setViewProjects] = useState(projects || []);

  useEffect(() => {
    setViewProjects(projects || []);
  }, [projects]);

  const projectRows = useMemo(() => {
    return (viewProjects || []).map((p) => ({
      _id: p._id,
      title: p.title,
      studentName: p.student?.name || "-",
      studentEmail: p.student?.email || "-",
      studentDept: p.student?.department || "-",
      supervisor: p.supervisor?.name || "-",
      deadline: p.deadline
        ? new Date(p.deadline).toISOString().slice(0, 10)
        : "-",
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-",
      raw: p,
    }));
  }, [viewProjects]);

  const filteredProjects = projectRows.filter((row) => {
    const matchesSearch =
      (row.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.studentName || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject || !formData.deadlineDate) return;

    let deadlineData = {
      name: selectedProject?.student?.name,
      dueDate: formData.deadlineDate,
      project: selectedProject?._id,
    };

    try {
      const updated = await dispatch(
        createDeadline({
          id: selectedProject._id,
          data: deadlineData,
        }),
      ).unwrap();

      const updatedProject = updated?.project || updated;

      if (updatedProject?._id) {
        setViewProjects((prev) =>
          prev.map((p) =>
            p._id === updatedProject._id ? { ...p, ...updatedProject } : p,
          ),
        );
      }
    } finally {
      setShowModal(false);

      setFormData({
        projectTitle: "",
        studentName: "",
        supervisor: "",
        deadlineDate: "",
        description: "",
      });

      setSelectedProject(null);

      setQuery("");
    }
  };

  const stats = [
    {
      label: "Total Projects",
      value: projectRows.length,
      icon: FolderKanban,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      textColor: "text-blue-900",
      subColor: "text-blue-600",
    },

    {
      label: "Deadlines Set",
      value: projectRows.filter((p) => p.deadline !== "-").length,
      icon: CalendarDays,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      textColor: "text-emerald-900",
      subColor: "text-emerald-600",
    },

    {
      label: "Pending Deadlines",
      value: projectRows.filter((p) => p.deadline === "-").length,
      icon: Clock3,
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      textColor: "text-amber-900",
      subColor: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Deadlines
            </h1>

            <p className="text-slate-500 mt-2">
              Create, update, and monitor project deadlines.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-5 py-3 font-medium transition"
          >
            Create / Update Deadline
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`${item.bg} ${item.border} border rounded-3xl p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${item.subColor}`}>
                    {item.label}
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

      {/* SEARCH */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search by project or student..."
            className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  "Student",
                  "Project",
                  "Supervisor",
                  "Deadline",
                  "Updated",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((row) => (
                <tr
                  key={row._id}
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
                    {row.supervisor !== "-" ? (
                      <span className="px-3 py-1 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        {row.supervisor}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
                        Not Assigned
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-slate-700 font-medium">
                    {row.deadline}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-500">
                    {row.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No projects found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Create / Update Deadline
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Assign project deadlines for students.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* SEARCH PROJECT */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Title
                  </label>

                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Search projects..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);

                      setSelectedProject(null);

                      setFormData({
                        ...formData,
                        projectTitle: e.target.value,
                      });
                    }}
                  />

                  {query && !selectedProject && (
                    <div className="mt-3 border border-slate-200 rounded-2xl overflow-hidden max-h-64 overflow-y-auto">
                      {(projects || [])
                        .filter((p) =>
                          (p.title || "")
                            .toLowerCase()
                            .includes(query.toLowerCase()),
                        )
                        .slice(0, 8)
                        .map((p) => (
                          <button
                            key={p._id}
                            type="button"
                            onClick={() => {
                              setSelectedProject(p);

                              setQuery(p.title);

                              setFormData({
                                ...formData,
                                projectTitle: p.title,
                                deadlineDate: p.deadline
                                  ? new Date(p.deadline)
                                      .toISOString()
                                      .slice(0, 10)
                                  : "",
                              });
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition"
                          >
                            <div className="font-medium text-slate-800 truncate">
                              {p.title}
                            </div>

                            <div className="text-sm text-slate-500 mt-1 truncate">
                              {p.student?.name || "-"} •{" "}
                              {p.supervisor?.name || "No Supervisor"}
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* DEADLINE */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deadline Date
                  </label>

                  <input
                    type="date"
                    disabled={!selectedProject}
                    value={formData.deadlineDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deadlineDate: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                  />
                </div>

                {/* PROJECT DETAILS */}
                {selectedProject && (
                  <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50">
                    <h4 className="font-semibold text-slate-900 mb-4">
                      Project Details
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Description
                        </p>

                        <p className="text-sm text-slate-700 leading-relaxed">
                          {selectedProject.description || "-"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Status</p>

                          <p className="font-medium text-slate-800">
                            {selectedProject.status || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 mb-1">
                            Supervisor
                          </p>

                          <p className="font-medium text-slate-800">
                            {selectedProject.supervisor?.name || "Not Assigned"}
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <p className="text-xs text-slate-500 mb-1">Student</p>

                          <p className="font-medium text-slate-800">
                            {selectedProject.student?.name || "-"} •{" "}
                            {selectedProject.student?.email || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-2xl px-5 py-3 font-medium transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-5 py-3 font-medium transition"
                  >
                    Save Deadline
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlinesPage;
