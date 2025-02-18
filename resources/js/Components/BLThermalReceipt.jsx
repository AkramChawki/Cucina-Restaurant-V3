import React from 'react';
import { Printer, Text, Line } from 'react-thermal-printer';

export const BasicReceipt = () => {
  return [
    { type: 'text', value: 'Hello World!' },
    { type: 'line' },
    { type: 'text', value: 'Testing Printer' },
    { type: 'cut' }
  ];
};

export const BLThermalReceipt = ({ livraison }) => {
  return [
    { type: 'text', value: livraison.type, style: { bold: true, align: 'center' } },
    { type: 'text', value: new Date(livraison.created_at).toLocaleDateString(), align: 'center' },
    { type: 'line' },
    ...livraison.data.flatMap((restau, idx) => [
      { type: 'text', value: restau.restau, style: { bold: true } },
      { type: 'line' },
      ...restau.products.map(product => ({
        type: 'text',
        value: `${product.designation}: ${product.qty} ${product.unite}`
      })),
      { type: 'line' },
      { type: 'text', value: 'Expediteur: _________________' },
      { type: 'text', value: 'Transporteur: _______________' },
      { type: 'text', value: 'Recepteur: _________________' },
      { type: 'line' }
    ]),
    { type: 'cut' }
  ];
};