import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Footer from "@/Components/Footer";

export default function Home({ restaurants }) {
    const { auth } = usePage().props;

    const CardOverlay = ({ title, link }) => (
        <div className="relative group h-80 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0">
                <img
                    src="/images/restau/flower.jpg"
                    alt=""
                    className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-green-600/40 to-green-900/80 mix-blend-multiply" />
            </div>
            <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-3xl font-bold text-white mb-4 transition-transform duration-300 group-hover:scale-105">
                    {title}
                </h2>
                <Link
                    href={link}
                    className="inline-flex items-center px-6 py-2 text-sm font-medium text-green-900 bg-white rounded-md shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    Accéder
                </Link>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Clôture Caisse" />

            <div className="min-h-screen bg-gray-50 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Gestion de Clôture de Caisse
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                            Choisissez l'action que vous souhaitez effectuer
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <CardOverlay
                            title="Ajouter une Clôture de Caisse"
                            link="/cloture-caisse/select-restaurant"
                        />
                        {auth.user.role.includes("CCVoir") && (
                            <CardOverlay
                                title="Consulter les Clôtures de Caisse"
                                link="/cloture-caisse/show"
                            />
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
