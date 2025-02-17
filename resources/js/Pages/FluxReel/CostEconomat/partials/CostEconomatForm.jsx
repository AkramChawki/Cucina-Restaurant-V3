import React from 'react';
import SharedCostForm from '../../components/SharedCostForm';

export default function CostEconomatForm(props) {
    return (
        <SharedCostForm
            title="Cost Economat Food"
            routeName="cost-economat.update-value"
            {...props}
        />
    );
}