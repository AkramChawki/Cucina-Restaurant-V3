import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { EnhancedThermalReceipt } from "@/Components/EnhancedThermalReceipt";

export default function ThermalReceipts({ thermalReceipts }) {
    const [isPrinting, setIsPrinting] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    
    const uniqueRestaurants = [...new Set(thermalReceipts.map(r => r.restaurant))].sort();
    
    // Group receipts by date
    const groupedReceipts = thermalReceipts.reduce((acc, receipt) => {
        const date = new Date(receipt.created_at).toLocaleDateString('fr-FR');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(receipt);
        return acc;
    }, {});
    
    const sortedDates = Object.keys(groupedReceipts).sort((a, b) => 
        new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-'))
    );
    
    const handlePrint = async (receipt) => {
        try {
            setIsPrinting(true);
            console.log('Starting print process...');
    
            // Get thermal receipt commands
            const commands = EnhancedThermalReceipt({ receipt: receipt.data });
            console.log('Commands generated:', commands);
    
            // Request port access
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
    
            const writer = port.writable.getWriter();
    
            try {
                // Initialize printer
                await writer.write(new Uint8Array([0x1B, 0x40])); // ESC @
    
                // Process each command
                for (const command of commands) {
                    let bytes;
                    
                    switch (command.type) {
                        case 'text':
                            // Apply text styling if present
                            if (command.style?.bold) {
                                await writer.write(new Uint8Array([0x1B, 0x45, 0x01])); // ESC E 1
                            }
                            
                            if (command.style?.underline) {
                                await writer.write(new Uint8Array([0x1B, 0x2D, 0x01])); // ESC - 1
                            }
                            
                            // Set alignment if specified
                            if (command.style?.align) {
                                const alignCode = 
                                    command.style.align === 'center' ? 1 : 
                                    command.style.align === 'right' ? 2 : 0;
                                await writer.write(new Uint8Array([0x1B, 0x61, alignCode])); // ESC a n
                            }
                            
                            // Set text size if specified
                            if (command.style?.size === 'L') {
                                await writer.write(new Uint8Array([0x1D, 0x21, 0x11])); // GS ! 0x11 (double height and width)
                            }
                            
                            // Write the text and newline
                            bytes = new TextEncoder().encode(command.value + '\n');
                            await writer.write(bytes);
                            
                            // Reset styling
                            if (command.style?.bold) {
                                await writer.write(new Uint8Array([0x1B, 0x45, 0x00])); // ESC E 0
                            }
                            
                            if (command.style?.underline) {
                                await writer.write(new Uint8Array([0x1B, 0x2D, 0x00])); // ESC - 0
                            }
                            
                            if (command.style?.align) {
                                await writer.write(new Uint8Array([0x1B, 0x61, 0x00])); // ESC a 0 (left align)
                            }
                            
                            if (command.style?.size) {
                                await writer.write(new Uint8Array([0x1D, 0x21, 0x00])); // GS ! 0 (normal size)
                            }
                            break;
                            
                        case 'line':
                            // Draw a line with the specified character or default to '-'
                            const lineChar = command.character || '-';
                            const lineLength = 42; // Standard 80mm thermal printer width (in characters)
                            const line = lineChar.repeat(lineLength) + '\n';
                            bytes = new TextEncoder().encode(line);
                            await writer.write(bytes);
                            break;
                            
                        case 'cut':
                            bytes = new Uint8Array([0x1D, 0x56, 0x41, 0x00]);
                            await writer.write(bytes);
                            break;
                            
                        default:
                            console.log('Unknown command:', command);
                            continue;
                    }
                }
    
                console.log('Print job completed successfully');
                
                // Mark receipt as printed using Inertia.js
                router.post(`/thermal-receipts/${receipt.id}/printed`, {}, {
                    preserveState: true,
                    onSuccess: () => {
                        // Update the receipt status in the UI without a full page reload
                        receipt.printed = true;
                    }
                });
            } finally {
                writer.releaseLock();
                await port.close();
            }
            
        } catch (error) {
            console.error('Detailed error:', error);
            alert(`Échec de l'impression. Erreur: ${error.message}`);
        } finally {
            setIsPrinting(false);
        }
    };
    
    const filterReceipts = (receiptsArray) => {
        return receiptsArray.filter(receipt => {
            const matchesRestaurant = !selectedRestaurant || receipt.restaurant === selectedRestaurant;
            return matchesRestaurant;
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Tickets de Livraison (Thermique)</h1>
                
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="w-64">
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
                    const filteredReceipts = filterReceipts(groupedReceipts[date]);
                    
                    if (filteredReceipts.length === 0) return null;
                    
                    return (
                        <div key={date} className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">
                                {date}
                            </h2>
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Restaurant
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Heure
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Statut
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredReceipts.map((receipt) => (
                                                <tr key={receipt.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {receipt.restaurant}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {receipt.receipt_id.substring(0, 8)}...
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(receipt.created_at).toLocaleString("fr-FR", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            receipt.printed
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {receipt.printed ? 'Imprimé' : 'Non imprimé'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => handlePrint(receipt)}
                                                            disabled={isPrinting}
                                                            className={`text-white bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded ${
                                                                isPrinting ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        >
                                                            {isPrinting ? 'Impression...' : 'Imprimer Ticket'}
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