import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Camera, ChevronDown, Calendar, Clock } from 'lucide-react';
import InfractionsTable from './InfractionsTable';

export default function Index({ employes, restaurants, postes, infractions }) {
    const [preview, setPreview] = useState(null);
    const fileInput = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

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
        <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
                Nouvelle Infraction
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Restaurant Selection */}
                <div>
                    <label className="block text-base text-gray-700 mb-2">
                        Restaurant
                    </label>
                    <div className="relative">
                        <select
                            value={data.restaurant}
                            onChange={e => setData('restaurant', e.target.value)}
                            className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        >
                            <option value="">Sélectionner un restaurant</option>
                            {restaurants.map(restaurant => (
                                <option key={restaurant} value={restaurant}>{restaurant}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                </div>

                {/* Poste Selection */}
                <div>
                    <label className="block text-base text-gray-700 mb-2">
                        Poste
                    </label>
                    <div className="relative">
                        <select
                            value={data.poste}
                            onChange={e => setData('poste', e.target.value)}
                            className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        >
                            <option value="">Sélectionner un poste</option>
                            {postes.map(poste => (
                                <option key={poste} value={poste}>{poste}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                </div>

                {/* Employee Selection */}
                {/* Employee Selection */}
                <div>
                    <label className="block text-base text-gray-700 mb-2">
                        Employé
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full text-left rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                {data.employe_id && employes && (
                                    <>
                                        {employes.find(e => e.id === parseInt(data.employe_id))?.profile_photo && (
                                            <img
                                                src={`https://restaurant.cucinanapoli.com/public/storage/${employes.find(e => e.id === parseInt(data.employe_id)).profile_photo}`}
                                                alt=""
                                                className="h-8 w-8 rounded-full mr-3 object-cover"
                                            />
                                        )}
                                        <span>
                                            {employes.find(e => e.id === parseInt(data.employe_id))?.first_name} {' '}
                                            {employes.find(e => e.id === parseInt(data.employe_id))?.last_name}
                                        </span>
                                    </>
                                )}
                                {!data.employe_id && <span>Sélectionner un employé</span>}
                            </div>
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                        </button>

                        {isOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                {employes.map((e) => (
                                    <div
                                        key={e.id}
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                                        onClick={() => {
                                            setData('employe_id', e.id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {e.profile_photo && (
                                            <img
                                                src={`https://restaurant.cucinanapoli.com/public/storage/${e.profile_photo}`}
                                                alt=""
                                                className="h-8 w-8 rounded-full mr-3 object-cover"
                                            />
                                        )}
                                        <span>{e.first_name} {e.last_name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Infraction Description */}
                <div>
                    <label className="block text-base text-gray-700 mb-2">
                        Infraction constatée
                    </label>
                    <textarea
                        value={data.infraction_constatee}
                        onChange={e => setData('infraction_constatee', e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-base text-gray-700 mb-2">
                            Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={data.infraction_date}
                                onChange={e => setData('infraction_date', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-base text-gray-700 mb-2">
                            Heure
                        </label>
                        <div className="relative">
                            <input
                                type="time"
                                value={data.infraction_time}
                                onChange={e => setData('infraction_time', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="block text-base text-gray-700 mb-2">
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
                        className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                        <Camera className="h-5 w-5" />
                        <span>Prendre une photo</span>
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
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
            <InfractionsTable
                infractions={infractions}
                employes={employes}
            />
        </div >
    );
}