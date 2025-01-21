import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function CostPizzaForm({ restaurant, products, currentMonth }) {
    const [monthDate, setMonthDate] = useState(
        new Date(currentMonth.year, currentMonth.month - 1)
    );

    const daysInMonth = Array.from(
        { length: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate() },
        (_, i) => i + 1
    );

    const handleValueChange = (productId, day, value) => {
        router.post(route('cost-pizza.update-value'), {
            restaurant_id: restaurant.id,
            product_id: productId,
            day: day,
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear(),
            value: value || 0
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                router.reload();
            }
        });
    };

    const handleWheel = (e) => {
        e.target.blur();
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">Cost Pizza</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            {restaurant.name} - {monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <input
                            type="month"
                            value={`${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`}
                            onChange={(e) => setMonthDate(new Date(e.target.value))}
                            className="block w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                {daysInMonth.map(day => (
                                    <th 
                                        key={day} 
                                        scope="col" 
                                        className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="sticky left-0 z-10 bg-white px-4 py-2">
                                        <div className="flex items-center">
                                            <img
                                                src={`https://admin.cucinanapoli.com/storage/${product.image}`}
                                                alt={product.designation}
                                                className="h-12 w-12 object-cover rounded-md mr-3"
                                            />
                                            <span className="text-sm font-medium text-gray-900">
                                                {product.designation}
                                            </span>
                                        </div>
                                    </td>
                                    {daysInMonth.map(day => (
                                        <td key={day} className="px-1 py-1 text-sm">
                                            <input
                                                type="number"
                                                className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm p-1"
                                                value={product.values[day] || ''}
                                                onChange={(e) => handleValueChange(product.id, day, e.target.value)}
                                                onWheel={handleWheel}
                                                step="0.01"
                                                min="0"
                                            />
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