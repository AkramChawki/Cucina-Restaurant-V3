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
        moyens: {
            economat: {
                economat_salle_ferme: { etat: "non", commentaire: "" },
                economat_chimique_ferme: { etat: "non", commentaire: "" },
                economat_food_ferme: { etat: "non", commentaire: "" }
            },
            salle: {
                torchon_salle: { etat: "non", commentaire: "" },
                deobact_salle: { etat: "non", commentaire: "" },
                balai_salle: { etat: "non", commentaire: "" },
                port_tenue_responsable: { etat: "non", commentaire: "" },
                port_tenue_serveur: { etat: "non", commentaire: "" },
                boxs_livreurs: { etat: "non", commentaire: "" },
                poubelle_salle: { etat: "non", commentaire: "" }
            },
            pizzeria: {
                port_tenue_pizzaiolo: { etat: "non", commentaire: "" },
                distributeur_essui_main: { etat: "non", commentaire: "" },
                distributeur_savon_pizzeria: { etat: "non", commentaire: "" },
                deobact_pizzeria: { etat: "non", commentaire: "" },
                torchon_pizzeria: { etat: "non", commentaire: "" },
                poubelle_pizzeria: { etat: "non", commentaire: "" }
            },
            wc_client: {
                distributeur_savon_wc: { etat: "non", commentaire: "" },
                papier_hygienique_wc_client: { etat: "non", commentaire: "" },
                papier_essui_main_wc_client: { etat: "non", commentaire: "" },
                poubelle_wc_client: { etat: "non", commentaire: "" }
            },
            cuisine: {
                port_tenue_cuisinier: { etat: "non", commentaire: "" },
                deobact_cuisine: { etat: "non", commentaire: "" },
                supervix: { etat: "non", commentaire: "" },
                nectal_wc: { etat: "non", commentaire: "" },
                mister_glass: { etat: "non", commentaire: "" },
                javel: { etat: "non", commentaire: "" },
                sanicroix: { etat: "non", commentaire: "" },
                distributeur_savon_plonge: { etat: "non", commentaire: "" },
                distributeur_essui_main_plonge: { etat: "non", commentaire: "" },
                torchon_cuisine: { etat: "non", commentaire: "" },
                poubelle_cuisine: { etat: "non", commentaire: "" }
            },
            vestiaire: {
                vestiaire_personnel: { etat: "non", commentaire: "" },
                wc_personnel: { etat: "non", commentaire: "" },
                casiers_ferme: { etat: "non", commentaire: "" },
                douche_personnel: { etat: "non", commentaire: "" },
                papier_hygienique_personnel: { etat: "non", commentaire: "" },
                distributeur_savon_personnel: { etat: "non", commentaire: "" },
                poubelle_vestiaire: { etat: "non", commentaire: "" }
            }
        },
        controles: {
            rangement_economats: {
                rangement_economat_chimique: { value: "", commentaire: "" },
                rangement_economat_salle: { value: "", commentaire: "" },
                rangement_economat_food: { value: "", commentaire: "" }
            },
            salle: {
                proprete_table: { value: "", commentaire: "" },
                proprete_chaise: { value: "", commentaire: "" },
                proprete_tenue_responsable: { value: "", commentaire: "" },
                proprete_tenue_serveur: { value: "", commentaire: "" },
                proprete_bouteilles_huile: { value: "", commentaire: "" },
                proprete_poubelle_salle: { value: "", commentaire: "" },
                proprete_torchon: { value: "", commentaire: "" },
                proprete_boxs_livreurs: { value: "", commentaire: "" },
                proprete_poste_caisse: { value: "", commentaire: "" }
            },
            poste_pizza: {
                proprete_comptoir_pizzeria: { value: "", commentaire: "" },
                proprete_tenues_pizzaiolo: { value: "", commentaire: "" },
                proprete_ustensiles_pizzeria: { value: "", commentaire: "" },
                proprete_poubelle_pizzeria: { value: "", commentaire: "" },
                proprete_torchon_pizzeria: { value: "", commentaire: "" }
            },
            wc_client: {
                proprete_sol_wc: { value: "", commentaire: "" },
                proprete_sanitaire: { value: "", commentaire: "" },
                proprete_miroir: { value: "", commentaire: "" },
                proprete_poubelle_wc: { value: "", commentaire: "" }
            },
            cuisine: {
                proprete_comptoir_chaud: { value: "", commentaire: "" },
                proprete_comptoir_froid: { value: "", commentaire: "" },
                proprete_armoires_positives: { value: "", commentaire: "" },
                proprete_congelateurs: { value: "", commentaire: "" },
                proprete_piano_chaud: { value: "", commentaire: "" },
                proprete_salamander: { value: "", commentaire: "" },
                proprete_micro_onde: { value: "", commentaire: "" },
                proprete_tenues_cuisiniers: { value: "", commentaire: "" },
                proprete_torchon_cuisine: { value: "", commentaire: "" }
            },
            vestiaire: {
                controle_odeurs_casiers: { value: "", commentaire: "" },
                controle_proprete_poubelles: { value: "", commentaire: "" },
                controle_proprete_wc_personnel: { value: "", commentaire: "" }
            },
            facade_terrasse: {
                proprete_enseigne: { value: "", commentaire: "" },
                proprete_drapeau: { value: "", commentaire: "" },
                proprete_vitres: { value: "", commentaire: "" },
                proprete_jardiniere: { value: "", commentaire: "" },
                proprete_sol_terrasse: { value: "", commentaire: "" },
                proprete_tapis_sol: { value: "", commentaire: "" }
            }
        }
    });

    function submit(e) {
        e.preventDefault();
        post("/fiche-controle/form", {
            onError: (errors) => {
                console.error(errors);
            }
        });
    }

    const createOuiNonSection = (title, sectionData) => (
        <div className="mt-8 overflow-x-auto">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{title}</h3>
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            Moyens
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            Etat oui
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            Etat non
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Commentaires
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(sectionData).map(([key, value]) => (
                        <tr key={key}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words">
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <input
                                    type="radio"
                                    name={`etat-${title}-${key}`}
                                    checked={value.etat === "oui"}
                                    onChange={() => {
                                        const newData = _.cloneDeep(data);
                                        newData.moyens[title.toLowerCase()][key].etat = "oui";
                                        setData(newData);
                                    }}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <input
                                    type="radio"
                                    name={`etat-${title}-${key}`}
                                    checked={value.etat === "non"}
                                    onChange={() => {
                                        const newData = _.cloneDeep(data);
                                        newData.moyens[title.toLowerCase()][key].etat = "non";
                                        setData(newData);
                                    }}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                                />
                            </td>
                            <td className="px-6 py-4">
                                <input
                                    type="text"
                                    value={value.commentaire}
                                    onChange={(e) => {
                                        const newData = _.cloneDeep(data);
                                        newData.moyens[title.toLowerCase()][key].commentaire = e.target.value;
                                        setData(newData);
                                    }}
                                    className="w-full min-w-0 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const createEvaluationSection = (title, sectionData) => (
        <div className="mt-8 overflow-x-auto">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{title}</h3>
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            Désignation des contrôles
                        </th>
                        {['bien', 'moyen', 'mediocre', 'neant'].map((rating) => (
                            <th key={rating} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                {rating}
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Commentaires
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(sectionData).map(([key, value]) => (
                        <tr key={key}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words">
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </td>
                            {['bien', 'moyen', 'mediocre', 'neant'].map((rating) => (
                                <td key={rating} className="px-6 py-4 whitespace-nowrap text-center">
                                    <input
                                        type="radio"
                                        checked={value.value === rating}
                                        onChange={() => {
                                            const newData = _.cloneDeep(data);
                                            _.set(newData, `controles.${title.toLowerCase().replace(/ /g, '_')}.${key}.value`, rating);
                                            setData(newData);
                                        }}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                    />
                                </td>
                            ))}
                            <td className="px-6 py-4">
                                <input
                                    type="text"
                                    value={value.commentaire}
                                    onChange={(e) => {
                                        const newData = _.cloneDeep(data);
                                        _.set(newData, `controles.${title.toLowerCase()}.${key}.commentaire`, e.target.value);
                                        setData(newData);
                                    }}
                                    className="w-full min-w-0 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 py-10">
            <form onSubmit={submit} className="space-y-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold">Fiche contrôle hygiène</h2>
                            <div className="mt-4 space-y-4">
                                <div className="flex space-x-4 items-center">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData("date", e.target.value)}
                                        className="shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex space-x-4 items-center">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Restaurant
                                    </label>
                                    <input
                                        type="text"
                                        value={data.restau}
                                        disabled
                                        className="shadow-sm bg-gray-50 sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {createOuiNonSection("Economat", data.moyens.economat)}
                    {createOuiNonSection("Salle", data.moyens.salle)}
                    {createOuiNonSection("Pizzeria", data.moyens.pizzeria)}
                    {createOuiNonSection("WC Client", data.moyens.wc_client)}
                    {createOuiNonSection("Cuisine", data.moyens.cuisine)}
                    {createOuiNonSection("Vestiaire", data.moyens.vestiaire)}

                    {createEvaluationSection("Rangement Economats", data.controles.rangement_economats)}
                    {createEvaluationSection("Salle", data.controles.salle)}
                    {createEvaluationSection("Poste Pizza", data.controles.poste_pizza)}
                    {createEvaluationSection("WC Client", data.controles.wc_client)}
                    {createEvaluationSection("Cuisine", data.controles.cuisine)}
                    {createEvaluationSection("Vestiaire", data.controles.vestiaire)}
                    {createEvaluationSection("Facade et Terrasse", data.controles.facade_terrasse)}

                    <div className="pt-8 flex justify-end space-x-3">
                        <Link
                            href="/"
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}