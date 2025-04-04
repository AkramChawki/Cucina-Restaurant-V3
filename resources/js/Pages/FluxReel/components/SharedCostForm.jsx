import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function SharedCostForm({
    title,
    routeName,
    restaurant,
    products,
    currentMonth
}) {
    const { auth, processing } = usePage().props;
    // Fix: Use proper type conversion for MySQL tinyint(1) boolean
    const isGuest = Boolean(auth.user.guest);
    console.log("Guest status:", auth.user.guest, "isGuest:", isGuest);
    
    const [monthDate, setMonthDate] = useState(
        new Date(currentMonth.year, currentMonth.month - 1)
    );
    const daysInMonth = Array.from(
        { length: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate() },
        (_, i) => i + 1
    );
    
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

    // Calculate the monthly total (sum of all day totals)
    const calculateMonthlyTotal = () => {
        return daysInMonth.reduce((sum, day) => {
            return sum + calculateDayTotal(day);
        }, 0);
    };

    // Calculate the total quantity for a product across all days
    const calculateProductTotalQty = (product) => {
        return daysInMonth.reduce((sum, day) => {
            const morning = parseFloat(getValue(product, day, 'morning')) || 0;
            const afternoon = parseFloat(getValue(product, day, 'afternoon')) || 0;
            return sum + morning + afternoon;
        }, 0);
    };

    const handleValueChange = (product, day, period, value) => {
        if (isGuest) return; // Prevent changes if user is a guest
        
        const morning = period === 'morning' ? parseFloat(value) || 0 : parseFloat(getValue(product, day, 'morning')) || 0;
        const afternoon = period === 'afternoon' ? parseFloat(value) || 0 : parseFloat(getValue(product, day, 'afternoon')) || 0;
        const productTotal = (morning + afternoon) * (product.prix || 0);
        let dailyData = { ...(product.values || {}) };
        if (!dailyData[day]) {
            dailyData[day] = { morning: 0, afternoon: 0, total: 0 };
        }
        dailyData[day] = {
            morning: morning,
            afternoon: afternoon,
            total: productTotal
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
                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</div>
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
                                        {daysInMonth.map(day => (
                                            <td key={day} className="px-1 py-2 border-x min-w-[90px]">
                                                <div className="flex flex-col gap-1">
                                                    <div className="grid grid-cols-2 gap-1">
                                                        <input
                                                            type="number"
                                                            className={`w-full border-gray-300 rounded-sm ${isGuest ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-green-500 focus:border-green-500'} text-sm p-1`}
                                                            value={getValue(product, day, 'morning')}
                                                            onChange={(e) => handleValueChange(product, day, 'morning', e.target.value)}
                                                            onWheel={handleWheel}
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0"
                                                            disabled={isGuest}
                                                            readOnly={isGuest}
                                                        />
                                                        <input
                                                            type="number"
                                                            className={`w-full border-gray-300 rounded-sm ${isGuest ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-green-500 focus:border-green-500'} text-sm p-1`}
                                                            value={getValue(product, day, 'afternoon')}
                                                            onChange={(e) => handleValueChange(product, day, 'afternoon', e.target.value)}
                                                            onWheel={handleWheel}
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0"
                                                            disabled={isGuest}
                                                            readOnly={isGuest}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-right text-gray-600 pr-1">
                                                        {calculateProductDayTotal(product, day).toFixed(2)}DH
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}