import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import BMLForm from './partials/BMLFom';

export default function BML({ restaurant, currentMonth, existingEntries, types, currentType }) {
    // Enhanced debugging
    console.log('BML component rendered with type:', currentType);
    console.log('Type is empty string?', currentType === '');
    console.log('Type is null?', currentType === null);
    console.log('Type is undefined?', currentType === undefined);
    console.log('Available types:', types);
    console.log('Existing entries count:', existingEntries ? existingEntries.length : 'No entries');
    
    // Ensure currentType is always a string (even if null/undefined)
    const processedType = currentType || '';
    
    useEffect(() => {
        console.log('BML component mounted with processed type:', processedType);
    }, []);
    
    return (
        <>
            <Head title={`BML - ${restaurant.name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <BMLForm
                        restaurant={restaurant}
                        currentMonth={currentMonth}
                        existingEntries={existingEntries || []}
                        types={types}
                        currentType={processedType}
                    />
                </div>
            </div>
        </>
    );
}