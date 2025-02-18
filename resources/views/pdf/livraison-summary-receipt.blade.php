<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Livraison Pour {{ $type }}</title>
    <style>
        @page {
            size: 110mm auto;
            margin: 0;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 5mm;
            width: 100mm;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: left;
            font-size: 10px;
        }
        th {
            background-color: #f2f2f2;
        }
        h1 {
            color: #333;
            font-size: 14px;
            margin: 5px 0;
            text-align: center;
        }
        h2 {
            color: #333;
            font-size: 12px;
            margin: 8px 0;
        }
        h4 {
            margin: 0;
            font-size: 10px;
        }
        .date {
            text-align: center;
            font-size: 10px;
            margin-bottom: 10px;
        }
        .signature-section {
            margin-top: 20px;
            padding: 5px;
        }
        .signature-box {
            margin: 10px 0;
        }
        .signature-line {
            border-bottom: 1px solid silver;
            height: 40px;
            margin: 5px 0;
        }
        .signature-label {
            font-size: 10px;
            color: #333;
            margin-top: 2px;
        }
    </style>
</head>
<body>
    <h1>{{ $type }}</h1>
    <div class="date">Date: {{ now()->format('Y-m-d H:i') }}</div>

    @foreach ($data as $restau)
        <h2>{{ $restau['restau'] }}</h2>
        <table>
            <thead>
                <tr>
                    <th>Designation</th>
                    <th>Qty</th>
                    @if(collect($restau['products'])->contains('has_rest', true))
                        <th>Rest</th>
                    @endif
                    <th>Unit</th>
                    <th>Envoie</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($restau['products'] as $product)
                    <tr>
                        <td>
                            <h4>{{ $product['designation'] }}</h4>
                        </td>
                        <td>{{ $product['qty'] }}</td>
                        @if(collect($restau['products'])->contains('has_rest', true))
                            <td>{{ $product['has_rest'] ? $product['rest'] : '-' }}</td>
                        @endif
                        <td>{{ $product['unite'] }}</td>
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