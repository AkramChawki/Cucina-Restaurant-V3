import { Link, useForm, usePage } from "@inertiajs/react";
import React from "react";
import _ from 'lodash';

export default function PatrimoineForm() {
    const { auth } = usePage().props;
    const queryParameters = new URLSearchParams(window.location.search);
    const restau = queryParameters.get("restau");

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name,
        date: "",
        restau: restau,
        type: "patrimoine",
        eclairage: {
            logo_eclaire: { etat: false, commentaire: "" },
            drapeau_eclaire: { etat: false, commentaire: "" },
            lampes_salle: { etat: false, commentaire: "" },
            eclairage_wc: { etat: false, commentaire: "" },
            eclairage_pizzeria: { etat: false, commentaire: "" },
            eclairage_cuisine: { etat: false, commentaire: "" }
        },
        equipements: {
            climatisation: { etat: false, commentaire: "" },
            tue_mouche: { etat: false, commentaire: "" },
            prises_electriques: { etat: false, commentaire: "" },
            refregirateur_boissons: { etat: false, commentaire: "" }
        },
        pizzeria: {
            comptoir_pizzeria: { etat: false, commentaire: "" },
            lave_main_pizzeria: { etat: false, commentaire: "" }
        },
        salle: {
            chaises_etat: { etat: false, commentaire: "" },
            lavabo_robinet: { etat: false, commentaire: "" },
            wc_fonctionnel: { etat: false, commentaire: "" },
            carrelage_four: { etat: false, commentaire: "" },
            carrelage_salle: { etat: false, commentaire: "" },
            escalier_etat: { etat: false, commentaire: "" },
            peinture_salle: { etat: false, commentaire: "" },
            plafond_etat: { etat: false, commentaire: "" }
        },
        cuisine: {
            comptoir_cuisine: { etat: false, commentaire: "" },
            lave_main_cuisine: { etat: false, commentaire: "" },
            plonge_cuisine: { etat: false, commentaire: "" },
            chauffe_eau_plonge: { etat: false, commentaire: "" },
            hotte_cuisine: { etat: false, commentaire: "" },
            installation_gaz: { etat: false, commentaire: "" },
            friteuse_salamander: { etat: false, commentaire: "" },
            armoires_cuisines: { etat: false, commentaire: "" },
            congelateurs_cuisine: { etat: false, commentaire: "" }
        }
    });

    function submit(e) {
        e.preventDefault();
        post("/fiche-controle/form", {
            preserveState: true,
            preserveScroll: true
        });
    }

    // Helper function to create Oui/Non field with comment
    const createOuiNonField = (label, path) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm text-gray-700">
                    {label}
                </label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            checked={_.get(data, `${path}.etat`) === true}
                            onChange={() => {
                                const newData = { ...data };
                                _.set(newData, `${path}.etat`, true);
                                setData(newData);
                            }}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <label className="ml-2 text-sm text-gray-700">Oui</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            checked={_.get(data, `${path}.etat`) === false}
                            onChange={() => {
                                const newData = { ...data };
                                _.set(newData, `${path}.etat`, false);
                                setData(newData);
                            }}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label className="ml-2 text-sm text-gray-700">Non</label>
                    </div>
                </div>
            </div>
            <input
                type="text"
                placeholder="Commentaire"
                value={_.get(data, `${path}.commentaire`)}
                onChange={(e) => {
                    const newData = { ...data };
                    _.set(newData, `${path}.commentaire`, e.target.value);
                    setData(newData);
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
        </div>
    );

    // Helper function to create a section
    const createSection = (title, fields) => (
        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{title}</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    {Object.entries(fields).map(([key, label]) => (
                        <div key={key} className="sm:col-span-1">
                            {createOuiNonField(label, key)}
                        </div>
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
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            FICHE DE CONTROLE PATRIMOINE
                        </h3>

                        {/* Date Input */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Date
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData("date", e.target.value)}
                                        className="max-w-lg block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        {createSection("Éclairage", {
                            "eclairage.logo_eclaire": "Logo Éclairé",
                            "eclairage.drapeau_eclaire": "Drapeau Éclairé",
                            "eclairage.lampes_salle": "Lampes Salle",
                            "eclairage.eclairage_wc": "Éclairage WC",
                            "eclairage.eclairage_pizzeria": "Éclairage Pizzeria",
                            "eclairage.eclairage_cuisine": "Éclairage Cuisine"
                        })}

                        {createSection("Équipements", {
                            "equipements.climatisation": "Climatisation Fonctionnelle",
                            "equipements.tue_mouche": "Tue Mouche Fonctionnelle",
                            "equipements.prises_electriques": "Prises Électriques Fonctionnelle",
                            "equipements.refregirateur_boissons": "Réfrigérateur Boissons Fonctionnel"
                        })}

                        {createSection("Pizzeria", {
                            "pizzeria.comptoir_pizzeria": "Comptoir Pizzeria Fonctionnelle",
                            "pizzeria.lave_main_pizzeria": "Lave Main Pizzeria Fonctionnelle"
                        })}

                        {createSection("Salle", {
                            "salle.chaises_etat": "Chaises en Bon État",
                            "salle.lavabo_robinet": "Lavabo et Robinet Fonctionnel",
                            "salle.wc_fonctionnel": "WC Fonctionnel",
                            "salle.carrelage_four": "Carrelage Four en Bon État",
                            "salle.carrelage_salle": "Carrelage Salle",
                            "salle.escalier_etat": "Escalier en Bon État",
                            "salle.peinture_salle": "Peinture Salle",
                            "salle.plafond_etat": "Plafon en Bon État"
                        })}

                        {createSection("Cuisine", {
                            "cuisine.comptoir_cuisine": "Comptoir + Cuisine",
                            "cuisine.lave_main_cuisine": "Lave Main Cuisine Fonctionnelle",
                            "cuisine.plonge_cuisine": "Plonge Cuisine Fonctionnelle",
                            "cuisine.chauffe_eau_plonge": "Chauffe Eau Plonge Fonctionnel",
                            "cuisine.hotte_cuisine": "Hotte Cuisine Fonctionnelle",
                            "cuisine.installation_gaz": "Installation Gaz (4 Feux et Bain Marie)",
                            "cuisine.friteuse_salamander": "Fonctionnement Friteuse et Salamander",
                            "cuisine.armoires_cuisines": "Armoires + Cuisines",
                            "cuisine.congelateurs_cuisine": "Congélateurs Cuisine"
                        })}

                        {/* Submit Buttons */}
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
                                    disabled={processing}
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}