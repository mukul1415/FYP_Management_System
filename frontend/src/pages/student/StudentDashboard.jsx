// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDashboardStats } from "../../store/slices/studentSlice";
// import { Link } from "react-router-dom";
// import { MessageCircle, MessageCircleWarning, Bell } from "lucide-react";

// const StudentDashboard = () => {
//   const dispatch = useDispatch();
//   const { authUser } = useSelector((state) => state.auth);
//   const { dashboardStats } = useSelector((state) => state.student);

//   useEffect(() => {
//     dispatch(fetchDashboardStats());
//   }, [dispatch]);

//   const project = dashboardStats?.project || {};
//   const supervisorName = dashboardStats?.supervisorName || "";
//   const upcomingDeadlines = dashboardStats?.upcomingDeadlines || [];
//   const topNotifications = dashboardStats?.topNotifications || [];
//   const feedbackList =
//     dashboardStats?.feedbackNotifications?.slice(-2).reverse() || [];

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "N/A";
//     return new Date(dateStr).toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // const getStatusColor = (status) => {
//   //   switch (status) {
//   //     case "upcoming":
//   //       return "badge-pending"
//   //     case "completed":
//   //       return "badge-approved"
//   //     case "overdue":
//   //       return "badge-rejected"
//   //     default:
//   //       return "badge-pending";
//   //   }
//   // };

//   return (
//     <>
//       <div className="space-y-6">
//         <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
//           <h1 className="text-2xl font-bold mb-2">
//             Welcome back, {authUser?.name || "Student"}
//           </h1>
//           <p className="text-blue-100">
//             Here's your project overview and recent updates.
//           </p>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="card">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">📚</div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-slate-600">
//                   Project Title
//                 </p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   {project?.title || "No Project"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="card">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">🙍🏻‍♂️</div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-slate-600">Supervisor</p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   {supervisorName || "N/A"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="card">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">⏰</div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-slate-600">
//                   Next Deadline
//                 </p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   {formatDate(project?.deadline)}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="card">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">💬</div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-slate-600">
//                   Recent Feedback
//                 </p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   {feedbackList?.length
//                     ? formatDate(feedbackList[0]?.createdAt)
//                     : "No feedback yet"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* MAIN CONTENT GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Project Overview */}
//           <div className="card">
//             <div className="card-header">
//               <h2 className="card-title">Project Overview</h2>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-slate-600">
//                   Title
//                 </label>
//                 <p className="text-slate-800 font-medium">
//                   {project?.title || "N/A"}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-slate-600">
//                   Description
//                 </label>
//                 <p className="text-slate-800 font-medium">
//                   {project?.description || "No description provided"}
//                 </p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <label className="text-sm font-medium text-slate-600">
//                   Status
//                 </label>
//                 <span
//                   className={`inline-flex items-center px-2 py-[2px] rounded-full text-sm font-medium capitalize ${
//                     project?.status === "approved"
//                       ? "bg-green-100 text-green-800"
//                       : project?.status === "pending"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : project?.status === "rejected"
//                           ? "bg-red-100 text-red-800"
//                           : project?.status === "completed"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-gray-100 text-gray-800"
//                   }
//                 `}
//                 >
//                   {project?.status || "Unknown"}
//                 </span>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-slate-600">
//                   Submission Deadline
//                 </label>
//                 <p className="text-slate-800 font-medium">
//                   {formatDate(project?.deadline)}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Latest Feddback */}
//           <div className="card">
//             <div className="card-header flex items-center justify-between">
//               <h2 className="card-title">Latest Feedback</h2>
//               <Link
//                 to={"/student/feedback"}
//                 className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full font-medium
//                         hover:bg-blue-600 transition-all duration-300"
//               >
//                 View All
//               </Link>
//             </div>

//             {feedbackList && feedbackList.length > 0 ? (
//               <div className="space-y-4 p-4">
//                 {feedbackList.map((feedback, index) => {
//                   return (
//                     <div
//                       key={index}
//                       className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center space-x-2">
//                           <MessageCircle className="w-5 h-5 text-blue-500" />
//                           <h3 className="font-medium text-slate-800">
//                             {feedback.title || "Supervisor Feedback"}
//                           </h3>
//                         </div>

//                         <p className="text-xs text-slate-500">
//                           {formatDate(feedback.createdAt)}
//                         </p>
//                       </div>

//                       <div className="text-slate-50 rounded-lg p-3">
//                         <p className="text-slate-700 text-sm leading-relaxed">
//                           {feedback.message}
//                         </p>
//                       </div>

//                       <div className="flex justify-between items-center mt-3">
//                         <p className="text-xs text-slate-500">
//                           - {supervisorName || "Supervisor"}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
//                 <p className="text-slate-500 text-sm">
//                   No feedback available yet.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* UPCOMING DEADLINES & NOTIFICATIONS */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="card">
//             <div className="card-header">
//               <h2 className="card-title">Upcoming Deadlines</h2>
//             </div>
//             {upcomingDeadlines && upcomingDeadlines.length > 0 ? (
//               <div className="space-y-3">
//                 {upcomingDeadlines.map((d, i) => {
//                   return (
//                     <div
//                       key={i}
//                       className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
//                     >
//                       <div>
//                         <p className="font-medium text-slate-800">{d.title}</p>
//                         <p className="text-sm text-slate-600">
//                           {formatDate(d.deadline)}
//                         </p>
//                       </div>
//                       <div
//                         className={`badge badge-pending capitalize font-bold`}
//                       >
//                         Upcoming
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <MessageCircleWarning className="w-10 h-10 text-slate-300 mx-auto mb-3" />
//                 <p className="text-slate-500 text-sm">
//                   No upcoming deadlines yet.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Recent Notifications */}
//           <div className="card">
//             <div className="card-header">
//               <h2 className="card-title">Recent Notifications</h2>

//               {topNotifications && topNotifications.length > 0 ? (
//                 <div className="space-y-3">
//                   {topNotifications.map((n, i) => {
//                     return (
//                       <div
//                         key={i}
//                         className="p-3 bg-slate-50 rounded-lg border border-slate-100"
//                       >
//                         <p className="font-medium text-slate-800">
//                           {n.message}
//                         </p>
//                         <p className="text-xs text-slate-500 mt-1">
//                           {formatDate(n.createdAt)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
//                   <p className="text-slate-500 text-sm">
//                     No notifications yet.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentDashboard;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../store/slices/studentSlice";
import { Link } from "react-router-dom";

import {
  MessageCircle,
  MessageCircleWarning,
  Bell,
  BookOpen,
  User,
  CalendarDays,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const StudentDashboard = () => {
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.auth);

  const { dashboardStats } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const project = dashboardStats?.project || {};

  const supervisorName = dashboardStats?.supervisorName || "";

  const upcomingDeadlines = dashboardStats?.upcomingDeadlines || [];

  const topNotifications = dashboardStats?.topNotifications || [];

  const feedbackList =
    dashboardStats?.feedbackNotifications?.slice(-2).reverse() || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statCards = [
    {
      title: "Project",
      value: project?.title || "No Project",
      Icon: BookOpen,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },

    {
      title: "Supervisor",
      value: supervisorName || "N/A",
      Icon: User,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },

    {
      title: "Deadline",
      value: formatDate(project?.deadline),
      Icon: CalendarDays,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },

    {
      title: "Project Status",
      value: project?.status || "Pending",
      Icon: CheckCircle2,
      bg: "bg-green-100",
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {authUser?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div>
              <h1 className="text-3xl font-bold">Welcome back,</h1>

              <p className="text-xl text-blue-100 font-medium">
                {authUser?.name || "Student"}
              </p>
            </div>
          </div>

          <p className="text-blue-100 max-w-2xl leading-relaxed">
            Track your project progress, deadlines, feedback, and stay updated
            with all recent notifications.
          </p>
        </div>

        {/* Blur circles */}
        <div className="absolute -right-10 top-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute right-20 bottom-0 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map(({ title, value, Icon, bg, color }, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{title}</p>

                <h2 className="text-lg font-bold text-slate-800 mt-2 capitalize">
                  {value}
                </h2>
              </div>

              <div className={`p-4 rounded-2xl ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* PROJECT OVERVIEW */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800">
              Project Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Details about your current project
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <p className="text-sm text-slate-500 mb-1">Project Title</p>

              <h3 className="font-semibold text-slate-800 text-lg">
                {project?.title || "No Project"}
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Description</p>

              <p className="text-slate-700 leading-relaxed">
                {project?.description || "No project description available."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500">Status:</p>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                  project?.status,
                )}`}
              >
                {project?.status || "Unknown"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 className="w-5 h-5 text-orange-500" />

              <p className="text-slate-700 font-medium">
                Submission Deadline: {formatDate(project?.deadline)}
              </p>
            </div>
          </div>
        </div>

        {/* FEEDBACK */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Latest Feedback
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Recent supervisor feedback
              </p>
            </div>

            <Link
              to="/student/feedback"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              View All
            </Link>
          </div>

          <div className="p-6">
            {feedbackList.length > 0 ? (
              <div className="space-y-4">
                {feedbackList.map((feedback, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-blue-500" />

                        <h3 className="font-semibold text-slate-800">
                          {feedback.title || "Supervisor Feedback"}
                        </h3>
                      </div>

                      <span className="text-xs text-slate-500">
                        {formatDate(feedback.createdAt)}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed text-sm">
                      {feedback.message}
                    </p>

                    <p className="text-xs text-slate-500 mt-4">
                      — {supervisorName || "Supervisor"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />

                <h3 className="text-lg font-semibold text-slate-700">
                  No Feedback Yet
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Feedback from your supervisor will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DEADLINES + NOTIFICATIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* DEADLINES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800">
              Upcoming Deadlines
            </h2>
          </div>

          <div className="p-6">
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeadlines.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{d.title}</p>

                      <p className="text-sm text-slate-500 mt-1">
                        {formatDate(d.deadline)}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                      Upcoming
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircleWarning className="w-12 h-12 text-slate-300 mb-3" />

                <h3 className="text-lg font-semibold text-slate-700">
                  No Upcoming Deadlines
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Future deadlines will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800">
              Recent Notifications
            </h2>
          </div>

          <div className="p-6">
            {topNotifications.length > 0 ? (
              <div className="space-y-4">
                {topNotifications.map((n, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Bell className="w-5 h-5 text-slate-700" />
                    </div>

                    <div>
                      <p className="font-medium text-slate-800">{n.message}</p>

                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(n.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 mb-3" />

                <h3 className="text-lg font-semibold text-slate-700">
                  No Notifications
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Notifications will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
