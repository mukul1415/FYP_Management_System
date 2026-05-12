// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllSupervisors,
//   fetchProject,
//   getSupervisor,
//   requestSupervisor,
// } from "../../store/slices/studentSlice";
// import { X } from "lucide-react";

// const SupervisorPage = () => {
//   const dispatch = useDispatch();
//   const { authUser } = useSelector((state) => state.auth);
//   const { project, supervisors, supervisor } = useSelector(
//     (state) => state.student,
//   );

//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [requestMessage, setRequestMessage] = useState("");
//   const [selectedSupervisor, setSelectedSupervisor] = useState(null);

//   useEffect(() => {
//     dispatch(fetchProject());
//     dispatch(getSupervisor());
//     dispatch(fetchAllSupervisors());
//   }, [dispatch]);

//   const hasSupervisor = useMemo(
//     () => !!(supervisor && supervisor._id),
//     [supervisor],
//   );
//   const hasProject = useMemo(() => !!(project && project._id), [project]);

//   const formatDeadline = (dateStr) => {
//     if (!dateStr) return "-";
//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) return "-";
//     const day = date.getDate();
//     const j = day % 10,
//       k = day % 100;
//     const suffix =
//       j === 1 && k !== 11
//         ? "st"
//         : j === 2 && k !== 12
//           ? "nd"
//           : j === 3 && k !== 13
//             ? "rd"
//             : "th";
//     const month = date.toLocaleString("en-US", { month: "long" });
//     const year = date.getFullYear();
//     return `${day}${suffix} ${month} ${year}`;
//   };

//   const handleOpenRequest = (supervisor) => {
//     setSelectedSupervisor(supervisor);
//     setShowRequestModal(true);
//   };

//   const submitRequest = () => {
//     if (!selectedSupervisor) return;
//     const message =
//       requestMessage?.trim() ||
//       `${authUser.name || "Student"}
//       has request ${selectedSupervisor.name} to be their supervisor.`;
//     dispatch(
//       requestSupervisor({
//         supervisorId: selectedSupervisor._id,
//         message,
//       }),
//     ).then((res) => {
//       if (res.type === "student/requestSupervisor/fulfilled") {
//         setShowRequestModal(false);
//       }
//     });
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         {/* CURRENT SUPERVISOR */}
//         <div className="card">
//           <div className="card-header">
//             <h1 className="card-title">Current Supervisor</h1>
//             {hasSupervisor && (
//               <span className="badge badge-approved">Assigned</span>
//             )}
//           </div>

//           {/* SUPERVISOR DETAILS */}
//           {hasSupervisor ? (
//             <div className="space-y-6">
//               <div className="flex items-start space-x-6">
//                 <img
//                   src="/placeholder.jpg"
//                   alt="Supervisor Avatar"
//                   className="w-20 h-20 rounded-full object-cover shadow-md"
//                 />
//                 <div className="flex-1 space-y-4">
//                   <div>
//                     <h3 className="text-2xl font-bold text-slate-800">
//                       {supervisor?.name || "-"}
//                     </h3>
//                     <p className="text-lg text-slate-600">
//                       {supervisor?.department || "-"}
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
//                         Email
//                       </label>
//                       <p className="text-slate-800 font-medium">
//                         {supervisor?.email || "-"}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
//                         Expertise
//                       </label>
//                       <p className="text-slate-800 font-medium">
//                         {Array.isArray(supervisor?.experties)
//                           ? supervisor.experties.join(", ")
//                           : supervisor?.experties || "-"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="p-6 text-center">
//               <p className="text-slate-600 text-lg">
//                 Supervisor not assigned yet.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* PROJECT DETAILS - ONLY SHOW IF PROJECT EXISTS */}
//         {hasProject && (
//           <div className="card">
//             <div className="card-header">
//               <h2 className="card-title">Project Details</h2>
//             </div>

//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
//                       Project Title
//                     </label>
//                     <p className="text-lg font-semibold text-slate-800 mt-1">
//                       {project?.title || "-"}
//                     </p>
//                   </div>
//                   <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
//                     Status
//                   </label>
//                   <div className="mt-1">
//                     <span
//                       className={`inline-flex items-center px-3 py-1 rounded-full font-medium capitalize text-sm
//                         ${
//                           project.status === "approved"
//                             ? "bg-green-100 text-green-800"
//                             : project.status === "pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : project.status === "rejected"
//                                 ? "bg-red-100 text-red-800"
//                                 : project.status === "completed"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : "bg-gray-100 text-gray-800"
//                         }`}
//                     >
//                       {project?.status || "Invalid"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
//                       Deadline
//                     </label>
//                     <p className="text-lg font-semibold text-slate-800 mt-1">
//                       {project?.deadline
//                         ? formatDeadline(project.deadline)
//                         : "No deadline set"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
//                       Created
//                     </label>
//                     <p className="text-lg font-semibold text-slate-800 mt-1">
//                       {project.createdAt
//                         ? formatDeadline(project.createdAt)
//                         : "Unknown"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {project?.description && (
//                 <div>
//                   <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
//                     Description
//                   </label>
//                   <p className="text-slate-700 mt-2 leading-relaxed">
//                     {project?.description || "-"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* IF NO PROJECT */}
//         {!hasProject && (
//           <div className="card">
//             <div className="card-header">
//               <h2 className="card-title">Project Required</h2>
//             </div>
//             <div className="p-6 text-center">
//               <p className="test-slate-600 text-lg">
//                 You have not submitted any project proposal yet, so you cannot
//                 request a supervisor.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* AVAILABLE SUPERVISORS | ONLY WHEN PROJECT EXISTS AND NO SUPERVISOR ASSIGNED */}
//         {hasProject && !hasSupervisor && (
//           <div className="card">
//             <div className="card-header">
//               <h2 className="card-title">Available Supervisors</h2>
//               <p className="card-subtitle">
//                 Browse and request supervision from available faculty members
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//               {supervisors &&
//                 supervisors.map((sup) => (
//                   <div
//                     key={sup._id}
//                     className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex items-center space-x-3 mb-3">
//                       <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
//                         <span className="text-sm font-bold text-slate-600">
//                           {sup.name || "Anonymous"}
//                         </span>
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-medium text-slate-800">
//                           {sup.name}
//                         </h4>
//                         <p className="text-sm text-slate-600">
//                           {sup.department}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="space-y-2 mb-4">
//                       <div>
//                         <label className="text-xs font-medium text-slate-500">
//                           Email
//                         </label>
//                         <p className="text-sm font-medium text-slate-700">
//                           {sup.email || "-"}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="text-xs font-medium text-slate-500">
//                           Expertise
//                         </label>
//                         <p className="text-sm font-medium text-slate-700">
//                           {Array.isArray(sup?.experties)
//                             ? sup.experties.join(", ")
//                             : sup?.experties || "-"}
//                         </p>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => handleOpenRequest(sup)}
//                       className="btn-primary w-full"
//                     >
//                       Request Suprvisor
//                     </button>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}

//         {/* REQUEST MODAL */}
//         {showRequestModal && selectedSupervisor && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-slate-800">
//                     Request Supervision
//                   </h3>
//                   <button
//                     className="text-slate-400 hover:text-slate-600"
//                     onClick={() => {
//                       setShowRequestModal(false);
//                       setSelectedSupervisor(null);
//                       setRequestMessage("");
//                     }}
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="p-4 bg-slate-50 rounded-md">
//                     <p className="text-sm test-slate-600">
//                       {selectedSupervisor?.name}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="label">Message to Supervisor</label>
//                     <textarea
//                       className="input min-h-[120px]"
//                       required
//                       value={requestMessage}
//                       onChange={(e) => setRequestMessage(e.target.value)}
//                       placeholder="Introduce yourself and explain why you'd like this professor to
//                      supervise your project..."
//                     />
//                   </div>

//                   <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
//                     <button
//                       onClick={() => {
//                         setShowRequestModal(false);
//                         selectedSupervisor(null);
//                         setRequestMessage("");
//                       }}
//                       className="btn-outline"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={submitRequest}
//                       className="btn-primary"
//                       disabled={!requestMessage.trim()}
//                     >
//                       Send Request
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default SupervisorPage;

import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllSupervisors,
  fetchProject,
  getSupervisor,
  requestSupervisor,
} from "../../store/slices/studentSlice";

import {
  X,
  Mail,
  User,
  CalendarDays,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

const SupervisorPage = () => {
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.auth);

  const { project, supervisors, supervisor } = useSelector(
    (state) => state.student,
  );

  const [showRequestModal, setShowRequestModal] = useState(false);

  const [requestMessage, setRequestMessage] = useState("");

  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  useEffect(() => {
    dispatch(fetchProject());
    dispatch(getSupervisor());
    dispatch(fetchAllSupervisors());
  }, [dispatch]);

  const hasSupervisor = useMemo(
    () => !!(supervisor && supervisor._id),
    [supervisor],
  );

  const hasProject = useMemo(() => !!(project && project._id), [project]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleOpenRequest = (sup) => {
    setSelectedSupervisor(sup);

    setShowRequestModal(true);
  };

  const submitRequest = () => {
    if (!selectedSupervisor) return;

    const message =
      requestMessage?.trim() ||
      `${authUser?.name || "Student"} requested ${selectedSupervisor?.name} to supervise the project.`;

    dispatch(
      requestSupervisor({
        supervisorId: selectedSupervisor._id,
        message,
      }),
    ).then((res) => {
      if (res.type === "student/requestSupervisor/fulfilled") {
        setShowRequestModal(false);

        setSelectedSupervisor(null);

        setRequestMessage("");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Supervisor Management
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your project supervisor and send supervision requests.
        </p>
      </div>

      {/* CURRENT SUPERVISOR */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Current Supervisor
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your assigned project supervisor
            </p>
          </div>

          {hasSupervisor && (
            <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              Assigned
            </span>
          )}
        </div>

        <div className="p-6">
          {hasSupervisor ? (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* AVATAR */}
              <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-600">
                {supervisor?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-800">
                  {supervisor?.name}
                </h3>

                <p className="text-slate-500 mt-1">{supervisor?.department}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-blue-100">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Email</p>

                      <p className="font-medium text-slate-800">
                        {supervisor?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-purple-100">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Expertise</p>

                      <p className="font-medium text-slate-800">
                        {Array.isArray(supervisor?.experties)
                          ? supervisor.experties.join(", ")
                          : supervisor?.experties || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <User className="w-14 h-14 text-slate-300 mx-auto mb-4" />

              <h3 className="text-xl font-semibold text-slate-700">
                No Supervisor Assigned
              </h3>

              <p className="text-slate-500 mt-2">
                You can request a supervisor after submitting a project
                proposal.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PROJECT DETAILS */}
      {hasProject ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Project Details
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Project Title</p>

                  <h3 className="text-xl font-bold text-slate-800">
                    {project?.title}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Description</p>

                  <p className="text-slate-700 leading-relaxed">
                    {project?.description}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-500 mb-2">Status</p>

                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize
                    ${
                      project?.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : project?.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : project?.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : project?.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project?.status}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-orange-100">
                    <CalendarDays className="w-5 h-5 text-orange-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Deadline</p>

                    <p className="font-medium text-slate-800">
                      {formatDate(project?.deadline)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Created At</p>

                    <p className="font-medium text-slate-800">
                      {formatDate(project?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            No Project Submitted
          </h2>

          <p className="text-slate-500 mt-3">
            Submit your project proposal before requesting a supervisor.
          </p>
        </div>
      )}

      {/* SUPERVISORS */}
      {hasProject && !hasSupervisor && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Available Supervisors
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Browse faculty members and send supervision requests
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {supervisors?.map((sup) => (
              <div
                key={sup._id}
                className="border border-slate-200 rounded-3xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-700">
                    {sup?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {sup?.name}
                    </h3>

                    <p className="text-sm text-slate-500">{sup?.department}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>

                    <p className="text-sm font-medium text-slate-700">
                      {sup?.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">Expertise</p>

                    <p className="text-sm font-medium text-slate-700">
                      {Array.isArray(sup?.experties)
                        ? sup.experties.join(", ")
                        : sup?.experties || "-"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenRequest(sup)}
                  className="w-full mt-6 py-3 rounded-2xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
                >
                  Request Supervisor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL */}
      {showRequestModal && selectedSupervisor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="border-b border-slate-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Request Supervision
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Send a request to {selectedSupervisor?.name}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowRequestModal(false);

                  setSelectedSupervisor(null);

                  setRequestMessage("");
                }}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Message
              </label>

              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Introduce yourself and explain why you want this supervisor for your project..."
                rows={6}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 resize-none outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-500 transition"
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRequestModal(false);

                    setSelectedSupervisor(null);

                    setRequestMessage("");
                  }}
                  className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={submitRequest}
                  disabled={!requestMessage.trim()}
                  className="px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorPage;
