import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Camera } from 'lucide-react';

export default function Index({ employes, restaurants, postes, infractions }) {
    const [preview, setPreview] = useState(null);
    const fileInput = useRef(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        restaurant: '',
        infraction_constatee: '',
        poste: '',
        employe_id: '',
        photo: null,
        infraction_date: '',
        infraction_time: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('infractions.store'), {
            onSuccess: () => {
                reset();
                setPreview(null);
            },
            preserveScroll: true
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Form Section */}
            <div className="bg-white shadow-sm rounded-lg">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Nouvelle Infraction</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Restaurant Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Restaurant
                                </label>
                                <select
                                    value={data.restaurant}
                                    onChange={e => setData('restaurant', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Sélectionner un restaurant</option>
                                    {restaurants.map(restaurant => (
                                        <option key={restaurant} value={restaurant}>
                                            {restaurant}
                                        </option>
                                    ))}
                                </select>
                                {errors.restaurant && (
                                    <p className="mt-1 text-sm text-red-600">{errors.restaurant}</p>
                                )}
                            </div>

                            {/* Poste Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Poste
                                </label>
                                <select
                                    value={data.poste}
                                    onChange={e => setData('poste', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Sélectionner un poste</option>
                                    {postes.map(poste => (
                                        <option key={poste} value={poste}>
                                            {poste}
                                        </option>
                                    ))}
                                </select>
                                {errors.poste && (
                                    <p className="mt-1 text-sm text-red-600">{errors.poste}</p>
                                )}
                            </div>

                            {/* Employee Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Employé
                                </label>
                                <select
                                    value={data.employe_id}
                                    onChange={e => setData('employe_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Sélectionner un employé</option>
                                    {employes.map(employe => (
                                        <div key={employe.id} className="flex items-center">
                                            <option value={employe.id}>
                                                {employe.first_name} {employe.last_name}
                                            </option>
                                        </div>
                                    ))}
                                </select>
                                {errors.employe_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.employe_id}</p>
                                )}
                            </div>

                            {/* Infraction Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Infraction constatée
                                </label>
                                <textarea
                                    value={data.infraction_constatee}
                                    onChange={e => setData('infraction_constatee', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.infraction_constatee && (
                                    <p className="mt-1 text-sm text-red-600">{errors.infraction_constatee}</p>
                                )}
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.infraction_date}
                                        onChange={e => setData('infraction_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.infraction_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.infraction_date}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Heure
                                    </label>
                                    <input
                                        type="time"
                                        value={data.infraction_time}
                                        onChange={e => setData('infraction_time', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.infraction_time && (
                                        <p className="mt-1 text-sm text-red-600">{errors.infraction_time}</p>
                                    )}
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Photo
                                </label>
                                <input
                                    type="file"
                                    ref={fileInput}
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                    accept="image/*"
                                    capture="environment"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInput.current?.click()}
                                    className="mt-1 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Camera className="h-5 w-5 mr-2" />
                                    Prendre une photo
                                </button>
                                {preview && (
                                    <div className="mt-2">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                {errors.photo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {processing ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="mt-8 bg-white shadow-sm rounded-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Liste des infractions</h2>
                        <form action={route('infractions.report')} method="GET" className="flex gap-4">
                            <input
                                type="date"
                                name="date_from"
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <input
                                type="date"
                                name="date_to"
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Générer Rapport
                            </button>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Restaurant
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Poste
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employé
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Infraction
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Heure
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {infractions.map((infraction) => (
                                    <tr key={infraction.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {infraction.restaurant}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {infraction.poste}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {infraction.employe.profile_photo && (
                                                    <img
                                                        src={`/storage/${infraction.employe.profile_photo}`}
                                                        alt=""
                                                        className="h-8 w-8 rounded-full mr-2"
                                                    />
                                                )}
                                                <span>
                                                    {infraction.employe.first_name} {infraction.employe.last_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {infraction.infraction_constatee}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {infraction.infraction_date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {infraction.infraction_time}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}