<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Livraison Pour {{ $type }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
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
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            padding: 20px;
        }
        .signature-box {
            flex: 1;
            margin: 0 15px;
            text-align: center;
        }
        .signature-line {
            border: 1px solid silver;
            height: 100px;
            margin: 10px 0;
        }
        .signature-label {
            font-size: 14px;
            color: #333;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <h1>{{ $type }}</h1>
    <p>Date: {{ now()->format('Y-m-d H:i') }}</p>

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
                    <th>Envoie</th>
                    <th>Reception</th>
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
                        <td></td>
                        <td></td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Signature de l'expediteur</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Signature du transporteur</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Signature du recepteur</div>
            </div>
        </div>
    @endforeach
</body>
</html>