import React from 'react';
import { Head } from '@inertiajs/react';
import BMLForm from './partials/BMLFom';

export default function BML({ restaurant, currentMonth, existingEntries, types, currentType }) {
    console.log('BML component rendered with type:', currentType);
    console.log('Available types:', types);
    console.log('Existing entries count:', existingEntries.length);
    
    return (
        <>
            <Head title={`BML - ${restaurant.name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <BMLForm
                        restaurant={restaurant}
                        currentMonth={currentMonth}
                        existingEntries={existingEntries}
                        types={types}
                        currentType={currentType}
                    />
                </div>
            </div>
        </>
    );
}