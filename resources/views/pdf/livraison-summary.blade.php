<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Livraison Type {{$type}}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1, h2 { color: #333; }
    </style>
</head>
<body>
    <h1>Livraison Summary - Type {{$type}}</h1>
    <p>Date: {{now()->toDateString()}}</p>

    @foreach($data as $restau)
        <h2>{{$restau['restau']}}</h2>
        <table>
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                @foreach($restau['products'] as $product)
                    <tr>
                        <td>{{$product['product_id']}}</td>
                        <td>{{$product['name']}}</td>
                        <td>{{$product['qty']}}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach
</body>
</html>