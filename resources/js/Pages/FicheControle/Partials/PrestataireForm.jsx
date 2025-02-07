import { useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function ListePrestataires({ restau, type, existingData }) {
    console.log("Component Props:", { restau, type, existingData });
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [tempPrestataire, setTempPrestataire] = useState({
        lot: "",
        nom: "",
        telephone: ""
    });

    const { data, setData, post, processing ,errors } = useForm({
        name: "Liste Prestataires",
        date: new Date().toISOString().split('T')[0],
        restau: restau,
        type: type,
        prestataires: existingData?.prestataires || []
    });

    useEffect(() => {
        console.log("Current Form Data:", data);
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newPrestataire = {
            lot: tempPrestataire.lot,
            nom: tempPrestataire.nom,
            telephone: tempPrestataire.telephone
        };

        const formData = {
            name: data.name,
            date: data.date,
            restau: data.restau,
            type: data.type,
            prestataires: [...data.prestataires, newPrestataire]
        };

        console.log("Submitting Data:", formData);

        post("/fiche-controle/form", formData, {
            onError: (errors) => {
                console.log("Submission Errors:", errors);
            },
            onSuccess: () => {
                console.log("Submission Successful");
                setIsAddingNew(false);
                setTempPrestataire({
                    lot: "",
                    nom: "",
                    telephone: ""
                });
            }
        });
    };

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            console.log("Current Validation Errors:", errors);
        }
    }, [errors]);

    const handleNewPrestataire = () => {
        setIsAddingNew(true);
        setTempPrestataire({
            lot: "",
            nom: "",
            telephone: ""
        });
    };

    const handleCancel = () => {
        setIsAddingNew(false);
        setTempPrestataire({
            lot: "",
            nom: "",
            telephone: ""
        });
    };

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-10">
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Liste Prestataires - {restau}</h1>
                    <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700 mr-2">Date:</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    {!isAddingNew && (
                        <button
                            type="button"
                            onClick={handleNewPrestataire}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ajouter Prestataire
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            LOT
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Nom Prestataire
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            N Telephone
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {data.prestataires.map((prestataire, index) => (
                                        <tr key={index}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {prestataire.lot}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {prestataire.nom}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {prestataire.telephone}
                                            </td>
                                        </tr>
                                    ))}
                                    {isAddingNew && (
                                        <tr>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                                <input
                                                    type="text"
                                                    value={tempPrestataire.lot}
                                                    onChange={(e) => setTempPrestataire(prev => ({ ...prev, lot: e.target.value }))}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                    placeholder="LOT"
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <input
                                                    type="text"
                                                    value={tempPrestataire.nom}
                                                    onChange={(e) => setTempPrestataire(prev => ({ ...prev, nom: e.target.value }))}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                    placeholder="Nom Prestataire"
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <input
                                                    type="text"
                                                    value={tempPrestataire.telephone}
                                                    onChange={(e) => setTempPrestataire(prev => ({ ...prev, telephone: e.target.value }))}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                    placeholder="N Telephone"
                                                />
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={processing}
                                                    className="inline-flex mr-2 items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    {processing ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}