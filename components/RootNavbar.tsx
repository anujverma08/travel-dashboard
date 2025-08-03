import React, { useState } from 'react'
import {Link, useLoaderData, useLocation, useNavigate, useParams} from "react-router";
import {logoutUser} from "~/appwrite/auth";
import {cn} from "~/lib/utils";

const RootNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const user = useLoaderData();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutUser();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    }

    const isOnTravelDetail = location.pathname === `/travel/${params.tripId}`;
    const isOnTravelPages = location.pathname.startsWith('/travel');

    return (
        <nav className={cn(
            'w-full fixed top-0 z-50 transition-all duration-300',
            {
                'bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg': isOnTravelDetail,
                'bg-gradient-to-r from-blue-600/95 to-indigo-700/95 backdrop-blur-lg': !isOnTravelDetail
            }
        )}>
            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <Link to='/' className="flex items-center space-x-3 group">
                        <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-200',
                            {
                                
                            }
                        )}>
                            <img 
                                src="/assets/icons/logo.svg" 
                                alt="TripWise Logo" 
                                className="w-6 h-6 filter brightness-0 invert" 
                            />
                        </div>
                        <h1 className={cn(
                            'text-xl font-bold transition-colors duration-200',
                            {
                                'text-white group-hover:text-blue-100': !isOnTravelDetail,
                                'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent': isOnTravelDetail
                            }
                        )}>
                            TripWise
                        </h1>
                    </Link>

                    {/* Right Section */}
                    <aside className="flex items-center space-x-4">
                        {/* Admin Panel Link */}
                        {user?.status === 'admin' && (
                            <Link 
                                to="/dashboard" 
                                className={cn(
                                    'px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105',
                                    {
                                        'text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm': !isOnTravelDetail,
                                        'text-blue-600 bg-blue-50 hover:bg-blue-100': isOnTravelDetail
                                    }
                                )}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span>Admin Panel</span>
                                </div>
                            </Link>
                        )}

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                {/* User Avatar */}
                                <div className="relative">
                                    <img 
                                        src={user?.imageUrl || '/assets/images/david.webp'} 
                                        alt={user?.name || 'User'} 
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>

                                {/* User Name */}
                                <div className="hidden sm:block text-left">
                                    <p className={cn(
                                        'text-sm font-medium',
                                        {
                                            'text-white': !isOnTravelDetail,
                                            'text-gray-900': isOnTravelDetail
                                        }
                                    )}>
                                        {user?.name || 'Guest User'}
                                    </p>
                                    <p className={cn(
                                        'text-xs',
                                        {
                                            'text-blue-100': !isOnTravelDetail,
                                            'text-gray-500': isOnTravelDetail
                                        }
                                    )}>
                                        {user?.email || 'guest@tripwise.com'}
                                    </p>
                                </div>

                                {/* Dropdown Arrow */}
                                <svg 
                                    className={cn(
                                        'w-4 h-4 transition-transform duration-200',
                                        {
                                            'text-white': !isOnTravelDetail,
                                            'text-gray-600': isOnTravelDetail,
                                            'rotate-180': showUserMenu
                                        }
                                    )} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <img 
                                                src={user?.imageUrl || '/assets/images/david.webp'} 
                                                alt={user?.name || 'User'} 
                                                referrerPolicy="no-referrer"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user?.name || 'Guest User'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email || 'guest@tripwise.com'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-1">
                                        
                                        

                                    
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                handleLogout();
                                            }}
                                            disabled={isLoggingOut}
                                            className={cn(
                                                'w-full flex items-center px-4 py-2 text-sm transition-colors duration-200',
                                                {
                                                    'text-red-600 hover:bg-red-50': !isLoggingOut,
                                                    'text-gray-400 cursor-not-allowed': isLoggingOut
                                                }
                                            )}
                                        >
                                            {isLoggingOut ? (
                                                <>
                                                    <div className="w-4 h-4 mr-3 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                                                    Logging out...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign Out
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </header>

            {/* Click outside to close menu */}
            {showUserMenu && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                ></div>
            )}
        </nav>
    )
}

export default RootNavbar;
