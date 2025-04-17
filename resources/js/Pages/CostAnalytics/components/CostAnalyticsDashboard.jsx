import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { RefreshCw } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

const CostAnalyticsDashboard = ({
    restaurants,
    selectedRestaurant,
    selectedMonth,
    selectedYear,
    foodCosts,
    consumableCosts,
    monthlySummary: initialMonthlySummary,
    chartData: initialChartData,
    currentDay,
    lastDay,
    daysInMonth
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [monthlySummary, setMonthlySummary] = useState(initialMonthlySummary);
    const [chartData, setChartData] = useState(initialChartData);
    const [lastRefreshed, setLastRefreshed] = useState(new Date());

    // Handle restaurant change
    const handleRestaurantChange = (e) => {
        setIsLoading(true);
        router.get(
            route("cost-analytics.index"),
            {
                restaurant_id: e.target.value,
                month: selectedMonth,
                year: selectedYear,
            },
            {
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Handle month change
    const handleMonthChange = (e) => {
        setIsLoading(true);
        router.get(
            route("cost-analytics.index"),
            {
                restaurant_id: selectedRestaurant,
                month: e.target.value,
                year: selectedYear,
            },
            {
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Handle year change
    const handleYearChange = (e) => {
        setIsLoading(true);
        router.get(
            route("cost-analytics.index"),
            {
                restaurant_id: selectedRestaurant,
                month: selectedMonth,
                year: e.target.value,
            },
            {
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const fetchSummaryData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `/cost-analytics/summary?restaurant_id=${selectedRestaurant}&month=${selectedMonth}&year=${selectedYear}&_=${Date.now()}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log("Refreshed summary data:", data);
                setMonthlySummary(data.monthlySummary);
                setLastRefreshed(new Date());
            }
        } catch (error) {
            console.error("Error fetching summary data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh full data
    const refreshFullData = () => {
        setIsLoading(true);
        router.reload({
            only: [
                "foodCosts",
                "consumableCosts",
                "monthlySummary",
                "chartData",
                "currentDay",
                "lastDay",
                "daysInMonth"
            ],
            preserveScroll: true,
            preserveState: false,
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    // Generate daily FC and CC data
    const handleGenerateDaily = async () => {
        setIsLoading(true);
        try {
            router.post(
                route("cost-analytics.generate-daily"),
                {},
                {
                    onSuccess: () => {
                        refreshFullData();
                    },
                    onFinish: () => setIsLoading(false),
                }
            );
        } catch (error) {
            console.error("Error generating daily data:", error);
            setIsLoading(false);
        }
    };

    // Set up auto-refresh
    useEffect(() => {
        // Refresh immediately on mount
        fetchSummaryData();

        // Set up refresh interval
        const refreshInterval = setInterval(fetchSummaryData, 15000); // Every 15 seconds

        // Handle visibility change (refresh when tab becomes visible)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchSummaryData();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Clean up
        return () => {
            clearInterval(refreshInterval);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [selectedRestaurant, selectedMonth, selectedYear]);

    // Format currency (MAD)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "MAD",
        }).format(value);
    };

    // Format percentage
    const formatPercentage = (value) => {
        if (value === null || value === undefined) {
            return "N/A";
        }
        return new Intl.NumberFormat("fr-FR", {
            style: "percent",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value / 100);
    };

    // Get month name
    const getMonthName = (month) => {
        const date = new Date();
        date.setMonth(month - 1);
        return date.toLocaleString("fr-FR", { month: "long" });
    };

    // Get selected restaurant name
    const getSelectedRestaurantName = () => {
        const restaurant = restaurants.find((r) => r.id == selectedRestaurant);
        return restaurant ? restaurant.name : "";
    };

    // Format date for tooltip
    const formatDate = (day) => {
        return new Date(
            selectedYear,
            selectedMonth - 1,
            day
        ).toLocaleDateString("fr-FR");
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (
            !active ||
            !payload ||
            !Array.isArray(payload) ||
            payload.length === 0
        ) {
            return null;
        }

        // Safely extract values with proper checks
        const safeGetValue = (item, defaultValue = 0) => {
            return item && item.value !== undefined ? item.value : defaultValue;
        };

        try {
            // Get values with fallbacks
            const fcAmount = safeGetValue(
                payload.find((p) => p.dataKey === "fc_amount")
            );
            const ccAmount = safeGetValue(
                payload.find((p) => p.dataKey === "cc_amount")
            );
            const fcPercentage =
                payload.find((p) => p.dataKey === "fc_percentage")?.value ??
                null;
            const ccPercentage =
                payload.find((p) => p.dataKey === "cc_percentage")?.value ??
                null;
            const revenue = safeGetValue(
                payload.find((p) => p.dataKey === "revenue")
            );

            return (
                <div className="bg-white p-4 border rounded shadow-lg">
                    <p className="font-bold">{formatDate(label)}</p>
                    <p className="text-sm">
                        <span className="text-blue-600">FC: </span>
                        {formatCurrency(fcAmount)}
                        {fcPercentage !== null
                            ? ` (${formatPercentage(fcPercentage)})`
                            : " (N/A)"}
                    </p>
                    <p className="text-sm">
                        <span className="text-green-600">CC: </span>
                        {formatCurrency(ccAmount)}
                        {ccPercentage !== null
                            ? ` (${formatPercentage(ccPercentage)})`
                            : " (N/A)"}
                    </p>
                    <p className="text-sm">
                        <span className="text-gray-600">CA: </span>
                        {formatCurrency(revenue)}
                    </p>
                    {revenue > 0 && (
                        <p className="text-sm font-medium pt-1 border-t mt-1">
                            <span className="text-purple-600">FC+CC: </span>
                            {formatPercentage(
                                ((fcAmount + ccAmount) / revenue) * 100
                            )}
                        </p>
                    )}
                </div>
            );
        } catch (error) {
            console.error("Error in CustomTooltip:", error);
            // Fallback simple tooltip
            return (
                <div className="bg-white p-4 border rounded shadow-lg">
                    <p className="font-bold">{formatDate(label)}</p>
                    <p className="text-sm">
                        There was an error displaying detailed data.
                    </p>
                </div>
            );
        }
    };

    // Determine what to show in the UI
    const displayDay = currentDay > 0 ? currentDay : (lastDay > 0 ? lastDay : daysInMonth);
    const chartDisplayTitle = currentDay > 0 
        ? `(Up to day ${currentDay})` 
        : (lastDay > 0 ? `(Up to day ${lastDay})` : '');

    // Filter chart data to only show up to the current day if we have a valid current day
    // Otherwise show all days in the month for historical data
    const validChartData = chartData || [];
    const filteredChartData = currentDay > 0 
        ? validChartData.filter(data => data.day <= currentDay && !data.is_future)
        : validChartData;

    // Make sure we have at least some data to display
    const hasChartData = filteredChartData && filteredChartData.length > 0;

    return (
        <>
            <Head title="Cost Analytics Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-6">
                                Food Cost & Consumable Cost Analytics
                            </h1>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <label
                                        htmlFor="restaurant"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Restaurant
                                    </label>
                                    <select
                                        id="restaurant"
                                        name="restaurant"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={selectedRestaurant}
                                        onChange={handleRestaurantChange}
                                        disabled={isLoading}
                                    >
                                        {restaurants.map((restaurant) => (
                                            <option
                                                key={restaurant.id}
                                                value={restaurant.id}
                                            >
                                                {restaurant.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="month"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Month
                                    </label>
                                    <select
                                        id="month"
                                        name="month"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                        disabled={isLoading}
                                    >
                                        {Array.from(
                                            { length: 12 },
                                            (_, i) => i + 1
                                        ).map((month) => (
                                            <option key={month} value={month}>
                                                {getMonthName(month)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="year"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Year
                                    </label>
                                    <select
                                        id="year"
                                        name="year"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={selectedYear}
                                        onChange={handleYearChange}
                                        disabled={isLoading}
                                    >
                                        {[2024, 2025].map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end gap-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={handleGenerateDaily}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Processing..." : "Generate Today's Data"}
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        onClick={refreshFullData}
                                        disabled={isLoading}
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Refresh All Data
                                    </button>
                                </div>
                            </div>

                            <div className="text-right text-xs text-gray-500 mb-2">
                                Last refreshed:{" "}
                                {lastRefreshed.toLocaleTimeString()}
                                {isLoading && <span className="ml-2 text-orange-500 animate-pulse">Refreshing...</span>}
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {/* FC Card */}
                                <div className="bg-blue-50 p-4 rounded-lg shadow">
                                    <h2 className="text-lg font-semibold text-blue-700">
                                        Food Cost (FC)
                                    </h2>
                                    <div className="mt-2 grid grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total
                                            </p>
                                            <p className="text-lg font-bold">
                                                {formatCurrency(
                                                    monthlySummary.fc.total
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Percentage
                                            </p>
                                            <p className="text-lg font-bold">
                                                {formatPercentage(
                                                    monthlySummary.fc.percentage
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CC Card */}
                                <div className="bg-green-50 p-4 rounded-lg shadow">
                                    <h2 className="text-lg font-semibold text-green-700">
                                        Consumable Cost (CC)
                                    </h2>
                                    <div className="mt-2 grid grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total
                                            </p>
                                            <p className="text-lg font-bold">
                                                {formatCurrency(
                                                    monthlySummary.cc.total
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Percentage
                                            </p>
                                            <p className="text-lg font-bold">
                                                {formatPercentage(
                                                    monthlySummary.cc.percentage
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Revenue Card */}
                                <div className="bg-purple-50 p-4 rounded-lg shadow">
                                    <h2 className="text-lg font-semibold text-purple-700">
                                        Revenue
                                    </h2>
                                    <div className="mt-2 grid grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total Revenue
                                            </p>
                                            <p className="text-lg font-medium">
                                                {formatCurrency(
                                                    monthlySummary.total_revenue
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Restaurant
                                            </p>
                                            <p className="text-lg font-medium truncate">
                                                {getSelectedRestaurantName()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Costs Chart */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Daily Costs {chartDisplayTitle}
                                </h2>
                                <div className="h-96 bg-white rounded-lg shadow p-4">
                                    {hasChartData ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={filteredChartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="day"
                                                    label={{
                                                        value: "Day",
                                                        position: "insideBottom",
                                                        offset: -5,
                                                    }}
                                                />
                                                <YAxis
                                                    yAxisId="left"
                                                    orientation="left"
                                                    label={{
                                                        value: "Amount (MAD)",
                                                        angle: -90,
                                                        position: "insideLeft",
                                                    }}
                                                />
                                                <YAxis
                                                    yAxisId="right"
                                                    orientation="right"
                                                    label={{
                                                        value: "Percentage (%)",
                                                        angle: 90,
                                                        position: "insideRight",
                                                    }}
                                                />
                                                <Tooltip
                                                    content={<CustomTooltip />}
                                                />
                                                <Legend />
                                                <Line
                                                    yAxisId="left"
                                                    type="monotone"
                                                    dataKey="fc_amount"
                                                    name="FC Amount"
                                                    stroke="#3b82f6"
                                                    activeDot={{ r: 8 }}
                                                />
                                                <Line
                                                    yAxisId="left"
                                                    type="monotone"
                                                    dataKey="cc_amount"
                                                    name="CC Amount"
                                                    stroke="#10b981"
                                                    activeDot={{ r: 8 }}
                                                />
                                                <Line
                                                    yAxisId="right"
                                                    type="monotone"
                                                    dataKey="fc_percentage"
                                                    name="FC %"
                                                    stroke="#1d4ed8"
                                                    strokeDasharray="5 5"
                                                    connectNulls={true}
                                                />
                                                <Line
                                                    yAxisId="right"
                                                    type="monotone"
                                                    dataKey="cc_percentage"
                                                    name="CC %"
                                                    stroke="#047857"
                                                    strokeDasharray="5 5"
                                                    connectNulls={true}
                                                />
                                                <Line
                                                    yAxisId="left"
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    name="Revenue"
                                                    stroke="#6b7280"
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-gray-500">No data available for this time period</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cumulative Charts */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Cumulative Monthly Data {chartDisplayTitle}
                                </h2>
                                <div className="h-96 bg-white rounded-lg shadow p-4">
                                    {hasChartData ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={filteredChartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="day"
                                                    label={{
                                                        value: "Day",
                                                        position: "insideBottom",
                                                        offset: -5,
                                                    }}
                                                />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="fc_cumul"
                                                    name="FC Cumulative"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="cc_cumul"
                                                    name="CC Cumulative"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="cumul_revenue"
                                                    name="Revenue Cumulative"
                                                    stroke="#6b7280"
                                                    strokeWidth={2}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-gray-500">No data available for this time period</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Updated Data Table based on Excel format */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">
                                    Daily Data {chartDisplayTitle}
                                </h2>
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Day
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        FC
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Cumul FC
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        CC
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Cumul CC
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Chiffre Affaire
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Cumul Chiffre Affaire
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Taux FC
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Taux CC
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {hasChartData ? (
                                                    filteredChartData.map(
                                                        (data, index) => (
                                                            <tr
                                                                key={index}
                                                                className={
                                                                    index % 2 === 0
                                                                        ? "bg-white"
                                                                        : "bg-gray-50"
                                                                }
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {formatDate(
                                                                        data.day
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {formatCurrency(
                                                                        data.fc_amount
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {formatCurrency(
                                                                        data.fc_cumul
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {formatCurrency(
                                                                        data.cc_amount
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {formatCurrency(
                                                                        data.cc_cumul
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {formatCurrency(
                                                                        data.revenue
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {formatCurrency(
                                                                        data.cumul_revenue
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {formatPercentage(
                                                                        data.fc_percentage
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {formatPercentage(
                                                                        data.cc_percentage
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            No data available for this time period
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CostAnalyticsDashboard;