import { useEffect, useState } from "react";
import { api } from "../api/api";
import Loader from "../components/Loader";

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [lowStock, setLowStock] = useState([]);
    const [inventoryValue, setInventoryValue] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [supplierProducts, setSupplierProducts] = useState([]);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showReorderModal, setShowReorderModal] = useState(false);
    const [reorderSuggestions, setReorderSuggestions] = useState("");
    const [loadingReorder, setLoadingReorder] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const lowStockRes = await api.get("/reports/low-stock");
                const invRes = await api.get("/reports/inventory-value");
                const txRes = await api.get("/transactions");
                const suppliersRes = await api.get("/suppliers");
                const productsRes = await api.get("/products");

                setLowStock(lowStockRes.data || []);
                setInventoryValue(invRes.totalValue || 0);
                setTransactions(txRes.data ? txRes.data.slice(0, 5) : []);
                setSuppliers(suppliersRes.data || []);
                setProducts(productsRes.data || []);
            } catch (err) {
                console.error("Dashboard fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (showReorderModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }


        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showReorderModal]);


    const handleSupplierProductsView = async (supplier) => {
        try {
            setSelectedSupplier(supplier);
            const res = await api.get(`/reports/products-by-supplier/${supplier._id}`);
            setSupplierProducts(res.data || []);
            setShowSupplierModal(true);
        } catch (err) {
            console.error("Failed to fetch supplier products", err);
            setSupplierProducts([]);
            setShowSupplierModal(true);
        }
    };

    const closeSupplierModal = () => {
        setShowSupplierModal(false);
        setSelectedSupplier(null);
        setSupplierProducts([]);
    };

    const handleReorderRecommendations = async () => {
        try {
            setLoadingReorder(true);
            setShowReorderModal(true);
            setReorderSuggestions("Generating AI recommendations...");

            const res = await api.post("/recommendation/reorder", {});
            if (res.success) {
                setReorderSuggestions(res.suggestion);
            } else {
                setReorderSuggestions("Failed to generate recommendations. Please try again.");
            }
        } catch (err) {
            console.error("Failed to fetch reorder recommendations", err);
            setReorderSuggestions("Error generating recommendations. Please check your connection and try again.");
        } finally {
            setLoadingReorder(false);
        }
    };

    const closeReorderModal = () => {
        setShowReorderModal(false);
        setReorderSuggestions("");
    };


    const totalProducts = products.length;
    const totalSuppliers = suppliers.length;
    const lowStockPercentage = totalProducts > 0 ? ((lowStock.length / totalProducts) * 100).toFixed(1) : 0;

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-8xl mx-auto space-y-8">
                <div className="text-center mb-12">
                    <div className="relative inline-block">
                        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                            Dashboard Overview
                        </h1>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20"></div>
                    </div>
                    <p className="text-gray-700 text-xl font-medium mt-4 max-w-2xl mx-auto">
                        Monitor your inventory and business metrics in real-time with comprehensive analytics
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="group relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-8 rounded-3xl shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-800 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <h2 className="text-white/90 text-sm font-bold uppercase tracking-wider mb-2">Low Stock Alert</h2>
                                <p className="text-4xl font-black text-white mb-1">{lowStock.length}</p>
                                <p className="text-red-100 text-sm font-medium">{lowStockPercentage}% of inventory</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                                <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
                    </div>

                    <div className="group relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-8 rounded-3xl shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-800 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <h2 className="text-white/90 text-sm font-bold uppercase tracking-wider mb-2">Total Value</h2>
                                <p className="text-4xl font-black text-white mb-1">${inventoryValue.toFixed(2)}</p>
                                <p className="text-emerald-100 text-sm font-medium">Current inventory worth</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                                <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                    </div>

                    <div className="group relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 p-8 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-800 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <h2 className="text-white/90 text-sm font-bold uppercase tracking-wider mb-2">Total Products</h2>
                                <p className="text-4xl font-black text-white mb-1">{totalProducts}</p>
                                <p className="text-blue-100 text-sm font-medium">Items in catalog</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                                <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                </svg>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                    </div>

                    <div className="group relative bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 p-8 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-violet-800 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <h2 className="text-white/90 text-sm font-bold uppercase tracking-wider mb-2">Active Suppliers</h2>
                                <p className="text-4xl font-black text-white mb-1">{totalSuppliers}</p>
                                <p className="text-purple-100 text-sm font-medium">Business partners</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                                <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="group relative bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/90 transition-all duration-500">
                        <div className="absolute  inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center mb-8">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-lg mr-6">
                                        <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-ping"></div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-800 mb-1">AI Recommendations</h2>
                                    <p className="text-gray-600 font-medium">Smart inventory insights</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-6xl mb-6 animate-bounce">🤖</div>
                                <p className="text-gray-700 text-lg font-semibold mb-6">Get AI-powered reorder suggestions</p>
                                <button
                                    onClick={handleReorderRecommendations}
                                    disabled={loadingReorder}
                                    className="group/btn relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-amber-500/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <div className="absolute  inset-0 bg-gradient-to-r from-amber-400 to-red-600 rounded-2xl blur-lg opacity-40 group-hover/btn:opacity-60 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center space-x-3">
                                        {loadingReorder ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span>Get Recommendations</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="group relative bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/90 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center mb-8">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-4 rounded-2xl shadow-lg mr-6">
                                        <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-800 mb-1">Supplier Analytics</h2>
                                    <p className="text-gray-600 font-medium">View products by supplier</p>
                                </div>
                            </div>
                            {suppliers.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-8xl mb-6 animate-pulse">🏢</div>
                                    <p className="text-gray-700 text-xl font-semibold">No suppliers yet</p>
                                    <p className="text-gray-500 mt-2">Add suppliers to see analytics</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {suppliers.map((supplier, index) => (
                                        <div key={supplier._id} className="group/item relative bg-gradient-to-r from-purple-50 via-violet-50 to-purple-50 p-6 rounded-2xl border-l-4 border-purple-500 shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300 cursor-pointer"
                                            onClick={() => handleSupplierProductsView(supplier)}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl opacity-0 group-hover/item:opacity-30 transition-opacity duration-300"></div>
                                            <div className="relative flex justify-between items-center">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 text-lg">{supplier.name}</span>
                                                        <p className="text-gray-600 font-medium text-sm">{supplier.email}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full font-bold text-sm shadow-md">
                                                    View Products
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="group relative bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/90 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center mb-8">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg mr-6">
                                        <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                        </svg>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-800 mb-1">Low Stock Products</h2>
                                    <p className="text-gray-600 font-medium">Items requiring immediate attention</p>
                                </div>
                            </div>
                            {lowStock.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-8xl mb-6 animate-bounce">🎉</div>
                                    <p className="text-gray-700 text-xl font-semibold">All products are well stocked!</p>
                                    <p className="text-gray-500 mt-2">Your inventory management is on point</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {lowStock.map((p, index) => (
                                        <div key={p._id} className="group/item relative bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 p-6 rounded-2xl border-l-4 border-red-500 shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl opacity-0 group-hover/item:opacity-30 transition-opacity duration-300"></div>
                                            <div className="relative flex justify-between items-center">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                    <span className="font-bold text-gray-900 text-lg">{p.name}</span>
                                                </div>
                                                <div className="flex space-x-3">
                                                    <span className="bg-red-200 text-red-900 px-4 py-2 rounded-full font-bold text-sm shadow-md">
                                                        Stock: {p.stockQty}
                                                    </span>
                                                    <span className="bg-orange-200 text-orange-900 px-4 py-2 rounded-full font-bold text-sm shadow-md">
                                                        Reorder: {p.reorderLevel}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="group relative bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/90 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center mb-8">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg mr-6">
                                        <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-800 mb-1">Recent Transactions</h2>
                                    <p className="text-gray-600 font-medium">Latest business activity</p>
                                </div>
                            </div>
                            {transactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-8xl mb-6 animate-pulse">📋</div>
                                    <p className="text-gray-700 text-xl font-semibold">No transactions yet</p>
                                    <p className="text-gray-500 mt-2">Start your business activity</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {transactions.map((tx, index) => (
                                        <div key={tx._id} className="group/item relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border-l-4 border-blue-500 shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl opacity-0 group-hover/item:opacity-30 transition-opacity duration-300"></div>
                                            <div className="relative flex justify-between items-center">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 text-lg capitalize">{tx.txType}</span>
                                                        <p className="text-gray-600 font-medium mt-1">
                                                            {new Date(tx.txDate).toLocaleDateString()} • {tx.items.length} items
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="bg-blue-200 text-blue-900 px-4 py-2 rounded-full font-bold text-sm shadow-md">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showSupplierModal && selectedSupplier && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="relative p-6 sm:p-8 border-b border-gray-200">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-3xl opacity-50"></div>
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-2xl shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-black text-gray-800">Supplier Products</h3>
                                            <p className="text-gray-600 font-medium">Products supplied by {selectedSupplier.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeSupplierModal}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-2 rounded-xl transition-all duration-300"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8">
                                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl mb-6 border border-purple-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-purple-700 mb-1">Supplier Name</div>
                                            <div className="text-lg font-bold text-gray-800">{selectedSupplier.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-purple-700 mb-1">Email</div>
                                            <div className="text-lg font-bold text-gray-800">{selectedSupplier.email}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-purple-700 mb-1">Phone</div>
                                            <div className="text-lg font-bold text-gray-800">{selectedSupplier.phone}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                        </svg>
                                        <span>Associated Products ({supplierProducts.length})</span>
                                    </h4>

                                    {supplierProducts.length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                            </svg>
                                            <p className="text-gray-500 font-medium text-lg">No products found</p>
                                            <p className="text-gray-400 text-sm mt-2">This supplier has no associated products</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {supplierProducts.map((product) => (
                                                <div key={product._id} className="bg-gradient-to-r from-white to-purple-50 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="text-lg font-bold text-gray-800">{product.name}</h5>
                                                            <span className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm font-semibold">
                                                                {product.sku}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <div className="text-gray-600 font-medium">Stock Qty</div>
                                                                <div className={`font-bold ${(product.stockQty || 0) <= (product.reorderLevel || 0) ? 'text-red-600' : 'text-green-600'}`}>
                                                                    {product.stockQty || 0} {product.unit}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-gray-600 font-medium">Avg Cost</div>
                                                                <div className="font-bold text-gray-800">${(product.avgCost || 0).toFixed(2)}</div>
                                                            </div>
                                                        </div>

                                                        {(product.stockQty || 0) <= (product.reorderLevel || 0) && (
                                                            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded-lg">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                                                </svg>
                                                                <span className="text-sm font-medium">Low Stock Alert</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                                    <button
                                        onClick={closeSupplierModal}
                                        className="bg-gray-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showReorderModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-white/30 flex flex-col">
                            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 sm:p-8 text-white flex-shrink-0">
                                <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-amber-400 to-red-600 blur-xl opacity-40"></div>
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl font-black">AI Reorder Recommendations</h2>
                                            <p className="text-white/90 font-medium mt-1">Smart insights for inventory management</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeReorderModal}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-2xl transition-all duration-300 group"
                                    >
                                        <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 sm:p-8" style={{ maxHeight: 'calc(95vh - 200px)' }}>
                                {loadingReorder ? (
                                    <div className="text-center py-16">
                                        <div className="relative mx-auto w-20 h-20 mb-8">
                                            <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                                            <div className="absolute inset-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Inventory</h3>
                                        <p className="text-gray-600 font-medium">AI is generating personalized recommendations...</p>
                                        <div className="flex justify-center mt-6 space-x-2">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-0"></div>
                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-150"></div>
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-300"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-8 rounded-2xl border border-amber-200">
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg flex-shrink-0">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-3">AI Analysis Results</h3>
                                                    <div className="prose prose-lg max-w-none">
                                                        <div className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-amber-100 max-h-80 overflow-y-auto">
                                                            {reorderSuggestions || "No recommendations available at this time."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <h4 className="text-lg font-bold text-blue-900">How it works</h4>
                                            </div>
                                            <p className="text-blue-800 font-medium">Our AI analyzes your inventory levels, sales patterns, and supplier data to provide intelligent reorder recommendations that help optimize your stock levels and reduce costs.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 px-6 sm:px-8 py-4 sm:py-6 border-t border-gray-200 flex-shrink-0">
                                <div className="flex justify-end">
                                    <button
                                        onClick={closeReorderModal}
                                        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 sm:px-8 rounded-2xl shadow-lg hover:from-gray-600 hover:to-gray-700 transform hover:-translate-y-1 transition-all duration-300"
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

export default Dashboard;
