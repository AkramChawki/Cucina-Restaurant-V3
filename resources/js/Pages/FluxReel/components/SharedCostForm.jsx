import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function SharedCostForm({
    title,
    routeName,
    restaurant,
    products,
    currentMonth
}) {
    const { auth, processing } = usePage().props;
    console.log('Auth user:', auth.user);
    console.log('Guest status raw:', auth.user.guest);
    const isGuest = auth.user.guest === 1 || 
                   auth.user.guest === true || 
                   auth.user.guest === '1' || 
                   String(auth.user.guest).toLowerCase() === 'true';
    
    console.log('Final guest detection:', isGuest);
    
    // Parse user roles from JSON if needed
    const userRoles = typeof auth.user.role === 'string' 
        ? JSON.parse(auth.user.role) 
        : (Array.isArray(auth.user.role) ? auth.user.role : []);
    
    const isDataEntryRole = !isGuest && checkDataEntryRole(userRoles);
    const isVerifierRole = !isGuest && checkVerifierRole(userRoles);
    
    // Helper functions to check roles
    function checkDataEntryRole(roles) {
        const dataEntryRoles = ['Cost-Cuisine', 'Cost-Pizza', 'Cost-Economat', 'Cost-Consomable'];
        return roles.some(role => dataEntryRoles.includes(role));
    }
    
    function checkVerifierRole(roles) {
        const verifierRoles = ['Audit', 'Admin', 'Analytics'];
        return roles.some(role => verifierRoles.includes(role));
    }
    
    const [monthDate, setMonthDate] = useState(
        new Date(currentMonth.year, currentMonth.month - 1)
    );
    
    const [selectedDay, setSelectedDay] = useState(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    
    const daysInMonth = Array.from(
        { length: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate() },
        (_, i) => i + 1
    );
    
    useEffect(() => {
        console.log("Component mounted, guest status:", isGuest);
    }, []);
    
    const handleMonthChange = (e) => {
        const newDate = new Date(e.target.value);
        setMonthDate(newDate);

        // Visit the same URL with new month/year parameters
        router.get(window.location.pathname, {
            month: newDate.getMonth() + 1,
            year: newDate.getFullYear()
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['products', 'currentMonth']
        });
    };
    
    const calculateProductDayTotal = (product, day) => {
        const morning = parseFloat(getValue(product, day, 'morning')) || 0;
        const afternoon = parseFloat(getValue(product, day, 'afternoon')) || 0;
        return (morning + afternoon) * (product.prix || 0);
    };
    
    const calculateDayTotal = (day) => {
        return products.reduce((sum, product) => {
            return sum + calculateProductDayTotal(product, day);
        }, 0);
    };

    const calculateMonthlyTotal = () => {
        return daysInMonth.reduce((sum, day) => {
            return sum + calculateDayTotal(day);
        }, 0);
    };

    const calculateProductTotalQty = (product) => {
        return daysInMonth.reduce((sum, day) => {
            const morning = parseFloat(getValue(product, day, 'morning')) || 0;
            const afternoon = parseFloat(getValue(product, day, 'afternoon')) || 0;
            return sum + morning + afternoon;
        }, 0);
    };

    const handleValueChange = (product, day, period, value) => {
        // Double-check guest status to prevent any edits
        if (isGuest) {
            console.log("Blocked edit attempt by guest user");
            return;
        }
        
        if (!canEditEntry(product, day)) {
            alert("You don't have permission to edit this entry.");
            return;
        }
        
        const morning = period === 'morning' ? parseFloat(value) || 0 : parseFloat(getValue(product, day, 'morning')) || 0;
        const afternoon = period === 'afternoon' ? parseFloat(value) || 0 : parseFloat(getValue(product, day, 'afternoon')) || 0;
        const productTotal = (morning + afternoon) * (product.prix || 0);
        let dailyData = { ...(product.values || {}) };
        if (!dailyData[day]) {
            dailyData[day] = { morning: 0, afternoon: 0, total: 0, status: 'pending' };
        }
        dailyData[day] = {
            morning: morning,
            afternoon: afternoon,
            total: productTotal,
            status: dailyData[day].status || 'pending'
        };
        let newDayTotal = 0;
        products.forEach(p => {
            if (p.id === product.id) {
                newDayTotal += productTotal;
            } else {
                newDayTotal += calculateProductDayTotal(p, day);
            }
        });
        router.post(route(routeName), {
            restaurant_id: restaurant.id,
            product_id: product.id,
            day: day,
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear(),
            period: period,
            value: value || 0,
            daily_data: dailyData[day],
            day_total: newDayTotal
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleVerify = (day) => {
        if (isGuest) {
            console.log("Blocked verification attempt by guest user");
            return;
        }
        setSelectedDay(day);
        setShowVerifyModal(true);
    };
    
    const confirmVerification = () => {
        if (isGuest) {
            console.log("Blocked verification confirmation by guest user");
            return;
        }
        
        if (!selectedDay) return;
        
        products.forEach(product => {
            if (hasEntryForDay(product, selectedDay)) {
                router.post(route(routeName), {
                    restaurant_id: restaurant.id,
                    product_id: product.id,
                    day: selectedDay,
                    month: monthDate.getMonth() + 1,
                    year: monthDate.getFullYear(),
                    period: 'morning',
                    value: getValue(product, selectedDay, 'morning'),
                    daily_data: {
                        morning: parseFloat(getValue(product, selectedDay, 'morning')) || 0,
                        afternoon: parseFloat(getValue(product, selectedDay, 'afternoon')) || 0,
                        total: calculateProductDayTotal(product, selectedDay),
                        status: 'verified'
                    },
                    day_total: calculateDayTotal(selectedDay),
                    verify: true
                }, {
                    preserveScroll: true,
                    preserveState: true
                });
            }
        });
        
        setShowVerifyModal(false);
    };
    
    const hasEntryForDay = (product, day) => {
        return product.values && product.values[day] && 
            (parseFloat(product.values[day].morning) > 0 || parseFloat(product.values[day].afternoon) > 0);
    };
    
    const canEditEntry = (product, day) => {
        // Always block guests from editing
        if (isGuest) return false;
        
        // Verifiers can always edit
        if (isVerifierRole) return true;
        
        // Data entry role can only edit new entries or their own pending entries from today
        if (isDataEntryRole) {
            if (!product.values || !product.values[day]) return true; // New entry
            
            const entryStatus = product.values[day].status || 'pending';
            const createdAt = product.values[day].created_at;
            
            // Can edit if pending and created today
            if (entryStatus === 'pending' && createdAt) {
                const today = new Date().toDateString();
                const createdDate = new Date(createdAt).toDateString();
                return today === createdDate;
            }
            
            return false; // Can't edit older entries or verified entries
        }
        
        return false; // Default deny
    };
    
    const isEntryVerified = (product, day) => {
        return product.values && 
               product.values[day] && 
               product.values[day].status === 'verified';
    };
    
    const isDayVerified = (day) => {
        return products.every(product => 
            !hasEntryForDay(product, day) || isEntryVerified(product, day)
        );
    };

    const handleWheel = (e) => {
        e.target.blur();
    };

    const getValue = (product, day, period) => {
        if (!product.values || !product.values[day]) {
            return '';
        }
        return product.values[day][period] || '';
    };

    return (
        <div className="flex flex-col h-full">
            {processing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        Loading...
                    </div>
                </div>
            )}
            
            {/* Role banner - ONLY SHOW IF NOT A GUEST */}
            {!isGuest && (isDataEntryRole || isVerifierRole) && (
                <div className={`${isDataEntryRole ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border-b p-3`}>
                    <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDataEntryRole ? 'text-blue-600' : 'text-green-600'} mr-2`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className={`font-medium ${isDataEntryRole ? 'text-blue-800' : 'text-green-800'}`}>
                            {isDataEntryRole ? 'Mode saisie. Vous pouvez ajouter de nouvelles données ou modifier vos saisies du jour.' : 'Mode vérification. Vous pouvez vérifier et modifier toutes les entrées.'}
                        </span>
                    </div>
                </div>
            )}
            
            {/* Guest mode banner */}
            {isGuest && (
                <div className="bg-yellow-50 border-b border-yellow-200 p-3">
                    <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-yellow-800">Mode consultation uniquement. Vous ne pouvez pas modifier les données.</span>
                    </div>
                </div>
            )}
            
            <div className="bg-white p-4 border-b shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-600">
                            {restaurant.name} - {monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <input
                        type="month"
                        value={`${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`}
                        onChange={handleMonthChange}
                        className={`border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500'}`}
                    />
                </div>
                
                {/* Monthly Total Section */}
                <div className="mt-4 flex justify-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-3 shadow-sm">
                        <h2 className="text-sm font-medium text-green-700 text-center">Total du Mois</h2>
                        <p className="text-2xl font-bold text-green-800 text-center">
                            {calculateMonthlyTotal().toFixed(2)}DH
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Scroll Hint */}
            <div className="sm:hidden bg-blue-50 p-2 text-center text-xs text-blue-700">
                Swipe horizontally to see more days →
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <div className="overflow-x-auto pb-4 min-w-full">
                        <table className="w-full border-collapse min-w-max">
                            <thead className="bg-gray-50 sticky top-0 z-20">
                                <tr>
                                    {/* Product header - Reduced width for mobile */}
                                    <th className="sticky left-0 z-30 bg-gray-50 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[130px] sm:max-w-none px-2 sm:px-6">
                                        Produit
                                    </th>
                                    {daysInMonth.map(day => (
                                        <th key={day} className="px-3 py-3 text-center border-x min-w-[90px]">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</div>
                                                {/* Verification status indicator - only show action button for verifiers */}
                                                {isVerifierRole && (
                                                    <button 
                                                        onClick={() => handleVerify(day)}
                                                        className={`px-2 py-0.5 rounded text-xs ${
                                                            isDayVerified(day) 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                    >
                                                        {isDayVerified(day) ? 'Vérifié' : 'Vérifier'}
                                                    </button>
                                                )}
                                                {/* Always show the verification status label for guests or non-verifiers */}
                                                {(isGuest || !isVerifierRole) && isDayVerified(day) && (
                                                    <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                                                        Vérifié
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm font-semibold text-green-600">
                                                {calculateDayTotal(day).toFixed(2)}DH
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                <div className="text-xs text-gray-500">Matin</div>
                                                <div className="text-xs text-gray-500">Midi</div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        {/* Product column - Reduced width and content for mobile */}
                                        <td className="sticky left-0 bg-white border-r whitespace-nowrap z-20 hover:bg-gray-50 max-w-[140px] sm:max-w-none px-2 sm:px-6 py-2 sm:py-4">
                                            <div className="flex items-center gap-1 sm:gap-3">
                                                <img
                                                    src={`https://admin.cucinanapoli.com/storage/${product.image}`}
                                                    alt={product.designation}
                                                    className="h-8 w-8 sm:h-12 sm:w-12 object-cover rounded-md flex-shrink-0"
                                                />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-medium text-gray-900 truncate">
                                                        {product.designation}
                                                    </span>
                                                    <span className="text-xs text-gray-500 truncate">
                                                        {product.prix}DH/{product.unite}
                                                    </span>
                                                    
                                                    {/* Product Total Quantity */}
                                                    <div className="mt-1 text-green-700 text-xs px-2 py-1 rounded-md inline-flex items-center">
                                                        <span className="font-semibold">Total: </span>
                                                        <span className="ml-1">{calculateProductTotalQty(product).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {daysInMonth.map(day => {
                                            const isVerified = isEntryVerified(product, day);
                                            const canEdit = canEditEntry(product, day);
                                            const cellDisabled = !canEdit || isGuest;
                                            
                                            return (
                                                <td key={day} className={`px-1 py-2 border-x min-w-[90px] ${isVerified ? 'bg-green-50' : ''}`}>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="grid grid-cols-2 gap-1">
                                                            <input
                                                                type="number"
                                                                className={`w-full border-${isVerified ? 'green' : 'gray'}-300 rounded-sm ${
                                                                    cellDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-green-500 focus:border-green-500'
                                                                } text-sm p-1`}
                                                                value={getValue(product, day, 'morning')}
                                                                onChange={(e) => handleValueChange(product, day, 'morning', e.target.value)}
                                                                onWheel={handleWheel}
                                                                step="0.01"
                                                                min="0"
                                                                placeholder="0"
                                                                disabled={cellDisabled}
                                                                readOnly={cellDisabled}
                                                            />
                                                            <input
                                                                type="number"
                                                                className={`w-full border-${isVerified ? 'green' : 'gray'}-300 rounded-sm ${
                                                                    cellDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-green-500 focus:border-green-500'
                                                                } text-sm p-1`}
                                                                value={getValue(product, day, 'afternoon')}
                                                                onChange={(e) => handleValueChange(product, day, 'afternoon', e.target.value)}
                                                                onWheel={handleWheel}
                                                                step="0.01"
                                                                min="0"
                                                                placeholder="0"
                                                                disabled={cellDisabled}
                                                                readOnly={cellDisabled}
                                                            />
                                                        </div>
                                                        <div className="text-xs text-right text-gray-600 pr-1">
                                                            {calculateProductDayTotal(product, day).toFixed(2)}DH
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Verification Modal */}
            {showVerifyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la vérification</h3>
                        <p className="text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir vérifier les entrées pour le jour {selectedDay} ? 
                            Cette action marquera toutes les entrées comme vérifiées.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                onClick={() => setShowVerifyModal(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md"
                                onClick={confirmVerification}
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}