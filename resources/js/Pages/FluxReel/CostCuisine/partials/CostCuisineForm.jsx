import React, { useState } from 'react';
import SharedCostForm from '../../components/SharedCostForm';

export default function CostCuisineForm(props) {
    return (
            <SharedCostForm
                title="Cost Cuisine Food"
                routeName="cost-cuisine.update-value"
                {...props}
            />
        );
}