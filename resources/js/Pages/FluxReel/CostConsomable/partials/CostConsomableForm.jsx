import React from 'react';
import SharedCostForm from '../../components/SharedCostForm';

export default function CostConsomableForm(props) {
    return (
        <SharedCostForm
            title="Cost Consomable"
            routeName="cost-consomable.update-value"
            {...props}
        />
    );
}