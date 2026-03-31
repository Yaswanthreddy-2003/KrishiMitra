import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/advisory', label: 'Crop Advisory' },
        { path: '/disease-detection', label: 'Disease Detection' },
        { path: '/disease-history', label: 'Detection History' },
        { path: '/market-prices', label: 'Market Prices' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-green-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="font-bold text-base tracking-wide">KrishiMitra</span>
                    </Link>

                    {/* Navigation Links — hidden on small screens */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(link.path)
                                        ? 'bg-green-700 text-white'
                                        : 'text-green-200 hover:bg-green-800 hover:text-white'
                                }`}
                            >
                                {t(link.label, link.label)}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Language + User + Logout */}
                    <div className="flex items-center gap-3">
                        <select
                            onChange={(e) => i18n.changeLanguage(e.target.value)}
                            value={i18n.language}
                            className="bg-green-800 text-white text-xs rounded px-2 py-1.5 border border-green-700 outline-none cursor-pointer"
                        >
                            <option value="en">EN</option>
                            <option value="hi">HI</option>
                            <option value="te">TE</option>
                        </select>

                        {user.name && (
                            <span className="hidden md:block text-green-200 text-sm border-r border-green-700 pr-3">
                                {user.name}
                            </span>
                        )}

                        <button
                            onClick={logout}
                            className="bg-red-700 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md font-medium transition-colors"
                        >
                            {t('Logout')}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
