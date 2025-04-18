import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { EnhancedThermalReceipt } from "@/Components/EnhancedThermalReceipt";

export default function RestaurantLatestReceipt({ restaurant }) {
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPrinting, setIsPrinting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load the latest receipt for this restaurant
        router.visit(`/thermal-receipts/restaurant/${restaurant}`, {
            method: 'get',
            onSuccess: (page) => {
                if (page.props.receipt) {
                    setReceipt(page.props.receipt);
                    setError('');
                } else {
                    setError('Aucun ticket trouvé pour ce restaurant');
                }
                setLoading(false);
            },
            onError: () => {
                setError('Erreur lors du chargement du ticket');
                setLoading(false);
            },
            preserveState: true,
        });
    }, [restaurant]);

    const handlePrint = async () => {
        if (!receipt) return;
        
        try {
            setIsPrinting(true);
            console.log('Starting print process...');
    
            // Get thermal receipt commands
            const commands = EnhancedThermalReceipt({ receipt: receipt.data });
    
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
                        // Update the receipt status in the UI
                        setReceipt({
                            ...receipt,
                            printed: true
                        });
                    }
                });
            } finally {
                writer.releaseLock();
                await port.close();
            }
            
        } catch (error) {
            console.error('Detailed error:', error);
            setError(`Échec de l'impression. Erreur: ${error.message}`);
        } finally {
            setIsPrinting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
            </div>
        );
    }

    if (!receipt) {
        return (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p>Aucun ticket disponible pour ce restaurant</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Dernier ticket pour {restaurant}</h2>
            
            <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-600 font-medium">ID:</span> 
                        <span className="ml-2">{receipt.receipt_id.substring(0, 8)}...</span>
                    </div>
                    <div>
                        <span className="text-gray-600 font-medium">Date:</span>
                        <span className="ml-2">
                            {new Date(receipt.created_at).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600 font-medium">Heure:</span>
                        <span className="ml-2">
                            {new Date(receipt.created_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600 font-medium">Statut:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                            receipt.printed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {receipt.printed ? 'Imprimé' : 'Non imprimé'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="border-t border-gray-200 py-4">
                <h3 className="font-semibold mb-2">Contenu du ticket:</h3>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    {receipt.data.thermal_blocks.map((block, idx) => (
                        <div key={idx} className="mb-3">
                            <h4 className="font-bold">{block.type}</h4>
                            <ul>
                                {block.products.map((product, pidx) => (
                                    <li key={pidx}>
                                        {product.designation}: {product.qty} {product.unite}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-4">
                <button
                    onClick={handlePrint}
                    disabled={isPrinting}
                    className={`text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded ${
                        isPrinting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isPrinting ? 'Impression...' : 'Imprimer Ticket'}
                </button>
            </div>
        </div>
    );
}