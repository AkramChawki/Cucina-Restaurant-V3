import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast, ToastContainer } from '@/Components/Toast';

// Common designations by type to help with frequently used items
const COMMON_DESIGNATIONS = {
    'gastro': ['Mozzarella Milka', 'Creme Fraîche', 'PERLA CERISE', 'Mozzarella cerise'],
    'giada': ['Mozzarella', 'Stracciatella', 'Buratta', 'Ricotta'],
    'legume': ['Roquette', 'EPINARD', 'Tomate cerise', 'Poivron Rouge', 'Poivron vert', 'CHAMPIGNON', 'CITRON', 'ORANGUE', 'CONCOMBRE', 'AIL', 'Basilic', 'Courgette', 'OIGNON'],
    'boisson': ['Coca', 'Coca Zero', 'Hawaei', 'Sprite', 'POMS', 'Citron', 'Tonic']
};

// Common units to standardize input
const COMMON_UNITS = ['Kg', 'KG', '250G', 'unite', 'L', 'Botte', 'BROT', 'paquet de 24 U', 'Pot de 1 kg'];

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
        if (!date) return acc;
        
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

// Get the appropriate fournisseur based on type
const getFournisseurByType = (type) => {
    switch (type) {
        case 'gastro': return 'GASTRO';
        case 'giada': return 'GIADA';
        case 'legume': return 'Legume';
        case 'boisson': return 'COCA COLA';
        default: return '';
    }
};

export default function BMLForm({
    restaurant,
    currentMonth,
    existingEntries = [],
    types = {},
    currentType = ''
}) {
    const { toasts, addToast, removeToast } = useToast();
    const [monthDate, setMonthDate] = useState(
        new Date(currentMonth.year, currentMonth.month - 1)
    );
    const [selectedType, setSelectedType] = useState(currentType);
    const [isLoading, setIsLoading] = useState(false);
    // Use ref to track if this is the initial render
    const initialRender = useRef(true);
    const prevExistingEntries = useRef(existingEntries);

    const getDefaultRow = () => ({
        id: Date.now() + Math.floor(Math.random() * 1000), // Ensure uniqueness
        fournisseur: getFournisseurByType(selectedType),
        designation: '',
        quantity: '',
        price: '',
        unite: '',
        date: formatDate(new Date()),
        type: selectedType,
        total_ttc: 0
    });

    const [rows, setRows] = useState([getDefaultRow()]);

    // Only update rows when existingEntries change, not on every render
    useEffect(() => {
        // Skip the first render to avoid the infinite loop
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        // Check if existingEntries has actually changed
        const entriesChanged = JSON.stringify(prevExistingEntries.current) !== JSON.stringify(existingEntries);
        prevExistingEntries.current = existingEntries;
        
        if (!entriesChanged) {
            return;
        }
        
        if (existingEntries && existingEntries.length > 0) {
            const formattedRows = existingEntries.map((entry, index) => ({
                id: Date.now() + index,
                fournisseur: entry.fournisseur || getFournisseurByType(entry.type),
                designation: entry.designation || '',
                quantity: entry.quantity || '',
                price: entry.price || '',
                unite: entry.unite || '',
                date: formatDate(entry.date),
                type: entry.type || selectedType,
                total_ttc: parseFloat(entry.total_ttc) || 0
            }));
            setRows(formattedRows);
        } else {
            // If no entries, initialize with default row
            setRows([getDefaultRow()]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingEntries]);

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
                    
                    // Auto-update fournisseur when type changes
                    if (field === 'type') {
                        updatedRow.fournisseur = getFournisseurByType(value);
                    }
                    
                    // Recalculate total when quantity or price changes
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
        try {
            const newType = e.target.value;
            console.log('Type changed to:', newType);
            setSelectedType(newType);
            setIsLoading(true);
            
            // For "all types" selection, we send an empty string
            const typeParam = newType === "" ? null : newType;
            
            // Make sure we're using the proper URL
            const url = route('bml.show', [restaurant.slug]);
            console.log('Navigating to:', url, 'with type:', typeParam);
            
            router.get(url, {
                month: monthDate.getMonth() + 1,
                year: monthDate.getFullYear(),
                type: typeParam
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    console.log('Navigation successful', page);
                    setIsLoading(false);
                },
                onError: (errors) => {
                    console.error('Navigation error:', errors);
                    setIsLoading(false);
                    addToast('Erreur lors du chargement des données.', 'error');
                }
            });
        } catch (error) {
            console.error('Error in handleTypeChange:', error);
            setIsLoading(false);
            addToast('Une erreur est survenue lors du changement de type.', 'error');
        }
    };

    const handleMonthChange = (e) => {
        const newDate = new Date(e.target.value);
        setMonthDate(newDate);
        setIsLoading(true);

        router.get(route('bml.show', [restaurant.slug]), {
            month: newDate.getMonth() + 1,
            year: newDate.getFullYear(),
            type: selectedType
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
                addToast('Erreur lors du chargement des données.', 'error');
            }
        });
    };

    const calculateGrandTotal = () => {
        const groupedTotals = calculateDayTotals(rows);
        return Object.entries(groupedTotals)
            .map(([date, data]) => ({
                date: date,
                total: data.total.toFixed(2)
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Skip submission if no rows or all rows are empty
        if (rows.length === 0 || rows.every(row => !row.designation)) {
            addToast('Aucune donnée à enregistrer.', 'warning');
            return;
        }
        
        // Validate that all required fields are filled in non-empty rows
        const nonEmptyRows = rows.filter(row => row.designation || row.quantity || row.price);
        const hasEmptyFields = nonEmptyRows.some(row => 
            !row.date || !row.fournisseur || !row.designation || 
            !row.quantity || !row.price || !row.unite
        );
        
        if (hasEmptyFields) {
            addToast('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        setIsLoading(true);
        
        // Only process rows that have data
        const rowsToSubmit = rows.filter(row => 
            row.date && row.fournisseur && row.designation && 
            row.quantity && row.price && row.unite
        );
        
        // Ensure each row has the proper type
        const processedRows = rowsToSubmit.map(row => ({
            ...row,
            date: formatDate(row.date),
            type: selectedType || row.type || 'gastro', // Default to 'gastro' if no type
            total_ttc: calculateTotal(row.quantity, row.price)
        }));
        
        // Create a single submission for all data
        const submissionData = {
            restaurant_id: restaurant.id,
            rows: processedRows,
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear(),
            type: selectedType || 'gastro', // Make sure we provide a default
            day_total: processedRows.reduce((sum, row) => sum + parseFloat(row.total_ttc), 0).toFixed(2)
        };
        
        // Only submit if we have rows to submit
        if (processedRows.length > 0) {
            router.post(route('bml.update-value'), submissionData, {
                onSuccess: () => {
                    addToast('Les données ont été enregistrées avec succès.', 'success');
                    setIsLoading(false);
                    
                    // Refresh data with proper type parameter
                    const typeParam = selectedType === "" ? null : selectedType;
                    router.get(route('bml.show', [restaurant.slug]), {
                        month: monthDate.getMonth() + 1,
                        year: monthDate.getFullYear(),
                        type: typeParam
                    }, {
                        preserveScroll: true,
                        preserveState: true
                    });
                },
                onError: (errors) => {
                    setIsLoading(false);
                    addToast('Une erreur est survenue lors de l\'enregistrement.', 'error');
                    console.error('Submission errors:', errors);
                }
            });
        } else {
            setIsLoading(false);
            addToast('Aucune donnée valide à enregistrer.', 'warning');
        }
    };
    
    // Get suggestions for designations based on selected type
    const getDesignationSuggestions = () => {
        if (!selectedType) return [];
        return COMMON_DESIGNATIONS[selectedType] || [];
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
                        <div className="relative">
                            <select
                                value={selectedType}
                                onChange={handleTypeChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 pl-3 pr-10 text-base"
                                disabled={isLoading}
                            >
                                <option value="">Tous les types</option>
                                {Object.entries(types).map(([label, value]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <input
                            type="month"
                            value={`${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`}
                            onChange={handleMonthChange}
                            className="block w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <form onSubmit={handleSubmit}>
                    {isLoading && (
                        <div className="p-4 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            <p className="mt-2 text-gray-600">Chargement en cours...</p>
                        </div>
                    )}
                    
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
                                                value={row.date || ''}
                                                onChange={(e) => handleInputChange(row.id, 'date', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                required
                                                disabled={isLoading}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={row.fournisseur}
                                                onChange={(e) => handleInputChange(row.id, 'fournisseur', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                required
                                                disabled={true} // Auto-set based on type
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    list={`designations-${row.id}`}
                                                    value={row.designation}
                                                    onChange={(e) => handleInputChange(row.id, 'designation', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                    required
                                                    disabled={isLoading}
                                                />
                                                <datalist id={`designations-${row.id}`}>
                                                    {getDesignationSuggestions().map((designation, index) => (
                                                        <option key={index} value={designation} />
                                                    ))}
                                                </datalist>
                                            </div>
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
                                                disabled={isLoading}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    list="unite-options"
                                                    value={row.unite}
                                                    onChange={(e) => handleInputChange(row.id, 'unite', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                    required
                                                    disabled={isLoading}
                                                />
                                                <datalist id="unite-options">
                                                    {COMMON_UNITS.map((unit, index) => (
                                                        <option key={index} value={unit} />
                                                    ))}
                                                </datalist>
                                            </div>
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
                                                disabled={isLoading}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {parseFloat(row.total_ttc).toFixed(2)} MAD
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                type="button"
                                                onClick={() => removeRow(row.id)}
                                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                disabled={isLoading || rows.length <= 1}
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
                                            {calculateGrandTotal().map((dayTotal) => (
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
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ajouter une ligne
                        </button>

                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}