import React, { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import {
    PlusCircle,
    Trash2,
    Save,
    Calendar,
    ChevronsUpDown,
    AlertCircle
} from "lucide-react";
import { useToast, ToastContainer } from "@/Components/Toast";

const COMMON_DESIGNATIONS = {
    gastro: [
        "Mozzarella Milka",
        "Creme Fraîche",
        "PERLA CERISE",
        "Mozzarella cerise",
    ],
    giada: ["Mozzarella", "Stracciatella", "Buratta", "Ricotta"],
    legume: [
        "Roquette",
        "EPINARD",
        "Tomate cerise",
        "Poivron Rouge",
        "Poivron vert",
        "CHAMPIGNON",
        "CITRON",
        "ORANGUE",
        "CONCOMBRE",
        "AIL",
        "Basilic",
        "Courgette",
        "OIGNON",
    ],
    boisson: [
        "Coca",
        "Coca Zero",
        "Hawaei",
        "Sprite",
        "POMS",
        "Citron",
        "Tonic",
        "Ouelmes",
        "EAU",
    ],
};

const COMMON_UNITS = [
    "KG",
    "250G",
    "unite",
    "L",
    "Botte",
    "paquet de 24 U",
    "Pot de 1 kg",
];

const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
        const date =
            dateString instanceof Date ? dateString : new Date(dateString);
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - timezoneOffset);
        return localDate.toISOString().split("T")[0];
    } catch (e) {
        console.error("Error formatting date:", e);
        return "";
    }
};

const getFournisseurByType = (type) => {
    switch (type) {
        case "gastro":
            return "GASTRO";
        case "giada":
            return "GIADA";
        case "legume":
            return "Legume";
        case "boisson":
            return "COCA COLA";
        default:
            return "";
    }
};

// Custom Month Picker Component
const MonthYearPicker = ({ value, onChange, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const selectedDate = new Date(value);

    // Handle clicking outside the picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // Generate years (current year, previous 5 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    // Month names
    const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];

    const handleMonthSelect = (monthIndex) => {
        const newDate = new Date(selectedDate.getFullYear(), monthIndex);
        onChange(newDate);
        setIsOpen(false);
    };

    const handleYearSelect = (year) => {
        const newDate = new Date(year, selectedDate.getMonth());
        onChange(newDate);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm ${
                    disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                }`}
                disabled={disabled}
            >
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                    {months[selectedDate.getMonth()]}{" "}
                    {selectedDate.getFullYear()}
                </span>
                <ChevronsUpDown className="w-4 h-4 ml-2 text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-64">
                    <div className="mb-2">
                        <div className="font-medium text-gray-700 mb-1">
                            Mois
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                            {months.map((month, index) => (
                                <button
                                    key={month}
                                    type="button"
                                    className={`text-sm p-1 rounded ${
                                        selectedDate.getMonth() === index
                                            ? "bg-green-500 text-white"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => handleMonthSelect(index)}
                                >
                                    {month.substring(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="font-medium text-gray-700 mb-1">
                            Année
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    type="button"
                                    className={`text-sm p-1 rounded ${
                                        selectedDate.getFullYear() === year
                                            ? "bg-green-500 text-white"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => handleYearSelect(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function BMLForm({
    restaurant,
    currentMonth,
    existingEntries = [],
    types = {},
    currentType = "",
}) {
    // Get auth user and check if guest
    const { auth, processing } = usePage().props;
    const isGuest = Boolean(auth.user.guest);
    console.log("Guest status:", auth.user.guest, "isGuest:", isGuest);
    
    const { toasts, addToast, removeToast } = useToast();
    const [monthDate, setMonthDate] = useState(
        new Date(currentMonth.year, currentMonth.month - 1)
    );
    const [selectedType, setSelectedType] = useState(currentType);
    const [isLoading, setIsLoading] = useState(false);
    const [rowSavingStates, setRowSavingStates] = useState({});
    const initialRender = useRef(true);
    const prevExistingEntries = useRef(existingEntries);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "ascending",
    });

    const getDefaultRow = () => ({
        id: Date.now() + Math.floor(Math.random() * 1000),
        fournisseur: getFournisseurByType(selectedType),
        designation: "",
        quantity: "",
        price: "",
        unite: "",
        date: formatDate(new Date()),
        type: selectedType,
        total_ttc: 0,
        isNew: true,
        isSaving: false,
        hasChanges: false,
    });

    const [rows, setRows] = useState([getDefaultRow()]);

    // Used to track if any row has unsaved changes
    const hasUnsavedChanges = rows.some((row) => row.hasChanges);

    // Update day totals on the UI after operations
    const updateDayTotalsUI = (date, type, newTotal) => {
        if (!date) return;

        // If newTotal is 0, remove all rows for this date/type
        if (newTotal === 0) {
            setRows((currentRows) =>
                currentRows.filter(
                    (row) => !(row.date === date && row.type === type)
                )
            );
            return;
        }

        // Otherwise, just ensure day totals are recalculated
        setRows((currentRows) => [...currentRows]); // Trigger re-render
    };

    const calculateDayTotals = (rowsToCalculate) => {
        const groupedByDate = rowsToCalculate.reduce((acc, row) => {
            const date = row.date;
            if (!date) return acc;

            if (!acc[date]) {
                acc[date] = {
                    rows: [],
                    total: 0,
                };
            }
            acc[date].rows.push(row);
            acc[date].total += parseFloat(row.total_ttc) || 0;
            return acc;
        }, {});

        return groupedByDate;
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const entriesChanged =
            JSON.stringify(prevExistingEntries.current) !==
            JSON.stringify(existingEntries);
        prevExistingEntries.current = existingEntries;

        if (!entriesChanged) {
            return;
        }

        if (existingEntries && existingEntries.length > 0) {
            const formattedRows = existingEntries.map((entry, index) => ({
                id: Date.now() + index,
                fournisseur:
                    entry.fournisseur || getFournisseurByType(entry.type),
                designation: entry.designation || "",
                quantity: entry.quantity || "",
                price: entry.price || "",
                unite: entry.unite || "",
                date: formatDate(entry.date),
                type: entry.type || selectedType,
                total_ttc: parseFloat(entry.total_ttc) || 0,
                isNew: false,
                isSaving: false,
                hasChanges: false,
                originalId: entry.id,
            }));
            setRows(formattedRows);
        } else {
            setRows([getDefaultRow()]);
        }
    }, [existingEntries]);

    // Apply sorting to rows
    const sortedRows = [...rows].sort((a, b) => {
        if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;

        if (sortConfig.key === "date") {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortConfig.direction === "ascending"
                ? dateA - dateB
                : dateB - dateA;
        }

        const valueA = a[sortConfig.key].toString().toLowerCase();
        const valueB = b[sortConfig.key].toString().toLowerCase();

        if (valueA < valueB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valueA > valueB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (columnName) => {
        if (sortConfig.key !== columnName) return null;

        return (
            <span className="ml-1">
                {sortConfig.direction === "ascending" ? "▲" : "▼"}
            </span>
        );
    };

    const calculateTotal = (quantity, price) => {
        const qty = parseFloat(quantity) || 0;
        const prc = parseFloat(price) || 0;
        return (qty * prc).toFixed(2);
    };

    const isDateOutOfSelectedMonth = (dateString) => {
        if (!dateString) return false;

        const date = new Date(dateString);
        return (
            date.getMonth() + 1 !== monthDate.getMonth() + 1 ||
            date.getFullYear() !== monthDate.getFullYear()
        );
    };

    const addRow = () => {
        if (isGuest) {
            addToast("Mode consultation uniquement. Vous ne pouvez pas ajouter de lignes.", "warning");
            return;
        }
        setRows((currentRows) => [...currentRows, getDefaultRow()]);
    };

    // Delete a row
    const removeRow = async (id) => {
        if (isGuest) {
            addToast("Mode consultation uniquement. Vous ne pouvez pas supprimer de lignes.", "warning");
            return;
        }
        
        // Check if this is an existing row (not newly created)
        const rowToRemove = rows.find((row) => row.id === id);

        if (!rowToRemove) return;

        // If it's the only row, don't allow deletion
        if (rows.length <= 1) {
            addToast("Impossible de supprimer la seule ligne", "warning");
            return;
        }

        // If it's not a new row and has an originalId, send delete request to server
        if (!rowToRemove.isNew && rowToRemove.originalId) {
            if (!confirm("Êtes-vous sûr de vouloir supprimer cette ligne?")) {
                return;
            }

            setRowSavingStates((prev) => ({ ...prev, [id]: true }));

            try {
                // Send delete request to the server with redirect option
                router.post(
                    route("bml.delete"),
                    {
                        id: rowToRemove.originalId,
                        restaurant_id: restaurant.id,
                    },
                    {
                        // Preserve scroll position
                        preserveScroll: true,
                        // Preserve state where possible
                        preserveState: false,
                        // We want a full page reload here since we're redirecting
                        onSuccess: () => {
                            // The redirect will handle loading the new data
                        },
                        onError: (errors) => {
                            console.error("Delete error:", errors);
                            addToast("Erreur lors de la suppression", "error");
                            setRowSavingStates((prev) => ({
                                ...prev,
                                [id]: false,
                            }));
                        },
                    }
                );
            } catch (error) {
                addToast("Erreur lors de la suppression", "error");
                console.error("Error deleting row:", error);
                setRowSavingStates((prev) => ({ ...prev, [id]: false }));
            }
        } else {
            // For new rows just remove from the UI without server request
            // Remove row from state
            setRows((currentRows) =>
                currentRows.filter((row) => row.id !== id)
            );

            // Remove from saving states
            setRowSavingStates((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        }
    };

    // Save a single row
    const saveRow = async (rowId) => {
        if (isGuest) {
            addToast("Mode consultation uniquement. Vous ne pouvez pas enregistrer de modifications.", "warning");
            return;
        }
        
        const row = rows.find((r) => r.id === rowId);
        if (!row) return;

        // Validate row
        if (
            !row.date ||
            !row.fournisseur ||
            !row.designation ||
            !row.quantity ||
            !row.price ||
            !row.unite
        ) {
            addToast("Veuillez remplir tous les champs obligatoires.", "error");
            return;
        }

        // Check if date is outside selected month and warn
        if (isDateOutOfSelectedMonth(row.date)) {
            const rowDate = new Date(row.date);
            const formattedDate = rowDate.toLocaleDateString("fr-FR");

            if (
                !confirm(
                    `Attention: La date sélectionnée (${formattedDate}) est en dehors du mois actuel. Cette entrée sera automatiquement placée dans le mois correspondant à sa date. Voulez-vous continuer?`
                )
            ) {
                return;
            }
        }

        // Set row as saving
        setRows((currentRows) =>
            currentRows.map((r) =>
                r.id === rowId ? { ...r, isSaving: true } : r
            )
        );
        setRowSavingStates((prev) => ({ ...prev, [rowId]: true }));

        try {
            // Prepare row data
            const rowDate = new Date(row.date);
            const processedRow = {
                ...row,
                date: formatDate(rowDate),
                type: selectedType || row.type || "gastro",
                total_ttc: calculateTotal(row.quantity, row.price),
            };

            // Prepare submission data
            const submissionData = {
                restaurant_id: restaurant.id,
                rows: [processedRow],
                month: rowDate.getMonth() + 1,
                year: rowDate.getFullYear(),
                type: selectedType || "gastro",
                day_total: parseFloat(processedRow.total_ttc).toFixed(2),
            };

            // Send to server with redirect options
            await router.post(route("bml.update-value"), submissionData, {
                preserveScroll: true,
                preserveState: false, // We don't want to preserve state for a redirect
                onSuccess: () => {
                    // The redirect will handle success state
                    // We'll rely on the server to redirect us to the correct location
                },
                onError: (errors) => {
                    console.error("Save error:", errors);
                    addToast("Erreur lors de l'enregistrement", "error");

                    setRows((currentRows) =>
                        currentRows.map((r) =>
                            r.id === rowId ? { ...r, isSaving: false } : r
                        )
                    );
                    setRowSavingStates((prev) => ({ ...prev, [rowId]: false }));
                },
            });
        } catch (error) {
            console.error("Error saving row:", error);
            addToast("Erreur lors de l'enregistrement", "error");

            setRows((currentRows) =>
                currentRows.map((r) =>
                    r.id === rowId ? { ...r, isSaving: false } : r
                )
            );
            setRowSavingStates((prev) => ({ ...prev, [rowId]: false }));
        }
    };

    const handleInputChange = (id, field, value) => {
        if (isGuest) return; // Prevent changes if user is a guest
        
        setRows((currentRows) =>
            currentRows.map((row) => {
                if (row.id === id) {
                    const updatedRow = {
                        ...row,
                        [field]: value,
                        hasChanges: true,
                    };

                    if (field === "type") {
                        updatedRow.fournisseur = getFournisseurByType(value);
                    }

                    if (field === "quantity" || field === "price") {
                        updatedRow.total_ttc = calculateTotal(
                            field === "quantity" ? value : row.quantity,
                            field === "price" ? value : row.price
                        );
                    }

                    return updatedRow;
                }
                return row;
            })
        );
    };

    const handleTypeChange = (e) => {
        if (isGuest) {
            addToast("Mode consultation uniquement. Vous ne pouvez pas changer le type.", "warning");
            return;
        }
        
        try {
            const newType = e.target.value;
            console.log("Type changed to:", newType);

            // Check for unsaved changes
            if (hasUnsavedChanges) {
                if (
                    !confirm(
                        "Vous avez des modifications non enregistrées. Voulez-vous continuer sans enregistrer?"
                    )
                ) {
                    return;
                }
            }

            setSelectedType(newType);
            setIsLoading(true);

            const typeParam = newType === "" ? null : newType;

            const url = route("bml.show", [restaurant.slug]);
            console.log("Navigating to:", url, "with type:", typeParam);

            router.get(
                url,
                {
                    month: monthDate.getMonth() + 1,
                    year: monthDate.getFullYear(),
                    type: typeParam,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: (page) => {
                        console.log("Navigation successful", page);
                        setIsLoading(false);
                    },
                    onError: (errors) => {
                        console.error("Navigation error:", errors);
                        setIsLoading(false);
                        addToast(
                            "Erreur lors du chargement des données.",
                            "error"
                        );
                    },
                }
            );
        } catch (error) {
            console.error("Error in handleTypeChange:", error);
            setIsLoading(false);
            addToast(
                "Une erreur est survenue lors du changement de type.",
                "error"
            );
        }
    };

    const handleMonthChange = (newDate) => {
        if (isGuest) {
            addToast("Mode consultation uniquement. Vous pouvez consulter d'autres mois.", "info");
        }
        
        // Check for unsaved changes
        if (hasUnsavedChanges) {
            if (
                !confirm(
                    "Vous avez des modifications non enregistrées. Voulez-vous continuer sans enregistrer?"
                )
            ) {
                return;
            }
        }

        setMonthDate(newDate);
        setIsLoading(true);

        router.get(
            route("bml.show", [restaurant.slug]),
            {
                month: newDate.getMonth() + 1,
                year: newDate.getFullYear(),
                type: selectedType,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                    addToast("Erreur lors du chargement des données.", "error");
                },
            }
        );
    };

    const calculateGrandTotal = () => {
        const groupedTotals = calculateDayTotals(rows);
        return Object.entries(groupedTotals)
            .map(([date, data]) => ({
                date: date,
                total: data.total.toFixed(2),
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isGuest) {
            addToast("Mode consultation uniquement. Vous ne pouvez pas enregistrer de modifications.", "warning");
            return;
        }

        // Check if there are any rows with changes
        const rowsWithChanges = rows.filter((row) => row.hasChanges);
        if (rowsWithChanges.length === 0) {
            addToast("Aucune modification à enregistrer.", "info");
            return;
        }

        // Ask for confirmation
        if (
            !confirm(
                `Voulez-vous enregistrer ${rowsWithChanges.length} ligne(s) modifiée(s)?`
            )
        ) {
            return;
        }

        // Process all rows with changes
        const processedRows = rowsWithChanges.map((row) => {
            const rowDate = new Date(row.date);
            return {
                ...row,
                date: formatDate(rowDate),
                type: selectedType || row.type || "gastro",
                total_ttc: calculateTotal(row.quantity, row.price),
            };
        });

        // Prepare submission data for all rows
        const submissionData = {
            restaurant_id: restaurant.id,
            rows: processedRows,
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear(),
            type: selectedType || "gastro",
            day_total: processedRows
                .reduce((total, row) => total + parseFloat(row.total_ttc), 0)
                .toFixed(2),
        };

        // Set loading state
        setIsLoading(true);

        // Send all rows together to the store endpoint
        router.post(route("bml.store"), submissionData, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                // The redirect will handle success state
            },
            onError: (errors) => {
                console.error("Save error:", errors);
                addToast("Erreur lors de l'enregistrement", "error");
                setIsLoading(false);
            },
        });
    };

    const handleKeyPress = (e, rowId, fieldName, currentIndex) => {
        if (isGuest) return; // Prevent key actions if user is a guest
        
        // If Enter is pressed, save the row
        if (e.key === "Enter") {
            e.preventDefault();
            saveRow(rowId);
            return;
        }

        // Handle tab to move to next field or next row
        if (e.key === "Tab" && !e.shiftKey) {
            const fieldOrder = [
                "date",
                "fournisseur",
                "designation",
                "quantity",
                "unite",
                "price",
            ];
            const currentFieldIndex = fieldOrder.indexOf(fieldName);
            const isLastField = currentFieldIndex === fieldOrder.length - 1;

            if (isLastField) {
                e.preventDefault();

                // If it's the last field in the last row, add a new row
                if (currentIndex === rows.length - 1) {
                    addRow();
                }

                // Focus on the first field of the next row
                setTimeout(() => {
                    const nextRowIndex = currentIndex + 1;
                    if (nextRowIndex < rows.length) {
                        const nextRowId = rows[nextRowIndex].id;
                        const dateInput = document.querySelector(
                            `input[name="date-${nextRowId}"]`
                        );
                        if (dateInput) dateInput.focus();
                    }
                }, 0);
            }
        }
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Guest mode banner */}
            {isGuest && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg mb-4 p-3">
                    <div className="flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="font-medium text-yellow-800">Mode consultation uniquement. Vous ne pouvez pas modifier les données.</span>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1 flex items-center gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                BML
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {restaurant.name} -{" "}
                                {monthDate.toLocaleDateString("fr-FR", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="relative">
                            <select
                                value={selectedType}
                                onChange={handleTypeChange}
                                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 pl-3 pr-10 text-base ${
                                    isGuest ? "bg-gray-100 cursor-not-allowed" : ""
                                }`}
                                disabled={isLoading || isGuest}
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
                        <MonthYearPicker
                            value={monthDate}
                            onChange={handleMonthChange}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <form onSubmit={handleSubmit}>
                    {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                                <p className="mt-2 text-gray-600">
                                    Chargement en cours...
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 cursor-pointer"
                                        onClick={() => requestSort("date")}
                                    >
                                        <div className="flex items-center">
                                            Date {getSortIndicator("date")}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                                        Fournisseur
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 cursor-pointer"
                                        onClick={() =>
                                            requestSort("designation")
                                        }
                                    >
                                        <div className="flex items-center">
                                            Designation{" "}
                                            {getSortIndicator("designation")}
                                        </div>
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
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedRows.map((row, index) => (
                                    <tr
                                        key={row.id}
                                        className={`hover:bg-gray-50 transition-colors duration-150 ${
                                            row.hasChanges ? "bg-blue-50" : ""
                                        }`}
                                    >
                                        <td
                                            className={`px-4 py-2 ${
                                                isDateOutOfSelectedMonth(
                                                    row.date
                                                )
                                                    ? "bg-yellow-50"
                                                    : ""
                                            }`}
                                        >
                                            <div className="relative">
                                                <input
                                                    name={`date-${row.id}`}
                                                    type="date"
                                                    value={row.date || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            row.id,
                                                            "date",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleKeyPress(
                                                            e,
                                                            row.id,
                                                            "date",
                                                            index
                                                        )
                                                    }
                                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150 ${
                                                        isDateOutOfSelectedMonth(
                                                            row.date
                                                        )
                                                            ? "border-yellow-400 bg-yellow-50"
                                                            : ""
                                                    } ${
                                                        row.hasChanges
                                                            ? "border-blue-300"
                                                            : ""
                                                    } ${
                                                        isGuest ? "bg-gray-100 cursor-not-allowed" : ""
                                                    }`}
                                                    required
                                                    disabled={
                                                        isLoading ||
                                                        rowSavingStates[row.id] ||
                                                        isGuest
                                                    }
                                                    readOnly={isGuest}
                                                    max={formatDate(new Date())}
                                                />
                                                {isDateOutOfSelectedMonth(
                                                    row.date
                                                ) && (
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                        <svg
                                                            className="h-5 w-5 text-yellow-500"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            {isDateOutOfSelectedMonth(
                                                row.date
                                            ) && (
                                                <div className="text-xs text-yellow-600 mt-1">
                                                    Date hors du mois
                                                    sélectionné
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={row.fournisseur}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        row.id,
                                                        "fournisseur",
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleKeyPress(
                                                        e,
                                                        row.id,
                                                        "fournisseur",
                                                        index
                                                    )
                                                }
                                                className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150 ${
                                                    row.hasChanges
                                                        ? "border-blue-300"
                                                        : ""
                                                } ${
                                                    isGuest ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                required
                                                disabled={true}
                                                readOnly={true}
                                            />
                                        </td>
                                        <td className="px-4 py-2 relative">
                                            <input
                                                id={`designation-${row.id}`}
                                                type="text"
                                                value={row.designation}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        row.id,
                                                        "designation",
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleKeyPress(
                                                        e,
                                                        row.id,
                                                        "designation",
                                                        index
                                                    )
                                                }
                                                className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150 ${
                                                    row.hasChanges
                                                        ? "border-blue-300"
                                                        : ""
                                                } ${
                                                    isGuest ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                required
                                                disabled={
                                                    isLoading ||
                                                    rowSavingStates[row.id] ||
                                                    isGuest
                                                }
                                                readOnly={isGuest}
                                                autoComplete="off"
                                                onFocus={() =>
                                                    !isGuest && setActiveDropdown(row.id)
                                                }
                                                onBlur={() => {
                                                    setTimeout(
                                                        () =>
                                                            setActiveDropdown(
                                                                null
                                                            ),
                                                        200
                                                    );
                                                }}
                                            />

                                            {!isLoading &&
                                                !isGuest &&
                                                activeDropdown === row.id && (
                                                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
                                                        {COMMON_DESIGNATIONS[
                                                            selectedType
                                                        ]?.map(
                                                            (
                                                                suggestion,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                                    onMouseDown={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        handleInputChange(
                                                                            row.id,
                                                                            "designation",
                                                                            suggestion
                                                                        );
                                                                    }}
                                                                >
                                                                    {suggestion}
                                                                </div>
                                                            )
                                                        )}

                                                        {(!COMMON_DESIGNATIONS[
                                                            selectedType
                                                        ] ||
                                                            COMMON_DESIGNATIONS[
                                                                selectedType
                                                            ].length === 0) && (
                                                            <div className="px-3 py-2 text-sm text-gray-500">
                                                                Aucune
                                                                suggestion
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={row.quantity}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        row.id,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleKeyPress(
                                                        e,
                                                        row.id,
                                                        "quantity",
                                                        index
                                                    )
                                                }
                                                className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150 ${
                                                    row.hasChanges
                                                        ? "border-blue-300"
                                                        : ""
                                                } ${
                                                    isGuest ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                min="0"
                                                step="0.01"
                                                required
                                                disabled={
                                                    isLoading ||
                                                    rowSavingStates[row.id] ||
                                                    isGuest
                                                }
                                                readOnly={isGuest}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    list="unite-options"
                                                    value={row.unite}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            row.id,
                                                            "unite",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleKeyPress(
                                                            e,
                                                            row.id,
                                                            "unite",
                                                            index
                                                        )
                                                    }
                                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150 ${
                                                        row.hasChanges
                                                            ? "border-blue-300"
                                                            : ""
                                                    } ${
                                                        isGuest ? "bg-gray-100 cursor-not-allowed" : ""
                                                    }`}
                                                    required
                                                    disabled={
                                                        isLoading ||
                                                        rowSavingStates[row.id] ||
                                                        isGuest
                                                    }
                                                    readOnly={isGuest}
                                                />
                                                <datalist id="unite-options">
                                                    {COMMON_UNITS.map(
                                                        (unit, index) => (
                                                            <option
                                                                key={index}
                                                                value={unit}
                                                            />
                                                        )
                                                    )}
                                                </datalist>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={row.price}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        row.id,
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleKeyPress(
                                                        e,
                                                        row.id,
                                                        "price",
                                                        index
                                                    )
                                                }
                                                className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150 ${
                                                    row.hasChanges
                                                        ? "border-blue-300"
                                                        : ""
                                                } ${
                                                    isGuest ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                min="0"
                                                step="0.01"
                                                required
                                                disabled={
                                                    isLoading ||
                                                    rowSavingStates[row.id] ||
                                                    isGuest
                                                }
                                                readOnly={isGuest}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {parseFloat(
                                                    row.total_ttc
                                                ).toFixed(2)}{" "}
                                                MAD
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        saveRow(row.id)
                                                    }
                                                    className={`text-blue-600 hover:text-blue-800 ${
                                                        !row.hasChanges || isGuest
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                    disabled={
                                                        isLoading ||
                                                        !row.hasChanges ||
                                                        rowSavingStates[row.id] ||
                                                        isGuest
                                                    }
                                                    title={isGuest ? "Mode consultation uniquement" : "Enregistrer cette ligne"}
                                                >
                                                    {rowSavingStates[row.id] ? (
                                                        <div className="h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Save className="h-5 w-5" />
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeRow(row.id)
                                                    }
                                                    className={`text-red-600 hover:text-red-800 ${
                                                        isGuest || rows.length <= 1 || rowSavingStates[row.id]
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                    disabled={
                                                        isLoading ||
                                                        rows.length <= 1 ||
                                                        rowSavingStates[row.id] ||
                                                        isGuest
                                                    }
                                                    title={isGuest ? "Mode consultation uniquement" : "Supprimer cette ligne"}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50">
                                    <td colSpan="8" className="px-4 py-3">
                                        <div className="font-semibold text-gray-900 mb-2">
                                            Totaux par jour
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {calculateGrandTotal().map(
                                                (dayTotal) => (
                                                    <div
                                                        key={dayTotal.date}
                                                        className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
                                                    >
                                                        <span className="text-sm text-gray-600">
                                                            {new Date(
                                                                dayTotal.date
                                                            ).toLocaleDateString(
                                                                "fr-FR",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </span>
                                                        <span className="font-medium text-gray-900">
                                                            {parseFloat(
                                                                dayTotal.total
                                                            ).toLocaleString(
                                                                "fr-FR",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}{" "}
                                                            MAD
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <div className="mt-3 flex justify-end items-center border-t pt-2">
                                            <span className="text-sm font-medium text-gray-600 mr-2">
                                                Total du mois:
                                            </span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {calculateGrandTotal()
                                                    .reduce(
                                                        (acc, curr) =>
                                                            acc +
                                                            parseFloat(
                                                                curr.total
                                                            ),
                                                        0
                                                    )
                                                    .toLocaleString("fr-FR", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}{" "}
                                                MAD
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
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                                isLoading || isGuest ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isLoading || isGuest}
                            title={isGuest ? "Mode consultation uniquement" : "Ajouter une ligne"}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ajouter une ligne
                        </button>

                        <button
                            type="submit"
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                !hasUnsavedChanges || isGuest || isLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            disabled={isLoading || !hasUnsavedChanges || isGuest}
                            title={isGuest ? "Mode consultation uniquement" : "Enregistrer toutes les modifications"}
                        >
                            {isLoading
                                ? "Enregistrement..."
                                : "Enregistrer tout"}
                        </button>
                    </div>
                </form>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}