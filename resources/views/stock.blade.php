@extends('layout')

@section('content')
    <div class='max-w-7xl mx-auto sm:px-6 lg:px-8'>
        <form method="post" action="/inventaire/stock">
            @csrf
            <div>
                <input type="hidden" name="name" value={{ auth()->user()->name }} />
                <input type="hidden" name="restau" value={{ $restau }} />
                <input type="hidden" name="ficheId" value={{ $ficheId }} />
                @foreach ($categories as $category)
                    <div>
                        <h1 class='p-4 text-4xl font-bold text'>{{ $category->name }}</h1>
                        <div
                            class="mt-12 max-w-4xl mx-auto grid gap-3 lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-1 lg:max-w-none">
                            @foreach ($category->products as $product)
                                <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                    <div class="flex-shrink-0">
                                        <img class="h-48 w-full object-cover"
                                            src="https://admin.cucinanapoli.com/storage/{{ $product->image }}"
                                            alt="" />
                                    </div>
                                    <div class="flex-1 bg-white p-6 flex flex-col justify-between">
                                        <div class="flex-1">
                                            <a class="block mt-2">
                                                <p class="text-xl font-semibold text-gray-900 text-center">
                                                    {{ $product->designation }}
                                                </p>
                                            </a>
                                        </div>
                                        <div class="mt-6 flex justify-center">
                                            <div class="ml-3 w-full">
                                                <input type="number" name="qty[]"
                                                    class="focus:ring-[#90D88C] focus:border-[#90D88C] block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md text-center"
                                                    placeholder="0" min="0" />
                                                <div class='text-center my-4'>
                                                    unité {{ $product->unite }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class='flex justify-center my-4'>
                                            <input type="hidden" name="products_ids[]" value={{ $product->id }}
                                                class="focus:ring-[#90D88C] h-7 w-7 text-[#73ac70] border-black border-4 rounded " />
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            </div>
            <div class='px-4 py-4'>
                <button type="submit"
                    class="inline-flex items-center w-[100%] mt-10 px-4 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]">
                    Enregistrer
                </button>
                <a href="/"
                    class="inline-flex items-center w-[100%] mt-2 px-4 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]">
                    Annuler
                </a>
            </div>
        </form>
    </div>
@endsection
