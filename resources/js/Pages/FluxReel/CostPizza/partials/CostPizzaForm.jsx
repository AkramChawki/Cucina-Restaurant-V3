import React from 'react';
import SharedCostForm from '../../components/SharedCostForm';

export default function CostPizzaForm(props) {
    return (
        <SharedCostForm
            title="Cost Pizza"
            routeName="cost-pizza.update-value"
            {...props}
        />
    );
}