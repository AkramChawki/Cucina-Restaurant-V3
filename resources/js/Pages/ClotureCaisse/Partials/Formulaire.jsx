import { Link, useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function Formulaire({ restau }) {
    const { auth } = usePage().props;
    const [sign, setSign] = useState();
    const [url, setUrl] = useState();

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name,
        restau: restau,
        date: "",
        time: "",
        responsable: "",
        montant: "",
        montantE: "",
        cartebancaire: "",
        cartebancaireLivraison: "",
        virement: "",
        cheque: "",
        compensation: "",
        familleAcc: "",
        erreurPizza: "",
        erreurCuisine: "",
        erreurServeur: "",
        erreurCaisse: "",
        perteEmporte: "",
        giveawayPizza: "",
        giveawayPasta: "",
        glovoC: "",
        glovoE: "",
        appE: "",
        appC: "",
        shooting: "",
        charge: "",
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
                {/* General Information */}
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Cloture Caisse - {restau}
                        </h3>
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            {/* Date Field */}
                            <FormField
                                label="Date"
                                name="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                error={errors.date}
                            />

                            {/* Time Field */}
                            <FormField
                                label="Heure"
                                name="time"
                                type="time"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                                error={errors.time}
                            />

                            {/* Responsible Field */}
                            <FormField
                                label="Responsable"
                                name="responsable"
                                type="text"
                                value={data.responsable}
                                onChange={(e) => setData('responsable', e.target.value)}
                                error={errors.responsable}
                            />

                            {/* Montants */}
                            <FormField
                                label="Montant Caisse"
                                name="montant"
                                type="number"
                                value={data.montant}
                                onChange={(e) => setData('montant', e.target.value)}
                                error={errors.montant}
                            />

                            <FormField
                                label="Montant Espèce"
                                name="montantE"
                                type="number"
                                value={data.montantE}
                                onChange={(e) => setData('montantE', e.target.value)}
                                error={errors.montantE}
                            />

                            {/* Payment Methods */}
                            <FormField
                                label="Carte Bancaire"
                                name="cartebancaire"
                                type="number"
                                value={data.cartebancaire}
                                onChange={(e) => setData('cartebancaire', e.target.value)}
                                error={errors.cartebancaire}
                            />

                            <FormField
                                label="Carte Bancaire a Livraison"
                                name="cartebancaireLivraison"
                                type="number"
                                value={data.cartebancaireLivraison}
                                onChange={(e) => setData('cartebancaireLivraison', e.target.value)}
                                error={errors.cartebancaireLivraison}
                            />

                            <FormField
                                label="Virement"
                                name="virement"
                                type="number"
                                value={data.virement}
                                onChange={(e) => setData('virement', e.target.value)}
                                error={errors.virement}
                            />

                            <FormField
                                label="Chèque"
                                name="cheque"
                                type="number"
                                value={data.cheque}
                                onChange={(e) => setData('cheque', e.target.value)}
                                error={errors.cheque}
                            />

                            <FormField
                                label="Compensation"
                                name="compensation"
                                type="number"
                                value={data.compensation}
                                onChange={(e) => setData('compensation', e.target.value)}
                                error={errors.compensation}
                            />

                            {/* Errors and Giveaways */}
                            <FormField
                                label="Famille & Accompagnant"
                                name="familleAcc"
                                type="number"
                                value={data.familleAcc}
                                onChange={(e) => setData('familleAcc', e.target.value)}
                                error={errors.familleAcc}
                            />

                            <FormField
                                label="Erreur Pizza"
                                name="erreurPizza"
                                type="number"
                                value={data.erreurPizza}
                                onChange={(e) => setData('erreurPizza', e.target.value)}
                                error={errors.erreurPizza}
                            />

                            <FormField
                                label="Erreur Cuisine"
                                name="erreurCuisine"
                                type="number"
                                value={data.erreurCuisine}
                                onChange={(e) => setData('erreurCuisine', e.target.value)}
                                error={errors.erreurCuisine}
                            />

                            <FormField
                                label="Erreur Serveur"
                                name="erreurServeur"
                                type="number"
                                value={data.erreurServeur}
                                onChange={(e) => setData('erreurServeur', e.target.value)}
                                error={errors.erreurServeur}
                            />

                            <FormField
                                label="Erreur Caisse"
                                name="erreurCaisse"
                                type="number"
                                value={data.erreurCaisse}
                                onChange={(e) => setData('erreurCaisse', e.target.value)}
                                error={errors.erreurCaisse}
                            />

                            <FormField
                                label="Perte Emporte"
                                name="perteEmporte"
                                type="number"
                                value={data.perteEmporte}
                                onChange={(e) => setData('perteEmporte', e.target.value)}
                                error={errors.perteEmporte}
                            />

                            <FormField
                                label="Giveaway Pizza"
                                name="giveawayPizza"
                                type="number"
                                value={data.giveawayPizza}
                                onChange={(e) => setData('giveawayPizza', e.target.value)}
                                error={errors.giveawayPizza}
                            />

                            <FormField
                                label="Giveaway Pasta"
                                name="giveawayPasta"
                                type="number"
                                value={data.giveawayPasta}
                                onChange={(e) => setData('giveawayPasta', e.target.value)}
                                error={errors.giveawayPasta}
                            />

                            {/* Glovo and App */}
                            <FormField
                                label="Glovo Carte"
                                name="glovoC"
                                type="number"
                                value={data.glovoC}
                                onChange={(e) => setData('glovoC', e.target.value)}
                                error={errors.glovoC}
                            />

                            <FormField
                                label="Glovo Espèce"
                                name="glovoE"
                                type="number"
                                value={data.glovoE}
                                onChange={(e) => setData('glovoE', e.target.value)}
                                error={errors.glovoE}
                            />

                            <FormField
                                label="Application mobile Espèce"
                                name="appE"
                                type="number"
                                value={data.appE}
                                onChange={(e) => setData('appE', e.target.value)}
                                error={errors.appE}
                            />

                            <FormField
                                label="Application mobile Carte"
                                name="appC"
                                type="number"
                                value={data.appC}
                                onChange={(e) => setData('appC', e.target.value)}
                                error={errors.appC}
                            />

                            <FormField
                                label="Shooting Marketing"
                                name="shooting"
                                type="number"
                                value={data.shooting}
                                onChange={(e) => setData('shooting', e.target.value)}
                                error={errors.shooting}
                            />
                            
                            {/* New Charge Field */}
                            <FormField
                                label="Charge"
                                name="charge"
                                type="number"
                                value={data.charge}
                                onChange={(e) => setData('charge', e.target.value)}
                                error={errors.charge}
                            />
                        </div>
                    </div>
                </div>

                {/* Signature Section */}
                <div>
                    <label htmlFor="signature" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
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
                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={handleClear}
                        >
                            Effacer
                        </button>
                        <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={handleGenerate}
                        >
                            Sauvegarder
                        </button>
                    </div>
                    {url && (
                        <div className="mt-4">
                            <img src={url} className="mx-auto" alt="Signature" />
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end pt-5">
                    <Link
                        href="/cloture-caisse"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        disabled={processing}
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
}

function FormField({ label, name, type, value, onChange, error }) {
    return (
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                {label}
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                    <input
                        type={type}
                        name={name}
                        id={name}
                        value={value}
                        onChange={onChange}
                        className="flex-1 block w-full focus:ring-green-500 focus:border-green-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                    />
                </div>
                {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
            </div>
        </div>
    );
}