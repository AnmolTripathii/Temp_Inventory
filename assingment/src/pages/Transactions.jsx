import { useEffect, useState } from "react";
import { api } from "../api/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Transactions() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [form, setForm] = useState({
        txType: "PURCHASE",
        productId: "",
        quantity: 1,
        unitPrice: 0,
        note: "",
    });
    const [products, setProducts] = useState([]);

    const fetchTransactions = async () => {
        setLoading(true);
        const res = await api.get("/transactions");
        setTransactions(res.data || []);
        setLoading(false);
    };

    const fetchProducts = async () => {
        const res = await api.get("/products");
        setProducts(res.data || []);
    };

    useEffect(() => {
        fetchTransactions();
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await api.post("/transactions", {
            txType: form.txType,
            items: [
                { productId: form.productId, quantity: Number(form.quantity), unitPrice: Number(form.unitPrice) },
            ],
            note: form.note,
        });
        if (res.success) {
            toast.success("Transaction recorded");
            setForm({ txType: "PURCHASE", productId: "", quantity: 1, unitPrice: 0, note: "" });
            fetchTransactions();
        } else {
            toast.error(res.message || "Failed to record");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-8xl mx-auto space-y-8">
                <div className="text-center mb-12">
                    <div className="relative inline-block">
                        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                            Transaction Center
                        </h1>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20"></div>
                    </div>
                    <p className="text-gray-700 text-xl font-medium mt-4 max-w-2xl mx-auto">
                        Record and track all your business transactions with real-time inventory updates
                    </p>
                </div>

                <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl opacity-50"></div>
                    <div className="relative">
                        <div className="flex items-center mb-8">
                            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-4 rounded-2xl shadow-lg mr-6">
                                <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-800 mb-1">Record New Transaction</h2>
                                <p className="text-gray-600 font-medium">Add purchase or sale transactions to your inventory</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-6">
                            <div className="relative group">
                                <select
                                    value={form.txType}
                                    onChange={(e) => setForm({ ...form, txType: e.target.value })}
                                    className="w-full p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="PURCHASE">📦 Purchase</option>
                                    <option value="SALE">💰 Sale</option>
                                </select>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group md:col-span-2">
                                <select
                                    value={form.productId}
                                    onChange={(e) => setForm({ ...form, productId: e.target.value })}
                                    className="w-full p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">🔍 Select Product</option>
                                    {products.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} ({p.sku})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group">
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                    className="w-full p-4 pl-12 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                                    min="1"
                                    required
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group">
                                <input
                                    type="number"
                                    placeholder="Unit Price"
                                    value={form.unitPrice}
                                    onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                                    className="w-full p-4 pl-12 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group md:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Transaction Note (Optional)"
                                    value={form.note}
                                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                                    className="w-full p-4 pl-12 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-violet-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Record</span>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-50 rounded-3xl opacity-50"></div>
                    <div className="relative">
                        <div className="flex items-center mb-8">
                            <div className="bg-gradient-to-br from-slate-500 to-gray-600 p-4 rounded-2xl shadow-lg mr-6">
                                <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-800 mb-1">Transaction History</h2>
                                <p className="text-gray-600 font-medium">Complete record of all business transactions</p>
                            </div>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-8xl mb-6 animate-bounce">📋</div>
                                <p className="text-gray-700 text-2xl font-bold mb-2">No transactions yet</p>
                                <p className="text-gray-500 text-lg">Record your first transaction to get started</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {transactions.map((tx, index) => {
                                    const totalValue = tx.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
                                    const isPurchase = tx.txType === 'PURCHASE';

                                    return (
                                        <div key={tx._id} className="group relative bg-gradient-to-r from-white via-slate-50 to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300">
                                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${isPurchase
                                                ? 'bg-gradient-to-r from-blue-100 to-indigo-100'
                                                : 'bg-gradient-to-r from-green-100 to-emerald-100'
                                                }`}></div>

                                            <div className="relative flex items-center justify-between">
                                                <div className="flex items-center space-x-6">
                                                    <div className={`relative p-4 rounded-2xl shadow-lg ${isPurchase
                                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                        : 'bg-gradient-to-br from-green-500 to-emerald-600'
                                                        }`}>
                                                        {isPurchase ? (
                                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                            </svg>
                                                        )}
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gray-200 animate-pulse"></div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-4">
                                                            <h3 className={`text-2xl font-black capitalize ${isPurchase ? 'text-blue-800' : 'text-green-800'
                                                                }`}>
                                                                {tx.txType.toLowerCase()}
                                                            </h3>
                                                            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${isPurchase
                                                                ? 'bg-blue-200 text-blue-900'
                                                                : 'bg-green-200 text-green-900'
                                                                }`}>
                                                                #{index + 1}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center space-x-6 text-gray-600">
                                                            <div className="flex items-center space-x-2">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <span className="font-medium">
                                                                    {new Date(tx.txDate).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center space-x-2">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                                                </svg>
                                                                <span className="font-medium">{tx.items.length} items</span>
                                                            </div>

                                                            {tx.note && (
                                                                <div className="flex items-center space-x-2">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                    <span className="font-medium italic">"{tx.note}"</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className={`text-3xl font-black mb-1 ${isPurchase ? 'text-blue-800' : 'text-green-800'
                                                        }`}>
                                                        ${totalValue.toFixed(2)}
                                                    </div>
                                                    <div className="text-gray-500 text-sm font-medium">
                                                        Total Value
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {tx.items.map((item, itemIndex) => {

                                                        const productInfo = item.productId;
                                                        const productName = typeof productInfo === 'object' && productInfo?.name
                                                            ? productInfo.name
                                                            : products.find(p => p._id === item.productId)?.name || 'Unknown Product';
                                                        const productSku = typeof productInfo === 'object' && productInfo?.sku
                                                            ? productInfo.sku
                                                            : products.find(p => p._id === item.productId)?.sku || 'N/A';

                                                        return (
                                                            <div key={itemIndex} className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                        <h4 className="font-bold text-gray-800 text-lg">{productName}</h4>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-sm font-medium text-gray-600">SKU:</span>
                                                                            <span className="text-sm font-bold text-gray-800">{productSku}</span>
                                                                        </div>

                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-sm font-medium text-gray-600">Quantity:</span>
                                                                            <span className="text-sm font-bold text-gray-800">{item.quantity}</span>
                                                                        </div>

                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-sm font-medium text-gray-600">Unit Price:</span>
                                                                            <span className="text-sm font-bold text-gray-800">${item.unitPrice.toFixed(2)}</span>
                                                                        </div>

                                                                        <div className="pt-2 border-t border-gray-200">
                                                                            <div className="flex justify-between items-center">
                                                                                <span className="text-sm font-bold text-gray-700">Subtotal:</span>
                                                                                <span className="text-lg font-black text-indigo-600">
                                                                                    ${(item.quantity * item.unitPrice).toFixed(2)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transactions;
