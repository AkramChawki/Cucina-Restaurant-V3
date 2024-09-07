import { Link, useForm, usePage } from "@inertiajs/react";
import React from "react";

export default function From() {
    const { auth } = usePage().props;
    const queryParameters = new URLSearchParams(window.location.search);
    const restau = queryParameters.get("restau");
    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name,
        date: "",
        restau: restau,
        defeillance: "",
        image: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/audit/form", {
            preserveState: true,
            preserveScroll: true,
            forceFormData: true,
        });
    }
    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-10 py-10">
            <form
                className="space-y-8 divide-y divide-gray-200"
                onSubmit={submit}
                encType="multipart/form-data"
            >
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Audit
                            </h3>
                        </div>

                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="username"
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
                                    htmlFor="about"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Defeillance
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <textarea
                                        id="defeillance"
                                        name="defeillance"
                                        rows={3}
                                        value={data.defeillance}
                                        onChange={(e) =>
                                            setData(
                                                "defeillance",
                                                e.target.value
                                            )
                                        }
                                        className="max-w-lg shadow-sm block w-full focus:ring-green-500 focus:border-green-500 sm:text-sm border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="image"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Image
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                        onChange={(e) =>
                                            setData("image", e.target.files[0])
                                        }
                                        className="max-w-lg block w-full focus:ring-green-500 focus:border-green-500 sm:text-sm border border-gray-300 rounded-md"
                                    />
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
