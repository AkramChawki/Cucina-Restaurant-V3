import React from "react";

export default function Livraison({ livraisons }) {
    const groupedLivraisons = livraisons.reduce((acc, livraison) => {
        const date = livraison.created_at.split("T")[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(livraison);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedLivraisons).sort((a, b) => new Date(b) - new Date(a));

    // Helper function to get restaurant names from data
    const getRestaurantNames = (data) => {
        if (!data || !Array.isArray(data)) return '';
        const restaurants = [...new Set(data.map(item => item.restau))];
        return restaurants.join(', ');
    };

    // Helper function to find matching livraison by type and group
    const findMatchingLivraison = (livraisons, type, isZiraoui) => {
        return livraisons.find(l => 
            l.type === type && 
            (isZiraoui ? l.restaurant_group === 'Ziraoui' : l.restaurant_group === 'Others')
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {sortedDates.map((date) => (
                    <div key={date} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {new Date(date).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
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
                                                Restaurant(s)
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
                                        {[...new Set(groupedLivraisons[date].map(l => l.type))].map(type => {
                                            const dateLivraisons = groupedLivraisons[date];
                                            const ziraouiLivraison = findMatchingLivraison(dateLivraisons, type, true);
                                            const othersLivraison = findMatchingLivraison(dateLivraisons, type, false);

                                            return (
                                                <tr key={`${date}-${type}`} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {type}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                                        <div className="space-y-1">
                                                            {othersLivraison && (
                                                                <div>{getRestaurantNames(othersLivraison.data)}</div>
                                                            )}
                                                            {ziraouiLivraison && (
                                                                <div className="font-medium text-gray-800">
                                                                    Cucina Napoli - Ziraoui
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(dateLivraisons[0].created_at).toLocaleString("fr-FR", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-y-2">
                                                        {othersLivraison && (
                                                            <a 
                                                                href={othersLivraison.pdf_url}
                                                                className="block text-green-600 hover:text-green-800 font-medium"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                Télécharger PDF Autres
                                                            </a>
                                                        )}
                                                        {ziraouiLivraison && (
                                                            <a 
                                                                href={ziraouiLivraison.pdf_url}
                                                                className="block text-blue-600 hover:text-blue-800 font-medium"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                Télécharger PDF Ziraoui
                                                            </a>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
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