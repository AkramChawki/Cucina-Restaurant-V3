import React, { useState } from "react";
import { Link } from "@inertiajs/react";

export default function CostCuisineRestauSelect({ restaurants }) {
    const [selectedRestau, setSelectedRestau] = useState("");

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex h-screen">
            <div className="m-auto w-[90%] relative">
                <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-[#73ac70] focus-within:border-[#73ac70]">
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
                    >
                        <option value="">Choisir un restaurant...</option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.slug}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                {selectedRestau && (
                    <div className="mt-4 space-y-2">
                        <Link
                            href={`/cost-cuisine/${encodeURIComponent(selectedRestau)}`}
                            className="inline-flex w-full items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Continuer
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex w-full items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Annuler
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}