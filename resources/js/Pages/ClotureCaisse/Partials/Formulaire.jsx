import { Link, useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function Formulaire() {
    const queryParameters = new URLSearchParams(window.location.search);
    const restau = queryParameters.get("restau");
    const { auth } = usePage().props
    const [sign, setSign] = useState();
    const [url, setUrl] = useState();


    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name,
        restau: restau,
        date: "",
        time: "",
        caissierE: "",
        caissierS: "",
        montant: "",
        montantE: "",
        glovoE: "",
        glovoC: "",
        cartebancaire: "",
        LivE: "",
        LivC: "",
        virement: "",
        cheque: "",
        Compensation: "",
        signature: "",
    });

    const handleClear = () => {
        sign.clear();
        setUrl("");
        setData("signature", "");
    };
    const handleGenerate = () => {
        setUrl(sign.getTrimmedCanvas().toDataURL("image/png"));
        setData("signature", sign.getTrimmedCanvas().toDataURL("image/png"));
    };

    function handleSubmit(e) {
        e.preventDefault();
        post("/cloture-caisse");
    }
    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-10 py-10">
            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Cloture Caisse
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
                                            value={data.date} onChange={e => setData('date', e.target.value)}
                                            className="flex-1 block  w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.date && <div>{errors.date}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="heur"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Heure
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="time"
                                            name="time"
                                            id="time"
                                            value={data.time} onChange={e => setData('time', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.time && <div>{errors.time}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="caissierE"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Caissier Entrant
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="caissierE"
                                            id="caissierE"
                                            value={data.caissierE} onChange={e => setData('caissierE', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.caissierE && <div>{errors.caissierE}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="caissierS"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Caissier Sortant
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="caissierS"
                                            id="caissierS"
                                            value={data.caissierS} onChange={e => setData('caissierS', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.caissierS && <div>{errors.caissierS}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="montant"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Montant Caisse
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="montant"
                                            id="montant"
                                            value={data.montant} onChange={e => setData('montant', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.montant && <div>{errors.montant}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="montantE"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Montant Espece
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="montantE"
                                            id="montantE"
                                            value={data.montantE} onChange={e => setData('montantE', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.montantE && <div>{errors.montantE}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="glovoE"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Glovo Espece
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="glovoE"
                                            id="glovoE"
                                            value={data.glovoE} onChange={e => setData('glovoE', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.glovoE && <div>{errors.glovoE}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="glovoC"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Glovo Carte
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="glovoC"
                                            id="glovoC"
                                            value={data.glovoC} onChange={e => setData('glovoC', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.glovoC && <div>{errors.glovoC}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="cartebancaire"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Carte Bancaire
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="cartebancaire"
                                            id="cartebancaire"
                                            value={data.cartebancaire} onChange={e => setData('cartebancaire', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.cartebancaire && <div>{errors.cartebancaire}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="LivE"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Livraison.ma Espece
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="LivE"
                                            id="LivE"
                                            value={data.LivE} onChange={e => setData('LivE', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.LivE && <div>{errors.LivE}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="LivC"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Livraison.ma Carte
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="LivC"
                                            id="LivC"
                                            value={data.LivC} onChange={e => setData('LivC', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.LivC && <div>{errors.LivC}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="encaissement"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Virement Instantané
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="virement"
                                            id="virement"
                                            value={data.virement} onChange={e => setData('virement', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.virement && <div>{errors.virement}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="encaissement"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Chèque
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="cheque"
                                            id="cheque"
                                            value={data.cheque} onChange={e => setData('cheque', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.cheque && <div>{errors.cheque}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="encaissement"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Compensation
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="compensation"
                                            id="compensation"
                                            value={data.Compensation} onChange={e => setData('Compensation', e.target.value)}
                                            className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        {errors.Compensation && <div>{errors.Compensation}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="signature"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                        Signature
                    </label>
                    <div className="border-solid border-2 border-black w-[300px] mx-auto">
                        <SignatureCanvas
                            backgroundColor="white"
                            canvasProps={{
                                width: 300,
                                height: 200,
                                className: "sigCanvas",
                            }}
                            ref={(data) => setSign(data)}
                        />
                    </div>
                    <div className="flex justify-center">
                        <a
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={handleClear}
                        >
                            Clear
                        </a>
                        <a
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={handleGenerate}
                        >
                            Sauvgarder
                        </a>
                    </div>
                    <br />
                    <br />
                    <img src={url} className="mx-auto" />
                </div>
                <div className="flex justify-end">
                    <a
                        href="/"
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Cancel
                    </a>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
