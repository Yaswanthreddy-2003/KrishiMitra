const schemes = [
    {
        name: 'PM-KISAN',
        fullName: 'Pradhan Mantri Kisan Samman Nidhi',
        benefit: '₹6,000 per year in three installments of ₹2,000 each.',
        link: 'https://pmkisan.gov.in',
    },
    {
        name: 'PMFBY',
        fullName: 'Pradhan Mantri Fasal Bima Yojana',
        benefit: 'Crop insurance against natural calamities, pests, and diseases.',
        link: 'https://pmfby.gov.in',
    },
    {
        name: 'Soil Health Card',
        fullName: 'Soil Health Card Scheme',
        benefit: 'Free soil testing every two years with fertilizer recommendations.',
        link: 'https://soilhealth.dac.gov.in',
    },
    {
        name: 'KCC',
        fullName: 'Kisan Credit Card',
        benefit: 'Institutional credit at 4% interest for seeds, fertilizers, and irrigation.',
        link: 'https://www.nabard.org',
    },
    {
        name: 'eNAM',
        fullName: 'National Agriculture Market',
        benefit: 'Online trading platform to access buyers across India for better prices.',
        link: 'https://enam.gov.in',
    },
];

const GovernmentSchemes = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-900">Government Schemes</h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">Active schemes available for Indian farmers</p>
            </div>

            <div className="divide-y divide-gray-50">
                {schemes.map((scheme) => (
                    <div key={scheme.name} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                        {scheme.name}
                                    </span>
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" title="Active"></span>
                                </div>
                                <p className="text-xs font-medium text-gray-800 truncate">{scheme.fullName}</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{scheme.benefit}</p>
                            </div>
                            <a
                                href={scheme.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 text-xs text-green-700 hover:text-green-900 font-medium mt-0.5"
                                title="Apply / Learn more"
                            >
                                Apply →
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    Source: Ministry of Agriculture & Farmers Welfare, Govt. of India
                </p>
            </div>
        </div>
    );
};

export default GovernmentSchemes;
