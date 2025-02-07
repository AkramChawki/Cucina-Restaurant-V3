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
        moyens: {
            logo_eclaire: { etat: "non", commentaire: "" },
            drapeau_eclaire: { etat: "non", commentaire: "" },
            refregirateur_boissons_fonctionnel: { etat: "non", commentaire: "" },
            lampes_salles_eclaires: { etat: "non", commentaire: "" },
            eclairage_wc: { etat: "non", commentaire: "" },
            eclairage_pizzeria: { etat: "non", commentaire: "" },
            eclairage_cuisine: { etat: "non", commentaire: "" },
            climatisation_fonctionnelle: { etat: "non", commentaire: "" },
            tue_mouche_fonctionnelle: { etat: "non", commentaire: "" },
            prises_electriques_fonctionnelle: { etat: "non", commentaire: "" },
            comptoir_pizzeria_fonctionnelle: { etat: "non", commentaire: "" },
            lave_main_pizzeria_fonctionnelle: { etat: "non", commentaire: "" },
            chaises_en_bon_etat: { etat: "non", commentaire: "" },
            lavabo_et_robinet_fonctionnel: { etat: "non", commentaire: "" },
            wc_fonctionnel: { etat: "non", commentaire: "" },
            carrelage_four_en_bon_etat: { etat: "non", commentaire: "" },
            carrelage_salle: { etat: "non", commentaire: "" },
            escalier_en_bon_etat: { etat: "non", commentaire: "" },
            peinture_salle: { etat: "non", commentaire: "" },
            plafon_en_bon_etat: { etat: "non", commentaire: "" },
            comptoir_cuisine: { etat: "non", commentaire: "" },
            lave_main_cuisine_fonctionnelle: { etat: "non", commentaire: "" },
            plonge_cuisine_fonctionnelle: { etat: "non", commentaire: "" },
            chauffe_eau_plonge_fonctionnel: { etat: "non", commentaire: "" },
            hotte_cuisine_fonctionnelle: { etat: "non", commentaire: "" },
            installation_gaz: { etat: "non", commentaire: "" },
            fonctionnement_friteuse_et_salamander: { etat: "non", commentaire: "" },
            armoires_cuisines: { etat: "non", commentaire: "" },
            congelateurs_cuisine: { etat: "non", commentaire: "" }
        }
     });

    function submit(e) {
        e.preventDefault();
        post("/fiche-controle/form");
    }

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-10 py-10">
            <form onSubmit={submit} className="space-y-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold">Fiche contrôle Patrimoine</h2>
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
                        <img src="/api/placeholder/64/64" alt="Logo" className="w-16 h-16" />
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Moyens
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Etat oui
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Etat non
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commentaires
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(data.moyens).map(([key, value]) => (
                                <tr key={key}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <input
                                            type="radio"
                                            checked={value.etat === "oui"}
                                            onChange={() => {
                                                const newData = _.cloneDeep(data);
                                                newData.moyens[key].etat = "oui";
                                                setData(newData);
                                            }}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <input
                                            type="radio"
                                            checked={value.etat === "non"}
                                            onChange={() => {
                                                const newData = _.cloneDeep(data);
                                                newData.moyens[key].etat = "non";
                                                setData(newData);
                                            }}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <input
                                            type="text"
                                            value={value.commentaire}
                                            onChange={(e) => {
                                                const newData = _.cloneDeep(data);
                                                newData.moyens[key].commentaire = e.target.value;
                                                setData(newData);
                                            }}
                                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end space-x-3">
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
            </form>
        </div>
    );
}