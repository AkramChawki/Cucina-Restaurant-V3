import { Head, Link, usePage } from "@inertiajs/react";

function Home({ rubriques }) {
    const { auth } = usePage().props;
    
    // Debug log to see the actual structure of roles
    
    const hasRole = (roleName) => {
        // Debug the role check
        
        // If role is null or undefined, return false
        if (!auth.user.role) {
            return false;
        }
        
        // Try to handle JSON string if that's how roles are stored
        let userRoles = auth.user.role;
        if (typeof userRoles === 'string' && (userRoles.startsWith('[') || userRoles.startsWith('{'))) {
            try {
                userRoles = JSON.parse(userRoles);
            } catch (e) {
                console.log("Failed to parse roles as JSON, continuing with string value");
            }
        }
        
        // If userRoles is now an array after parsing
        if (Array.isArray(userRoles)) {
            // Log the array for debugging
            const hasExactRole = userRoles.some(role => 
                typeof role === 'string' && role.trim() === roleName.trim()
            );
            return hasExactRole;
        }
        
        // If userRoles is a string (comma separated or single value)
        if (typeof userRoles === 'string') {
            if (userRoles.includes(',')) {
                const roleArray = userRoles.split(',').map(r => r.trim());
                const hasRole = roleArray.some(role => role === roleName.trim());
                return hasRole;
            }
            
            // Direct string comparison with trimming
            const isExactMatch = userRoles.trim() === roleName.trim();
            return isExactMatch;
        }
        
        // If userRoles is an object, try to check properties
        if (typeof userRoles === 'object' && userRoles !== null) {
            // Check if the role name exists as a key or a value in the object
            return Object.keys(userRoles).includes(roleName) || 
                   Object.values(userRoles).some(val => 
                       typeof val === 'string' && val.trim() === roleName.trim()
                   );
        }
        
        return false;
    };

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
                        {hasRole("Analytics") && (
                            <CardOverlay
                                title="Cost Analytics"
                                link="/cost-analytics"
                            />
                        )}
                        {hasRole("Restaurant") && (
                            <CardOverlay
                                title="Gestion Restaurant"
                                link="/restaurants-rubriques"
                            />
                        )}

                        {rubriques.map(
                            (rubrique, id) => {
                                const hasRoleResult = hasRole(rubrique.title);
                                return hasRoleResult && (
                                    <CardOverlay
                                        key={id}
                                        title={formatRubriqueTitle(rubrique.title)}
                                        link={`/rubrique/${rubrique.title}`}
                                    />
                                );
                            }
                        )}

                        {hasRole("Flash") && (
                            <CardOverlay
                                title="Inventaire Flash"
                                link="/inventaire?ficheId=22"
                            />
                        )}

                        {hasRole("INV Labo") && (
                            <CardOverlay
                                title="Inventaire Labo"
                                link="/inventaire?ficheId=23"
                            />
                        )}

                        {hasRole("INV Economat") && (
                            <CardOverlay
                                title="Inventaire Economat"
                                link="/inventaire?ficheId=24"
                            />
                        )}

                        {hasRole("Inventaire Restaurant") && (
                            <CardOverlay
                                title="Inventaire Restaurant"
                                link="/inventaire?ficheId=25"
                            />
                        )}

                        {hasRole("PNC") && (
                            <CardOverlay
                                title="Produit Non Conformes"
                                link="/produit-non-conforme"
                            />
                        )}

                        {hasRole("Fiche-controle") && (
                            <CardOverlay
                                title="Fiche de Controle Hygiene"
                                link="/fiche-controle"
                            />
                        )}

                        {hasRole("Livraison") && (
                            <CardOverlay
                                title="Livraison Restaurant"
                                link="/livraisons"
                            />
                        )}
                        {hasRole("Thermal") && (
                            <CardOverlay
                                title="Impression Thermique"
                                link="/thermal-receipts"
                            />
                        )}

                        {hasRole("Flux Reel") && (
                            <CardOverlay
                                title="Flux Reel"
                                link="/flux-reel"
                            />
                        )}
                        {hasRole("Cloture Caisse") && (
                            <CardOverlay
                                title="Cloture Caisse"
                                link="/cloture-caisse"
                            />
                        )}

                        {hasRole("Numero") && (
                            <CardOverlay
                                title="Numero"
                                link="/numeros"
                            />
                        )}
                        {hasRole("Infraction") && (
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