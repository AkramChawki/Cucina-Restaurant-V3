import React, { useState, useMemo } from "react";
import { Link } from "@inertiajs/react";

export default function Name({ restaurants, auth }) {
    const [restaurant, setRestaurant] = useState("");

    console.log('Auth User Restau:', auth.user.restau); // Debug auth user restau
    console.log('Available Restaurants:', restaurants); // Debug available restaurants

    const userRestaurants = useMemo(() => {
        // Debug checks
        if (!auth.user.restau) {
            console.log('No restau field in auth.user');
            return [];
        }

        if (!Array.isArray(auth.user.restau)) {
            console.log('Restau is not an array:', typeof auth.user.restau);
            // If it's a string, try to parse it
            try {
                const parsedRestau = JSON.parse(auth.user.restau);
                if (Array.isArray(parsedRestau)) {
                    console.log('Successfully parsed restau:', parsedRestau);
                    auth.user.restau = parsedRestau;
                }
            } catch (e) {
                console.log('Failed to parse restau:', e);
                return [];
            }
        }

        const filtered = restaurants.filter(restaurant => {
            const restaurantName = restaurant.name.toLowerCase();
            return auth.user.restau.some(location => {
                const locationMatch = restaurantName.includes(location.toLowerCase());
                console.log(`Checking ${restaurantName} against ${location}: ${locationMatch}`);
                return locationMatch;
            });
        });

        console.log('Filtered Restaurants:', filtered);
        return filtered;
    }, [restaurants, auth.user.restau]);

    const handleChange = (event) => {
        setRestaurant(event.target.value);
    };

    // Rest of your component remains the same...
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
            <div className="m-auto w-[90%] relative">
                <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-[#73ac70] focus-within:border-[#73ac70]">
                    <label
                        htmlFor="restaurant"
                        className="px-1 bg-white text-xs font-medium text-gray-900"
                    >
                        Votre restaurant
                    </label>
                    <select 
                        value={restaurant} 
                        onChange={handleChange} 
                        id="restaurant" 
                        name="restaurant" 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#90D88C] focus:border-[#90D88C] sm:text-sm rounded-md"
                    >
                        <option value="">Selectionner le restaurant ...</option>
                        {userRestaurants.map((rest) => (
                            <option key={rest.id} value={rest.name}>
                                {rest.name}
                            </option>
                        ))}
                    </select>
                </div>
                {restaurant !== "" && (
                    <>
                        <Link
                            href={`/restaurant?restau=${encodeURIComponent(restaurant)}`}
                            className="inline-flex w-full mt-8 text-left items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]"
                        >
                            Suivant
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex w-full mt-2 text-left items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]"
                        >
                            Annuler
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}