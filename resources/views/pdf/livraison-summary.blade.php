<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Livraison Pour {{ $type }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        h1, h2 {
            color: #333;
        }
        .product-image {
            max-width: 50px;
            max-height: 50px;
        }
    </style>
</head>
<body>
    <h1>{{ $type }}</h1>
    <p>Date: {{ now()->toDateString() }}</p>

    @foreach ($data as $restau)
        <h2>{{ $restau['restau'] }}</h2>
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Designation</th>
                    <th>Quantity</th>
                    @if(collect($restau['products'])->contains('has_rest', true))
                        <th>Rest</th>
                    @endif
                    <th>Unit</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($restau['products'] as $product)
                    <tr>
                        <td>
                            <img src="https://admin.cucinanapoli.com/storage/{{ $product['image'] }}" 
                                 alt="" width="40px" height="40px">
                        </td>
                        <td>
                            <h4>{{ $product['designation'] }}</h4>
                        </td>
                        <td>{{ $product['qty'] }}</td>
                        @if(collect($restau['products'])->contains('has_rest', true))
                            <td>{{ $product['has_rest'] ? $product['rest'] : '-' }}</td>
                        @endif
                        <td>{{ $product['unite'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach
</body>
</html>