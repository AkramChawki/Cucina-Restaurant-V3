import React from 'react';
import { Printer, Text, Line } from 'react-thermal-printer';

// Basic test component to verify printer functionality
const BasicReceipt = () => (
  <Printer type="epson">
    <Text>Hello World!</Text>
    <Line />
    <Text>Testing Printer</Text>
  </Printer>
);

// Actual receipt component - we'll use this after basic test works
const BLThermalReceipt = ({ livraison }) => (
  <Printer type="epson">
    <Text>{livraison.type}</Text>
    <Line />
    <Text>Date: {new Date(livraison.created_at).toLocaleDateString()}</Text>
    <Line />
    {livraison.data.map((restau, idx) => (
      <React.Fragment key={idx}>
        <Text>{restau.restau}</Text>
        <Line />
      </React.Fragment>
    ))}
  </Printer>
);

export { BasicReceipt, BLThermalReceipt };