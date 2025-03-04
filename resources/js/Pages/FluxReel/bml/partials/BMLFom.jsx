import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { PlusCircle, Trash2 } from "lucide-react";
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
    ],
};

const COMMON_UNITS = [
    "Kg",
    "KG",
    "250G",
    "unite",
    "L",
    "Botte",
    "BROT",
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

const calculateDayTotals = (rows) => {
    const groupedByDate = rows.reduce((acc, row) => {
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

export default function BMLForm({
    restaurant,
    currentMonth,
    existingEntries = [],
    types = {},
    currentType = "",
}) {
    const { toasts, addToast, removeToast } = useToast();
    const [monthDate, setMonthDate] = useState(
        new Date(currentMonth.year, currentMonth.month - 1)
    );
    const [selectedType, setSelectedType] = useState(currentType);
    const [isLoading, setIsLoading] = useState(false);
    const initialRender = useRef(true);
    const prevExistingEntries = useRef(existingEntries);
    const [activeDropdown, setActiveDropdown] = useState(null);

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
    });

    const [rows, setRows] = useState([getDefaultRow()]);

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
            }));
            setRows(formattedRows);
        } else {
            setRows([getDefaultRow()]);
        }
    }, [existingEntries]);

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
        setRows((currentRows) => [...currentRows, getDefaultRow()]);
    };

    const removeRow = (id) => {
        setRows((currentRows) => {
            if (currentRows.length <= 1) return currentRows;
            return currentRows.filter((row) => row.id !== id);
        });
    };

    const handleInputChange = (id, field, value) => {
        setRows((currentRows) =>
            currentRows.map((row) => {
                if (row.id === id) {
                    const updatedRow = { ...row, [field]: value };

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
        try {
            const newType = e.target.value;
            console.log("Type changed to:", newType);
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

    const handleMonthChange = (e) => {
        const newDate = new Date(e.target.value);
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

        if (rows.length === 0 || rows.every((row) => !row.designation)) {
            addToast("Aucune donnée à enregistrer.", "warning");
            return;
        }

        const nonEmptyRows = rows.filter(
            (row) => row.designation || row.quantity || row.price
        );
        const hasEmptyFields = nonEmptyRows.some(
            (row) =>
                !row.date ||
                !row.fournisseur ||
                !row.designation ||
                !row.quantity ||
                !row.price ||
                !row.unite
        );

        if (hasEmptyFields) {
            addToast("Veuillez remplir tous les champs obligatoires.", "error");
            return;
        }

        const rowsWithDifferentMonth = nonEmptyRows.filter((row) => {
            const rowDate = new Date(row.date);
            return (
                rowDate.getMonth() + 1 !== monthDate.getMonth() + 1 ||
                rowDate.getFullYear() !== monthDate.getFullYear()
            );
        });

        if (rowsWithDifferentMonth.length > 0) {
            const formattedDates = rowsWithDifferentMonth
                .map((row) => {
                    const date = new Date(row.date);
                    return `${row.designation}: ${date.toLocaleDateString(
                        "fr-FR"
                    )}`;
                })
                .join(", ");

            if (
                !confirm(
                    `Attention: Certaines dates sont en dehors du mois sélectionné (${formattedDates}). Ces entrées seront automatiquement placées dans le mois correspondant à leur date. Voulez-vous continuer?`
                )
            ) {
                return; 
            }
        }

        setIsLoading(true);

        const rowsToSubmit = nonEmptyRows.filter(
            (row) =>
                row.date &&
                row.fournisseur &&
                row.designation &&
                row.quantity &&
                row.price &&
                row.unite
        );

        const rowsByMonthYear = {};

        rowsToSubmit.forEach((row) => {
            const rowDate = new Date(row.date);
            const month = rowDate.getMonth() + 1;
            const year = rowDate.getFullYear();
            const key = `${year}-${month}`;

            if (!rowsByMonthYear[key]) {
                rowsByMonthYear[key] = [];
            }

            const processedRow = {
                ...row,
                date: formatDate(rowDate),
                type: selectedType || row.type || "gastro",
                total_ttc: calculateTotal(row.quantity, row.price),
            };

            rowsByMonthYear[key].push(processedRow);
        });

        const submissions = Object.entries(rowsByMonthYear).map(
            ([key, monthRows]) => {
                const [year, month] = key.split("-").map(Number);

                return {
                    restaurant_id: restaurant.id,
                    rows: monthRows,
                    month: month,
                    year: year,
                    type: selectedType || "gastro",
                    day_total: monthRows
                        .reduce(
                            (sum, row) => sum + parseFloat(row.total_ttc),
                            0
                        )
                        .toFixed(2),
                };
            }
        );

        let completedSubmissions = 0;
        let successfulSubmissions = 0;

        const checkCompletion = () => {
            completedSubmissions++;
            if (completedSubmissions === submissions.length) {
                setIsLoading(false);

                if (successfulSubmissions === submissions.length) {
                    addToast(
                        "Toutes les données ont été enregistrées avec succès.",
                        "success"
                    );
                } else {
                    addToast(
                        `${successfulSubmissions} sur ${submissions.length} mois ont été enregistrés avec succès.`,
                        "warning"
                    );
                }

                const typeParam = selectedType === "" ? null : selectedType;
                router.get(
                    route("bml.show", [restaurant.slug]),
                    {
                        month: monthDate.getMonth() + 1,
                        year: monthDate.getFullYear(),
                        type: typeParam,
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                    }
                );
            }
        };

        if (submissions.length > 0) {
            submissions.forEach((submissionData) => {
                const monthName = new Date(
                    submissionData.year,
                    submissionData.month - 1
                ).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                });

                router.post(route("bml.update-value"), submissionData, {
                    onSuccess: () => {
                        successfulSubmissions++;
                        if (
                            submissionData.month !== monthDate.getMonth() + 1 ||
                            submissionData.year !== monthDate.getFullYear()
                        ) {
                            addToast(
                                `Données pour ${monthName} enregistrées avec succès.`,
                                "info"
                            );
                        }
                        checkCompletion();
                    },
                    onError: (errors) => {
                        addToast(
                            `Erreur lors de l'enregistrement pour ${monthName}.`,
                            "error"
                        );
                        console.error("Submission errors:", errors);
                        checkCompletion();
                    },
                });
            });
        } else {
            setIsLoading(false);
            addToast("Aucune donnée valide à enregistrer.", "warning");
        }
    };

    return (
        <div className="p-4 sm:p-6">
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
                            value={`${monthDate.getFullYear()}-${String(
                                monthDate.getMonth() + 1
                            ).padStart(2, "0")}`}
                            onChange={handleMonthChange}
                            className="block w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <form onSubmit={handleSubmit}>
                    {isLoading && (
                        <div className="p-4 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            <p className="mt-2 text-gray-600">
                                Chargement en cours...
                            </p>
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
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-50 transition-colors duration-150"
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
                                                    type="date"
                                                    value={row.date || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            row.id,
                                                            "date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150 ${
                                                        isDateOutOfSelectedMonth(
                                                            row.date
                                                        )
                                                            ? "border-yellow-400 bg-yellow-50"
                                                            : ""
                                                    }`}
                                                    required
                                                    disabled={isLoading}
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
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                required
                                                disabled={true}
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
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                required
                                                disabled={isLoading}
                                                autoComplete="off"
                                                onFocus={() =>
                                                    setActiveDropdown(row.id)
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
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            row.id,
                                                            "unite",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                    required
                                                    disabled={isLoading}
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
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-150"
                                                min="0"
                                                step="0.01"
                                                required
                                                disabled={isLoading}
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
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeRow(row.id)
                                                }
                                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                disabled={
                                                    isLoading ||
                                                    rows.length <= 1
                                                }
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
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
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}
