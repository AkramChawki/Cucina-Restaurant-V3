
import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    MenuAlt2Icon,
    XIcon,
} from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'
import { Link, router, useForm, usePage } from '@inertiajs/react'

const userNavigation = [
    { name: 'Se Déconnecter', href: 'logout' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Table({ categories, ficheId, restau }) {
    const { auth } = usePage().props;
    const { data, setData, post } = useForm({
        name: auth.user.name,
        restau: restau || null,
        ficheId: ficheId,
        products: categories.reduce((acc, category) => {
            category.products.forEach(product => {
                acc.push({ id: product.id, qty: '' });
            });
            return acc;
        }, [])
    });

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [filterText, setFilterText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit button clicked');
    
        const filteredProducts = data.products.filter(product => product.qty !== '' && parseFloat(product.qty.replace(',', '.')) > 0);
        const filteredData = { 
            name: data.name,
            restau: data.restau || null,
            products: filteredProducts.map(product => ({
                id: product.id,
                qty: parseFloat(product.qty.replace(',', '.'))
            }))
        };
    
        if (!filteredData.restau) {
            delete filteredData.restau;
        }
    
        console.log('Filtered data:', filteredData);
    
        let endpoint = '';
        if (ficheId == 7) {
            endpoint = '/inventaire/inv';
        } else if (ficheId == 8) {
            endpoint = '/inventaire/cntrl';
        }
        console.log('Endpoint:', endpoint);
    
        router.post(endpoint, filteredData, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const handleQtyChange = (productId, value) => {
        const regex = /^-?\d*[.,]?\d*$/;
        if (!regex.test(value) && value !== '') return;

        const updatedProducts = data.products.map(product =>
            product.id === productId ? { ...product, qty: value } : product
        );
        setData('products', updatedProducts);
    };

    const handleBlur = (productId) => {
        const product = data.products.find(p => p.id === productId);
        if (!product) return;

        let value = product.qty;
        if (value === '' || isNaN(parseFloat(value.replace(',', '.')))) {
            value = '0';
        } else {
            value = parseFloat(value.replace(',', '.')).toString().replace('.', ',');
        }

        const updatedProducts = data.products.map(p =>
            p.id === productId ? { ...p, qty: value } : p
        );
        setData('products', updatedProducts);
    };

    const handleFilterChange = (e) => {
        setFilterText(e.target.value.toLowerCase());
    };

    const filteredCategories = categories.map((category) => {
        const filteredProducts = category.products.filter(product =>
            product.designation.toLowerCase().includes(filterText)
        );
        return { ...category, products: filteredProducts };
    }).filter(category => category.products.length > 0);

    const navigation = filteredCategories.map(category => ({
        name: category.name,
        href: `#${category.name.toLowerCase()}`,
    }));

    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-[#0D3D33]">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-shrink-0 flex items-center px-4">
                                    <img
                                        className="h-8 w-20"
                                        src="/images/logo/Cucina.png"
                                        alt="Workflow"
                                    />
                                </div>
                                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                                    <nav className="px-2 space-y-1">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current ? 'bg-[#0D3D33] text-white' : 'text-[#90D88C] hover:bg-[#73ac70]',
                                                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                                )}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                        </div>
                    </Dialog>
                </Transition.Root>
                <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                    <div className="flex flex-col flex-grow pt-5 bg-[#0D3D33] overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <img
                                className="h-16 w-auto mx-auto"
                                src="/images/logo/Cucina.png"
                                alt="Workflow"
                            />
                        </div>
                        <div className="mt-5 flex-1 flex flex-col">
                            <nav className="flex-1 px-2 pb-4 space-y-1">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'bg-[#0D3D33] text-white' : 'text-[#90D88C] hover:bg-[#73ac70]',
                                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="md:pl-64 flex flex-col flex-1">
                    <form onSubmit={handleSubmit}>
                        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
                            <button
                                type="button"
                                className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#90D88C] md:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <div className="flex-1 px-4 flex justify-between">
                                <div className="flex-1 flex">
                                    <div className="w-full flex md:ml-0">
                                        <label htmlFor="search-field" className="sr-only">
                                            Search
                                        </label>
                                        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                                <SearchIcon className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <input
                                                id="search-field"
                                                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                                placeholder="Search"
                                                type="text"
                                                name="search"
                                                value={filterText}
                                                onChange={handleFilterChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-4 flex items-center md:ml-6">
                                    <Menu as="div" className="ml-3 relative">
                                        <div>
                                            <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]">
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                                                    alt=""
                                                />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {userNavigation.map((item) => (
                                                    <Menu.Item key={item.name}>
                                                        {({ active }) => (
                                                            <Link
                                                                href={route(item.href)} method="post"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm text-gray-700'
                                                                )}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                        <main>
                            <div className="py-6">
                                {filteredCategories.map((category) => (
                                    <div key={`c-${category.id}`}>
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                            <h1 id={category.name.toLowerCase()} className="text-2xl font-semibold text-gray-900">{category.name}</h1>
                                        </div>
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                            <div className="mt-12 max-w-4xl mx-auto grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 lg:max-w-none">
                                                {category.products.map(product => (
                                                    <div key={`p-${product.id}`} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                                        <div className="flex-shrink-0">
                                                            <img className="h-48 w-full object-cover" src={"https://admin.cucinanapoli.com/storage/" + product.image} alt="" />
                                                        </div>
                                                        <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                                            <div className="flex-1">
                                                                <a className="block mt-2">
                                                                    <p className="text-xl font-semibold text-gray-900 text-center">{product.designation}</p>
                                                                </a>
                                                            </div>
                                                            <div className="mt-6 flex justify-center">
                                                                <div className="ml-3 w-full">
                                                                    <input
                                                                        type="text"
                                                                        className="focus:ring-[#90D88C] focus:border-[#90D88C] block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md text-center"
                                                                        placeholder="0"
                                                                        value={data.products.find(p => p.id === product.id)?.qty}
                                                                        onChange={(e) => handleQtyChange(product.id, e.target.value)}
                                                                        onBlur={() => handleBlur(product.id)}
                                                                    />
                                                                    <div className='text-center my-4'>
                                                                        unité ({product.unite})
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className='px-4 py-4'>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center w-[100%] mt-10 px-4 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]"
                                    >
                                        Envoyer
                                    </button>
                                    <Link
                                        type="button"
                                        as="button"
                                        href="/"
                                        className="inline-flex items-center w-[100%] mt-2 px-4 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]"
                                    >
                                        Annuler
                                    </Link>
                                </div>
                            </div>
                        </main>
                    </form>
                </div>
            </div>
        </>
    )
}
