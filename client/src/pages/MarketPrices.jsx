import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import locationsData from '../data/locations.json';
import Navbar from '../components/Navbar';

// ── Price Range Bar Visualization ────────────────────────────────────────────
const PriceRangeBar = ({ record, maxModal, isBest }) => {
    const pct = maxModal > 0 ? Math.round((record.modal_price / maxModal) * 100) : 0;
    const barColor = isBest ? 'bg-green-600' : 'bg-blue-400';

    return (
        <div className={`border rounded-xl p-4 transition-all ${isBest
            ? 'border-green-300 bg-green-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}>
            <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{record.market} Market</p>
                        {isBest && (
                            <span className="text-xs font-bold bg-green-700 text-white px-2 py-0.5 rounded-full">
                                Best Price
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{record.commodity} · {record.arrival_date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900">₹{record.modal_price}</p>
                    <p className="text-xs text-gray-400">per quintal</p>
                </div>
            </div>

            {/* Price Range Bar */}
            <div className="mb-2">
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            {/* Min / Max / Advisory */}
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="text-xs text-gray-500">
                        <span className="text-gray-400">Min</span> <span className="font-medium text-gray-700">₹{record.min_price}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        <span className="text-gray-400">Max</span> <span className="font-medium text-gray-700">₹{record.max_price}</span>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    record.advisoryType === 'sell'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                }`}>
                    {record.advisory}
                </span>
            </div>
        </div>
    );
};

const MarketPrices = () => {
    const [bestMarket, setBestMarket] = useState(null);
    const [otherMarkets, setOtherMarkets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fallbackTriggered, setFallbackTriggered] = useState(false);
    const [isMock, setIsMock] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const states = Object.keys(locationsData);
    const [stateLocation, setStateLocation] = useState('');
    const [district, setDistrict] = useState('');
    const [crop, setCrop] = useState('');
    const currentDistricts = stateLocation ? Object.keys(locationsData[stateLocation]) : [];

    const popularCrops = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Soybean', 'Groundnut', 'Sugarcane', 'Onion', 'Potato', 'Tomato'];

    const handleStateChange = (e) => {
        setStateLocation(e.target.value);
        setDistrict('');
        setBestMarket(null);
        setOtherMarkets([]);
    };

    const fetchPrices = async (e) => {
        e.preventDefault();
        if (!stateLocation || !district || !crop) {
            setError('Please select a State, District, and Commodity.');
            return;
        }
        setLoading(true);
        setError(null);
        setFallbackTriggered(false);
        setBestMarket(null);
        setOtherMarkets([]);
        setSubmitted(false);

        try {
            const res = await api.get('/api/market/prices', {
                params: { state: stateLocation, district, commodity: crop }
            });

            if (!res.data.bestMarket && (!res.data.otherMarkets || res.data.otherMarkets.length === 0)) {
                setError(`No market data found for "${crop}" in ${district}, ${stateLocation}.`);
            } else {
                setBestMarket(res.data.bestMarket);
                setOtherMarkets(res.data.otherMarkets || []);
                setFallbackTriggered(res.data.fallbackTriggered);
                setIsMock(res.data.isMock);
                setSubmitted(true);
            }
        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.error || 'Failed to fetch market prices. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const allResults = bestMarket
        ? [bestMarket, ...otherMarkets]
        : otherMarkets;
    const maxModal = Math.max(...allResults.map(r => r.modal_price || 0), 1);

    const selectCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Market Price Assistant</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Real-time commodity prices sourced from Agmarknet (data.gov.in) across Indian agricultural markets.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Filter Panel ─────────────────────────────────── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-900">Search Filters</h2>
                            </div>
                            <div className="p-5">
                                <form onSubmit={fetchPrices} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">State</label>
                                        <select value={stateLocation} onChange={handleStateChange} required className={selectCls}>
                                            <option value="" disabled>Select state</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">District</label>
                                        <select
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            disabled={!stateLocation}
                                            required
                                            className={selectCls}
                                        >
                                            <option value="" disabled>Select district</option>
                                            {currentDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Commodity</label>
                                        <input
                                            type="text"
                                            value={crop}
                                            onChange={(e) => setCrop(e.target.value)}
                                            required
                                            placeholder="e.g. Wheat, Cotton"
                                            list="crop-suggestions"
                                            className={selectCls}
                                        />
                                        <datalist id="crop-suggestions">
                                            {popularCrops.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !stateLocation || !district || !crop}
                                        className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Fetching Prices...
                                            </span>
                                        ) : 'Get Market Prices'}
                                    </button>
                                </form>

                                {/* Popular Crops Quick Select */}
                                <div className="mt-5 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-medium text-gray-500 mb-2">Quick select commodity</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {popularCrops.slice(0, 6).map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setCrop(c)}
                                                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                                                    crop === c
                                                        ? 'bg-green-700 text-white border-green-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'
                                                }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Panel */}
                        <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">About This Data</h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Prices sourced from Agmarknet via data.gov.in API.',
                                    'Modal price is the most common traded price.',
                                    'If no district data, state-level results are shown.',
                                    '"Hold" advisory means current prices are below average.',
                                ].map((t, i) => (
                                    <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                                        <span className="text-green-600 mt-0.5">•</span>{t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ── Results Panel ─────────────────────────────────── */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-64">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">Price Results</h2>
                                    {submitted && !loading && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Showing results for <span className="font-medium text-gray-600">{crop}</span> in <span className="font-medium text-gray-600">{district}, {stateLocation}</span>
                                        </p>
                                    )}
                                </div>
                                {isMock && submitted && (
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                                        Simulated Data
                                    </span>
                                )}
                            </div>

                            <div className="p-5">
                                {/* Fallback notice */}
                                {fallbackTriggered && !loading && (
                                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm mb-4">
                                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>No records found for {district}. Showing statewide results for {stateLocation} instead.</span>
                                    </div>
                                )}

                                {/* Error */}
                                {error && (
                                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                {/* Loading */}
                                {loading && (
                                    <div className="text-center py-16">
                                        <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-sm text-gray-600">Connecting to Agmarknet API...</p>
                                        <p className="text-xs text-gray-400 mt-1">Fetching live price data for {crop}</p>
                                    </div>
                                )}

                                {/* Empty initial state */}
                                {!loading && !error && !submitted && (
                                    <div className="text-center py-16">
                                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">No data fetched yet</p>
                                        <p className="text-xs text-gray-400 mt-1">Select a state, district, and commodity to see live market prices.</p>
                                    </div>
                                )}

                                {/* Results */}
                                {!loading && submitted && allResults.length > 0 && (
                                    <div className="space-y-3">
                                        {/* Summary Row */}
                                        {bestMarket && (
                                            <div className="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-gray-100">
                                                {[
                                                    { label: 'Best Price', value: `₹${bestMarket.modal_price}`, sub: 'per quintal · ' + bestMarket.market },
                                                    { label: 'Price Range', value: `₹${Math.min(...allResults.map(r => r.min_price))} – ₹${Math.max(...allResults.map(r => r.max_price))}`, sub: 'across all markets' },
                                                    { label: 'Markets Found', value: allResults.length, sub: fallbackTriggered ? 'statewide results' : 'in your district' },
                                                ].map(s => (
                                                    <div key={s.label} className="text-center border border-gray-100 rounded-xl py-3 px-2">
                                                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                                                        <p className="text-lg font-bold text-gray-900">{s.value}</p>
                                                        <p className="text-xs text-gray-400 truncate">{s.sub}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Price Bars */}
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                            Price Comparison — Modal Price per Quintal
                                        </p>
                                        {bestMarket && (
                                            <PriceRangeBar record={bestMarket} maxModal={maxModal} isBest={true} />
                                        )}
                                        {otherMarkets.map((r, i) => (
                                            <PriceRangeBar key={i} record={r} maxModal={maxModal} isBest={false} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketPrices;
