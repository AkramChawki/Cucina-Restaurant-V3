import React from 'react';
import { Text, Row, Line } from 'react-thermal-printer';

// Note: removed Printer and Cut from imports as they're not needed in the component
const BLThermalReceipt = ({ livraison }) => (
  <>
    <Text align="center" bold={true}>
      {livraison.type}
    </Text>
    <Text align="center">
      {new Date(livraison.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </Text>
    <Text align="center">
      {new Date(livraison.created_at).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })}
    </Text>
    <Line />
    
    {livraison.data.map((restau, idx) => (
      <React.Fragment key={idx}>
        <Text bold={true}>
          {restau.restau}
        </Text>
        <Line />
        
        {restau.products.map((product, prodIdx) => (
          <Row key={prodIdx}>
            <Text>{product.designation}</Text>
            <Text>{`${product.qty} ${product.unite}`}</Text>
          </Row>
        ))}
        
        <Line />
        <Text>Expediteur: _________________</Text>
        <Text>Transporteur: _______________</Text>
        <Text>Recepteur: _________________</Text>
        <Line />
      </React.Fragment>
    ))}
  </>
);

export default BLThermalReceipt;