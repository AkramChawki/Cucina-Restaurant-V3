import { Link, useForm, usePage } from "@inertiajs/react";
import React from "react";
import _ from 'lodash';

export default function HygieneForm() {
    const { auth } = usePage().props;
    const queryParameters = new URLSearchParams(window.location.search);
    const restau = queryParameters.get("restau");

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name,
        date: "",
        restau: restau,
        type: "hygiene",
        economat: {
            economat_salle_ferme: { etat: "non", commentaire: "" },
            economat_chimique_ferme: { etat: "non", commentaire: "" },
            economat_food_ferme: { etat: "non", commentaire: "" }
        },
        rangements: {
            rangement_economat_chimique: { value: "", commentaire: "" },
            rangement_economat_salle: { value: "", commentaire: "" },
            rangement_economat_food: { value: "", commentaire: "" }
        },
        salle: {
            torchon_salle: { etat: "non", commentaire: "" },
            deobact_salle: { etat: "non", commentaire: "" },
            balai_salle: { etat: "non", commentaire: "" },
            port_tenue_responsable: { etat: "non", commentaire: "" },
            port_tenue_serveur: { etat: "non", commentaire: "" },
            box_livreurs: { etat: "non", commentaire: "" },
            poubelle_salle: { etat: "non", commentaire: "" }
        },
        salle_evaluations: {
            proprete_table: { value: "", commentaire: "" },
            proprete_chaise: { value: "", commentaire: "" },
            proprete_tenue_responsable: { value: "", commentaire: "" },
            proprete_tenue_serveur: { value: "", commentaire: "" },
            proprete_bouteilles_huile: { value: "", commentaire: "" },
            proprete_poubelle_salle: { value: "", commentaire: "" },
            proprete_torchon: { value: "", commentaire: "" }
        },
        pizzeria: {
            port_tenue_pizzaiolo: { etat: "non", commentaire: "" },
            distributeur_essui_main: { etat: "non", commentaire: "" },
            distributeur_savon: { etat: "non", commentaire: "" },
            deobact: { etat: "non", commentaire: "" },
            torchon: { etat: "non", commentaire: "" },
            poubelle: { etat: "non", commentaire: "" }
        },
        poste_pizza: {
            proprete_comptoir: { value: "", commentaire: "" },
            proprete_tenues: { value: "", commentaire: "" },
            proprete_ustensiles: { value: "", commentaire: "" },
            proprete_poubelle: { value: "", commentaire: "" },
            proprete_torchon: { value: "", commentaire: "" }
        },
        wc_client: {
            distributeur_savon: { etat: "non", commentaire: "" },
            papier_hygienique: { etat: "non", commentaire: "" },
            papier_essui_main: { etat: "non", commentaire: "" },
            poubelle: { etat: "non", commentaire: "" },
            evaluations: {
                proprete_sol: { value: "", commentaire: "" },
                proprete_sanitaire: { value: "", commentaire: "" },
                proprete_miroir: { value: "", commentaire: "" },
                proprete_poubelle: { value: "", commentaire: "" }
            }
        },
        cuisine: {
            port_tenue: { etat: "non", commentaire: "" },
            deobact: { etat: "non", commentaire: "" },
            supervix: { etat: "non", commentaire: "" },
            nectal: { etat: "non", commentaire: "" },
            mister_glass: { etat: "non", commentaire: "" },
            vita_bac: { etat: "non", commentaire: "" },
            javel: { etat: "non", commentaire: "" },
            sani: { etat: "non", commentaire: "" },
            vita_hand: { etat: "non", commentaire: "" },
            drax: { etat: "non", commentaire: "" },
            distributeur_essui_main: { etat: "non", commentaire: "" },
            distributeur_savon: { etat: "non", commentaire: "" },
            torchon: { etat: "non", commentaire: "" },
            poubelle: { etat: "non", commentaire: "" },
            evaluations: {
                proprete_comptoir_chaud: { value: "", commentaire: "" },
                proprete_comptoir_froid: { value: "", commentaire: "" },
                proprete_armoires: { value: "", commentaire: "" },
                proprete_congelateurs: { value: "", commentaire: "" },
                proprete_piano: { value: "", commentaire: "" },
                proprete_salamander: { value: "", commentaire: "" },
                proprete_micro_onde: { value: "", commentaire: "" },
                proprete_tenues: { value: "", commentaire: "" },
                proprete_torchon: { value: "", commentaire: "" }
            }
        },
        vestiaire: {
            vestiaire_personnel: { etat: "non", commentaire: "" },
            wc_personnel: { etat: "non", commentaire: "" },
            casiers: { etat: "non", commentaire: "" },
            douche: { etat: "non", commentaire: "" },
            papier_hygienique: { etat: "non", commentaire: "" },
            distributeur_savon: { etat: "non", commentaire: "" },
            poubelle: { etat: "non", commentaire: "" }
        },
        facade_terrasse: {
            proprete_enseigne: { value: "", commentaire: "" },
            proprete_vitres: { value: "", commentaire: "" },
            proprete_jardiniere: { value: "", commentaire: "" },
            proprete_sol_terrasse: { value: "", commentaire: "" },
            proprete_tapis_sol: { value: "", commentaire: "" }
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
                            id={`${path}-oui`}
                            checked={_.get(data, `${path}.etat`) === "oui"}
                            onChange={() => {
                                const newData = { ...data };
                                _.set(newData, `${path}.etat`, "oui");
                                setData(newData);
                            }}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <label htmlFor={`${path}-oui`} className="ml-2 text-sm text-gray-700">Oui</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id={`${path}-non`}
                            checked={_.get(data, `${path}.etat`) === "non"}
                            onChange={() => {
                                const newData = { ...data };
                                _.set(newData, `${path}.etat`, "non");
                                setData(newData);
                            }}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor={`${path}-non`} className="ml-2 text-sm text-gray-700">Non</label>
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

    // Helper function to create evaluation field (Bien/Moyen/Mediocre/Neant)
    const createEvaluationField = (label, path) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm text-gray-700">
                    {label}
                </label>
                <select
                    value={_.get(data, `${path}.value`)}
                    onChange={(e) => {
                        const newData = { ...data };
                        _.set(newData, `${path}.value`, e.target.value);
                        setData(newData);
                    }}
                    className="w-40 pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                    <option value="">Sélectionner...</option>
                    <option value="bien">Bien</option>
                    <option value="moyen">Moyen</option>
                    <option value="mediocre">Mediocre</option>
                    <option value="neant">Néant</option>
                </select>
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

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-10 py-10">
            <form className="space-y-8 divide-y divide-gray-200" onSubmit={submit}>
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            FICHE DE CONTROLE HYGIENE
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

                        {/* Economat Section */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Economat</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createOuiNonField("Economat Salle Fermé", "economat.economat_salle_ferme")}
                                    {createOuiNonField("Economat Chimique Fermé", "economat.economat_chimique_ferme")}
                                    {createOuiNonField("Economat Food Fermé", "economat.economat_food_ferme")}
                                </div>
                            </div>
                        </div>

                        {/* Rangements des Economats */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Rangements des Economats</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createEvaluationField("Rangement Economat Chimique", "rangements.rangement_economat_chimique")}
                                    {createEvaluationField("Rangement Economat Salle", "rangements.rangement_economat_salle")}
                                    {createEvaluationField("Rangement Economat Food", "rangements.rangement_economat_food")}
                                </div>
                            </div>
                        </div>

                        {/* Salle Section */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Salle</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createOuiNonField("Torchon Salle", "salle.torchon_salle")}
                                    {createOuiNonField("Déobact Salle", "salle.deobact_salle")}
                                    {createOuiNonField("Balai Salle", "salle.balai_salle")}
                                    {createOuiNonField("Port Tenue Responsable", "salle.port_tenue_responsable")}
                                    {createOuiNonField("Port Tenue Serveur", "salle.port_tenue_serveur")}
                                    {createOuiNonField("Box Livreurs", "salle.box_livreurs")}
                                    {createOuiNonField("Poubelle Salle", "salle.poubelle_salle")}
                                </div>
                            </div>
                        </div>

                        {/* Evaluations Salle */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Evaluations Salle</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createEvaluationField("Propreté Table", "salle_evaluations.proprete_table")}
                                    {createEvaluationField("Propreté Chaise", "salle_evaluations.proprete_chaise")}
                                    {createEvaluationField("Propreté Tenue Responsable", "salle_evaluations.proprete_tenue_responsable")}
                                    {createEvaluationField("Propreté Tenue Serveur", "salle_evaluations.proprete_tenue_serveur")}
                                    {createEvaluationField("Propreté Bouteilles Huile", "salle_evaluations.proprete_bouteilles_huile")}
                                    {createEvaluationField("Propreté Poubelle Salle", "salle_evaluations.proprete_poubelle_salle")}
                                    {createEvaluationField("Propreté Torchon", "salle_evaluations.proprete_torchon")}
                                </div>
                            </div>
                        </div>

                        {/* Pizzeria Section */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Pizzeria</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createOuiNonField("Port Tenue Pizzaiolo", "pizzeria.port_tenue_pizzaiolo")}
                                    {createOuiNonField("Distributeur Essui Main", "pizzeria.distributeur_essui_main")}
                                    {createOuiNonField("Distributeur Savon", "pizzeria.distributeur_savon")}
                                    {createOuiNonField("Déobact", "pizzeria.deobact")}
                                    {createOuiNonField("Torchon", "pizzeria.torchon")}
                                    {createOuiNonField("Poubelle", "pizzeria.poubelle")}
                                </div>
                            </div>
                        </div>

                        {/* Poste Pizza Evaluations */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Poste Pizza</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createEvaluationField("Propreté Comptoir", "poste_pizza.proprete_comptoir")}
                                    {createEvaluationField("Propreté Tenues", "poste_pizza.proprete_tenues")}
                                    {createEvaluationField("Propreté Ustensiles", "poste_pizza.proprete_ustensiles")}
                                    {createEvaluationField("Propreté Poubelle", "poste_pizza.proprete_poubelle")}
                                    {createEvaluationField("Propreté Torchon", "poste_pizza.proprete_torchon")}
                                </div>
                            </div>
                        </div>

                        {/* WC Client Section */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">WC Client</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createOuiNonField("Distributeur Savon", "wc_client.distributeur_savon")}
                                    {createOuiNonField("Papier Hygiénique", "wc_client.papier_hygienique")}
                                    {createOuiNonField("Papier Essui Main", "wc_client.papier_essui_main")}
                                    {createOuiNonField("Poubelle", "wc_client.poubelle")}
                                </div>
                            </div>
                        </div>

                        {/* WC Client Evaluations */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Evaluations WC Client</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createEvaluationField("Propreté Sol", "wc_client.evaluations.proprete_sol")}
                                    {createEvaluationField("Propreté Sanitaire", "wc_client.evaluations.proprete_sanitaire")}
                                    {createEvaluationField("Propreté Miroir", "wc_client.evaluations.proprete_miroir")}
                                    {createEvaluationField("Propreté Poubelle", "wc_client.evaluations.proprete_poubelle")}
                                </div>
                            </div>
                        </div>

                        {/* Cuisine Section */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Cuisine</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createOuiNonField("Port Tenue", "cuisine.port_tenue")}
                                    {createOuiNonField("Déobact", "cuisine.deobact")}
                                    {createOuiNonField("Supervix", "cuisine.supervix")}
                                    {createOuiNonField("Nectal", "cuisine.nectal")}
                                    {createOuiNonField("Mister Glass", "cuisine.mister_glass")}
                                    {createOuiNonField("Vita Bac", "cuisine.vita_bac")}
                                    {createOuiNonField("Javel", "cuisine.javel")}
                                    {createOuiNonField("Sani", "cuisine.sani")}
                                    {createOuiNonField("Vita Hand", "cuisine.vita_hand")}
                                    {createOuiNonField("Drax", "cuisine.drax")}
                                    {createOuiNonField("Distributeur Essui Main", "cuisine.distributeur_essui_main")}
                                    {createOuiNonField("Distributeur Savon", "cuisine.distributeur_savon")}
                                    {createOuiNonField("Torchon", "cuisine.torchon")}
                                    {createOuiNonField("Poubelle", "cuisine.poubelle")}
                                </div>
                            </div>
                        </div>

                        {/* Cuisine Evaluations */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Evaluations Cuisine</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createEvaluationField("Propreté Comptoir Chaud", "cuisine.evaluations.proprete_comptoir_chaud")}
                                    {createEvaluationField("Propreté Comptoir Froid", "cuisine.evaluations.proprete_comptoir_froid")}
                                    {createEvaluationField("Propreté Armoires", "cuisine.evaluations.proprete_armoires")}
                                    {createEvaluationField("Propreté Congélateurs", "cuisine.evaluations.proprete_congelateurs")}
                                    {createEvaluationField("Propreté Piano", "cuisine.evaluations.proprete_piano")}
                                    {createEvaluationField("Propreté Salamander", "cuisine.evaluations.proprete_salamander")}
                                    {createEvaluationField("Propreté Micro Onde", "cuisine.evaluations.proprete_micro_onde")}
                                    {createEvaluationField("Propreté Tenues", "cuisine.evaluations.proprete_tenues")}
                                    {createEvaluationField("Propreté Torchon", "cuisine.evaluations.proprete_torchon")}
                                </div>
                            </div>
                        </div>

                        {/* Vestiaire Section */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Vestiaire</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createOuiNonField("Vestiaire Personnel", "vestiaire.vestiaire_personnel")}
                                    {createOuiNonField("WC Personnel", "vestiaire.wc_personnel")}
                                    {createOuiNonField("Casiers", "vestiaire.casiers")}
                                    {createOuiNonField("Douche", "vestiaire.douche")}
                                    {createOuiNonField("Papier Hygiénique", "vestiaire.papier_hygienique")}
                                    {createOuiNonField("Distributeur Savon", "vestiaire.distributeur_savon")}
                                    {createOuiNonField("Poubelle", "vestiaire.poubelle")}
                                </div>
                            </div>
                        </div>

                        {/* Facade et Terrasse Section */}
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Façade et Terrasse</h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {createEvaluationField("Propreté Enseigne", "facade_terrasse.proprete_enseigne")}
                                    {createEvaluationField("Propreté Vitres", "facade_terrasse.proprete_vitres")}
                                    {createEvaluationField("Propreté Jardinière", "facade_terrasse.proprete_jardiniere")}
                                    {createEvaluationField("Propreté Sol Terrasse", "facade_terrasse.proprete_sol_terrasse")}
                                    {createEvaluationField("Propreté Tapis Sol", "facade_terrasse.proprete_tapis_sol")}
                                </div>
                            </div>
                        </div>

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
