import React from 'react'

export default function Boisson({ boissons }) {
    const groupedBoissons = boissons.reduce((acc, boisson) => {
        const date = boisson.created_at.split("T")[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(boisson);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedBoissons).sort((a, b) => new Date(b) - new Date(a));
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {sortedDates.map((date) => (
                    <div key={date} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {date}
                        </h2>
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pour
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                PDF
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {groupedBoissons[date]
                                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                            .map((boisson) => (
                                                <tr key={boisson.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {boisson.type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(boisson.created_at).toLocaleString("en-US", {
                                                            year: "numeric",
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            second: "2-digit",
                                                            hour12: false,
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <a href={boisson.pdf_url}>
                                                            PDF
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
