import { Link, useForm, usePage } from "@inertiajs/react";
import React from "react";

export default function Form() {
    const { auth } = usePage().props;
    const queryParameters = new URLSearchParams(window.location.search);
    const restau = queryParameters.get("restau");

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name,
        date: "",
        restau: restau,
        type: "",
        produit: "",
        date_production: "",
        probleme: "",
    });

    const problemeOptions = [
        "probleme sous vide",
        "probleme DLC date",
        "probleme qualite produit",
        "produit abime"
    ];

    function submit(e) {
        e.preventDefault();
        post("/produit-non-conforme/form", {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-10 py-10">
            <form
                className="space-y-8 divide-y divide-gray-200"
                onSubmit={submit}
            >
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                CUCINA NAPOLI - Produit Non Conforme
                            </h3>
                        </div>

                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Date
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            value={data.date}
                                            onChange={(e) =>
                                                setData("date", e.target.value)
                                            }
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="type"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Cuisinier ou Pizzaiolo
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <select
                                        id="type"
                                        name="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData("type", e.target.value)
                                        }
                                        className="max-w-lg block focus:ring-green-500 focus:border-green-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="">Sélectionnez un type</option>
                                        <option value="cuisinier">Cuisinier</option>
                                        <option value="pizzaiolo">Pizzaiolo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="produit"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Produit
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="text"
                                        name="produit"
                                        id="produit"
                                        value={data.produit}
                                        onChange={(e) =>
                                            setData("produit", e.target.value)
                                        }
                                        className="max-w-lg block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="date_production"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Date Production
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="date"
                                        name="date_production"
                                        id="date_production"
                                        value={data.date_production}
                                        onChange={(e) =>
                                            setData("date_production", e.target.value)
                                        }
                                        className="max-w-lg block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="probleme"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Problème lié au produit
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <select
                                        id="probleme"
                                        name="probleme"
                                        value={data.probleme}
                                        onChange={(e) =>
                                            setData("probleme", e.target.value)
                                        }
                                        className="max-w-lg block focus:ring-green-500 focus:border-green-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="">Sélectionnez un problème</option>
                                        {problemeOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <Link
                            type="button"
                            as="button"
                            href="/"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}