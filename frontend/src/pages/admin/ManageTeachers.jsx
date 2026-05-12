// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import AddTeacher from "../../components/modal/AddTeacher";
// import { getAllUsers } from "../../store/slices/adminSlice";
// import {
//   Plus,
//   BadgeCheck,
//   Users,
//   X,
//   TriangleAlert,
//   AlertTriangle,
// } from "lucide-react";
// import { updateTeacher, deleteTeacher } from "../../store/slices/adminSlice";
// import { toggleTeacherModal } from "../../store/slices/popupSlice";

// const ManageTeachers = () => {
//   const { users } = useSelector((state) => state.admin);
//   const { isCreateTeacherModalOpen } = useSelector((state) => state.popup);
//   const [showModal, setShowModal] = useState(false);
//   const [editingTeacher, setEditingTeacher] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("all");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [teacherToDelete, setTeacherToDelete] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     department: "",
//     experties: "",
//     maxStudents: 10,
//   });

//   const dispatch = useDispatch();

//   const teachers = useMemo(() => {
//     return (users || []).filter((u) => u.role?.toLowerCase() === "teacher");
//   }, [users]);

//   const departments = useMemo(() => {
//     const set = new Set(
//       (teachers || []).map((t) => t.department).filter(Boolean),
//     );
//     return Array.from(set);
//   }, [teachers]);

//   const filteredTeachers = teachers.filter((teacher) => {
//     const matchesSearch =
//       (teacher.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (teacher.email || "").toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter =
//       filterDepartment === "all" || teacher.department === filterDepartment;
//     return matchesSearch && matchesFilter;
//   });

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingTeacher(null);
//     setFormData({
//       name: "",
//       email: "",
//       department: "",
//       experties: "",
//       maxStudents: 10,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (editingTeacher) {
//       dispatch(updateTeacher({ id: editingTeacher._id, data: formData }));
//     }
//     handleCloseModal();
//   };

//   const handleEdit = (teacher) => {
//     setEditingTeacher(teacher);
//     setFormData({
//       name: teacher.name,
//       email: teacher.email,
//       department: teacher.department,
//       experties: Array.isArray(teacher.experties)
//         ? teacher.experties[0]
//         : teacher.experties,
//       maxStudents:
//         typeof teacher.maxStudents === "number" ? teacher.maxStudents : 10,
//     });
//     setShowModal(true);
//   };

//   const handleDelete = (teacher) => {
//     setTeacherToDelete(teacher);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = () => {
//     if (teacherToDelete) {
//       dispatch(deleteTeacher(teacherToDelete._id));
//       setShowDeleteModal(false);
//       setTeacherToDelete(null);
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setTeacherToDelete(null);
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         {/* HEADER */}
//         <div className="card">
//           <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
//             <div>
//               <h1 className="card-title">Manage Teachers</h1>
//               <p className="card-subtitle">
//                 Add, edit and manage teacher accounts
//               </p>
//             </div>
//             <button
//               onClick={() => dispatch(toggleTeacherModal())}
//               className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
//             >
//               <Plus className="w-5 h-5" />
//               <span>Add New Teacher</span>
//             </button>
//           </div>
//         </div>

//         {/* STATS CARD */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="card">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <Users className="w-6 h-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-slate-600 ">
//                   Total Teachers
//                 </p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   {teachers.length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="card">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <BadgeCheck className="w-6 h-6 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-slate-600 ">
//                   Assigned Students
//                 </p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   {teachers.reduce(
//                     (sum, t) => sum + (t.assignedStudents?.length || 0),
//                     0,
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="card">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <TriangleAlert className="w-6 h-6 text-yellow-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-slate-600 ">
//                   Departments
//                 </p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   {departments.length}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FILTERS */}
//         <div className="card">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Search Teachers
//               </label>
//               <input
//                 type="text"
//                 placeholder="Search by name or email..."
//                 className="input-field w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Filter Status
//               </label>
//               <select
//                 className="input-field w-full"
//                 value={filterDepartment}
//                 onChange={(e) => setFilterDepartment(e.target.value)}
//               >
//                 <option value="all">All Departments</option>
//                 {departments.map((dept) => (
//                   <option value={dept} key={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* TEACHERS TABLE */}
//         <div className="card">
//           <div className="card-header">
//             <h2 className="card-title">Teachers List</h2>
//           </div>
//           <div className="overflow-x-auto">
//             {filteredTeachers && filteredTeachers.length > 0 ? (
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
//                       Teacher Info
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
//                       Department
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
//                       Expertise
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
//                       Join Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="bg-white divide-y divide-slate-200">
//                   {filteredTeachers.map((teacher) => {
//                     return (
//                       <tr key={teacher._id} className="hover:bg-slate-50">
//                         <td>
//                           <div>
//                             <div className="text-sm font-medium text-slate-900">
//                               {teacher.name}
//                             </div>
//                             <div className="text-sm text-slate-500">
//                               {teacher.email}
//                             </div>
//                           </div>
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-slate-900">
//                             {teacher.department || "-"}
//                           </div>
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {Array.isArray(teacher.experties)
//                             ? teacher.experties.join(", ")
//                             : teacher.experties}
//                         </td>

//                         <td className="px-6 py-4">
//                           <div className="text-sm text-slate-900">
//                             {teacher.createdAt
//                               ? new Date(teacher.createdAt).toLocaleString()
//                               : "-"}
//                           </div>
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleEdit(teacher)}
//                               className="text-blue-600 hover:text-blue-900"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(teacher)}
//                               className="text-red-600 hover:text-red-900"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             ) : (
//               filteredTeachers.length === 0 && (
//                 <div className="text-center py-8 text-slate-500">
//                   No teacher found matching your criteria.
//                 </div>
//               )
//             )}
//           </div>

//           {/* EDIT STUDENT MODEL */}
//           {showModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-slate-900">
//                     Edit Teacher
//                   </h3>

//                   <button
//                     onClick={handleCloseModal}
//                     className="text-slate-400 hover:to-slate-600"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       className="input-field w-full py-1 border-b border-slate-600 focus: outline-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       required
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       className="input-field w-full py-1 border-b border-slate-600 focus: outline-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Department
//                     </label>

//                     <select
//                       className="input-field w-full py-1 border-b border-slate-600 focus: outline-none"
//                       required
//                       value={formData.department}
//                       onChange={(e) =>
//                         setFormData({ ...formData, department: e.target.value })
//                       }
//                     >
//                       <option value="Computer Science">Computer Science</option>
//                       <option value="Software Engineering">
//                         Software Engineering
//                       </option>
//                       <option value="Information Technology">
//                         Information Technology
//                       </option>
//                       <option value="Data Science">Data Science</option>
//                       <option value="Electrical Engineering">
//                         Electrical Engineering
//                       </option>
//                       <option value="Mechanical Engineering">
//                         Mechanical Engineering
//                       </option>
//                       <option value="Civil Engineering">
//                         Civil Engineering
//                       </option>
//                       <option value="Business Administration">
//                         Business Administration
//                       </option>
//                       <option value="Economics">Economics</option>
//                       <option value="Psychology">Psychology</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Expertise
//                     </label>

//                     <select
//                       className="input-field w-full py-1 border-b border-slate-600 focus: outline-none"
//                       required
//                       value={formData.experties}
//                       onChange={(e) =>
//                         setFormData({ ...formData, experties: e.target.value })
//                       }
//                     >
//                       <option value="Artificial Intelligence">
//                         Artificial Intelligence
//                       </option>
//                       <option value="Machine Learning">Machine Learning</option>
//                       <option value="Data Science">Data Science</option>
//                       <option value="Cybersecurity">Cybersecurity</option>
//                       <option value="Cloud Computing">Cloud Computing</option>
//                       <option value="Software Development">
//                         Software Development
//                       </option>
//                       <option value="Web Development">Web Development</option>
//                       <option value="Mobile App Development">
//                         Mobile App Development
//                       </option>
//                       <option value="Database Systems">Database Systems</option>
//                       <option value="Computer Networks">
//                         Computer Networks
//                       </option>
//                       <option value="Operating Systems">
//                         Operating Systems
//                       </option>
//                       <option value="Human-Computer Interaction">
//                         Human-Computer Interaction
//                       </option>
//                       <option value="Big Data Analytics">
//                         Big Data Analytics
//                       </option>
//                       <option value="Blockchain Technology">
//                         Blockchain Technology
//                       </option>
//                       <option value="Internet of things (IoT)">
//                         Internet of things (IoT)
//                       </option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Max Students
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       max={10}
//                       min={1}
//                       value={formData.maxStudents}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           maxStudents: Number(e.target.value),
//                         })
//                       }
//                       className="input-field w-full py-1 border-b border-slate-600 focus: outline-none"
//                     />
//                   </div>

//                   <div className="flex justify-end space-x-3 pt-4">
//                     <button
//                       type="button"
//                       onClick={handleCloseModal}
//                       className="btn-danger"
//                     >
//                       Cancel
//                     </button>
//                     <button type="submit" className="btn-primary">
//                       Update Teacher
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {showDeleteModal && teacherToDelete && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
//                 <div className="flex items-center mb-4">
//                   <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
//                     <AlertTriangle className="w-6 h-6 text-red-600" />
//                   </div>
//                 </div>

//                 <div className="text-center">
//                   <h3 className="text-lg font-medium text-slate-900 mb-2">
//                     Delete Teacher
//                   </h3>

//                   <p className="text-sm text-slate-500 mb-4">
//                     Are you sure you want to delete{" "}
//                     <span>
//                       {teacherToDelete.name} ? This action cannot be undone.
//                     </span>
//                   </p>

//                   <div className="flex justify-center space-x-3">
//                     <button onClick={cancelDelete} className="btn-secondary">
//                       Cancel
//                     </button>
//                     <button onClick={confirmDelete} className="btn-danger">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {isCreateTeacherModalOpen && <AddTeacher />}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ManageTeachers;

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AddTeacher from "../../components/modal/AddTeacher";

import {
  getAllUsers,
  updateTeacher,
  deleteTeacher,
} from "../../store/slices/adminSlice";

import { toggleTeacherModal } from "../../store/slices/popupSlice";

import {
  Plus,
  BadgeCheck,
  Users,
  X,
  TriangleAlert,
  AlertTriangle,
  Search,
} from "lucide-react";

const ManageTeachers = () => {
  const { users } = useSelector((state) => state.admin);

  const { isCreateTeacherModalOpen } = useSelector((state) => state.popup);

  const [showModal, setShowModal] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterDepartment, setFilterDepartment] = useState("all");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    experties: "",
    maxStudents: 10,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const teachers = useMemo(() => {
    return (users || []).filter((u) => u.role?.toLowerCase() === "teacher");
  }, [users]);

  const departments = useMemo(() => {
    const set = new Set(
      (teachers || []).map((t) => t.department).filter(Boolean),
    );

    return Array.from(set);
  }, [teachers]);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      (teacher.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterDepartment === "all" || teacher.department === filterDepartment;

    return matchesSearch && matchesFilter;
  });

  const handleCloseModal = () => {
    setShowModal(false);

    setEditingTeacher(null);

    setFormData({
      name: "",
      email: "",
      department: "",
      experties: "",
      maxStudents: 10,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingTeacher) {
      dispatch(
        updateTeacher({
          id: editingTeacher._id,
          data: formData,
        }),
      );
    }

    handleCloseModal();
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);

    setFormData({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      experties: Array.isArray(teacher.experties)
        ? teacher.experties[0]
        : teacher.experties,
      maxStudents:
        typeof teacher.maxStudents === "number" ? teacher.maxStudents : 10,
    });

    setShowModal(true);
  };

  const handleDelete = (teacher) => {
    setTeacherToDelete(teacher);

    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      dispatch(deleteTeacher(teacherToDelete._id));

      setShowDeleteModal(false);

      setTeacherToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);

    setTeacherToDelete(null);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Teachers
            </h1>

            <p className="text-slate-500 mt-2">
              Add, edit, and manage teacher accounts and assignments.
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleTeacherModal())}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-5 py-3 flex items-center gap-2 font-medium transition"
          >
            <Plus className="w-5 h-5" />
            Add New Teacher
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* TOTAL */}
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Total Teachers
              </p>

              <h3 className="text-3xl font-bold text-blue-900 mt-2">
                {teachers.length}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        {/* ASSIGNED */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Assigned Students
              </p>

              <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                {teachers.reduce(
                  (sum, t) => sum + (t.assignedStudents?.length || 0),
                  0,
                )}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <BadgeCheck className="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        </div>

        {/* DEPARTMENTS */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Departments</p>

              <h3 className="text-3xl font-bold text-amber-900 mt-2">
                {departments.length}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
              <TriangleAlert className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search teacher by name or email..."
              className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>

            {departments.map((dept) => (
              <option value={dept} key={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-semibold text-slate-900">
            Teachers List
          </h2>
        </div>

        <div className="overflow-x-auto">
          {filteredTeachers && filteredTeachers.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Teacher Info
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Expertise
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Join Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {teacher.name}
                        </div>

                        <div className="text-sm text-slate-500 mt-1">
                          {teacher.email}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                        {teacher.department || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {Array.isArray(teacher.experties)
                        ? teacher.experties.join(", ")
                        : teacher.experties}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {teacher.createdAt
                        ? new Date(teacher.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(teacher)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 text-slate-500">
              No teacher found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-7 w-full max-w-md mx-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Edit Teacher
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Update teacher information
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>

                <select
                  required
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Computer Science">Computer Science</option>

                  <option value="Software Engineering">
                    Software Engineering
                  </option>

                  <option value="Information Technology">
                    Information Technology
                  </option>

                  <option value="Data Science">Data Science</option>

                  <option value="Electrical Engineering">
                    Electrical Engineering
                  </option>

                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>

                  <option value="Civil Engineering">Civil Engineering</option>

                  <option value="Business Administration">
                    Business Administration
                  </option>

                  <option value="Economics">Economics</option>

                  <option value="Psychology">Psychology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expertise
                </label>

                <select
                  required
                  value={formData.experties}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experties: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>

                  <option value="Machine Learning">Machine Learning</option>

                  <option value="Data Science">Data Science</option>

                  <option value="Cybersecurity">Cybersecurity</option>

                  <option value="Cloud Computing">Cloud Computing</option>

                  <option value="Software Development">
                    Software Development
                  </option>

                  <option value="Web Development">Web Development</option>

                  <option value="Mobile App Development">
                    Mobile App Development
                  </option>

                  <option value="Database Systems">Database Systems</option>

                  <option value="Computer Networks">Computer Networks</option>

                  <option value="Operating Systems">Operating Systems</option>

                  <option value="Human-Computer Interaction">
                    Human-Computer Interaction
                  </option>

                  <option value="Big Data Analytics">Big Data Analytics</option>

                  <option value="Blockchain Technology">
                    Blockchain Technology
                  </option>

                  <option value="Internet of things (IoT)">
                    Internet of things (IoT)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Students
                </label>

                <input
                  type="number"
                  required
                  max={10}
                  min={1}
                  value={formData.maxStudents}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxStudents: Number(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-2xl px-5 py-3 font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-5 py-3 font-medium transition"
                >
                  Update Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && teacherToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-7 w-full max-w-md mx-4 shadow-2xl border border-slate-200">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Delete Teacher
              </h3>

              <p className="text-slate-500 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">
                  {teacherToDelete.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={cancelDelete}
                  className="border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-2xl px-5 py-3 font-medium transition"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-5 py-3 font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TEACHER MODAL */}
      {isCreateTeacherModalOpen && <AddTeacher />}
    </div>
  );
};

export default ManageTeachers;
