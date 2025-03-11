import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function SharedCostForm({
    title,
    routeName,
    restaurant,
    products,
    currentMonth
}) {
    const [monthDate, setMonthDate] = useState(
        new Date(currentMonth.year, currentMonth.month - 1)
    );
    const [visibleDays, setVisibleDays] = useState([]);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const { processing } = usePage().props;

    // Calculate days in month
    const daysInMonth = Array.from(
        { length: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate() },
        (_, i) => i + 1
    );

    // Effect to update visible days when screen size or current index changes
    useEffect(() => {
        const handleResize = () => {
            // For mobile (less than 640px), show 3 days at a time
            // For tablets (640px - 1024px), show 5 days
            // For desktop, show 7 days or more depending on screen size
            const width = window.innerWidth;
            let daysToShow = 3; // Mobile default
            
            if (width >= 1280) {
                daysToShow = 10;
            } else if (width >= 1024) {
                daysToShow = 7;
            } else if (width >= 640) {
                daysToShow = 5;
            }
            
            // Update visible days based on current index
            updateVisibleDays(daysToShow);
        };

        // Initial calculation
        handleResize();
        
        // Add resize listener
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [daysInMonth, currentDayIndex]);

    // Update visible days based on current index and how many days to show
    const updateVisibleDays = (daysToShow) => {
        const maxStartIndex = Math.max(0, daysInMonth.length - daysToShow);
        const safeIndex = Math.min(currentDayIndex, maxStartIndex);
        const endIndex = Math.min(safeIndex + daysToShow, daysInMonth.length);
        
        setVisibleDays(daysInMonth.slice(safeIndex, endIndex));
    };

    // Navigate to previous set of days
    const showPreviousDays = () => {
        if (currentDayIndex > 0) {
            setCurrentDayIndex(Math.max(0, currentDayIndex - visibleDays.length));
        }
    };

    // Navigate to next set of days
    const showNextDays = () => {
        if (currentDayIndex + visibleDays.length < daysInMonth.length) {
            setCurrentDayIndex(currentDayIndex + visibleDays.length);
        }
    };

    const handleMonthChange = (e) => {
        const newDate = new Date(e.target.value);
        setMonthDate(newDate);
        setCurrentDayIndex(0); // Reset to first days when month changes

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

    const handleValueChange = (product, day, period, value) => {
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

    // Get current view range for display
    const currentDayRange = () => {
        if (visibleDays.length === 0) return '';
        const first = visibleDays[0];
        const last = visibleDays[visibleDays.length - 1];
        return `${first}-${last} / ${daysInMonth.length}`;
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
                        className="border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            </div>

            {/* Day Navigation Controls */}
            <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                <button 
                    onClick={showPreviousDays}
                    disabled={currentDayIndex === 0}
                    className={`px-3 py-1 rounded-md ${currentDayIndex === 0 ? 'text-gray-400' : 'text-green-600 hover:bg-green-50'}`}
                >
                    &lt; Previous
                </button>
                
                <span className="text-sm font-medium">
                    Days {currentDayRange()}
                </span>
                
                <button 
                    onClick={showNextDays}
                    disabled={currentDayIndex + visibleDays.length >= daysInMonth.length}
                    className={`px-3 py-1 rounded-md ${currentDayIndex + visibleDays.length >= daysInMonth.length ? 'text-gray-400' : 'text-green-600 hover:bg-green-50'}`}
                >
                    Next &gt;
                </button>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto h-full">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-20">
                            <tr>
                                <th className="sticky left-0 z-30 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 sm:w-1/4 md:w-1/5">
                                    Produit
                                </th>
                                {visibleDays.map(day => (
                                    <th key={day} className="px-3 py-3 text-center border-x">
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
                                    <td className="sticky left-0 bg-white border-r px-4 py-4 whitespace-nowrap z-20 hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://admin.cucinanapoli.com/storage/${product.image}`}
                                                alt={product.designation}
                                                className="h-10 w-10 object-cover rounded-md"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {product.designation}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {product.prix}DH/{product.unite}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    {visibleDays.map(day => (
                                        <td key={day} className="px-1 py-2 border-x">
                                            <div className="flex flex-col gap-1">
                                                <div className="grid grid-cols-2 gap-1">
                                                    <input
                                                        type="number"
                                                        className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm p-1"
                                                        value={getValue(product, day, 'morning')}
                                                        onChange={(e) => handleValueChange(product, day, 'morning', e.target.value)}
                                                        onWheel={handleWheel}
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0"
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm p-1"
                                                        value={getValue(product, day, 'afternoon')}
                                                        onChange={(e) => handleValueChange(product, day, 'afternoon', e.target.value)}
                                                        onWheel={handleWheel}
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0"
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
    );
}