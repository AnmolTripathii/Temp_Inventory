function Loader() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-8">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Loading...
                    </h2>

                    <p className="text-gray-600 text-sm">
                        Please wait a moment
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Loader;
