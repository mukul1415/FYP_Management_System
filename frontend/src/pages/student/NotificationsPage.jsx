// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getNotifications,
//   markAsRead,
//   markAllAsRead,
//   deleteNotification,
// } from "../../store/slices/notificationSlice";
// import {
//   MessageCircle,
//   Clock5,
//   BadgeCheck,
//   Calendar,
//   Settings,
//   User,
//   ChevronDown,
//   AlertCircle,
//   CheckCircle2,
//   Clock,
//   BellOff,
//   Icon,
// } from "lucide-react";

// const NotificationsPage = () => {
//   const dispatch = useDispatch();
//   const notifications = useSelector((state) => state.notification.list);
//   const unreadCount = useSelector((state) => state.notification.unreadCount);

//   useEffect(() => {
//     dispatch(getNotifications());
//   }, [dispatch]);

//   const markAsReadHandler = (id) => dispatch(markAsRead(id));
//   const markAllAsReadHandler = () => dispatch(markAllAsRead());
//   const deleteNotificationHandler = (id) => dispatch(deleteNotification(id));

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case "feedback":
//         return <MessageCircle className="w-6 h-6 text-blue-500" />;

//       case "deadline":
//         return <Clock5 className="w-6 h-6 text-red-500" />;

//       case "approval":
//         return <BadgeCheck className="w-6 h-6 text-green-500" />;

//       case "meeting":
//         return <Calendar className="w-6 h-6 text-purple-500" />;

//       case "system":
//         return <Settings className="w-6 h-6 text-gray-500" />;

//       default:
//         return (
//           <div className="relative w-6 h-6 text-slate-500 flex items-center justify-center">
//             <User className="w-5 h-5 absolute" />
//             <ChevronDown className="w-4 h-4 absolute top-4" />
//           </div>
//         );
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "high":
//         return "border-1-red-500";
//         break;
//       case "medium":
//         return "border-1-yellow-500";
//         break;
//       case "low":
//         return "border-1-green-500";
//         break;

//       default:
//         return "border-1-slate-300";
//         break;
//     }
//   };

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     const now = new Date();

//     const diffMs = now - date;
//     const diffMinutes = Math.floor(diffMs / (1000 * 60));
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//     if (diffMinutes < 1) return "Just now";
//     if (diffMinutes < 60) return `${diffMinutes} min ago`;
//     if (diffHours < 24) return `${diffHours} hr ago`;
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays <= 7) return `${diffDays} days ago`;

//     return date.toLocaleDateString();
//   };

//   const stats = [
//     {
//       title: "Total",
//       value: notifications.length,
//       bg: "bg-blue-50",
//       iconBg: "bg-blue-100",
//       textColor: "text-blue-600",
//       titleColor: "text-blue-800",
//       valueColor: "text-blue-900",
//       Icon: User,
//     },
//     {
//       title: "Unread",
//       value: unreadCount,
//       bg: "bg-red-50",
//       iconBg: "bg-red-100",
//       textColor: "text-red-600",
//       titleColor: "text-red-800",
//       valueColor: "text-red-900",
//       Icon: AlertCircle,
//     },
//     {
//       title: "High Priority",
//       value: notifications.filter((n) => n.priority === "high").length,
//       bg: "bg-yellow-50",
//       iconBg: "bg-yellow-100",
//       textColor: "text-yellow-600",
//       titleColor: "text-yellow-800",
//       valueColor: "text-yellow-900",
//       Icon: Clock,
//     },
//     {
//       title: "This Week",
//       value: notifications.filter((n) => {
//         const notifDate = new Date(n.date);
//         const weekAgo = new Date();
//         weekAgo.setDate(weekAgo.getDate() - 7);
//         return notifDate >= weekAgo;
//       }).length,
//       bg: "bg-green-50",
//       iconBg: "bg-green-100",
//       textColor: "text-green-600",
//       titleColor: "text-green-800",
//       valueColor: "text-green-900",
//       Icon: CheckCircle2,
//     },
//   ];

//   return (
//     <>
//       <div className="space-y-6">
//         <div className="card">
//           {/* CARD HEADER */}
//           <div className="card-header">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="card-title">Notifications</h1>
//                 <p className="card-subtitle">
//                   Stay updated with your project progress and deadlines
//                 </p>
//               </div>
//               {unreadCount > 0 && (
//                 <button
//                   className="btn-outline btn-small"
//                   onClick={markAllAsReadHandler}
//                 >
//                   Mark all as read ({unreadCount})
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* NOTIFICATION STATS */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             {stats.map((item, i) => {
//               return (
//                 <div key={i} className={`${item.bg} rounded-lg p-4`}>
//                   <div className="flex items-center">
//                     <div className={`p-2 ${item.iconBg} rounded-lg`}>
//                       <item.Icon className={`w-5 h-5 ${item.textColor}`} />
//                     </div>

//                     <div className="ml-3">
//                       <p className={`text-sm font-medium ${item.titleColor}`}>
//                         {item.title}
//                       </p>
//                       <p className={`text-sm font-medium ${item.valueColor}`}>
//                         {item.value}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* NOTIFICATION LIST*/}
//           <div className="space-y-3">
//             {notifications.map((notification) => {
//               <div
//                 key={notification._id}
//                 className={`border border-slate-200 rounded-lg p-4 transition-all duration-200 border-1
//                           ${getPriorityColor(notification.priority)}
//                           ${!notification.isRead ? "bg-blue-50" : "bg-white hover:bg-slate-50"}`}
//               >
//                 <div className="flex items-center space-x-4">
//                   <div className="flex-shrink-0 mt-1">
//                     {getNotificationIcon(notification.type)}
//                   </div>

//                   <div className="flex min-w-0">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3
//                         className={`font-medium ${
//                           !notification.isRead
//                             ? "text-slate-900"
//                             : "text-slate-700"
//                         }`}
//                       >
//                         {notification.title}
//                         {!notification.isRead && (
//                           <span className="ml-2 w-2 h-2 bg-blue-50 rounded-full inline-block" />
//                         )}
//                       </h3>

//                       <div className="flex items-center space-x-2">
//                         <span className="text-sm text-slate-500">
//                           {formatDate(notification.createdAt)}
//                         </span>
//                         <span
//                           className={`badge capitalize ${
//                             notification.priority === "high"
//                               ? "badge-rejected"
//                               : notification.priority === "medium"
//                                 ? "badge-pending"
//                                 : "badge-approved"
//                           }`}
//                         >
//                           {notification.priority}
//                         </span>
//                       </div>
//                     </div>

//                     <p className="text-slate-600 text-sm leading-relaxed mb-3">
//                       {notification.message}
//                     </p>

//                     <div className="flex items-center justify-between">
//                       <span
//                         className={`badge capitalize ${
//                           notification.type === "feedback"
//                             ? "bg-blue-100 text-blue-800"
//                             : notification.type === "deadline"
//                               ? "bg-red-100 text-red-800"
//                               : notification.type === "approval"
//                                 ? "bg-green-100 text-green-800"
//                                 : notification.type === "meeting"
//                                   ? "bg-purple-100 text-purple-800"
//                                   : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {notification.type}
//                       </span>
//                       <div className="flex items-center space-x-2">
//                         {!notification.isRead && (
//                           <button
//                             className="text-sm text-blue-600 hover:text-blue-500"
//                             onClick={() => markAsReadHandler(notification._id)}
//                           >
//                             Mark as read
//                           </button>
//                         )}
//                         <button
//                           className="text-sm text-red-600 hover:text-red-500"
//                           onClick={() =>
//                             deleteNotificationHandler(notification._id)
//                           }
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>;
//             })}
//           </div>

//           {notifications.length === 0 && (
//             <div className="text-center py-8">
//               <div className="flex items-center justify-center text-slate-600">
//                 <BellOff className="w-12 h-12" />
//               </div>
//               <p className="text-slate-500">No notifications yet</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default NotificationsPage;

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../store/slices/notificationSlice";

import {
  MessageCircle,
  Clock5,
  BadgeCheck,
  Calendar,
  Settings,
  User,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  BellOff,
  Bell,
  Trash2,
} from "lucide-react";

const NotificationsPage = () => {
  const dispatch = useDispatch();

  const notifications = useSelector((state) => state.notification.list || []);

  const unreadCount = useSelector(
    (state) => state.notification.unreadCount || 0,
  );

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const markAsReadHandler = (id) => {
    dispatch(markAsRead(id));
  };

  const markAllAsReadHandler = () => {
    dispatch(markAllAsRead());
  };

  const deleteNotificationHandler = (id) => {
    dispatch(deleteNotification(id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "feedback":
        return <MessageCircle className="w-6 h-6 text-blue-500" />;

      case "deadline":
        return <Clock5 className="w-6 h-6 text-red-500" />;

      case "approval":
        return <BadgeCheck className="w-6 h-6 text-green-500" />;

      case "meeting":
        return <Calendar className="w-6 h-6 text-purple-500" />;

      case "system":
        return <Settings className="w-6 h-6 text-slate-500" />;

      default:
        return (
          <div className="relative w-6 h-6 flex items-center justify-center text-slate-500">
            <User className="w-5 h-5 absolute" />
            <ChevronDown className="w-4 h-4 absolute top-3" />
          </div>
        );
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";

      case "medium":
        return "border-l-yellow-500";

      case "low":
        return "border-l-green-500";

      default:
        return "border-l-slate-300";
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "feedback":
        return "bg-blue-100 text-blue-700";

      case "deadline":
        return "bg-red-100 text-red-700";

      case "approval":
        return "bg-green-100 text-green-700";

      case "meeting":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const now = new Date();

    const diffMs = now - date;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";

    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    if (diffHours < 24) return `${diffHours} hr ago`;

    if (diffDays === 1) return "Yesterday";

    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  const stats = [
    {
      title: "Total",
      value: notifications.length,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-700",
      valueText: "text-blue-900",
      Icon: Bell,
    },

    {
      title: "Unread",
      value: unreadCount,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      text: "text-red-700",
      valueText: "text-red-900",
      Icon: AlertCircle,
    },

    {
      title: "High Priority",
      value: notifications.filter((n) => n.priority === "high").length,

      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      text: "text-yellow-700",
      valueText: "text-yellow-900",
      Icon: Clock,
    },

    {
      title: "This Week",
      value: notifications.filter((n) => {
        const d = new Date(n.createdAt);

        const weekAgo = new Date();

        weekAgo.setDate(weekAgo.getDate() - 7);

        return d >= weekAgo;
      }).length,

      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-700",
      valueText: "text-green-900",
      Icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Stay updated with project progress, approvals, meetings, and
              important alerts.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsReadHandler}
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`${item.bg} border border-slate-200 rounded-3xl p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${item.text}`}>
                  {item.title}
                </p>

                <h2 className={`text-3xl font-bold mt-2 ${item.valueText}`}>
                  {item.value}
                </h2>
              </div>

              <div className={`p-4 rounded-2xl ${item.iconBg}`}>
                <item.Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NOTIFICATIONS */}
      <div className="space-y-5">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white border border-slate-200 border-l-4 ${getPriorityBorder(
                notification.priority,
              )} rounded-3xl shadow-sm overflow-hidden transition hover:shadow-md`}
            >
              <div className="p-6">
                <div className="flex items-start gap-5">
                  {/* ICON */}
                  <div className="p-3 rounded-2xl bg-slate-100">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2
                            className={`text-lg font-bold ${
                              !notification.isRead
                                ? "text-slate-900"
                                : "text-slate-700"
                            }`}
                          >
                            {notification.title}
                          </h2>

                          {!notification.isRead && (
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeBadge(
                              notification.type,
                            )}`}
                          >
                            {notification.type}
                          </span>

                          <span className="text-xs text-slate-500 capitalize">
                            {notification.priority} priority
                          </span>

                          <span className="text-xs text-slate-500">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-3">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsReadHandler(notification._id)}
                            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
                          >
                            Mark as read
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteNotificationHandler(notification._id)
                          }
                          className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* MESSAGE */}
                    <div className="mt-5 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <p className="text-slate-700 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-14 text-center">
            <BellOff className="w-16 h-16 text-slate-300 mx-auto mb-5" />

            <h2 className="text-2xl font-bold text-slate-700">
              No Notifications
            </h2>

            <p className="text-slate-500 mt-2">
              Notifications and updates will appear here once available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
