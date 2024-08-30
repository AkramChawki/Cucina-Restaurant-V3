<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audit PDF</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20mm;
            box-sizing: border-box;
            height: 297mm;
            width: 210mm;
        }

        .header {
            border-bottom: 1px solid #000;
            padding-bottom: 10mm;
            margin-bottom: 10mm;
        }

        .image-container {
            text-align: center;
            margin-bottom: 10mm;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 2mm;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <div class="header">
        @if ($audit->restau == 'Anoual')
        <h1>Cucina Napoli - Anoual</h1>
        <p>4 BD Anoual</p>
        <p>Casablance</p>
        <p>+212 5 20 33 83 50 | anoual@cucinanapoli.com</p>
        @endif
        @if ($audit->restau == 'Palmier')
        <h1>Cucina Napoli - Palmier</h1>
        <p>13 rue Ahmed Naciri, Angle Rue Saria Ibnou Zounaim</p>
        <p>Casablance</p>
        <p>+212 5 20 57 24 34 | palmier@cucinanapoli.com</p>
        @endif
        @if ($audit->restau == 'Ziraoui')
        <h1>Cucina Napoli = Ziraoui</h1>
        <p>267 Bd Ziraoui, Casablanca 20250</p>
        <p>Casablance</p>
        <p>+212 5 20 82 32 22 | ziraoui@cucinanapoli.com</p>
        @endif
    </div>

    <div class="image-container">
        <img src="https://restaurant.cucinanapoli.com/storage/{{ $audit->image }}" alt="Product Image">
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Audit Par</th>
                <th>Defeillance</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{$audit->created_at}}</td>
                <td>{{$audit->name}}</td>
                <td>{{$audit->defeillance}}</td>
            </tr>
        </tbody>
    </table>
</body>

</html>
