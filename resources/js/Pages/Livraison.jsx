import { Head } from '@inertiajs/react';
import React from 'react';

const ProductTypeTable = ({ products }) => {
    if (products.length === 0) return <p>No products for this type.</p>;
    return (
        <table className="min-w-full bg-white border border-gray-300 mb-4">
            <thead>
                <tr>
                    <th className="px-4 py-2 border-b">Product ID</th>
                    <th className="px-4 py-2 border-b">Quantity</th>
                </tr>
            </thead>
            <tbody>
                {products.map((item) => (
                    <tr key={item.product_id}>
                        <td className="px-4 py-2 border-b">{item.product_id}</td>
                        <td className="px-4 py-2 border-b">{item.qty}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const RestaurantSection = ({ restau, types }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{restau}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(type => (
                    <div key={type}>
                        <h3 className="text-lg font-semibold mb-2">Type {type}</h3>
                        <ProductTypeTable products={types[type] || []} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const Livraison = ({ livraisonData, date }) => {
    console.log(livraisonData)
    return (
        <>
            <Head title="Livraison Data" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Livraison Data for {date}</h1>
                    {livraisonData ? (
                        Object.entries(livraisonData).map(([restau, types]) => (
                            <RestaurantSection key={restau} restau={restau} types={types} />
                        ))
                    ) : (
                        <p>No data available for this date.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Livraison;