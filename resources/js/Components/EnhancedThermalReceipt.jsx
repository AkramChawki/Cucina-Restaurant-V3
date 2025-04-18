import React from 'react';

export const EnhancedThermalReceipt = ({ receipt }) => {
  return [
    // Header
    { type: 'text', value: 'CUCINA NAPOLI', style: { bold: true, align: 'center', size: 'L' } },
    { type: 'text', value: receipt.restaurant, style: { bold: true, align: 'center' } },
    { type: 'text', value: new Date(receipt.date).toLocaleString('fr-FR'), style: { align: 'center' } },
    { type: 'text', value: `ID: ${receipt.id.substring(0, 8)}`, style: { align: 'center' } },
    { type: 'line' },
    
    // For each thermal block (consolidated BL type)
    ...receipt.thermal_blocks.flatMap((block, idx) => [
      { type: 'text', value: block.type, style: { bold: true, underline: true } },
      { type: 'line', character: '-' },
      
      // Products within this block
      ...block.products.map(product => ({
        type: 'text',
        value: `${product.designation}: ${product.qty} ${product.unite}`
      })),
      
      // Separator between blocks
      { type: 'line' }
    ]),
    
    // Signature section
    { type: 'text', value: 'Signatures:', style: { bold: true } },
    { type: 'line', character: '-' },
    { type: 'text', value: 'Expediteur: _________________' },
    { type: 'text', value: 'Transporteur: _______________' },
    { type: 'text', value: 'Recepteur: _________________' },
    { type: 'line' },
    
    // Footer
    { type: 'text', value: new Date().toLocaleString('fr-FR'), style: { align: 'center' } },
    { type: 'text', value: 'Merci', style: { align: 'center' } },
    { type: 'cut' }
  ];
};