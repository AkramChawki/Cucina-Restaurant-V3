import React, { useState } from 'react';
import { Link } from "@inertiajs/react";
import Footer from '@/Components/Footer';

export default function SelectRestaurant({ restaurants, action }) {
    const [restaurant, setRestaurant] = useState("");

    const handleChange = (event) => {
        setRestaurant(event.target.value);
    };

    const getTargetUrl = () => {
        if (action === "show") {
            return `/cloture-caisse/${restaurant}`;
        } else {
            return `/cloture-caisse/add?restau=${restaurant}`;
        }
    };

    const actionText = action === "show" ? "Consulter" : "Ajouter";

    return (
        <>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex min-h-screen">
                <div className="m-auto w-[90%] max-w-md relative">
                    <div className="bg-white shadow-md rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            {action === "show" ? "Consulter les Clôtures de Caisse" : "Ajouter une Clôture de Caisse"}
                        </h2>
                        
                        <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-[#73ac70] focus-within:border-[#73ac70] mb-6">
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
                                    <option key={restaurant.id} value={restaurant.name}>
                                        {restaurant.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {restaurant && (
                            <div className="space-y-4">
                                <a
                                    href={getTargetUrl()}
                                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]"
                                >
                                    {actionText}
                                </a>
                                <Link
                                    href="/cloture-caisse"
                                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                >
                                    Retour
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}