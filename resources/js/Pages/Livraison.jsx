import BLThermalReceipt from "@/Components/BLThermalReceipt";
import React, { useState } from "react";
import { Printer } from 'react-thermal-printer';
import { render } from 'react-thermal-printer';

export default function Livraison({ livraisons }) {
    const [isPrinting, setIsPrinting] = useState(false);
    
    const groupedLivraisons = livraisons.reduce((acc, livraison) => {
        const date = livraison.created_at.split("T")[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(livraison);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedLivraisons).sort((a, b) => new Date(b) - new Date(a));
    const [selectedType, setSelectedType] = useState("");
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const uniqueTypes = [...new Set(livraisons.map(l => l.type))].sort();
    const uniqueRestaurants = [...new Set(livraisons.map(l => l.restaurant_group))].sort();

    const handlePrint = async (livraison) => {
        try {
            setIsPrinting(true);
            console.log('Starting print process...');
    
            // Render the receipt content
            const data = await render(
                // Printer component is used here during render
                <Printer type="epson">
                    <BLThermalReceipt livraison={livraison} />
                </Printer>
            );
    
            console.log('Receipt rendered successfully');
    
            // Request port access
            console.log('Requesting port access...');
            const port = await navigator.serial.requestPort();
            
            console.log('Opening port...');
            await port.open({ 
                baudRate: 9600,
                dataBits: 8,
                stopBits: 1,
                parity: "none"
            });
    
            console.log('Port opened successfully');
    
            // Get a writer
            const writer = port.writable?.getWriter();
            if (!writer) {
                throw new Error('Failed to get writer');
            }
    
            try {
                // Initialize printer
                console.log('Initializing printer...');
                await writer.write(new Uint8Array([0x1B, 0x40])); // ESC @ - Initialize printer
                
                // Write the data
                console.log('Writing data to printer...');
                await writer.write(data);
                
                // Cut paper
                console.log('Cutting paper...');
                await writer.write(new Uint8Array([0x1D, 0x56, 0x41, 0x00])); // GS V A - Cut paper
                
                console.log('Print job completed successfully');
            } finally {
                writer.releaseLock();
            }
    
            await port.close();
            console.log('Port closed');
            
        } catch (error) {
            console.error('Detailed error:', error);
            alert(`Échec de l'impression. Erreur: ${error.message}`);
        } finally {
            setIsPrinting(false);
        }
    };

    const filterLivraisons = (livraisonsArray) => {
        return livraisonsArray.filter(livraison => {
            const matchesType = !selectedType || livraison.type === selectedType;
            const matchesRestaurant = !selectedRestaurant || livraison.restaurant_group === selectedRestaurant;
            return matchesType && matchesRestaurant;
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type de BL
                        </label>
                        <select 
                            className="w-full border-gray-300 rounded-md shadow-sm"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">Tous les types</option>
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Restaurant
                        </label>
                        <select 
                            className="w-full border-gray-300 rounded-md shadow-sm"
                            value={selectedRestaurant}
                            onChange={(e) => setSelectedRestaurant(e.target.value)}
                        >
                            <option value="">Tous les restaurants</option>
                            {uniqueRestaurants.map(restaurant => (
                                <option key={restaurant} value={restaurant}>{restaurant}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {sortedDates.map((date) => {
                    const filteredLivraisons = filterLivraisons(groupedLivraisons[date]);
                    
                    if (filteredLivraisons.length === 0) return null;
                    return (
                        <div key={date} className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">
                                {new Date(date).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </h2>
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type de BL
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Restaurant
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Heure
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredLivraisons.map((livraison) => (
                                                <tr key={livraison.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {livraison.type}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {livraison.restaurant_group}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(livraison.created_at).toLocaleString("fr-FR", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                                                        <a 
                                                            href={livraison.pdf_url}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Télécharger PDF
                                                        </a>
                                                        <button
                                                            onClick={() => handlePrint(livraison)}
                                                            disabled={isPrinting}
                                                            className={`text-green-600 hover:text-green-800 font-medium ${
                                                                isPrinting ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        >
                                                            {isPrinting ? 'Impression...' : 'Imprimer BL'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}