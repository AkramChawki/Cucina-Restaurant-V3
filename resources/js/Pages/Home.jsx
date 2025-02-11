import { Head, Link, usePage } from "@inertiajs/react";

function Home({ rubriques }) {
    const { auth } = usePage().props;

    const formatRubriqueTitle = (title) => {
        if (title === "Restaurant") {
            return "Gestion Restaurant";
        }
        return `Commande ${title}`;
    };

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
            <Head title="Accueil" />

            {/* Hero Section */}
            <div className="relative min-h-screen">
                <main className="relative bg-light-gray">
                    <div className="mx-auto max-w-7xl w-full pt-16 pb-20 text-center lg:py-48 lg:text-left px-4 sm:px-6 lg:px-8">
                        <div className="lg:w-1/2">
                            <img
                                src="/images/logo/Cucina.png"
                                alt="Logo"
                                className="h-[100px] w-[400px] mb-8 mx-auto lg:mx-0"
                            />
                            <h1 className="text-4xl tracking-tight font-extrabold text-dark-gray sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                <span className="block">Pizza Au Feu</span>
                                <span className="block text-[#73ac70]">De Bois</span>
                            </h1>
                            <p className="mt-3 text-lg text-gray-500 sm:text-xl md:mt-5">
                                Livraison Jusqu'à chez vous !!
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:justify-start">
                                <a
                                    href="#access"
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#73ac70] hover:bg-[#5f9a5c] transition-colors duration-200"
                                >
                                    Accéder
                                </a>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#73ac70] hover:bg-[#5f9a5c] transition-colors duration-200"
                                >
                                    Se Deconnecter
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
                        <img
                            className="absolute inset-0 w-full h-full object-cover"
                            src="/images/cover/banner.webp"
                            alt=""
                        />
                    </div>
                </main>
            </div>

            {/* Access Section */}
            <div id="access" className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {auth.user.role.includes("Restaurant") && (
                            <CardOverlay
                                title="Gestion Restaurant"
                                link="/restaurants-rubriques"
                            />
                        )}

                        {rubriques.map(
                            (rubrique, id) =>
                                auth.user.role.includes(rubrique.title) && (
                                    <CardOverlay
                                        key={id}
                                        title={formatRubriqueTitle(rubrique.title)}
                                        link={`/rubrique/${rubrique.title}`}
                                    />
                                )
                        )}

                        {auth.user.role.includes("Flash") && (
                            <CardOverlay
                                title="Inventaire Flash"
                                link="/inventaire?ficheId=22"
                            />
                        )}

                        {auth.user.role.includes("INV Labo") && (
                            <CardOverlay
                                title="Inventaire Labo"
                                link="/inventaire?ficheId=23"
                            />
                        )}

                        {auth.user.role.includes("INV Economat") && (
                            <CardOverlay
                                title="Inventaire Economat"
                                link="/inventaire?ficheId=24"
                            />
                        )}

                        {auth.user.role.includes("Inventaire Restaurant") && (
                            <CardOverlay
                                title="Inventaire Restaurant"
                                link="/inventaire?ficheId=25"
                            />
                        )}

                        {auth.user.role.includes("PNC") && (
                            <CardOverlay
                                title="Produit Non Conformes"
                                link="/produit-non-conforme"
                            />
                        )}

                        {auth.user.role.includes("Fiche-controle") && (
                            <CardOverlay
                                title="Fiche de Controle Hygiene"
                                link="/fiche-controle"
                            />
                        )}

                        {auth.user.role.includes("Livraison") && (
                            <CardOverlay
                                title="Livraison Restaurant"
                                link="/livraisons"
                            />
                        )}

                        {auth.user.role.includes("Flux Reel") && (
                            <CardOverlay
                                title="Flux Reel"
                                link="/flux-reel"
                            />
                        )}
                        {auth.user.role.includes("Cloture Caisse") && (
                            <CardOverlay
                                title="Cloture Caisse"
                                link="/cloture-caisse"
                            />
                        )}

                        {auth.user.role.includes("Numero") && (
                            <CardOverlay
                                title="Numero"
                                link="/numeros"
                            />
                        )}
                        {auth.user.role.includes("Infraction") && (
                            <CardOverlay
                                title="INFRACTIONS CONSTATEES PAR LE CENTRE DE CONTRÔLE"
                                link="/infraction"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <a
                            href="https://www.facebook.com/Cucina.Napoli/"
                            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                        >
                            <span className="sr-only">Facebook</span>
                            <svg
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                        {/* ... other social icons ... */}
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-base text-gray-400">
                            © {new Date().getFullYear()} Cucina Napoli.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Home;