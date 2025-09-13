import { useEffect, useState } from "react";
import { api } from "../api/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Products() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [form, setForm] = useState({
        name: "",
        sku: "",
        unit: "pcs",
        stockQty: 0,
        reorderLevel: 0,
        avgCost: 0,
        supplierIds: []
    });

    const fetchProducts = async () => {
        setLoading(true);
        const res = await api.get("/products");
        setProducts(res.data || []);
        setLoading(false);
    };

    const fetchSuppliers = async () => {
        const res = await api.get("/suppliers");
        setSuppliers(res.data || []);
    };

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = editingProduct ? `/products/${editingProduct._id}` : "/products";
        const method = editingProduct ? "put" : "post";

        const res = await api[method](endpoint, form);
        if (res.success) {
            toast.success(editingProduct ? "Product updated" : "Product added");
            setForm({
                name: "",
                sku: "",
                unit: "pcs",
                stockQty: 0,
                reorderLevel: 0,
                avgCost: 0,
                supplierIds: []
            });
            setEditingProduct(null);
            fetchProducts();
        } else {
            toast.error(res.message || "Failed to save");
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            sku: product.sku,
            unit: product.unit,
            stockQty: product.stockQty || 0,
            reorderLevel: product.reorderLevel || 0,
            avgCost: product.avgCost || 0,
            supplierIds: product.supplierIds?.map(s => s._id || s) || []
        });
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const res = await api.delete(`/products/${productId}`);
            if (res.success) {
                toast.success("Product deleted");
                fetchProducts();
            } else {
                toast.error(res.message || "Failed to delete");
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setForm({
            name: "",
            sku: "",
            unit: "pcs",
            stockQty: 0,
            reorderLevel: 0,
            avgCost: 0,
            supplierIds: []
        });
    };

    const handleSupplierChange = (supplierId) => {
        setForm(prev => ({
            ...prev,
            supplierIds: prev.supplierIds.includes(supplierId)
                ? prev.supplierIds.filter(id => id !== supplierId)
                : [...prev.supplierIds, supplierId]
        }));
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedProduct(null);
    };

    const getSupplierNames = (productSuppliers) => {
        if (!productSuppliers || productSuppliers.length === 0) return 'No suppliers assigned';
        return productSuppliers.map(supplier =>
            typeof supplier === 'string'
                ? suppliers.find(s => s._id === supplier)?.name || 'Unknown'
                : supplier.name
        ).join(', ');
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-8xl mx-auto space-y-8">
                <div className="text-center mb-12">
                    <div className="relative inline-block">
                        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                            Products Management
                        </h1>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20"></div>
                    </div>
                    <p className="text-gray-700 text-xl font-medium mt-4 max-w-2xl mx-auto">
                        Manage your product catalog with advanced inventory tracking
                    </p>
                </div>

                <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl opacity-50"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg mr-6">
                                    <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-800 mb-1">
                                        {editingProduct ? "Edit Product" : "Add New Product"}
                                    </h2>
                                    <p className="text-gray-600 font-medium">
                                        {editingProduct ? "Update product information" : "Create a new product entry in your inventory"}
                                    </p>
                                </div>
                            </div>
                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors duration-300"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Product Name *</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="Enter product name"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                                                required
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">SKU Code (Serial No.) *</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="Enter SKU code"
                                                value={form.sku}
                                                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                                className="w-full p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                required
                                                disabled={editingProduct}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                        </div>
                                        {editingProduct && (
                                            <p className="text-xs text-gray-500 italic">SKU cannot be modified during editing</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Unit of Measurement(e.g., pcs, kg, liters) *</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="e.g., pcs, kg, liters"
                                                value={form.unit}
                                                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                                className="w-full p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                                                required
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Inventory Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Current Stock Quantity</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                placeholder="Quantity in stock"
                                                value={form.stockQty}
                                                onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
                                                className="w-full p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                                                min="0"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Reorder Level</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                placeholder="Reorder level"
                                                value={form.reorderLevel}
                                                onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
                                                className="w-full p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                                                min="1"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                        </div>
                                        <p className="text-xs text-gray-500">Minimum stock level before reordering</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Average Cost ($)</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={form.avgCost}
                                                onChange={(e) => setForm({ ...form, avgCost: parseFloat(e.target.value) || 0 })}
                                                className="w-full p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                                                min="0"
                                                step="1"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                        </div>
                                        <p className="text-xs text-gray-500">Average cost per unit</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <label className="text-xl font-bold text-gray-800">Select Suppliers</label>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Choose one or more suppliers for this product (optional)</p>
                                {suppliers.length === 0 ? (
                                    <div className="p-8 text-center bg-gray-50 rounded-2xl">
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <p className="text-gray-500 font-medium">No suppliers available</p>
                                        <p className="text-gray-400 text-sm">Add suppliers first to link them with products</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-48 overflow-y-auto p-4 bg-white/30 rounded-2xl border border-gray-200">
                                        {suppliers.map((supplier) => (
                                            <label
                                                key={supplier._id}
                                                className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-300"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={form.supplierIds.includes(supplier._id)}
                                                    onChange={() => handleSupplierChange(supplier._id)}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-medium text-gray-800 truncate">{supplier.name}</div>
                                                    <div className="text-sm text-gray-600 truncate">{supplier.email}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {suppliers.length > 0 && (
                                    <p className="text-xs text-gray-500 italic">
                                        {form.supplierIds.length} supplier{form.supplierIds.length !== 1 ? 's' : ''} selected
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 w-full md:w-auto"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>{editingProduct ? "Update Product" : "Add Product"}</span>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl opacity-50"></div>
                    <div className="relative">
                        <div className="flex items-center mb-8">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg mr-6">
                                <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-800 mb-1">Product Inventory</h2>
                                <p className="text-gray-600 font-medium">Overview of all products in your catalog</p>
                            </div>
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-8xl mb-6 animate-bounce">📦</div>
                                <p className="text-gray-700 text-2xl font-bold mb-2">No products yet</p>
                                <p className="text-gray-500 text-lg">Add your first product to get started</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-900 to-gray-800">
                                                <th className="px-8 py-6 text-left text-sm font-black text-white uppercase tracking-wider">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        <span>Product Name</span>
                                                    </div>
                                                </th>
                                                <th className="px-8 py-6 text-left text-sm font-black text-white uppercase tracking-wider">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>SKU</span>
                                                    </div>
                                                </th>
                                                <th className="px-8 py-6 text-left text-sm font-black text-white uppercase tracking-wider">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                                        </svg>
                                                        <span>Stock Qty</span>
                                                    </div>
                                                </th>
                                                <th className="px-8 py-6 text-left text-sm font-black text-white uppercase tracking-wider">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                                        </svg>
                                                        <span>Reorder Level</span>
                                                    </div>
                                                </th>
                                                <th className="px-8 py-6 text-left text-sm font-black text-white uppercase tracking-wider">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                        <span>Avg Cost</span>
                                                    </div>
                                                </th>
                                                <th className="px-8 py-6 text-left text-sm font-black text-white uppercase tracking-wider">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        <span>Actions</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/90 backdrop-blur-sm divide-y divide-gray-200">
                                            {products.map((p, index) => (
                                                <tr key={p._id} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                                                    <td
                                                        className="px-8 py-6 cursor-pointer"
                                                        onClick={() => handleProductClick(p)}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:animate-pulse"></div>
                                                            <span className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors duration-300">{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-semibold text-sm shadow-md">
                                                            {p.sku}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`px-4 py-2 rounded-full font-bold text-sm shadow-md ${(p.stockQty || 0) <= (p.reorderLevel || 0)
                                                                ? 'bg-red-200 text-red-900'
                                                                : 'bg-green-200 text-green-900'
                                                                }`}>
                                                                {p.stockQty || 0}
                                                            </span>
                                                            {(p.stockQty || 0) <= (p.reorderLevel || 0) && (
                                                                <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="bg-orange-200 text-orange-900 px-4 py-2 rounded-full font-bold text-sm shadow-md">
                                                            {p.reorderLevel || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="bg-emerald-200 text-emerald-900 px-4 py-2 rounded-full font-bold text-sm shadow-md">
                                                            ${(p.avgCost || 0).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => handleEdit(p)}
                                                                className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-2 rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-1 hover:scale-110 transition-all duration-300"
                                                                title="Edit Product"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(p._id)}
                                                                className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-xl shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-1 hover:scale-110 transition-all duration-300"
                                                                title="Delete Product"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {showDetailModal && selectedProduct && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="relative p-6 sm:p-8 border-b border-gray-200">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl opacity-50"></div>
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-black text-gray-800">Product Details</h3>
                                            <p className="text-gray-600 font-medium">Complete information about {selectedProduct.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeDetailModal}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-2 rounded-xl transition-all duration-300"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 space-y-8">
                                <div className="space-y-6">
                                    <h4 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Basic Information</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                                            <div className="text-sm font-semibold text-blue-700 mb-1">Product Name</div>
                                            <div className="text-lg font-bold text-gray-800">{selectedProduct.name}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
                                            <div className="text-sm font-semibold text-purple-700 mb-1">SKU Code</div>
                                            <div className="text-lg font-bold text-gray-800">{selectedProduct.sku}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-2xl border border-indigo-200">
                                            <div className="text-sm font-semibold text-indigo-700 mb-1">Unit</div>
                                            <div className="text-lg font-bold text-gray-800">{selectedProduct.unit}</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="space-y-6">
                                    <h4 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                        </svg>
                                        <span>Inventory Status</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-sm font-semibold text-emerald-700">Current Stock</div>
                                                <div className={`p-2 rounded-xl ${(selectedProduct.stockQty || 0) <= (selectedProduct.reorderLevel || 0) ? 'bg-red-500' : 'bg-green-500'}`}>
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-black text-gray-800 mb-2">{selectedProduct.stockQty || 0}</div>
                                            <div className={`text-sm font-medium ${(selectedProduct.stockQty || 0) <= (selectedProduct.reorderLevel || 0) ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {(selectedProduct.stockQty || 0) <= (selectedProduct.reorderLevel || 0) ? 'Low Stock Warning!' : 'Stock Level Normal'}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-sm font-semibold text-orange-700">Reorder Level</div>
                                                <div className="p-2 rounded-xl bg-orange-500">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-black text-gray-800 mb-2">{selectedProduct.reorderLevel || 0}</div>
                                            <div className="text-sm font-medium text-orange-600">Minimum threshold</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-2xl border border-cyan-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-sm font-semibold text-cyan-700">Average Cost</div>
                                                <div className="p-2 rounded-xl bg-cyan-500">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-black text-gray-800 mb-2">${(selectedProduct.avgCost || 0).toFixed(2)}</div>
                                            <div className="text-sm font-medium text-cyan-600">Per unit cost</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="space-y-6">
                                    <h4 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>Suppliers</span>
                                    </h4>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                                        {selectedProduct.supplierIds && selectedProduct.supplierIds.length > 0 ? (
                                            <div className="space-y-3">
                                                <div className="text-sm font-semibold text-gray-700 mb-3">
                                                    Associated Suppliers ({selectedProduct.supplierIds.length})
                                                </div>
                                                <div className="text-lg text-gray-800 font-medium">
                                                    {getSupplierNames(selectedProduct.supplierIds)}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <p className="text-gray-500 font-medium">No suppliers assigned</p>
                                                <p className="text-gray-400 text-sm">This product has no associated suppliers</p>
                                            </div>
                                        )}
                                    </div>
                                </div>


                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            handleEdit(selectedProduct);
                                            closeDetailModal();
                                        }}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Edit Product</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={closeDetailModal}
                                        className="flex-1 bg-gray-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
