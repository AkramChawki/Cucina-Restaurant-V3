import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast, ToastContainer } from '@/Components/Toast';

const DEFAULT_TYPES = {
    'Achat': 'achat',
    'Livraison': 'livraison',
    'Stock': 'stock',
    'Autre': 'autre'
};
export default function BMLForm({
    restaurant,
    currentMonth,
    existingEntries = [],
    types = DEFAULT_TYPES,
    currentType = ''
}) {
    const { toasts, addToast, removeToast } = useToast();
    const [monthDate, setMonthDate] = useState(
        new Date(currentMonth.year, currentMonth.month - 1)
    );
    const [selectedType, setSelectedType] = useState(currentType);

    const defaultRow = {
        id: 1,
        fournisseur: '',
        designation: '',
        quantity: '',
        price: '',
        unite: '',
        date: new Date().toISOString().split('T')[0],
        type: selectedType,
        total_ttc: 0
    };

    const [rows, setRows] = useState([defaultRow]);

    useEffect(() => {
        if (existingEntries && existingEntries.length > 0) {
            const formattedRows = existingEntries.map((entry, index) => ({
                id: index + 1,
                fournisseur: entry.fournisseur || '',
                designation: entry.designation || '',
                quantity: entry.quantity || '',
                price: entry.price || '',
                unite: entry.unite || '',
                date: entry.date || new Date().toISOString().split('T')[0],
                type: entry.type || selectedType,
                total_ttc: entry.total_ttc || 0
            }));
            setRows(formattedRows);
        } else {
            setRows([defaultRow]);
        }
    }, [existingEntries]);

    const calculateTotal = (quantity, price) => {
        const qty = parseFloat(quantity) || 0;
        const prc = parseFloat(price) || 0;
        return (qty * prc).toFixed(2);
    };

    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            fournisseur: '',
            designation: '',
            quantity: '',
            price: '',
            unite: '',
            date: new Date().toISOString().split('T')[0],
            type: selectedType,
            total_ttc: 0
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
                const updatedRow = { ...row, [field]: value };
                if (field === 'quantity' || field === 'price') {
                    updatedRow.total_ttc = calculateTotal(
                        field === 'quantity' ? value : row.quantity,
                        field === 'price' ? value : row.price
                    );
                }
                return updatedRow;
            }
            return row;
        }));
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setSelectedType(newType);

        router.get(route('BML.show', [restaurant.slug]), {
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear(),
            type: newType
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleMonthChange = (e) => {
        const newDate = new Date(e.target.value);
        setMonthDate(newDate);

        router.get(route('BML.show', [restaurant.slug]), {
            month: newDate.getMonth() + 1,
            year: newDate.getFullYear(),
            type: selectedType
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submissionData = {
            restaurant_id: restaurant.id,
            rows: rows.map(row => ({
                ...row,
                type: selectedType || row.type,
                total_ttc: calculateTotal(row.quantity, row.price)
            })),
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear(),
        };

        router.post(route('bml.update-value'), submissionData, {
            preserveScroll: true,
            onSuccess: () => {
                addToast('Les données ont été enregistrées avec succès.', 'success');
            },
            onError: (errors) => {
                addToast('Une erreur est survenue lors de l\'enregistrement.', 'error');
                console.error('Submission errors:', errors);
            }
        });
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1 flex items-center gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">BML</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {restaurant.name} - {monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <select
                            value={selectedType}
                            onChange={handleTypeChange}
                            className="border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">Tous les types</option>
                            {Object.entries(types).map(([label, value]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
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
                                        Date
                                    </th>
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
                                        Unité
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Prix
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total TTC
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
                                                type="date"
                                                value={row.date}
                                                onChange={(e) => handleInputChange(row.id, 'date', e.target.value)}
                                                className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm"
                                                required
                                            />
                                        </td>
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
                                                type="text"
                                                value={row.unite}
                                                onChange={(e) => handleInputChange(row.id, 'unite', e.target.value)}
                                                className="w-full border-gray-300 rounded-sm focus:ring-green-500 focus:border-green-500 text-sm"
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
                                            <div className="text-sm text-gray-900">
                                                {row.total_ttc}€
                                            </div>
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

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}