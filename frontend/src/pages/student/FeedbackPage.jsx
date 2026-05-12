// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProject, getFeedback } from "../../store/slices/studentSlice";
// import { BadgeCheck, AlertTriangle, MessageCircle } from "lucide-react";

// const FeedbackPage = () => {

//   const dispatch = useDispatch();
//   const { project, feedback } = useSelector((state) => state.student);

//   useEffect(() => {
//     dispatch(fetchProject());
//   }, [dispatch]);

//   useEffect(() => {
//     if(project?._id) {
//       dispatch(getFeedback(project._id))
//     }
//   }, [dispatch, project]);

//   const getFeedbackIcon = (type) => {
//     if(type === "positive") {
//       return <BadgeCheck className="w-6 h-6 text-green-500" />
//     }
//     if(type === "negative") {
//       return <AlertTriangle className="w-6 h-6 text-red-500" />
//     }
//     return <MessageCircle className="w-6 h-6 text-green-500" />
//   };

//   const feedbackStats = [
//     {
//       type: "general",
//       title: "Total Feedback",
//       bg: "bg-blue-50",
//       iconBg: "bg-blue-100",
//       textColor: "text-blue-800",
//       valueColor: "text-blue-900",
//       getCount: (feedback) => feedback?.length || 0,
//     },
//     {
//       type: "positive",
//       title: "Positive",
//       bg: "bg-green-50",
//       iconBg: "bg-green-100",
//       textColor: "text-green-800",
//       valueColor: "text-green-900",
//       getCount: (feedback) =>
//         feedback.filter((f) => f.type === "positive").length,
//     },
//     {
//       type: "negative",
//       title: "Needs Revision",
//       bg: "bg-yellow-50",
//       iconBg: "bg-yellow-100",
//       textColor: "text-yellow-800",
//       valueColor: "text-yellow-900",
//       getCount: (feedback) =>
//         feedback.filter((f) => f.type === "negative").length,
//     },
//   ];

//   return (

//   <>

//   <div className="space-y-6">

//     {/* FEEDBACK HEADER */}
//     <div className="card">
//         <div className="card-header">
//           <h1 className="card-title">
//             Supervisor Feedback
//           </h1>
//           <p className="card-subtitle">
//             View feedback and comments from your supervisor
//           </p>
//         </div>
//     </div>

//     {/* FEEDBACK STATS */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         {
//           feedbackStats.map((item, i) => {
//             return (
//               <div key={i} className={`${item.bg} rounded-lg p-4`}>
//               <div className="flex items-center">
//                 <div className={`p-2 ${item.iconBg} rounded-lg`}>

//                   {
//                     getFeedbackIcon(item.type)
//                   }
//                 </div>

//               <div className="ml-3">
//                 <p className={`text-sm font-medium ${item.textColor}`}>
//                   {item.title}
//                 </p>
//                 <p className={`text-sm font-medium ${item.valueColor}`}>
//                   {item.getCount(feedback)}
//                 </p>
//               </div>
//               </div>
//             </div>
//             );
//           })
//         }
//       </div>

//       {/* Feedback List */}
//       <div className="space-y-4">
//         {
//           feedback && feedback.length > 0 ? (
//             feedback.map((f, i) => {
//               return (
//                 <div key={i} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center space-x-3">
//                       <div className="flex items-center space-x-2">
//                         {getFeedbackIcon(f.type)}
//                         <h3 className="font-medium text-slate-800">
//                           {f.title || "Feedback"}
//                         </h3>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-sm border-slate-600">
//                       {
//                         new Date(f.createdAt).toLocaleDateString()
//                       }
//                     </p>
//                     <p>
//                       {f.supervisorName || "Supervisor"}
//                     </p>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg mb-3">
//                     <p className="text-slate-700 leading-relaxed">
//                       {f.message}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-center py-8">
//               <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <p className="text-slate-500">
//                 No feedback received yet
//               </p>
//             </div>
//           )
//         }
//       </div>
//   </div>

//   </>
//  );
// };

// export default FeedbackPage;

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchProject, getFeedback } from "../../store/slices/studentSlice";

import {
  BadgeCheck,
  AlertTriangle,
  MessageCircle,
  CalendarDays,
  User,
} from "lucide-react";

const FeedbackPage = () => {
  const dispatch = useDispatch();

  const { project, feedback } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchProject());
  }, [dispatch]);

  useEffect(() => {
    if (project?._id) {
      dispatch(getFeedback(project._id));
    }
  }, [dispatch, project]);

  const getFeedbackIcon = (type) => {
    if (type === "positive") {
      return <BadgeCheck className="w-6 h-6 text-green-500" />;
    }

    if (type === "negative") {
      return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }

    return <MessageCircle className="w-6 h-6 text-blue-500" />;
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "positive":
        return "bg-green-100 text-green-700";

      case "negative":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const feedbackStats = [
    {
      type: "general",
      title: "Total Feedback",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-800",
      valueColor: "text-blue-900",
      getCount: (feedback) => feedback?.length || 0,
    },

    {
      type: "positive",
      title: "Positive",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-800",
      valueColor: "text-green-900",
      getCount: (feedback) =>
        feedback.filter((f) => f.type === "positive").length,
    },

    {
      type: "negative",
      title: "Needs Revision",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-900",
      getCount: (feedback) =>
        feedback.filter((f) => f.type === "negative").length,
    },
  ];

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Supervisor Feedback
            </h1>

            <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
              Review comments, suggestions, and improvement notes from your
              supervisor regarding your project.
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100">
            <MessageCircle className="w-8 h-8 text-slate-700" />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feedbackStats.map((item, i) => (
          <div
            key={i}
            className={`${item.bg} rounded-3xl border border-slate-200 p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${item.textColor}`}>
                  {item.title}
                </p>

                <h2 className={`text-3xl font-bold mt-2 ${item.valueColor}`}>
                  {item.getCount(feedback || [])}
                </h2>
              </div>

              <div className={`p-4 rounded-2xl ${item.iconBg}`}>
                {getFeedbackIcon(item.type)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FEEDBACK LIST */}
      <div className="space-y-5">
        {feedback && feedback.length > 0 ? (
          feedback.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="border-b border-slate-100 p-6 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-slate-100">
                    {getFeedbackIcon(f.type)}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {f.title || "Feedback"}
                    </h2>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getBadgeColor(
                          f.type,
                        )}`}
                      >
                        {f.type || "general"}
                      </span>

                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <CalendarDays className="w-4 h-4" />

                        {new Date(f.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                  <User className="w-4 h-4" />

                  <span>{f.supervisorName || "Supervisor"}</span>
                </div>
              </div>

              {/* MESSAGE */}
              <div className="p-6">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {f.message}
                  </p>
                </div>

                {/* MOBILE SUPERVISOR */}
                <div className="md:hidden flex items-center gap-2 mt-4 text-sm text-slate-500">
                  <User className="w-4 h-4" />

                  <span>{f.supervisorName || "Supervisor"}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-12 text-center">
            <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-5" />

            <h2 className="text-2xl font-bold text-slate-700">
              No Feedback Yet
            </h2>

            <p className="text-slate-500 mt-2">
              Feedback from your supervisor will appear here once available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
