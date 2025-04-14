import React, { useState } from 'react';
import { Head, Link } from "@inertiajs/react";
import Footer from '@/Components/Footer';
import DetailModal from './Partials/DetailModal';

export default function Show({ records, restaurant }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Format currency values
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "—";
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(value);
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };
    
    const openDetailModal = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head title={`Clôtures de Caisse - ${restaurant}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Clôtures de Caisse - {restaurant}
                                </h1>
                                <Link
                                    href="/cloture-caisse"
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                                >
                                    Retour
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                {records.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Caisse</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Espèce</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {records.map((record) => (
                                                <tr key={record.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.time}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.responsable}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(record.montant)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(record.montantE)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button 
                                                            onClick={() => openDetailModal(record)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Voir plus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500 text-lg">Aucune clôture de caisse trouvée pour ce restaurant.</p>
                                        <Link
                                            href={`/cloture-caisse/add?restau=${restaurant}`}
                                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                        >
                                            Ajouter une clôture de caisse
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            
            {/* Detail Modal */}
            <DetailModal 
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                record={selectedRecord}
            />
        </>
    );
}