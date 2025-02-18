<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Livraison Pour {{ $type }}</title>
    <style>
        /* Reset margins and set base font */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Document settings for thermal paper */
        @page {
            size: 110mm auto;
            margin: 0;
        }

        body {
            width: 110mm;
            margin: 0;
            padding: 5mm;
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.2;
        }

        /* Header styles */
        .header {
            text-align: center;
            margin-bottom: 3mm;
        }

        .header h1 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 2mm;
        }

        .header p {
            font-size: 12px;
        }

        /* Restaurant name */
        .restaurant {
            font-size: 13px;
            font-weight: bold;
            margin: 3mm 0;
        }

        /* Table styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 3mm 0;
        }

        th, td {
            border: 0.5px solid #000;
            padding: 2mm;
            font-size: 11px;
            text-align: left;
        }

        th {
            font-weight: bold;
            background-color: #f0f0f0;
        }

        /* For centered or right-aligned columns */
        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        /* Signature section */
        .signature-section {
            margin-top: 10mm;
        }

        .signature-box {
            margin-bottom: 8mm;
        }

        .signature-line {
            border-bottom: 1px solid #000;
            height: 15mm;
            margin-bottom: 2mm;
        }

        .signature-label {
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $type }}</h1>
        <p>Date: {{ now()->format('Y-m-d H:i') }}</p>
    </div>

    @foreach ($data as $restau)
        <div class="restaurant">{{ $restau['restau'] }}</div>
        <table>
            <thead>
                <tr>
                    <th>Designation</th>
                    <th class="text-center">Qty</th>
                    @if(collect($restau['products'])->contains('has_rest', true))
                        <th class="text-center">Rest</th>
                    @endif
                    <th class="text-center">Unit</th>
                    <th class="text-center">Envoie</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($restau['products'] as $product)
                    <tr>
                        <td>{{ $product['designation'] }}</td>
                        <td class="text-center">{{ $product['qty'] }}</td>
                        @if(collect($restau['products'])->contains('has_rest', true))
                            <td class="text-center">{{ $product['has_rest'] ? $product['rest'] : '-' }}</td>
                        @endif
                        <td class="text-center">{{ $product['unite'] }}</td>
                        <td class="text-center"></td>
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