"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function AuthWrapper() {
    return (
        <Authenticator hideSignUp={true}>
            {({ signOut, user }) => (
                <div className="min-h-screen bg-gray-50">
                    <nav className="bg-white shadow-sm">
                        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">KeyForge</h1>
                            <button
                                onClick={signOut}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </nav>

                    <div className="max-w-2xl mx-auto px-6 py-12">
                        <p className="text-lg text-gray-600 mb-8">Welcome, <span className="font-semibold text-gray-800">{user?.signInDetails?.loginId || user?.username}</span></p>

                        <div className="bg-white rounded-lg shadow p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
                            <pre className="bg-gray-100 p-4 rounded text-sm text-gray-700 overflow-auto">
                                {JSON.stringify(user, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </Authenticator>
    );
}
