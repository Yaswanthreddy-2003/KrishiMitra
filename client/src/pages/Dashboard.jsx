import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GovernmentSchemes from '../components/GovernmentSchemes';
import Navbar from '../components/Navbar';

const featureCards = [
    {
        title: 'Crop & Fertilizer Advisory',
        description: 'Enter soil NPK values and pH to receive crop recommendations and fertilizer guidance tailored to your field conditions.',
        path: '/advisory',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        accent: 'border-l-green-600',
        iconBg: 'bg-green-50 text-green-700',
    },
    {
        title: 'Plant Disease Detection',
        description: 'Photograph a diseased crop leaf and receive an AI-powered diagnosis with confidence score and treatment recommendations.',
        path: '/disease-detection',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
        accent: 'border-l-blue-600',
        iconBg: 'bg-blue-50 text-blue-700',
    },
    {
        title: 'Detection History',
        description: 'Review all past disease analyses for your account including disease names, confidence scores, and treatment records.',
        path: '/disease-history',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        accent: 'border-l-purple-600',
        iconBg: 'bg-purple-50 text-purple-700',
    },
    {
        title: 'Market Prices',
        description: 'Check real-time commodity prices from Agmarknet across Indian markets and identify the most profitable selling destination.',
        path: '/market-prices',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        accent: 'border-l-amber-600',
        iconBg: 'bg-amber-50 text-amber-700',
    },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Banner */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {getGreeting()}, {user.name || 'Farmer'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{today}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        All services operational
                    </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {featureCards.map((card) => (
                        <Link
                            key={card.title}
                            to={card.path}
                            className={`bg-white border border-gray-200 border-l-4 ${card.accent} rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group duration-200`}
                        >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.iconBg}`}>
                                {card.icon}
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1.5 group-hover:text-green-700 transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {card.description}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Main Content: Info & Tips */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GovernmentSchemes />

                    {/* Quick Tips */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-green-50 text-green-700 rounded-full flex items-center justify-center border border-green-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Seasonal Farming Tips</h3>
                        </div>
                        <ul className="space-y-4 flex-1">
                            {[
                                { title: 'Soil Testing', text: 'Test soil pH before sowing for optimal nutrient uptake and better fertilizer efficiency.' },
                                { title: 'Disease Prevention', text: 'Inspect crops daily during humid weather for early disease signs to prevent spread.' },
                                { title: 'Market Research', text: 'Compare prices at 2-3 local and regional markets before deciding where to sell your harvest.' },
                                { title: 'Record Keeping', text: 'Keep records of fertilizer applications and disease occurrences for future reference.' },
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <span className="text-green-600 mt-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{tip.title}</p>
                                        <p className="text-sm text-gray-600 mt-0.5">{tip.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
