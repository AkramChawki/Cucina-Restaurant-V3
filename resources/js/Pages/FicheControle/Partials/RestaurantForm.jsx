import { Link, useForm, usePage } from "@inertiajs/react";
import React from "react";

export default function RestaurantForm() {
    const { auth } = usePage().props;
    const queryParameters = new URLSearchParams(window.location.search);
    const restau = queryParameters.get("restau");

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name,
        date: "",
        restau: restau,
        type: "restaurant",
        salle: {
            table: false,
            chaise: false,
            deobacte: false,
            torchon: false,
            serveur: false,
            balai_de_salle: false,
        },
        poste_pizza: {
            distributeur_essui_main: false,
            distributeur_savon: false,
            deobacte: false,
            torchon: false,
            poste: "",
        },
        toilette: {
            distributeur_papier_hygiene: false,
            distributeur_savon: false,
        },
        cuisine: {
            torchons: false,
            deobact: false,
            supervix: false,
            nectal: false,
            mister_glass: false,
            vita_bac: false,
            javel: false,
            sani: false,
            vita_hand: false,
            drax: false,
            distributeur_essui_main: false,
            distributeur_savon: false,
            poste: "",
        },
        lavabo_clients: {
            distributeur_papier: false,
            distributeur_savon: false,
        },
        support_mural_salle: {
            raclette: false,
            balai_douce: false,
            balai_dure: false,
        },
        support_mural_cuisine: {
            raclette: false,
            balai_douce: false,
            balai_dure: false,
        },
    });

    function submit(e) {
        e.preventDefault();
        post("/fiche-controle/form", {
            preserveState: true,
            preserveScroll: true,
        });
    }

    // Helper function to create section
    const createSection = (title, fields, path) => (
        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                <div className="mt-1 sm:mt-0 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Object.entries(fields).map(([key, value]) => (
                        typeof value === 'boolean' ? (
                            <div key={key} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`${path}.${key}`}
                                    checked={value}
                                    onChange={(e) => {
                                        const newData = { ...data };
                                        _.set(newData, `${path}.${key}`, e.target.checked);
                                        setData(newData);
                                    }}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`${path}.${key}`} className="ml-2 block text-sm text-gray-700">
                                    {key.replace(/_/g, ' ').toUpperCase()}
                                </label>
                            </div>
                        ) : (
                            <div key={key} className="sm:col-span-2">
                                <label htmlFor={`${path}.${key}`} className="block text-sm font-medium text-gray-700">
                                    {key.replace(/_/g, ' ').toUpperCase()}
                                </label>
                                <input
                                    type="text"
                                    id={`${path}.${key}`}
                                    value={value}
                                    onChange={(e) => {
                                        const newData = { ...data };
                                        _.set(newData, `${path}.${key}`, e.target.value);
                                        setData(newData);
                                    }}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-10 py-10">
            <form className="space-y-8 divide-y divide-gray-200" onSubmit={submit}>
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                FICHE DE CONTROLE RESTAURANT
                            </h3>
                        </div>

                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Date
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="date"
                                        name="date"
                                        id="date"
                                        value={data.date}
                                        onChange={(e) => setData("date", e.target.value)}
                                        className="max-w-lg block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        {createSection('SALLE', data.salle, 'salle')}
                        {createSection('POSTE PIZZA', data.poste_pizza, 'poste_pizza')}
                        {createSection('TOILETTE', data.toilette, 'toilette')}
                        {createSection('CUISINE', data.cuisine, 'cuisine')}
                        {createSection('LAVABO CLIENTS', data.lavabo_clients, 'lavabo_clients')}
                        {createSection('SUPPORT MURAL SALLE', data.support_mural_salle, 'support_mural_salle')}
                        {createSection('SUPPORT MURAL CUISINE', data.support_mural_cuisine, 'support_mural_cuisine')}
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <Link
                            href="/"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}