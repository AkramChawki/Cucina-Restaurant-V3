import React from 'react';
import { Printer, Text, Row, Line, Cut } from 'react-thermal-printer';

const BLThermalReceipt = ({ livraison }) => (
  <Printer type="epson" width={48}> {/* XP-TT426B typically has 48 characters per line */}
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
        <Text size={{ width: 1, height: 1 }} bold={true}>
          {restau.restau}
        </Text>
        <Line />
        
        {restau.products.map((product, prodIdx) => (
          <Row key={prodIdx}>
            <Text width={2} wordWrap={true}>{product.designation}</Text>
            <Text width={1} align="right">{`${product.qty} ${product.unite}`}</Text>
          </Row>
        ))}
        
        <Line />
        <Text>Expediteur: _________________</Text>
        <Text>Transporteur: _______________</Text>
        <Text>Recepteur: _________________</Text>
        {idx < livraison.data.length - 1 && <Cut partial={true} />}
      </React.Fragment>
    ))}
    <Cut />
  </Printer>
);

export default BLThermalReceipt;