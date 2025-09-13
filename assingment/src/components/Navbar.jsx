import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        {
            path: "/",
            label: "Dashboard",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14H8V5z" />
                </svg>
            )
        },
        {
            path: "/products",
            label: "Products",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
            )
        },
        {
            path: "/suppliers",
            label: "Suppliers",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            path: "/transactions",
            label: "Transactions",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            )
        },
    ];

    return (
        <nav className="sticky top-0 bg-gradient-to-r from-white via-blue-50 to-purple-50 backdrop-blur-lg border-b border-white/20 shadow-2xl z-50">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <div className="relative">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                InventoryPro
                            </h1>
                            <p className="text-xs text-gray-500 font-medium hidden lg:block">Management System</p>
                        </div>
                        <div className="block sm:hidden">
                            <h1 className="text-base font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Inventory
                            </h1>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`group relative flex items-center space-x-2 xl:space-x-3 px-3 xl:px-6 py-2 xl:py-3 rounded-2xl font-semibold transition-all duration-300 text-sm xl:text-base ${isActive
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                                        : "text-gray-700 hover:bg-white/80 hover:shadow-lg hover:scale-102 hover:text-blue-600"
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10"></div>
                                    )}

                                    <div className={`transition-all duration-300 ${isActive
                                        ? "text-white drop-shadow-sm"
                                        : "text-gray-500 group-hover:text-blue-600"
                                        }`}>
                                        {item.icon}
                                    </div>

                                    <span className={`transition-all duration-300 ${isActive
                                        ? "text-white font-bold"
                                        : "group-hover:text-blue-600"
                                        }`}>
                                        {item.label}
                                    </span>

                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-md animate-pulse"></div>
                                    )}

                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="hidden md:flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-xl shadow-lg border border-white/30">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs lg:text-sm font-semibold text-gray-700">Online</span>
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden relative p-2 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg border border-white/30 hover:bg-white/90 transition-all duration-300 z-50"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-2xl z-[9999]">
                        <div className="px-4 py-6 space-y-3">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`group relative flex items-center space-x-4 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${isActive
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                            : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
                                            }`}
                                    >
                                        <div className={`transition-all duration-300 ${isActive
                                            ? "text-white"
                                            : "text-gray-500 group-hover:text-blue-600"
                                            }`}>
                                            {item.icon}
                                        </div>

                                        <span className={`text-base transition-all duration-300 ${isActive
                                            ? "text-white font-bold"
                                            : "group-hover:text-blue-600"
                                            }`}>
                                            {item.label}
                                        </span>

                                        {isActive && (
                                            <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        )}
                                    </Link>
                                );
                            })}

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-center space-x-2 bg-green-50 px-4 py-3 rounded-xl">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-green-800">System Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;