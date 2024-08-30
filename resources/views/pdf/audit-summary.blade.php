<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audit Summary</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 10px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header p {
            margin: 5px 0;
        }
        .audit-info {
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .image-container {
            text-align: center;
            margin-bottom: 30px;
        }
        .audit-image {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            @if ($audit->restau == 'Anoual')
            <h1>Cucina Napoli - Anoual</h1>
            <p>4 BD Anoual</p>
            <p>Casablanca</p>
            <p>+212 5 20 33 83 50 | anoual@cucinanapoli.com</p>
            @endif
            @if ($audit->restau == 'Palmier')
            <h1>Cucina Napoli - Palmier</h1>
            <p>13 rue Ahmed Naciri, Angle Rue Saria Ibnou Zounaim</p>
            <p>Casablanca</p>
            <p>+212 5 20 57 24 34 | palmier@cucinanapoli.com</p>
            @endif
            @if ($audit->restau == 'Ziraoui')
            <h1>Cucina Napoli - Ziraoui</h1>
            <p>267 Bd Ziraoui, Casablanca 20250</p>
            <p>Casablanca</p>
            <p>+212 5 20 82 32 22 | ziraoui@cucinanapoli.com</p>
            @endif
        </div>

        <h2 style="text-align: center;">Audit Summary</h2>
        <div class="audit-info">
            <table>
                <tr>
                    <th>Name</th>
                    <td>{{ $audit->name }}</td>
                </tr>
                <tr>
                    <th>Date</th>
                    <td>{{ $audit->date->format('Y-m-d') }}</td>
                </tr>
                <tr>
                    <th>Restaurant</th>
                    <td>{{ $audit->restau }}</td>
                </tr>
                <tr>
                    <th>Defaillance</th>
                    <td>{{ $audit->defeillance }}</td>
                </tr>
            </table>
        </div>
        @if($audit->image && isset($imageWidth) && isset($imageHeight))
            <div class="image-container">
                <img src="{{ storage_path('app/public/' . $audit->image) }}" alt="Audit Image" class="audit-image" width="{{ $imageWidth }}" height="{{ $imageHeight }}">
            </div>
        @endif
    </div>
</body>
</html>