import React from 'react';
import { Printer, Text, Row, Line, Cut } from 'react-thermal-printer';

const BLThermalReceipt = ({ livraison }) => (
  <Printer type="epson">
    <Text size={{ width: 2, height: 2 }} align="center" bold={true}>
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
        <Text size={{ width: 1.5, height: 1.5 }} bold={true}>
          {restau.restau}
        </Text>
        <Line />
        
        <Row>
          <Text bold={true} width={3}>Produit</Text>
          <Text bold={true} width={1}>Qté</Text>
        </Row>
        
        {restau.products.map((product, prodIdx) => (
          <Row key={prodIdx}>
            <Text width={3}>{product.designation}</Text>
            <Text width={1}>{`${product.qty} ${product.unite}`}</Text>
          </Row>
        ))}
        
        <Line />
        <Text>Expediteur: _________________</Text>
        <Text>Transporteur: _______________</Text>
        <Text>Recepteur: _________________</Text>
        {idx < livraison.data.length - 1 && <Cut />}
      </React.Fragment>
    ))}
    <Cut />
  </Printer>
);

export default BLThermalReceipt;