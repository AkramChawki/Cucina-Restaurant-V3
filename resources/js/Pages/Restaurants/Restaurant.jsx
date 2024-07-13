import { React, useState } from 'react'
import { Switch } from '@headlessui/react'
import { router, useForm } from '@inertiajs/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Restaurant({ restaurant, products }) {
    const restau = restaurant.name.toLowerCase();
    const [Renabled, setREnabled] = useState(restaurant.visible);
    const { post } = useForm();

    useEffect(() => {
        setREnabled(restaurant.visible);
    }, [restaurant.visible]);

    const toggleVisibility = () => {
        post(`/restaurant/${restaurant.id}/toggle-visibility`, {
            onSuccess: (response) => {
                setREnabled(response.visible);
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const toggleRestaurant = (productId, enabled) => {
        router.post(`/product/${productId}/toggle-restaurant`, {
            restaurant_name: restau,
            add_restaurant: enabled,
        }, {
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };
    return (
        <div className="container mx-auto sm:px-6 lg:px-8">
            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{restaurant.name}</h3>
                    </div>
                    <div className="ml-4 mt-2 flex-shrink-0">
                        <Switch
                            checked={Renabled == 1}
                            onChange={toggleVisibility}
                            className={classNames(
                                Renabled ? 'bg-green-600' : 'bg-gray-200',
                                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                            )}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                className={classNames(
                                    Renabled ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                )}
                            >
                                <span
                                    className={classNames(
                                        Renabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                                        'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                    )}
                                    aria-hidden="true"
                                >
                                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                        <path
                                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <span
                                    className={classNames(
                                        Renabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                                        'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                    )}
                                    aria-hidden="true"
                                >
                                    <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Image
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Status
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => {
                                        const isEnabled = Array.isArray(product.restaurant) && product.restaurant.includes(restau);
                                        const [Penabled, setPEnabled] = useState(isEnabled);

                                        const handleToggle = async () => {
                                            const newEnabled = !Penabled;
                                            setPEnabled(newEnabled);
                                            await toggleRestaurant(product.id, newEnabled);
                                        };

                                        return (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-full" src="" alt="" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{product.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Switch
                                                        checked={Penabled}
                                                        onChange={handleToggle}
                                                        className={classNames(
                                                            Penabled ? 'bg-green-600' : 'bg-gray-200',
                                                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                                        )}
                                                    >
                                                        <span className="sr-only">Use setting</span>
                                                        <span
                                                            className={classNames(
                                                                Penabled ? 'translate-x-5' : 'translate-x-0',
                                                                'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                            )}
                                                        >
                                                            <span
                                                                className={classNames(
                                                                    Penabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                                                                    'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                                                )}
                                                                aria-hidden="true"
                                                            >
                                                                <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                                                    <path
                                                                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            </span>
                                                            <span
                                                                className={classNames(
                                                                    Penabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                                                                    'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                                                )}
                                                                aria-hidden="true"
                                                            >
                                                                <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 12 12">
                                                                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414z" />
                                                                </svg>
                                                            </span>
                                                        </span>
                                                    </Switch>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


