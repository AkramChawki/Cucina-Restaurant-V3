import React, { useState, useMemo } from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function BMLRestauSelect({ restaurants }) {
    const { auth } = usePage().props;
    const [selectedRestau, setSelectedRestau] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const userRestaurants = useMemo(() => {
        if (!auth.user.restau) {
            return [];
        }

        if (!Array.isArray(auth.user.restau)) {
            try {
                const parsedRestau = JSON.parse(auth.user.restau);
                if (Array.isArray(parsedRestau)) {
                    auth.user.restau = parsedRestau;
                }
            } catch (e) {
                return [];
            }
        }

        const filtered = restaurants.filter((restaurant) => {
            const restaurantName = restaurant.name.toLowerCase();
            return auth.user.restau.some((location) => {
                const locationMatch = restaurantName.includes(
                    location.toLowerCase()
                );
                return locationMatch;
            });
        });

        return filtered;
    }, [restaurants, auth.user.restau]);

    // Modified handleContinue function to use router.visit with query params
    const handleContinue = (e) => {
        if (selectedRestau) {
            e.preventDefault(); // Prevent the default Link behavior
            setIsLoading(true);
            
            // Get current date for default month/year
            const now = new Date();
            const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
            const currentYear = now.getFullYear();
            
            // Use Inertia router to navigate with query parameters
            router.visit(`/bml/${selectedRestau}`, {
                data: {
                    month: currentMonth,
                    year: currentYear,
                    type: "" // Empty string for "tous les types"
                },
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                }
            });
        }
    };

    if (!userRestaurants.length) {
        return (
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex h-screen">
                <div className="m-auto w-[90%] relative">
                    <p className="text-red-500">Restaurant non trouvé</p>
                    <Link
                        href="/"
                        className="inline-flex w-full mt-2 text-left items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]"
                    >
                        Retour
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex h-screen">
            <div className="m-auto w-[90%] max-w-md relative">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestion BML</h2>
                    
                    <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-[#73ac70] focus-within:border-[#73ac70] mb-4">
                        <label
                            htmlFor="restaurant"
                            className="px-1 bg-white text-xs font-medium text-gray-900"
                        >
                            Sélectionner le restaurant
                        </label>
                        <select 
                            value={selectedRestau} 
                            onChange={(e) => setSelectedRestau(e.target.value)} 
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                            disabled={isLoading}
                        >
                            <option value="">Choisir un restaurant...</option>
                            {userRestaurants.map((restaurant) => (
                                <option key={restaurant.id} value={restaurant.slug}>
                                    {restaurant.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="space-y-3">
                        <Link
                            href={selectedRestau ? `/bml/${encodeURIComponent(selectedRestau)}` : '#'}
                            className={`inline-flex w-full items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                                selectedRestau 
                                    ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' 
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            onClick={handleContinue}
                            disabled={!selectedRestau || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Chargement...
                                </>
                            ) : (
                                'Continuer'
                            )}
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex w-full items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={isLoading}
                        >
                            Annuler
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}