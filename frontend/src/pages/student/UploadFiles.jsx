// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   downloadFile,
//   fetchProject,
//   uploadFiles,
// } from "../../store/slices/studentSlice";
// import {
//   File,
//   Icon,
//   FileText,
//   Archive,
//   FileCode,
//   FilePlus,
// } from "lucide-react";

// const UploadFiles = () => {
//   const dispatch = useDispatch();

//   const { project, files } = useSelector((state) => state.student);

//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const reportRef = useRef(null);
//   const presRef = useRef(null);
//   const codeRef = useRef(null);

//   useEffect(() => {
//     if (!project) {
//       dispatch(fetchProject());
//     }
//   }, [dispatch, project]);

//   const handleFilePick = (e) => {
//     const list = Array.from(e.target.files || []);
//     setSelectedFiles((prev) => [...prev, ...list]);
//     e.target.value = "";
//   };

//   const handleUpload = (e) => {
//     const activeProject = project;
//     // if(!activeProject) {
//     //   const action = dispatch(fetchProject());
//     //   if(fetchProject.fullfilled.match(action)) {
//     //     activeProject = action.payload?.project || action.payload;
//     //   }
//     // }

//     if (selectedFiles.length === 0) return;
//     dispatch(uploadFiles({ projectId: project?._id, files: selectedFiles }));
//     setSelectedFiles([]);
//   };

//   const removeSelected = (name) => {
//     setSelectedFiles((prev) => prev.filter((f) => f.name !== name));
//   };

//   const getFileIcon = (fileName) => {
//     const extension = fileName.split(".").pop().toLowerCase();
//     const Icon = ({ className }) => <File className={className} />;
//     const color =
//       extension === "pdf"
//         ? "text-red-500"
//         : ["doc", "docx"].includes(extension)
//           ? "text-blue-500"
//           : ["ppt", "pptx"].includes(extension)
//             ? "text-orange-500"
//             : "text-slate-500";
//     return <Icon className={`w-8 h-8 ${color}`} />;
//   };

//   const handleDownloadFile = async (file) => {
//     const res = await dispatch(
//       downloadFile({ projectId: project._id, fileId: file._id }),
//     ).then((res) => {
//       const { blob } = res.payload;
//       const url = window.URL.createObjectURL(new Blob([blob]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", file.name || "download");
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     });
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         <div className="card">
//           <div className="card-header">
//             <h1 className="card-title">Upload Project Files</h1>
//             <p className="card-subtitle">
//               Upload your project documents including reports, presentation and
//               code files.
//             </p>
//           </div>

//           {/* UPLOAD SECTION */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
//               <div className="mb-4">
//                 <FileText className="w-12 h-12 text-slate-400 mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-slate-800 mb-2">
//                 Report
//               </h3>
//               <p className="text-sm text-slate-600 mb-4">
//                 Upload your project report (PDF, DOC)
//               </p>
//               <label className="btn-outline cursor-pointed">
//                 Choose File
//                 <input
//                   type="file"
//                   ref={reportRef}
//                   className="hidden"
//                   accept=".pdf, .doc, .docx"
//                   onChange={handleFilePick}
//                   multiple
//                 />
//               </label>
//             </div>

//             <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
//               <div className="mb-4">
//                 <Archive className="w-12 h-12 text-slate-400 mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-slate-800 mb-2">
//                 Presentation
//               </h3>
//               <p className="text-sm text-slate-600 mb-4">
//                 Upload your presentation (PPT, PPTX, PDF)
//               </p>
//               <label className="btn-outline cursor-pointer">
//                 Choose File
//                 <input
//                   type="file"
//                   ref={presRef}
//                   className="hidden"
//                   accept=".ppt, .pptx, .pdf"
//                   onChange={handleFilePick}
//                   multiple
//                 />
//               </label>
//             </div>

//             <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
//               <div className="mb-4">
//                 <FileCode className="w-12 h-12 text-slate-400 mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-slate-800 mb-2">
//                 Code Files
//               </h3>
//               <p className="text-sm text-slate-600 mb-4">
//                 Upload your source code (ZIP, RAR, TAR)
//               </p>
//               <label className="btn-outline cursor-pointed">
//                 Choose File
//                 <input
//                   type="file"
//                   ref={codeRef}
//                   className="hidden"
//                   accept=".zip, .rar, .tar, .gz"
//                   onChange={handleFilePick}
//                   multiple
//                 />
//               </label>
//             </div>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button onClick={handleUpload} className="btn-primary">
//               Upload Selected Files
//             </button>
//           </div>
//         </div>

//         {/* SELECTED FILES PREVIEW */}
//         {selectedFiles.length > 0 && (
//           <div className="card">
//             <div className="card-header">
//               <h2 className="card-title">Ready to upload</h2>
//             </div>

//             <div className="space-y-3">
//               {selectedFiles.map((file) => {
//                 return (
//                   <div
//                     key={file.name}
//                     className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
//                   >
//                     <div className="flex items-center space-x-4">
//                       {getFileIcon(file.name)}
//                       <div>
//                         <p className="font-medium text-slate-800">
//                           {file.name}
//                         </p>
//                         <div className="flex items-center space-x-4 text-sm text-slate-600">
//                           <span>
//                             {(file.size / (1024 * 1024)).toFixed(1)} MB
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <button
//                       className="btn-danger btn-small"
//                       onClick={() => removeSelected(file.name)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* UPLOADED FILES LIST */}
//         <div className="card">
//           <div className="card-header">
//             <h2 className="card-title">Uploaded Files</h2>
//             <p className="card-subtitle">Manage your uploaded project files</p>
//           </div>

//           {(files || []).length === 0 ? (
//             <div className="text-center py-4">
//               <FilePlus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <p className="text-slate-500">No files uploaded yet</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {files.map((file) => (
//                 <div
//                   key={file._id || file.fileUrl}
//                   className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
//                 >
//                   <div className="flex items-center space-x-4">
//                     {getFileIcon(file.originalName)}
//                     <div>
//                       <p className="font-medium text-slate-800">
//                         {file.originalName}
//                       </p>
//                       <div className="flex items-center space-x-4 text-sm text-slate-600">
//                         <span>{file.fileType || "File"}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <button
//                       className="btn-outline btn-small"
//                       onClick={() => handleDownloadFile(file)}
//                     >
//                       Download
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default UploadFiles;

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  deleteUploadedFile,
  downloadFile,
  fetchProject,
  uploadFiles,
} from "../../store/slices/studentSlice";

import {
  File,
  FileText,
  Archive,
  FileCode,
  FilePlus,
  UploadCloud,
  Download,
  Trash2,
  Loader2,
} from "lucide-react";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const REPORT_EXTENSIONS = [".pdf", ".docx"];
const PRESENTATION_EXTENSIONS = [".ppt", ".pptx", ".pdf"];
const SOURCE_EXTENSIONS = [".zip", ".rar", ".tar"];
const ALLOWED_EXTENSIONS = [
  ...new Set([
    ...REPORT_EXTENSIONS,
    ...PRESENTATION_EXTENSIONS,
    ...SOURCE_EXTENSIONS,
  ]),
];

const getFileExtension = (fileName = "") => {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
};

const UploadFiles = () => {
  const dispatch = useDispatch();

  const { project, files } = useSelector((state) => state.student);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);

  const reportRef = useRef(null);
  const presRef = useRef(null);
  const codeRef = useRef(null);

  useEffect(() => {
    if (!project) {
      dispatch(fetchProject());
    }
  }, [dispatch, project]);

  const handleFilePick = (e, allowedExtensions = ALLOWED_EXTENSIONS) => {
    const list = Array.from(e.target.files || []);
    const existingNames = new Set(
      [...selectedFiles, ...(files || [])].map((file) =>
        (file.originalName || file.name || "").toLowerCase(),
      ),
    );
    const acceptedFiles = [];

    for (const file of list) {
      const extension = getFileExtension(file.name);
      const lowerName = file.name.toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        toast.error(`${file.name} is not allowed in this upload section`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is larger than 10MB`);
        continue;
      }

      if (existingNames.has(lowerName)) {
        toast.warning(`${file.name} is already selected or uploaded`);
        continue;
      }

      if (selectedFiles.length + acceptedFiles.length >= MAX_FILES) {
        toast.warning(`You can select a maximum of ${MAX_FILES} files at once`);
        break;
      }

      existingNames.add(lowerName);
      acceptedFiles.push(file);
    }

    if (acceptedFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    }

    e.target.value = "";
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning("Please select files first");
      return;
    }

    if (!project?._id) {
      toast.error("Project not found");
      return;
    }

    if (project.status !== "approved") {
      toast.error("Files can only be uploaded for approved projects");
      return;
    }

    try {
      setUploading(true);

      await dispatch(
        uploadFiles({
          projectId: project._id,
          files: selectedFiles,
        }),
      ).unwrap();

      setSelectedFiles([]);
    } catch (error) {
      toast.error(error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeSelected = (name) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const canDeleteUploadedFiles = project?.status !== "completed";

  const getFileIcon = (fileName) => {
    const extension = getFileExtension(fileName).slice(1);

    if (["pdf"].includes(extension)) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }

    if (["doc", "docx"].includes(extension)) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }

    if (["ppt", "pptx"].includes(extension)) {
      return <Archive className="w-8 h-8 text-orange-500" />;
    }

    if (["zip", "rar", "gz", "tar"].includes(extension)) {
      return <FileCode className="w-8 h-8 text-green-500" />;
    }

    return <File className="w-8 h-8 text-slate-500" />;
  };

  const handleDownloadFile = async (file) => {
    try {
      await dispatch(
        downloadFile({
          projectId: project._id,
          fileId: file._id,
          fileName: file.originalName,
        }),
      ).unwrap();
    } catch (error) {
      toast.error(error || "Download failed");
    }
  };

  const handleDeleteFile = async (file) => {
    if (!canDeleteUploadedFiles) {
      toast.error("Files cannot be deleted after the project is completed");
      return;
    }

    if (!project?._id || !file?._id) {
      toast.error("File not found");
      return;
    }

    try {
      setDeletingFileId(file._id);
      await dispatch(
        deleteUploadedFile({
          projectId: project._id,
          fileId: file._id,
        }),
      ).unwrap();
    } catch (error) {
      toast.error(error || "Delete failed");
    } finally {
      setDeletingFileId(null);
    }
  };

  const uploadSections = [
    {
      title: "Project Report",
      description: "Upload PDF or DOCX report files",
      Icon: FileText,
      ref: reportRef,
      accept: REPORT_EXTENSIONS.join(","),
      allowedExtensions: REPORT_EXTENSIONS,
      color: "text-red-500",
    },

    {
      title: "Presentation",
      description: "Upload PPT, PPTX, or PDF presentations",
      Icon: Archive,
      ref: presRef,
      accept: PRESENTATION_EXTENSIONS.join(","),
      allowedExtensions: PRESENTATION_EXTENSIONS,
      color: "text-orange-500",
    },

    {
      title: "Source Code",
      description: "Upload ZIP, RAR, or TAR files",
      Icon: FileCode,
      ref: codeRef,
      accept: SOURCE_EXTENSIONS.join(","),
      allowedExtensions: SOURCE_EXTENSIONS,
      color: "text-green-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <UploadCloud className="w-7 h-7 text-slate-700" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Upload Project Files
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
                Upload and manage reports, presentations, source code, and other
                important project documents.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200">
            <p className="text-sm font-medium text-slate-700">
              {(files || []).length} Files Uploaded
            </p>
          </div>
        </div>
      </div>

      {/* UPLOAD SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {uploadSections.map(
          (
            { title, description, Icon, ref, accept, allowedExtensions, color },
            index,
          ) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-5 rounded-2xl bg-slate-100 mb-5">
                  <Icon className={`w-10 h-10 ${color}`} />
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {title}
                </h2>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {description}
                </p>

                <label className="w-full">
                  <div className="cursor-pointer rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                    Choose Files
                  </div>

                  <input
                    type="file"
                    ref={ref}
                    className="hidden"
                    accept={accept}
                    onChange={(e) => handleFilePick(e, allowedExtensions)}
                    multiple
                  />
                </label>
              </div>
            </div>
          ),
        )}
      </div>

      {/* SELECTED FILES */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Ready to Upload
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Selected files waiting for upload
              </p>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-slate-800 transition disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Upload Files
                </>
              )}
            </button>
          </div>

          <div className="p-6 space-y-4">
            {selectedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 p-4 transition"
              >
                <div className="flex items-center gap-4">
                  {getFileIcon(file.name)}

                  <div>
                    <p className="font-semibold text-slate-800">{file.name}</p>

                    <p className="text-sm text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeSelected(file.name)}
                  className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOADED FILES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-2xl font-bold text-slate-800">Uploaded Files</h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage your uploaded project documents
          </p>
        </div>

        <div className="p-6">
          {(files || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FilePlus className="w-16 h-16 text-slate-300 mb-4" />

              <h3 className="text-xl font-semibold text-slate-700">
                No Files Uploaded
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Uploaded project files will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file._id || file.fileUrl}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 p-5 transition"
                >
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.originalName)}

                    <div>
                      <p className="font-semibold text-slate-800">
                        {file.originalName}
                      </p>

                      <p className="text-sm text-slate-500">
                        {file.fileType || "File"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 transition font-medium text-slate-700"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>

                    {canDeleteUploadedFiles && (
                      <button
                        onClick={() => handleDeleteFile(file)}
                        disabled={deletingFileId === file._id}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-100 transition font-medium text-red-600 disabled:opacity-60"
                      >
                        {deletingFileId === file._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
