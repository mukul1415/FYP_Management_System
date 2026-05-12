// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   acceptRequest,
//   getTeacherRequests,
//   rejectRequest,
// } from "../../store/slices/teacherSlice";
// import { FileText } from "lucide-react";

// const PendingRequests = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [loadingMap, setLoadingMap] = useState({});
//   const dispatch = useDispatch();
//   const { list } = useSelector((state) => state.teacher);
//   const { authUser } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(getTeacherRequests(authUser._id));
//   }, [dispatch, authUser._id]);

//   const setLoading = (id, key, value) => {
//     setLoadingMap((prev) => ({
//       ...prev,
//       [id]: { ...(prev[id] || {}), [key]: value },
//     }));
//   };

//   const handleAccept = async (request) => {
//     const id = request._id;
//     setLoading(id, "accepting", true);
//     try {
//       await dispatch(acceptRequest(id)).unwrap();
//     } finally {
//       setLoading(id, "accepting", false);
//     }
//   };

//   const handleReject = async (request) => {
//     const id = request._id;
//     setLoading(id, "rejecting", true);
//     try {
//       await dispatch(rejectRequest(id)).unwrap();
//     } finally {
//       setLoading(id, "rejecting", false);
//     }
//   };

//   const filteredRequests =
//     list.filter((request) => {
//       const matchesSearch =
//         (request?.student?.name || "")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         (request?.latestProject?.title || "")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase());
//       const matchesStatus =
//         filterStatus === "all" || request.status === filterStatus;
//       return matchesSearch && matchesStatus;
//     }) || [];

//   return (
//     <>
//       <div className="space-y-6">
//         {/* HEADER */}
//         <div className="card">
//           <div className="card-header">
//             <h1 className="card-title">Pending Supervision Requests</h1>
//             <p className="card-subtitle">
//               Review and respond to student supervision requests
//             </p>
//           </div>

//           {/* SEARCH & FILTER */}

//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <input
//               type="text"
//               placeholder="Search by student name or project title..."
//               className="input-field flex-1"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             <select
//               className="input-field sm:w-48"
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="all">All Requests</option>
//               <option value="pending">Pending</option>
//               <option value="accepted">Accepted</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         {/* REQUESTS */}
//         <div className="space-y-4">
//           {filteredRequests.map((req) => {
//             const id = req._id;
//             const project = req.latestProject;
//             const projectStatus = project?.status?.toLowerCase() || "pending";
//             const supervisorAssigned = !!project?.supervisor;
//             const canAccept =
//               projectStatus === "approved" && !supervisorAssigned;
//             const lm = loadingMap[id] || {};

//             let bgClass = "bg-white";
//             let StatusMessage = "";

//             if (projectStatus === "approved" && supervisorAssigned) {
//               bgClass = "bg-blue-50 border-blue-300";
//               StatusMessage = "Supervisor already assigned";
//             } else if (projectStatus === "rejected") {
//               bgClass = "bg-red-50 border-red-300";
//               StatusMessage = "Project proposal rejected";
//             } else if (projectStatus === "pending") {
//               bgClass = "bg-yellow-50 border-yellow-300";
//               StatusMessage = "Project proposal pending";
//             }

//             return (
//               <div key={id} className={`card border ${bgClass} transition-all`}>
//                 <div className="flex flex-col lg:flex-row justify-between">
//                   {/* INFO */}
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className="text-lg font-semibold text-slate-800">
//                         {req?.student?.name || "Unknown Student"}
//                       </h3>
//                       <span
//                         className={`badge ${
//                           req.status === "pending"
//                             ? "badge-pending"
//                             : req.status === "accepted"
//                               ? "badge-approved"
//                               : "badge-rejected"
//                         }`}
//                       >
//                         {req.status?.charAt(0).toUpperCase() +
//                           req.status?.slice(1)}
//                       </span>
//                     </div>

//                     <p className="text-sm text-slate-600 mb-2">
//                       {req?.student?.email || "No email"}
//                     </p>
//                     <h4 className="font-medium text-slate-700 mb-2">
//                       {project?.title || "No project title"}
//                     </h4>
//                     <p className="text-xs text-slate-500">
//                       Submitted:{" "}
//                       {req?.createdAt
//                         ? new Date(req.createdAt).toLocaleDateString()
//                         : "-"}
//                     </p>

//                     {StatusMessage && (
//                       <p className="mt-2 text-sm font-medium text-slate-700">
//                         {StatusMessage}
//                       </p>
//                     )}
//                   </div>

//                   {/* ACTIONS */}
//                   {req.status === "pending" && (
//                     <div className="flex items-center gap-3 mt-3">
//                       <button
//                         className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors
//                           duration-200 disabled:cursor-not-allowed disabled:opacity-60
//                           ${
//                             canAccept
//                               ? "bg-green-600 hover:bg-green-700 text-white"
//                               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           }`}
//                         disabled={lm.accepting || !canAccept}
//                         onClick={() => handleAccept(req)}
//                       >
//                         {lm.accepting ? "Accepting" : "Accept"}
//                       </button>

//                       <button
//                         className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200
//                           disabled:opacity-6 bg-red-600 hover:bg-red-700 text-white disabled:cursor-not-allowed
//                           `}
//                         disabled={lm.rejecting}
//                         onClick={() => handleReject(req)}
//                       >
//                         {lm.rejecting ? "Rejecting" : "Reject"}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}

//           {/* NO REQUEST */}
//           {filteredRequests.length === 0 && (
//             <div className="card text-center py-8">
//               <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-slate-800 mb-2">
//                 No requests found
//               </h3>{" "}
//               <p className="text-slate-600">
//                 No supervision requests match your filters.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default PendingRequests;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  acceptRequest,
  getTeacherRequests,
  rejectRequest,
} from "../../store/slices/teacherSlice";

import {
  FileText,
  Search,
  Clock3,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";

const PendingRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingMap, setLoadingMap] = useState({});

  const dispatch = useDispatch();

  const { list } = useSelector((state) => state.teacher);

  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTeacherRequests(authUser._id));
  }, [dispatch, authUser._id]);

  const setLoading = (id, key, value) => {
    setLoadingMap((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  };

  const handleAccept = async (request) => {
    const id = request._id;

    setLoading(id, "accepting", true);

    try {
      await dispatch(acceptRequest(id)).unwrap();
    } finally {
      setLoading(id, "accepting", false);
    }
  };

  const handleReject = async (request) => {
    const id = request._id;

    setLoading(id, "rejecting", true);

    try {
      await dispatch(rejectRequest(id)).unwrap();
    } finally {
      setLoading(id, "rejecting", false);
    }
  };

  const filteredRequests =
    list.filter((request) => {
      const matchesSearch =
        (request?.student?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (request?.latestProject?.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || request.status === filterStatus;

      return matchesSearch && matchesStatus;
    }) || [];

  const stats = [
    {
      label: "Total Requests",
      value: list.length,
      icon: Users,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      textColor: "text-blue-900",
      subColor: "text-blue-600",
    },

    {
      label: "Pending",
      value: list.filter((r) => r.status === "pending").length,
      icon: Clock3,
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      textColor: "text-amber-900",
      subColor: "text-amber-600",
    },

    {
      label: "Accepted",
      value: list.filter((r) => r.status === "accepted").length,
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      textColor: "text-emerald-900",
      subColor: "text-emerald-600",
    },

    {
      label: "Rejected",
      value: list.filter((r) => r.status === "rejected").length,
      icon: XCircle,
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-700",
      textColor: "text-red-900",
      subColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Supervision Requests
            </h1>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Review, accept, or reject student supervision requests.
            </p>
          </div>

          <div className="bg-slate-100 border border-slate-200 px-5 py-3 rounded-2xl">
            <p className="text-sm font-medium text-slate-700">
              {filteredRequests.length} Requests
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-4 top-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search by student or project..."
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
              <option value="all">All Requests</option>

              <option value="pending">Pending</option>

              <option value="accepted">Accepted</option>

              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label || index}
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

      {/* REQUESTS */}
      <div className="space-y-5">
        {filteredRequests.map((req) => {
          const id = req._id;

          const project = req.latestProject;

          const projectStatus = project?.status?.toLowerCase() || "pending";

          const supervisorAssigned = !!project?.supervisor;

          const canAccept = projectStatus === "approved" && !supervisorAssigned;

          const lm = loadingMap[id] || {};

          let statusMessage = "";

          let statusColor = "";

          if (projectStatus === "approved" && supervisorAssigned) {
            statusMessage = "Supervisor already assigned";
            statusColor = "text-blue-600";
          } else if (projectStatus === "rejected") {
            statusMessage = "Project proposal rejected";
            statusColor = "text-red-600";
          } else if (projectStatus === "pending") {
            statusMessage = "Project proposal pending approval";
            statusColor = "text-amber-600";
          }

          return (
            <div
              key={id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                {/* LEFT */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <span className="text-slate-700 font-semibold text-lg">
                        {req?.student?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2) || "S"}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {req?.student?.name || "Unknown Student"}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-2xl text-xs font-semibold
                          ${
                            req.status === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : req.status === "accepted"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {req.status?.charAt(0).toUpperCase() +
                            req.status?.slice(1)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        {req?.student?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* PROJECT */}
                  <div className="border border-slate-200 rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
                      Project Title
                    </p>

                    <h4 className="font-semibold text-slate-800 text-lg">
                      {project?.title || "No project title"}
                    </h4>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                      <p className="text-sm text-slate-500">
                        Submitted:{" "}
                        {req?.createdAt
                          ? new Date(req.createdAt).toLocaleDateString()
                          : "-"}
                      </p>

                      {statusMessage && (
                        <p className={`text-sm font-medium ${statusColor}`}>
                          {statusMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                {req.status === "pending" && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      disabled={lm.accepting || !canAccept}
                      onClick={() => handleAccept(req)}
                      className={`min-w-[140px] rounded-2xl px-5 py-3 font-medium transition
                      ${
                        canAccept
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-slate-200 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {lm.accepting ? "Accepting..." : "Accept"}
                    </button>

                    <button
                      disabled={lm.rejecting}
                      onClick={() => handleReject(req)}
                      className="min-w-[140px] rounded-2xl px-5 py-3 font-medium bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60"
                    >
                      {lm.rejecting ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* EMPTY */}
        {filteredRequests.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 shadow-sm text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-5" />

            <h3 className="text-2xl font-semibold text-slate-800">
              No Requests Found
            </h3>

            <p className="text-slate-500 mt-2">
              No supervision requests match your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;
