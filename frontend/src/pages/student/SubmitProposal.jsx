// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { submitProjectProposal } from "../../store/slices/studentSlice";

// const SubmitProposal = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       dispatch(submitProjectProposal(formData));
//       setIsLoading(false);
//     } catch (error) {
//       setIsLoading(false);
//     }
//   }

//   return <>

//   <div className="space-y-6">
//     <div className="card">
//       <div className="card-header">
//         <h1 className="card-title">Submit Proposal</h1>
//         <p className="card-subtitle">
//           Please fill out all sections of your project proposal.
//           Make sure to be detailed and cleared about your project goals.{" "}
//           </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="label">Project Title</label>
//           <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           className="input"
//           placeholder="Enter your project title"
//           required
//         />
//         </div>

//         <div>
//           <label className="label">Project Description</label>
//           <textarea
//            name="description"
//            value={formData.description}
//            onChange={handleChange}
//            className="input min-h-[120px]"
//            placeholder="Provide a detailed description of your project..."
//            required
//           />
//         </div>

//         <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
//           <button
//            className="btn-primary disabled:opacity-50"
//            type="submit"
//            disabled={isLoading}
//           >
//             {isLoading ? "Submitting..." : "Submit Proposal"}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>

//   </>;
// };

// export default SubmitProposal;

import { useState } from "react";

import { useDispatch } from "react-redux";

import { submitProjectProposal } from "../../store/slices/studentSlice";

import { FileText, Loader2, Lightbulb, ClipboardList } from "lucide-react";

const SubmitProposal = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    try {
      setIsLoading(true);

      await dispatch(submitProjectProposal(formData));

      setFormData({
        title: "",
        description: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Submit Proposal
            </h1>

            <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
              Fill out your project proposal carefully with a clear title and
              detailed description. A strong proposal improves the chances of
              approval from your supervisor.
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100">
            <ClipboardList className="w-8 h-8 text-slate-700" />
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* CARD HEADER */}
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-slate-100">
              <FileText className="w-7 h-7 text-slate-700" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Project Proposal
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Enter your project details below
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* PROJECT TITLE */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Project Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your project title"
              required
              className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-slate-800 outline-none transition-all focus:ring-4 focus:ring-slate-100 focus:border-slate-500"
            />

            <p className="text-xs text-slate-500 mt-2">
              Choose a clear, meaningful and professional title for your
              project.
            </p>
          </div>

          {/* PROJECT DESCRIPTION */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <ClipboardList className="w-4 h-4 text-blue-500" />
              Project Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project idea, technologies, objectives, expected outcome and major features..."
              required
              rows={8}
              className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-slate-800 outline-none resize-none transition-all focus:ring-4 focus:ring-slate-100 focus:border-slate-500"
            />

            <p className="text-xs text-slate-500 mt-2">
              Explain your project idea clearly for better evaluation and
              approval.
            </p>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Submit Proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProposal;
