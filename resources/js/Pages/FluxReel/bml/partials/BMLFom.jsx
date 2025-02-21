import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast, ToastContainer } from '@/Components/Toast';

const DEFAULT_TYPES = {
    'Gastro': 'gastro',
    'Giada': 'giada',
    'Legume': 'legume',
    'Boisson': 'boisson'
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = dateString instanceof Date ? dateString : new Date(dateString);
        const timezoneOffset = date.getTimezoneOffset() * 60000; // Convert to milliseconds
        const localDate = new Date(date.getTime() - timezoneOffset);
        return localDate.toISOString().split('T')[0];
    } catch (e) {
        console.error('Error formatting date:', e);
        return '';
    }
};

const calculateDayTotals = (rows) => {
    const groupedByDate = rows.reduce((acc, row) => {
        const date = row.date;
        if (!acc[date]) {
            acc[date] = {
                rows: [],
                total: 0
            };
        }
        acc[date].rows.push(row);
        acc[date].total += parseFloat(row.total_ttc) || 0;
        return acc;
    }, {});

    return groupedByDate;
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

    const getDefaultRow = () => ({
        id: Date.now(),
        fournisseur: '',
        designation: '',
        quantity: '',
        price: '',
        unite: '',
        date: formatDate(new Date()),
        type: selectedType,
        total_ttc: 0
    });

    const [rows, setRows] = useState([getDefaultRow()]);

    useEffect(() => {
        if (existingEntries && existingEntries.length > 0) {
            const formattedRows = existingEntries.map((entry, index) => ({
                id: Date.now() + index,
                fournisseur: entry.fournisseur || '',
                designation: entry.designation || '',
                quantity: entry.quantity || '',
                price: entry.price || '',
                unite: entry.unite || '',
                // Properly format the date from server response
                date: formatDate(entry.date),
                type: entry.type || selectedType,
                total_ttc: entry.total_ttc || 0
            }));
            setRows(formattedRows);
        }
    }, [existingEntries, selectedType]);

    const calculateTotal = (quantity, price) => {
        const qty = parseFloat(quantity) || 0;
        const prc = parseFloat(price) || 0;
        return (qty * prc).toFixed(2);
    };

    const addRow = () => {
        setRows(currentRows => [...currentRows, getDefaultRow()]);
    };

    const removeRow = (id) => {
        setRows(currentRows => {
            if (currentRows.length <= 1) return currentRows;
            return currentRows.filter(row => row.id !== id);
        });
    };

    const handleInputChange = (id, field, value) => {
        setRows(currentRows =>
            currentRows.map(row => {
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
            })
        );
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setSelectedType(newType);
        setRows([getDefaultRow()]);
        router.get(route('bml.show', [restaurant.slug]), {
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear(),
            type: newType
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                if (page.props.existingEntries.length > 0) {
                    const formattedRows = page.props.existingEntries.map((entry, index) => ({
                        id: Date.now() + index,
                        fournisseur: entry.fournisseur || '',
                        designation: entry.designation || '',
                        quantity: entry.quantity || '',
                        price: entry.price || '',
                        unite: entry.unite || '',
                        date: formatDate(entry.date || new Date()),
                        type: entry.type || newType,
                        total_ttc: entry.total_ttc || 0
                    }));
                    setRows(formattedRows);
                }
            }
        });
    };

    const handleMonthChange = (e) => {
        const newDate = new Date(e.target.value);
        setMonthDate(newDate);

        setRows([getDefaultRow()]);

        router.get(route('bml.show', [restaurant.slug]), {
            month: newDate.getMonth() + 1,
            year: newDate.getFullYear(),
            type: selectedType
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                if (page.props.existingEntries.length > 0) {
                    const formattedRows = page.props.existingEntries.map((entry, index) => ({
                        id: Date.now() + index,
                        fournisseur: entry.fournisseur || '',
                        designation: entry.designation || '',
                        quantity: entry.quantity || '',
                        price: entry.price || '',
                        unite: entry.unite || '',
                        date: formatDate(entry.date || new Date()),
                        type: entry.type || selectedType,
                        total_ttc: entry.total_ttc || 0
                    }));
                    setRows(formattedRows);
                }
            }
        });
    };

    const calculateGrandTotal = () => {
        const groupedTotals = calculateDayTotals(rows);
        const totalsDisplay = Object.entries(groupedTotals)
            .map(([date, data]) => ({
                date: date,
                total: data.total.toFixed(2)
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return totalsDisplay;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const groupedTotals = calculateDayTotals(rows);

        const submissions = Object.entries(groupedTotals).map(([date, data]) => {
            const dateRows = data.rows;
            const dayTotal = data.total.toFixed(2);

            const submissionData = {
                restaurant_id: restaurant.id,
                rows: dateRows.map(row => ({
                    ...row,
                    date: formatDate(row.date),
                    type: selectedType || row.type,
                    total_ttc: calculateTotal(row.quantity, row.price)
                })),
                month: monthDate.getMonth() + 1,
                year: monthDate.getFullYear(),
                type: selectedType,
                day_total: dayTotal
            };

            return router.post(route('bml.update-value'), submissionData);
        });

        Promise.all(submissions)
            .then(() => {
                addToast('Les données ont été enregistrées avec succès.', 'success');
                router.get(route('bml.show', [restaurant.slug]), {
                    month: monthDate.getMonth() + 1,
                    year: monthDate.getFullYear(),
                    type: selectedType
                }, {
                    preserveScroll: true,
                    preserveState: true
                });
            })
            .catch((error) => {
                addToast('Une erreur est survenue lors de l\'enregistrement.', 'error');
                console.error('Submission errors:', error);
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
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                                        Fournisseur
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                                        Designation
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                                        Quantité
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                                        Unité
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                                        Prix
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                                        Total TTC
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rows.map((row) => (
                                    <tr key={row.id} className='hover:bg-gray-50 transition-colors duration-150'>
                                        <td className="px-4 py-2">
                                            <input
                                                type="date"
                                                value={row.date || ''} // Add fallback empty string
                                                onChange={(e) => handleInputChange(row.id, 'date', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={row.fournisseur}
                                                onChange={(e) => handleInputChange(row.id, 'fournisseur', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={row.designation}
                                                onChange={(e) => handleInputChange(row.id, 'designation', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={row.quantity}
                                                onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
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
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={row.price}
                                                onChange={(e) => handleInputChange(row.id, 'price', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="text-sm text-gray-900">
                                                {row.total_ttc}MAD
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
                                <tr className="bg-gray-50">
                                    <td colSpan="8" className="px-4 py-3">
                                        <div className="font-semibold text-gray-900 mb-2">Totaux par jour</div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {calculateGrandTotal().map((dayTotal, index) => (
                                                <div
                                                    key={dayTotal.date}
                                                    className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
                                                >
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(dayTotal.date).toLocaleDateString('fr-FR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                        {parseFloat(dayTotal.total).toLocaleString('fr-FR', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })} MAD
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 flex justify-end items-center border-t pt-2">
                                            <span className="text-sm font-medium text-gray-600 mr-2">Total du mois:</span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {calculateGrandTotal()
                                                    .reduce((acc, curr) => acc + parseFloat(curr.total), 0)
                                                    .toLocaleString('fr-FR', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })} MAD
                                            </span>
                                        </div>
                                    </td>
                                </tr>
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