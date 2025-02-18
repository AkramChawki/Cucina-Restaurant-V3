import React from 'react';
import { Printer, Text, Line } from 'react-thermal-printer';

// Basic test component to verify printer functionality
export const BasicReceipt = React.forwardRef((props, ref) => {
  return (
    <Printer type="epson">
      <Text content="Hello World!" />
      <Line />
      <Text content="Testing Printer" />
    </Printer>
  );
});

// Actual receipt component
export const BLThermalReceipt = React.forwardRef(({ livraison }, ref) => {
  return (
    <Printer type="epson">
      <Text content={livraison.type} />
      <Line />
      <Text content={`Date: ${new Date(livraison.created_at).toLocaleDateString()}`} />
      <Line />
      {livraison.data.map((restau, idx) => (
        <React.Fragment key={idx}>
          <Text content={restau.restau} />
          <Line />
        </React.Fragment>
      ))}
    </Printer>
  );
});