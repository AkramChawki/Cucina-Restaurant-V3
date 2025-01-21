import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast, ToastContainer } from '@/Components/Toast';

export default function BMLForm({ restaurant, currentMonth, existingEntries }) {
    const { toasts, addToast, removeToast } = useToast();
    const [monthDate, setMonthDate] = useState(
        new Date(currentMonth.year, currentMonth.month - 1)
    );

    const [rows, setRows] = useState([{
        id: 1,
        fournisseur: '',
        designation: '',
        quantity: '',
        price: ''
    }]);

    // Load existing entries when month changes or component mounts
    useEffect(() => {
        if (existingEntries && existingEntries.length > 0) {
            const formattedRows = existingEntries.map((entry, index) => ({
                id: index + 1,
                fournisseur: entry.fournisseur,
                designation: entry.designation,
                quantity: entry.quantity,
                price: entry.price
            }));
            setRows(formattedRows);
        } else {
            setRows([{
                id: 1,
                fournisseur: '',
                designation: '',
                quantity: '',
                price: ''
            }]);
        }
    }, [existingEntries, monthDate]);

    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            fournisseur: '',
            designation: '',
            quantity: '',
            price: ''
        };
        setRows([...rows, newRow]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(row => {
            if (row.id === id) {
                return { ...row, [field]: value };
            }
            return row;
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('bml.update-value'), {
            restaurant_id: restaurant.id,
            rows: rows,
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear(),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                addToast('Les données ont été enregistrées avec succès.', 'success');
                if (!existingEntries || existingEntries.length === 0) {
                    setRows([{
                        id: 1,
                        fournisseur: '',
                        designation: '',
                        quantity: '',
                        price: ''
                    }]);
                }
            },
            onError: (errors) => {
                addToast('Une erreur est survenue lors de l\'enregistrement.', 'error');
            }
        });
    };

    const handleMonthChange = (e) => {
        const newDate = new Date(e.target.value);
        setMonthDate(newDate);
        
        router.get(route('BL.show', [restaurant.slug]), {
            month: newDate.getMonth() + 1,
            year: newDate.getFullYear()
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">BML</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            {restaurant.name} - {monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <input
                            type="month"
                            value={`${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`}
                            onChange={handleMonthChange}
                            className="block w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fournisseur
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Designation
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantité
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Prix
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={row.fournisseur}
                                                onChange={(e) => handleInputChange(row.id, 'fournisseur', e.target.value)}
                                                className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={row.designation}
                                                onChange={(e) => handleInputChange(row.id, 'designation', e.target.value)}
                                                className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={row.quantity}
                                                onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
                                                className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={row.price}
                                                onChange={(e) => handleInputChange(row.id, 'price', e.target.value)}
                                                className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                type="button"
                                                onClick={() => removeRow(row.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 flex justify-between items-center bg-gray-50">
                        <button
                            type="button"
                            onClick={addRow}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ajouter une ligne
                        </button>

                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}