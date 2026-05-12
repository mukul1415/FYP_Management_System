// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getTeacherDashboardStats } from "../../store/slices/teacherSlice";
// import { CheckCircle, Clock, Loader, Users, MoveDiagonal } from "lucide-react";

// const TeacherDashboard = () => {
//   const dispatch = useDispatch();

//   const { dashboardStats, loading } = useSelector((state) => state.teacher);
//   const { authUser } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(getTeacherDashboardStats());
//   }, [dispatch]);

//   const statsCards = [
//     {
//       title: "Assigned Students",
//       value: authUser?.assignedStudents?.length || 0,
//       loading,
//       Icon: Users,
//       bg: "bg-blue-100",
//       color: "text-blue-600",
//     },
//     {
//       title: "Pending Requests",
//       value: dashboardStats?.totalPendingRequests || 0,
//       loading,
//       Icon: Clock,
//       bg: "bg-yellow-100",
//       color: "text-yellow-600",
//     },
//     {
//       title: "Completed Projects",
//       value: dashboardStats?.completedProjects || 0,
//       loading,
//       Icon: CheckCircle,
//       bg: "bg-green-100",
//       color: "text-green-600",
//     },
//   ];

//   return (
//     <>
//       <div className="space-y-6">
//         <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
//           <h1 className="text-2xl font-bold mb-2">Teacher Dashboard</h1>
//           <p className="text-green-100 mt-1">
//             Welcome back, {authUser?.name || "Teacher"}
//           </p>
//           <p className="text-green-100">
//             Manage your students and provide guidance on their projects.
//           </p>
//         </div>

//         {/* STATS CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {statsCards.map(
//             ({ title, value, loading, Icon, bg, color }, index) => {
//               return (
//                 <div key={index} className={`card`}>
//                   <div className="flex items-center">
//                     <div className={`p-3 ${bg} rounded-lg`}>
//                       <Icon className={`w-6 h-6 ${color}`} />
//                     </div>

//                     <div className="ml-4">
//                       <p className={`text-sm font-medium text-slate-600`}>
//                         {title}
//                       </p>
//                       <p className={`text-sm font-medium text-slate-800`}>
//                         {loading ? "..." : value}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             },
//           )}
//         </div>

//         {/* RECENT ACTIVITY */}

//         <div className="card">
//           <div className="card-header">
//             <h2 className="card-title">Recent Activity</h2>
//             <p className="card-subtitle">Latest notifications and updates</p>
//           </div>

//           <div className="space-y-4">
//             {loading ? (
//               <Loader size={32} className="animate-spin" />
//             ) : dashboardStats?.recentNotifications?.length > 0 ? (
//               dashboardStats.recentNotifications.map((notifications) => {
//                 return (
//                   <div
//                     key={notifications._id}
//                     className="flex items-center p-3 bg-slate-50 rounded-lg"
//                   >
//                     <div className="p-2 bg-white rounded-lg to-slate-600">
//                       <MoveDiagonal className="w-5 h-5" />
//                     </div>

//                     <div className="ml-3 flex-1">
//                       <p className="text-sm text-slate-800">
//                         {notifications.message}
//                       </p>
//                       <p className="text-xs text-slate-500">
//                         {new Date(notifications.createdAt).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center py-4 text-slate-500">
//                 {" "}
//                 No recent activity
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TeacherDashboard;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherDashboardStats } from "../../store/slices/teacherSlice";

import {
  CheckCircle,
  Clock,
  Loader,
  Users,
  Activity,
  Bell,
} from "lucide-react";

const TeacherDashboard = () => {
  const dispatch = useDispatch();

  const { dashboardStats, loading } = useSelector((state) => state.teacher);

  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTeacherDashboardStats());
  }, [dispatch]);

  const statsCards = [
    {
      title: "Assigned Students",
      value: authUser?.assignedStudents?.length || 0,
      Icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
      cardBg: "from-blue-50 to-blue-100/40",
    },

    {
      title: "Pending Requests",
      value: dashboardStats?.totalPendingRequests || 0,
      Icon: Clock,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
      cardBg: "from-yellow-50 to-yellow-100/40",
    },

    {
      title: "Completed Projects",
      value: dashboardStats?.completedProjects || 0,
      Icon: CheckCircle,
      bg: "bg-green-100",
      color: "text-green-600",
      cardBg: "from-green-50 to-green-100/40",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {authUser?.name?.charAt(0)?.toUpperCase() || "T"}
            </div>

            <div>
              <h1 className="text-3xl font-bold">Welcome back,</h1>

              <p className="text-xl text-green-100 font-medium">
                {authUser?.name || "Teacher"}
              </p>
            </div>
          </div>

          <p className="text-green-100 max-w-2xl leading-relaxed">
            Manage your assigned students, monitor project progress, and provide
            feedback efficiently from your dashboard.
          </p>
        </div>

        {/* Decorative Blur */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute right-20 bottom-0 w-28 h-28 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map(({ title, value, Icon, bg, color, cardBg }, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cardBg} border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{title}</p>

                <h2 className="text-3xl font-bold text-slate-800 mt-2">
                  {loading ? "..." : value}
                </h2>
              </div>

              <div className={`p-4 rounded-2xl ${bg}`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
            </div>

            <div className="absolute right-0 bottom-0 opacity-10">
              <Icon className="w-24 h-24" />
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-100">
              <Activity className="w-6 h-6 text-slate-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Activity
              </h2>

              <p className="text-sm text-slate-500">
                Latest notifications and project updates
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader className="w-10 h-10 animate-spin text-green-600" />
            </div>
          ) : dashboardStats?.recentNotifications?.length > 0 ? (
            <div className="space-y-4">
              {dashboardStats.recentNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Bell className="w-5 h-5 text-slate-700" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {notification.message}
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-slate-100 mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>

              <h3 className="text-lg font-semibold text-slate-700">
                No Recent Activity
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Notifications and updates will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
