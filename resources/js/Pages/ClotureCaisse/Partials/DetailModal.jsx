import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

export default function DetailModal({ isOpen, setIsOpen, record }) {
    if (!record) return null;

    // Format currency values
    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === "") return "—";
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

    const sections = [
        {
            title: "Informations générales",
            fields: [
                { label: "Date", value: record.date },
                { label: "Heure", value: record.time },
                { label: "Responsable", value: record.responsable },
                { label: "Restaurant", value: record.restau },
            ]
        },
        {
            title: "Montants",
            fields: [
                { label: "Montant Caisse", value: formatCurrency(record.montant) },
                { label: "Montant Espèce", value: formatCurrency(record.montantE) },
                { label: "Charge", value: formatCurrency(record.charge) },
            ]
        },
        {
            title: "Moyens de paiement",
            fields: [
                { label: "Carte Bancaire", value: formatCurrency(record.cartebancaire) },
                { label: "Carte Bancaire Livraison", value: formatCurrency(record.cartebancaireLivraison) },
                { label: "Virement", value: formatCurrency(record.virement) },
                { label: "Chèque", value: formatCurrency(record.cheque) },
                { label: "Compensation", value: formatCurrency(record.compensation) },
            ]
        },
        {
            title: "Erreurs et offerts",
            fields: [
                { label: "Famille & Accompagnant", value: formatCurrency(record.familleAcc) },
                { label: "Erreur Pizza", value: formatCurrency(record.erreurPizza) },
                { label: "Erreur Cuisine", value: formatCurrency(record.erreurCuisine) },
                { label: "Erreur Serveur", value: formatCurrency(record.erreurServeur) },
                { label: "Erreur Caisse", value: formatCurrency(record.erreurCaisse) },
                { label: "Perte Emporte", value: formatCurrency(record.perteEmporte) },
                { label: "Giveaway Pizza", value: formatCurrency(record.giveawayPizza) },
                { label: "Giveaway Pasta", value: formatCurrency(record.giveawayPasta) },
            ]
        },
        {
            title: "Services de livraison",
            fields: [
                { label: "Glovo Carte", value: formatCurrency(record.glovoC) },
                { label: "Glovo Espèce", value: formatCurrency(record.glovoE) },
                { label: "Commission Glovo", value: formatCurrency(record.ComGlovo) },
                { label: "Application mobile Espèce", value: formatCurrency(record.appE) },
                { label: "Application mobile Carte", value: formatCurrency(record.appC) },
            ]
        },
        {
            title: "Autres",
            fields: [
                { label: "Shooting Marketing", value: formatCurrency(record.shooting) },
                { label: "Créé le", value: formatDate(record.created_at) },
                { label: "Mise à jour le", value: formatDate(record.updated_at) },
            ]
        }
    ];

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="sr-only">Fermer</span>
                                        <XIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 mb-6">
                                            Détails de la clôture de caisse
                                        </Dialog.Title>
                                        <div className="mt-2 space-y-6 max-h-[70vh] overflow-y-auto pb-4">
                                            {sections.map((section, sectionIndex) => (
                                                <div key={sectionIndex} className="border rounded-lg overflow-hidden">
                                                    <div className="bg-gray-50 px-4 py-2 border-b">
                                                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                                                    </div>
                                                    <div className="divide-y divide-gray-200">
                                                        {section.fields.map((field, fieldIndex) => (
                                                            <div key={fieldIndex} className="px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4">
                                                                <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">{field.value}</dd>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Signature Section */}
                                            <div className="border rounded-lg overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-2 border-b">
                                                    <h4 className="font-medium text-gray-900">Signature</h4>
                                                </div>
                                                <div className="p-4 flex justify-center">
                                                    <img src={record.signature} alt="Signature" className="max-h-40" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Fermer
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}