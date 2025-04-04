import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
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
    monthlySummary,
    chartData,
}) => {
    const [isLoading, setIsLoading] = useState(false);

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

    // Generate daily FC and CC data
    const handleGenerateDaily = async () => {
        setIsLoading(true);
        try {
            router.post(
                route("cost-analytics.generate-daily"),
                {},
                {
                    onSuccess: () => {
                        router.reload();
                    },
                    onFinish: () => setIsLoading(false),
                }
            );
        } catch (error) {
            console.error("Error generating daily data:", error);
            setIsLoading(false);
        }
    };

    // Format currency (euro)
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
    // Replace the current CustomTooltip implementation with this more robust version
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
                            ? `(${formatPercentage(fcPercentage)})`
                            : "(N/A)"}
                    </p>
                    <p className="text-sm">
                        <span className="text-green-600">CC: </span>
                        {formatCurrency(ccAmount)}
                        {ccPercentage !== null
                            ? `(${formatPercentage(ccPercentage)})`
                            : "(N/A)"}
                    </p>
                    <p className="text-sm">
                        <span className="text-gray-600">CA: </span>
                        {formatCurrency(revenue)}
                    </p>
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

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={handleGenerateDaily}
                                        disabled={isLoading}
                                    >
                                        {isLoading
                                            ? "Processing..."
                                            : "Generate Today's Data"}
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {/* FC Card */}
                                <div className="bg-blue-50 p-4 rounded-lg shadow">
                                    <h2 className="text-lg font-semibold text-blue-700">
                                        Food Cost (FC)
                                    </h2>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total
                                            </p>
                                            <p className="text-xl font-bold">
                                                {formatCurrency(
                                                    monthlySummary.fc.total
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Average
                                            </p>
                                            <p className="text-xl font-bold">
                                                {formatPercentage(
                                                    monthlySummary.fc.average
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Highest
                                            </p>
                                            <p className="text-lg font-medium">
                                                {formatPercentage(
                                                    monthlySummary.fc.highest
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Lowest
                                            </p>
                                            <p className="text-lg font-medium">
                                                {formatPercentage(
                                                    monthlySummary.fc.lowest
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
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total
                                            </p>
                                            <p className="text-xl font-bold">
                                                {formatCurrency(
                                                    monthlySummary.cc.total
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Average
                                            </p>
                                            <p className="text-xl font-bold">
                                                {formatPercentage(
                                                    monthlySummary.cc.average
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Highest
                                            </p>
                                            <p className="text-lg font-medium">
                                                {formatPercentage(
                                                    monthlySummary.cc.highest
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Lowest
                                            </p>
                                            <p className="text-lg font-medium">
                                                {formatPercentage(
                                                    monthlySummary.cc.lowest
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Combined Card */}
                                <div className="bg-purple-50 p-4 rounded-lg shadow">
                                    <h2 className="text-lg font-semibold text-purple-700">
                                        Total (FC + CC)
                                    </h2>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total Costs
                                            </p>
                                            <p className="text-xl font-bold">
                                                {formatCurrency(
                                                    monthlySummary.combined
                                                        .total
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                % of Revenue
                                            </p>
                                            <p className="text-xl font-bold">
                                                {formatPercentage(
                                                    monthlySummary.combined
                                                        .percentage
                                                )}
                                            </p>
                                        </div>
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

                            {/* Charts */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Daily Costs
                                </h2>
                                <div className="h-96 bg-white rounded-lg shadow p-4">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={chartData}>
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
                                                    value: "Amount (€)",
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
                                                connectNulls={false} // Don't connect through null values
                                                isAnimationActive={false} // Disable animation for better stability with null values
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="cc_percentage"
                                                name="CC %"
                                                stroke="#047857"
                                                strokeDasharray="5 5"
                                                connectNulls={false} // Don't connect through null values
                                                isAnimationActive={false} // Disable animation for better stability with null values
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
                                </div>
                            </div>

                            {/* Cumulative Charts */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Cumulative Monthly Data
                                </h2>
                                <div className="h-96 bg-white rounded-lg shadow p-4">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={chartData}>
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
                                </div>
                            </div>

                            {/* Data Table */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">
                                    Daily Data
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
                                                        FC %
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
                                                        CC %
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Revenue
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        FC+CC %
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {chartData.map(
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
                                                                {formatPercentage(
                                                                    data.fc_percentage
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatCurrency(
                                                                    data.cc_amount
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatPercentage(
                                                                    data.cc_percentage
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatCurrency(
                                                                    data.revenue
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {data.revenue >
                                                                0
                                                                    ? formatPercentage(
                                                                          ((data.fc_amount +
                                                                              data.cc_amount) /
                                                                              data.revenue) *
                                                                              100
                                                                      )
                                                                    : "N/A"}
                                                            </td>
                                                        </tr>
                                                    )
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
