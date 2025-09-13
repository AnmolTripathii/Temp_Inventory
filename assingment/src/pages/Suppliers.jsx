import { useEffect, useState } from "react";
import { api } from "../api/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Suppliers() {
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });

    const fetchSuppliers = async () => {
        setLoading(true);
        const res = await api.get("/suppliers");
        setSuppliers(res.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = editingSupplier ? `/suppliers/${editingSupplier._id}` : "/suppliers";
        const method = editingSupplier ? "put" : "post";

        const res = await api[method](endpoint, form);
        if (res.success) {
            toast.success(editingSupplier ? "Supplier updated" : "Supplier added");
            setForm({ name: "", email: "", phone: "" });
            setEditingSupplier(null);
            fetchSuppliers();
        } else {
            toast.error(res.message || "Failed to save");
        }
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setForm({
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (supplierId) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            const res = await api.delete(`/suppliers/${supplierId}`);
            if (res.success) {
                toast.success("Supplier deleted");
                fetchSuppliers();
            } else {
                toast.error(res.message || "Failed to delete");
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingSupplier(null);
        setForm({ name: "", email: "", phone: "" });
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-2 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl xl:max-w-8xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
                <div className="text-center mb-6 sm:mb-8 md:mb-12">
                    <div className="relative inline-block">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-4 drop-shadow-lg leading-tight">
                            Suppliers Management
                        </h1>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20"></div>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl font-medium mt-2 sm:mt-4 max-w-sm sm:max-w-lg md:max-w-2xl mx-auto px-4 sm:px-0">
                        Manage your supplier network and maintain strong business relationships
                    </p>
                </div>

                <div className="relative bg-white/80 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl sm:rounded-3xl opacity-50"></div>
                    <div className="relative">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-0 sm:mr-6 w-fit">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 mb-1">
                                        {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 font-medium">
                                        {editingSupplier ? "Update supplier information" : "Register a new supplier in your network"}
                                    </p>
                                </div>
                            </div>
                            {editingSupplier && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="mt-4 sm:mt-0 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors duration-300 text-sm sm:text-base"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div className="relative group sm:col-span-2 lg:col-span-1">
                                <input
                                    type="text"
                                    placeholder="Supplier Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                                    required
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group sm:col-span-2 lg:col-span-1">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                                    required
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group sm:col-span-2 lg:col-span-1">
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                                    required
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1 text-sm sm:text-base"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center space-x-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="hidden sm:inline">{editingSupplier ? "Update Supplier" : "Add Supplier"}</span>
                                    <span className="sm:hidden">{editingSupplier ? "Update" : "Add"}</span>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl opacity-50"></div>
                    <div className="relative">
                        <div className="flex items-center mb-8">
                            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl shadow-lg mr-6">
                                <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-800 mb-1">Supplier Directory</h2>
                                <p className="text-gray-600 font-medium">Your trusted network of suppliers and partners</p>
                            </div>
                        </div>

                        {suppliers.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl sm:text-7xl md:text-8xl mb-6 animate-bounce">🏢</div>
                                <p className="text-gray-700 text-xl sm:text-2xl font-bold mb-2">No suppliers yet</p>
                                <p className="text-gray-500 text-base sm:text-lg">
                                    Add your first supplier to build your network
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1  gap-6">
                                {suppliers.map((s, index) => (
                                    <div
                                        key={s._id}
                                        className="group relative bg-gradient-to-r from-white via-cyan-50 to-blue-50 p-4 sm:p-6 rounded-2xl border border-cyan-200 shadow-md sm:shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                                    >

                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>


                                        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center">
                                                        <span className="text-lg sm:text-2xl font-black text-white">
                                                            {s.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                                </div>


                                                <div className="space-y-1 sm:space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-800">{s.name}</h3>
                                                        <span className="bg-cyan-200 text-cyan-900 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-md">
                                                            #{index + 1}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm sm:text-base">
                                                        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
                                                            <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="text-gray-700 font-medium">{s.email}</span>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            <span className="text-gray-700 font-medium">{s.phone}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="flex items-center space-x-2 sm:space-x-3">
                                                <button
                                                    onClick={() => handleEdit(s)}
                                                    className="group/btn relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 sm:p-3 rounded-xl shadow-md sm:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                                                    title="Edit Supplier"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300"></div>
                                                    <svg className="relative w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(s._id)}
                                                    className="group/btn relative bg-gradient-to-r from-red-500 to-red-600 text-white p-2 sm:p-3 rounded-xl shadow-md sm:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                                                    title="Delete Supplier"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300"></div>
                                                    <svg className="relative w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Suppliers;
