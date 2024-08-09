import React from "react";

export default function Livraison({ livraisons }) {
    const groupedLivraisons = livraisons.reduce((acc, livraison) => {
        const date = livraison.created_at.split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(livraison);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {Object.entries(groupedLivraisons).map(([date, dateLivraisons]) => (
                    <div key={date} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{date}</h2>
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
                                        {dateLivraisons.map((livraison) => (
                                            <tr key={livraison.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {livraison.type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {livraison.created_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <a href={livraison.pdf_url}>PDF</a>
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
    );
}