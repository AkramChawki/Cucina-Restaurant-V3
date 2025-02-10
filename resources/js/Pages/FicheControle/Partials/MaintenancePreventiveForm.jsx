import { Link, useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import _ from 'lodash';

export default function MaintenancePreventiveForm() {
    const { auth } = usePage().props;
    const queryParameters = new URLSearchParams(window.location.search);
    const restau = queryParameters.get("restau");

    const lotsInfo = [
        {
            lot: "Gaz",
            frequence: "Chaque mois",
            travaux: "Contrôle des 4 Feux et friteuse, nettoyage, reglage des feux..."
        },
        {
            lot: "Froid",
            frequence: "Chaque mois",
            travaux: "Nettoyage des batteries des Armoires, contrôle des thermostats, contrôle des portes et Joints ..."
        },
        {
            lot: "Chambres froides",
            frequence: "Chaque mois",
            travaux: "Contrôle des Groupes, contrôle Gel, contrôle des joints et portes, thermostats..."
        },
        {
            lot: "Hotte Four",
            frequence: "Chaque mois",
            travaux: "Nettoyage et ramonage de la gaine"
        },
        {
            lot: "Climatisation",
            frequence: "Chaque mois",
            travaux: "Nettoyage des filtres de clim, contrôle des groupes"
        },
        {
            lot: "Desinsectisation et deratisation",
            frequence: "Chaque semaine",
            travaux: "Injection produit, fumiginisation..."
        }
    ];

    const [rows, setRows] = useState([{
        lot: "",
        personne: "",
        detailTravaux: "",
        signatureControleur: ""
    }]);

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name,
        date: "",
        restau: restau,
        type: "maintenance_preventive",
        data: {
            mois: "",
            rows: rows
        }
    });

    const addRow = () => {
        const newRows = [...rows, {
            lot: "",
            personne: "",
            detailTravaux: "",
            signatureControleur: ""
        }];
        setRows(newRows);
        updateFormData(newRows);
    };

    const updateFormData = (updatedRows) => {
        setData(prevData => ({
            ...prevData,
            data: {
                ...prevData.data,
                rows: updatedRows
            }
        }));
    };

    const handleRowChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
        updateFormData(updatedRows);
    };

    const removeRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        updateFormData(updatedRows);
    };

    const handleMonthChange = (month) => {
        setData(prevData => ({
            ...prevData,
            data: {
                ...prevData.data,
                mois: month
            }
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post("/fiche-controle/form");
    };

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 py-10">
            <form onSubmit={submit} className="space-y-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold">Fiche Maintenance Preventive</h2>
                            <div className="mt-4 space-y-4">
                                <div className="flex space-x-4 items-center">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Mois
                                    </label>
                                    <input
                                        type="month"
                                        value={data.data.mois}
                                        onChange={(e) => handleMonthChange(e.target.value)}
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

                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Cette Fiche concerne les Lots (Gaz, Chambres froides, Armoires positives, Hotte Four, Climatisation, Deratisation et Desinsectisation)
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Lot</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Frequence</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Travaux A prevoir</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {lotsInfo.map((lot, index) => (
                                        <tr key={index}>
                                            <td className="py-4 pl-4 pr-3 text-sm text-gray-900">{lot.lot}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500">{lot.frequence}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500">{lot.travaux}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Dynamic Table */}
                    <div className="mt-8">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">LOT</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Personne</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Detail Travaux</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Signature controleur</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {rows.map((row, index) => (
                                        <tr key={index}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3">
                                                <select
                                                    value={row.lot}
                                                    onChange={(e) => handleRowChange(index, 'lot', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                >
                                                    <option value="">Sélectionner un lot</option>
                                                    {lotsInfo.map((lot, i) => (
                                                        <option key={i} value={lot.lot}>{lot.lot}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <input
                                                    type="text"
                                                    value={row.personne}
                                                    onChange={(e) => handleRowChange(index, 'personne', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                />
                                            </td>
                                            <td className="px-3 py-4">
                                                <input
                                                    type="text"
                                                    value={row.detailTravaux}
                                                    onChange={(e) => handleRowChange(index, 'detailTravaux', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <input
                                                    type="text"
                                                    value={row.signatureControleur}
                                                    onChange={(e) => handleRowChange(index, 'signatureControleur', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                />
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                {rows.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(index)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Supprimer
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addRow}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Ajouter une ligne
                            </button>
                        </div>
                    </div>

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