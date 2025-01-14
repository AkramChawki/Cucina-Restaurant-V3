import { Link } from "@inertiajs/react";
import React from "react";
import { useState } from "react";

export default function Name() {

    const getInitialState = () => {
        const restaurant = "";
        return restaurant;
    };

    const [restaurant, setRestaurant] = useState(getInitialState);

    const handleChange = event => {
        setRestaurant(event.target.value);
    };
    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex h-screen">
            <div className="m-auto w-[90%] relative   ">
                <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-green-600 focus-within:border-green-600">
                    <label
                        htmlFor="name"
                        className="px-1 bg-white text-xs font-medium text-gray-900"
                    >
                        Choisissez le restaurant
                    </label>
                    <select value={restaurant} onChange={handleChange} id="restaurant" name="restaurant" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                        <option defaultValue={""}>Selectionner le restaurant ...</option>
                        <option value="Anoual">Anoual</option>
                        <option value="Palmier">Palmier</option>
                    </select>
                </div>
                {restaurant !== "" && (
                    <>
                        <Link
                            type="button"
                            as="button"
                            href="/cloture-caisse/ajouter"
                            method="get"
                            data={{ restau: restaurant }}
                            className="inline-flex w-full mt-8 text-left items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Suivant
                        </Link>
                        <Link
                            type="button"
                            as="button"
                            href="/"
                            className="inline-flex w-full mt-2 text-left items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Annuler
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
