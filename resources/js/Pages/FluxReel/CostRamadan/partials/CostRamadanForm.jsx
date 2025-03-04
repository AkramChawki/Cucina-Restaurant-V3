import React from 'react';
import SharedCostForm from '../../components/SharedCostForm';

export default function CostRamadanForm(props) {
    return (
        <SharedCostForm
            title="Cost Ramadan"
            routeName="cost-ramadan.update-value"
            {...props}
        />
    );
}