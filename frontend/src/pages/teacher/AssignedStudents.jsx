// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { MessageSquare, CheckCircle, X, Loader } from "lucide-react";
// import {
//   addFeedback,
//   getAssignedStudents,
//   markComplete,
// } from "../../store/slices/teacherSlice";

// const AssignedStudents = () => {
//   const [sortBy, setSortBy] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [showCompleteModal, setShowCompleteModal] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [feedbackData, setFeedbackData] = useState({
//     title: "",
//     message: "",
//     type: "general",
//   });

//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getAssignedStudents());
//   }, [dispatch]);

//   const { assignedStudents, loading, error } = useSelector(
//     (state) => state.teacher,
//   );

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-700 border border-green-300";
//         break;

//       case "approved":
//         return "bg-blue-100 text-blue-700 border border-blue-300";
//         break;

//       default:
//         return "bg-yellow-100 text-yellow-700 border border-yellow-300";
//     }
//   };

//   const getStatusText = (status) => {
//     if (status === "completed") return "Completed";
//     if (status === "approved") return "Approved";
//     return "Pending";
//   };

//   const handleFeedback = (student) => {
//     setSelectedStudent(student);
//     setFeedbackData({ title: "", message: "", type: "general" });
//     setShowFeedbackModal(true);
//   };

//   const handleMarkComplete = (student) => {
//     setSelectedStudent(student);
//     setShowCompleteModal(true);
//   };

//   const closeModal = () => {
//     setShowFeedbackModal(false);
//     setShowCompleteModal(false);
//     setSelectedStudent(null);
//     setFeedbackData({ title: "", message: "", type: "general" });
//   };

//   const submitFeedback = () => {
//     if (
//       selectedStudent?.project?.id &&
//       feedbackData?.title &&
//       feedbackData.message
//     ) {
//       dispatch(
//         addFeedback({
//           projectId: selectedStudent.project._id,
//           payload: feedbackData,
//         }),
//       );
//       closeModal();
//     }
//   };

//   const confirmMarkComplete = () => {
//     if (selectedStudent?.project?.id) {
//       dispatch(dispatch(markComplete(selectedStudent?.project?._id)));
//       closeModal();
//     }
//   };

//   const sortedStudents = [...(assignedStudents || [])].sort((a, b) => {
//     switch (sortBy) {
//       case "name":
//         return a.name?.localeCompare(b.name);
//         break;

//       case "lastActivity":
//         return new Date(b.project?.updatedAt) - new Date(a.project.updatedAt);
//         break;

//       default:
//         return 0;
//     }
//   });

//   const stats = [
//     {
//       label: "Total Students",
//       value: sortedStudents.length,
//       bg: "bg-blue-50",
//       text: "text-blue-700",
//       sub: "text-blue-600",
//     },
//     {
//       label: "Projects Completed",
//       value: sortedStudents.filter((s) => s.project?.status === "completed")
//         .length,
//       bg: "bg-green-50",
//       text: "text-green-700",
//       sub: "text-green-600",
//     },
//     {
//       label: "In Progress",
//       value: sortedStudents.filter((s) => s.project?.status === "approved")
//         .length,
//       bg: "bg-yellow-50",
//       text: "text-yellow-700",
//       sub: "text-yellow-600",
//     },
//     {
//       label: "Total Projects",
//       value: sortedStudents.length,
//       bg: "bg-purple-50",
//       text: "text-purple-700",
//       sub: "text-purple-600",
//     },
//   ];

//   if (loading) {
//     return <Loader className="animate-spin w-16 h-16" />;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10 text-red-600 font-medium">
//         Error loading students
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-6">
//         {/* HEADER */}
//         <div className="card">
//           <div className="card-header">
//             <h1 className="card-title">Assigned Students</h1>
//             <p className="card-subtitle">
//               Manage your assigned students and their projects
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             {stats.map((item) => {
//               return (
//                 <div key={item.label} className={`${item.bg} p-4 rounded-lg`}>
//                   <p className={`text-sm ${item.sub}`}>{item.label}</p>
//                   <p className={`text-2xl ${item.text} font-bold`}>
//                     {item.value}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* STUDENTS GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {sortedStudents.map((student) => {
//             <div
//               key={student._id}
//               className="card hover:shadow-lg transition-all duration-300"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                     <span className="text-blue-600 font-semibold">
//                       {student.name
//                         ?.split(" ")
//                         .map((n) => n[0])
//                         .join("") || "S"}
//                     </span>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-slate-800">
//                       {student.name}
//                     </h3>
//                     <p className="text-sm text-slate-600">{student.email}</p>
//                   </div>
//                 </div>

//                 {/* STATUS BADGE */}
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(student.project?.status)}`}
//                 >
//                   {getStatusText(student.project?.status)}
//                 </span>
//               </div>

//               <div className="mb-5">
//                 <h4 className="font-medium text-slate-700 mb-1">
//                   {student.project.title || "No project title"}
//                 </h4>
//                 <p className="text-xs text-slate-500">
//                   Last Update:{" "}
//                   {new Date(
//                     student.project?.updatedAt || new Date(),
//                   ).toLocaleDateString()}
//                 </p>
//               </div>

//               {/* ACTIONS */}
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => handleFeedback(student)}
//                   className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white
//                   text-sm rounded-lg hover:bg-blue-700
//                   transition"
//                 >
//                   <MessageSquare className="w-4 h-4" /> Feedback
//                 </button>
//                 <button
//                   onClick={() => handleMarkComplete(student)}
//                   disabled={student.project?.status === "completed"}
//                   className={`flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white
//                   text-sm rounded-lg hover:bg-green-700
//                   transition ${
//                     student?.project?.status === "complete"
//                       ? "opacity-50 cursor-not-allowed"
//                       : "hover:bg-green-700"
//                   }`}
//                 >
//                   <CheckCircle className="w-4 h-4" /> Mark Complete
//                 </button>
//               </div>
//             </div>;
//           })}

//           {sortedStudents.length === 0 && (
//             <div className="card text-center py-10 text-slate-600">
//               No assigned students found
//             </div>
//           )}
//         </div>

//         {/* FEEDBACK MODAL */}
//         {showFeedbackModal && selectedStudent && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//             onClick={closeModal}
//           >
//             <div
//               className="bg-white rounded-xl shadow-2xl w-full max-w-md transform scale-100
//             transition-all"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-bold text-slate-800">
//                     Provide Feedback
//                   </h2>
//                   <button
//                     onClick={closeModal}
//                     className="text-slate-400 hover:text-slate-600"
//                   >
//                     <X />
//                   </button>
//                 </div>

//                 {/* PROJECT INFO */}
//                 <div className="bg-slate-50 rounded-lg p-4 mb-6">
//                   <div className="space-y-2 text-sm">
//                     <div>
//                       <span className="font-medium text-slate-600">
//                         Project:
//                       </span>
//                       <span className="ml-2 text-slate-800">
//                         {selectedStudent.project?.title || "No title"}
//                       </span>
//                     </div>

//                     <div>
//                       <span className="font-medium text-slate-600">
//                         Student:
//                       </span>
//                       <span className="ml-2 text-slate-800">
//                         {selectedStudent.name}
//                       </span>
//                     </div>

//                     {selectedStudent.project?.deadline && (
//                       <div>
//                         <span className="font-medium text-slate-600">
//                           Deadline:
//                         </span>
//                         <span className="ml-2 text-slate-800">
//                           {new Date(
//                             selectedStudent.project?.deadline,
//                           ).toLocaleDateString()}
//                         </span>
//                       </div>
//                     )}

//                     <div className="mb-4">
//                       <span className="font-medium text-slate-600">
//                         Last Updated:
//                       </span>
//                       <span className="ml-2 text-slate-800">
//                         {new Date(
//                           selectedStudent.project?.updatedAt || new Date(),
//                         ).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Feedback FORM */}
//                   <div className="space-y-4">
//                     <div className="mt-5">
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Feedback Title
//                       </label>
//                       <input
//                         type="text"
//                         value={feedbackData.title}
//                         onChange={(e) => {
//                           setFeedbackData({
//                             ...setFeedbackData,
//                             title: e.target.value,
//                           });
//                         }}
//                         className="w-full px-3 py-2 border-slate-300
//                         rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="Enter feedback title"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Feedback Type
//                       </label>

//                       <select
//                         value={feedbackData.type}
//                         onChange={(e) => {
//                           setFeedbackData({
//                             ...setFeedbackData,
//                             type: e.target.value,
//                           });
//                         }}
//                         className="w-full px-3 py-2 border-slate-300
//                         rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       >
//                         <option value="general">General</option>
//                         <option value="positive">Positive</option>
//                         <option value="negative">Negative</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Feedback Message
//                       </label>

//                       <textarea
//                         value={feedbackData.message}
//                         onChange={(e) => {
//                           setFeedbackData({
//                             ...setFeedbackData,
//                             message: e.target.value,
//                           });
//                         }}
//                         rows={4}
//                         className="w-full px-3 py-2 border-slate-300
//                         rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                         placeholder="Enter your feedback message..."
//                       />
//                     </div>
//                   </div>

//                   <div className="flex gap-3 mt-6">
//                     <button onClick={closeModal} className="btn-danger">
//                       Cancel
//                     </button>
//                     <button
//                       className="btn-primary"
//                       onClick={submitFeedback}
//                       disabled={!feedbackData.title || !feedbackData.message}
//                     >
//                       Submit Feedback
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* COMPLETE MODEL */}
//         {showCompleteModal && selectedStudent && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex backdrop-blur-sm items-center justify-center z-50 p-4"
//             onClick={closeModal}
//           >
//             <div
//               className="bg-white rounded-xl shadow-2xl w-full max-w-md transform scale-100
//             transition-all"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-bold text-slate-800">
//                     Mark project as Completed?
//                   </h2>
//                   <button
//                     className="text-slate-400 hover:text-slate-600"
//                     onClick={closeModel}
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <div className="bg-slate-50 rounded-lg p-4 mb-6">
//                   <div className="space-y-6 text-sm">
//                     <div>
//                       <span className="font-medium text-slate-600">
//                         Student
//                       </span>
//                       <span className="ml-2 text-slate-800">
//                         {selectedStudent.name}{" "}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="font-medium text-slate-600">
//                         Project
//                       </span>
//                       <span className="ml-2 text-slate-800">
//                         {selectedStudent.project?.title || "No title"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="text-slate-600 mb-6">
//                   Are you sure to mark this project as completed? This action
//                   cannot be undone.
//                 </p>

//                 <div className="flex gap-3">
//                   <button className="btn-danger" onClick={closeModal}>
//                     Cancel
//                   </button>
//                   <button className="btn-primary" onClick={confirmMarkComplete}>
//                     Mark as Completed
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AssignedStudents;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  MessageSquare,
  CheckCircle2,
  X,
  Loader2,
  Users,
  FolderKanban,
  Clock3,
  CheckCheck,
} from "lucide-react";

import {
  addFeedback,
  getAssignedStudents,
  markComplete,
} from "../../store/slices/teacherSlice";

const AssignedStudents = () => {
  const dispatch = useDispatch();

  const [sortBy, setSortBy] = useState("default");

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [feedbackData, setFeedbackData] = useState({
    title: "",
    message: "",
    type: "general",
  });

  const { assignedStudents, loading, error } = useSelector(
    (state) => state.teacher,
  );

  useEffect(() => {
    dispatch(getAssignedStudents());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";

      case "approved":
        return "bg-blue-50 text-blue-700 border border-blue-200";

      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getStatusText = (status) => {
    if (status === "completed") return "Completed";

    if (status === "approved") return "In Progress";

    return "Pending";
  };

  const handleFeedback = (student) => {
    setSelectedStudent(student);

    setFeedbackData({
      title: "",
      message: "",
      type: "general",
    });

    setShowFeedbackModal(true);
  };

  const handleMarkComplete = (student) => {
    setSelectedStudent(student);

    setShowCompleteModal(true);
  };

  const closeModal = () => {
    setShowFeedbackModal(false);

    setShowCompleteModal(false);

    setSelectedStudent(null);

    setFeedbackData({
      title: "",
      message: "",
      type: "general",
    });
  };

  const submitFeedback = () => {
    if (
      selectedStudent?.project?._id &&
      feedbackData.title &&
      feedbackData.message
    ) {
      dispatch(
        addFeedback({
          projectId: selectedStudent.project._id,
          payload: feedbackData,
        }),
      );

      closeModal();
    }
  };

  const confirmMarkComplete = () => {
    if (selectedStudent?.project?._id) {
      dispatch(markComplete(selectedStudent.project._id));

      closeModal();
    }
  };

  const sortedStudents = [...(assignedStudents || [])].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.name || "").localeCompare(b.name || "");

      case "lastActivity":
        return (
          new Date(b.project?.updatedAt || 0) -
          new Date(a.project?.updatedAt || 0)
        );

      default:
        return 0;
    }
  });

  const stats = [
    {
      label: "Total Students",
      value: sortedStudents.length,
      icon: Users,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      textColor: "text-blue-900",
      subColor: "text-blue-600",
    },

    {
      label: "Completed",
      value: sortedStudents.filter((s) => s.project?.status === "completed")
        .length,
      icon: CheckCheck,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      textColor: "text-emerald-900",
      subColor: "text-emerald-600",
    },

    {
      label: "In Progress",
      value: sortedStudents.filter((s) => s.project?.status === "approved")
        .length,
      icon: Clock3,
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      textColor: "text-amber-900",
      subColor: "text-amber-600",
    },

    {
      label: "Projects",
      value: sortedStudents.length,
      icon: FolderKanban,
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
      textColor: "text-purple-900",
      subColor: "text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-12 h-12 animate-spin text-slate-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-6 text-center font-medium">
        Error loading assigned students
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Assigned Students
            </h1>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Manage student projects, provide feedback, and monitor project
              progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-300 bg-white rounded-2xl px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="default">Default</option>

              <option value="name">Sort by Name</option>

              <option value="lastActivity">Last Activity</option>
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

      {/* STUDENTS */}
      {sortedStudents.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {sortedStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-700 font-semibold text-lg">
                      {student.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2) || "S"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {student.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {student.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap ${getStatusBadge(
                    student.project?.status,
                  )}`}
                >
                  {getStatusText(student.project?.status)}
                </span>
              </div>

              {/* PROJECT */}
              <div className="mt-6 border border-slate-200 rounded-2xl p-5 bg-slate-50">
                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
                  Project
                </p>

                <h4 className="font-semibold text-slate-800 text-lg">
                  {student.project?.title || "No project title"}
                </h4>

                <p className="text-sm text-slate-500 mt-3">
                  Last Updated:{" "}
                  {student.project?.updatedAt
                    ? new Date(student.project.updatedAt).toLocaleDateString()
                    : "No activity"}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => handleFeedback(student)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-medium transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Give Feedback
                </button>

                <button
                  onClick={() => handleMarkComplete(student)}
                  disabled={student.project?.status === "completed"}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 font-medium transition
                  ${
                    student.project?.status === "completed"
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "border border-slate-300 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 shadow-sm text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-5" />

          <h3 className="text-2xl font-semibold text-slate-800">
            No Assigned Students
          </h3>

          <p className="text-slate-500 mt-2">
            Assigned students will appear here.
          </p>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && selectedStudent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Provide Feedback
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Share feedback for {selectedStudent.name}
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Feedback title"
                  value={feedbackData.title}
                  onChange={(e) =>
                    setFeedbackData({
                      ...feedbackData,
                      title: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                />

                <select
                  value={feedbackData.type}
                  onChange={(e) =>
                    setFeedbackData({
                      ...feedbackData,
                      type: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="general">General</option>

                  <option value="positive">Positive</option>

                  <option value="negative">Negative</option>
                </select>

                <textarea
                  rows={5}
                  placeholder="Write feedback..."
                  value={feedbackData.message}
                  onChange={(e) =>
                    setFeedbackData({
                      ...feedbackData,
                      message: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-slate-200"
                />

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={closeModal}
                    className="flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-2xl py-3 font-medium transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={submitFeedback}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-medium transition"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE MODAL */}
      {showCompleteModal && selectedStudent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Complete Project
                </h2>

                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to mark this project as completed?
              </p>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={closeModal}
                  className="flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-2xl py-3 font-medium transition"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmMarkComplete}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3 font-medium transition"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedStudents;
