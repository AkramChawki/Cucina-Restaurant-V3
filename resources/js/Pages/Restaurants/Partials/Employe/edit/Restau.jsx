import React, { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Restau({ restaurants }) {
    const [restaurant, setRestaurant] = useState("");

    const handleChange = (event) => {
        setRestaurant(event.target.value);
    };

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex h-screen">
            <div className="m-auto w-[90%] relative   ">
                <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-[#73ac70] focus-within:border-[#73ac70]">
                    <label
                        htmlFor="restaurant"
                        className="px-1 bg-white text-xs font-medium text-gray-900"
                    >
                        Choisissez le restaurant
                    </label>
                    <select 
                        value={restaurant} 
                        onChange={handleChange} 
                        id="restaurant" 
                        name="restaurant" 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#90D88C] focus:border-[#90D88C] sm:text-sm rounded-md"
                    >
                        <option value="">Selectionner le restaurant ...</option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.slug}>{restaurant.name}</option>
                        ))}
                    </select>
                </div>
                {restaurant !== "" && (
                    <>
                        <Link
                            href={`/edit-employe?restau=${encodeURIComponent(restaurant)}`}
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