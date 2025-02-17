import React, { useState } from 'react';
import { router } from '@inertiajs/react';

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

    const daysInMonth = Array.from(
        { length: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate() },
        (_, i) => i + 1
    );

    const handleValueChange = (productId, day, period, value) => {

        router.post(route(routeName), {
            restaurant_id: restaurant.id,
            product_id: productId,
            day: day,
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear(),
            period: period,
            value: value || 0
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
            {/* Header Section - Always Visible */}
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
                        onChange={(e) => setMonthDate(new Date(e.target.value))}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            </div>

            {/* Table Container with Shadow Indicators */}
            <div className="relative flex-1 overflow-hidden">
                {/* Horizontal Scroll Shadow Indicators */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* Main Table Scroll Container */}
                <div className="overflow-x-auto overflow-y-auto h-full">
                    <table className="w-full border-collapse min-w-max">
                        <thead className="bg-gray-50 sticky top-0 z-20">
                            <tr>
                                {/* Fixed Product Column Header */}
                                <th className="sticky left-0 z-30 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[240px]">
                                    Produit
                                </th>
                                {/* Day Column Headers */}
                                {daysInMonth.map(day => (
                                    <th key={day} className="px-3 py-3 text-center border-x">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</div>
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
                                    {/* Fixed Product Column */}
                                    <td className="sticky left-0 bg-white border-r px-6 py-4 whitespace-nowrap z-20 hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://admin.cucinanapoli.com/storage/${product.image}`}
                                                alt={product.designation}
                                                className="h-12 w-12 object-cover rounded-md"
                                            />
                                            <span className="text-sm font-medium text-gray-900">
                                                {product.designation}
                                            </span>
                                        </div>
                                    </td>
                                    {/* Day Cells */}
                                    {daysInMonth.map(day => (
                                        <td key={day} className="px-1 py-2 border-x">
                                            <div className="grid grid-cols-2 gap-1">
                                                {/* Morning Input */}
                                                <input
                                                    type="number"
                                                    className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm p-1"
                                                    value={getValue(product, day, 'morning')}
                                                    onChange={(e) => handleValueChange(product.id, day, 'morning', e.target.value)}
                                                    onWheel={handleWheel}
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0"
                                                />
                                                {/* Afternoon Input */}
                                                <input
                                                    type="number"
                                                    className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm p-1"
                                                    value={getValue(product, day, 'afternoon')}
                                                    onChange={(e) => handleValueChange(product.id, day, 'afternoon', e.target.value)}
                                                    onWheel={handleWheel}
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0"
                                                />
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