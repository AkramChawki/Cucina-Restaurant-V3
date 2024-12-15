<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audit Summary</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        .container {
            width: 90%;
            max-width: 800px;
            padding: 20px;
            box-sizing: border-box;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .header p {
            margin: 2px 0;
        }

        h2 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 15px;
        }

        .image-container {
            text-align: center;
            margin-bottom: 20px;
        }

        .audit-image {
            max-width: 50%;
            max-height: 350px;
            object-fit: contain;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
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
            @elseif ($audit->restau == 'Palmier')
                <h1>Cucina Napoli - Palmier</h1>
                <p>13 rue Ahmed Naciri, Angle Rue Saria Ibnou Zounaim</p>
                <p>Casablanca</p>
                <p>+212 5 20 57 24 34 | palmier@cucinanapoli.com</p>
            @elseif ($audit->restau == 'Ziraoui')
                <h1>Cucina Napoli - Ziraoui</h1>
                <p>267 Bd Ziraoui, Casablanca 20250</p>
                <p>Casablanca</p>
                <p>+212 5 20 82 32 22 | ziraoui@cucinanapoli.com</p>
            @endif
        </div>

        <h2>Audit Summary</h2>

        @if ($audit->image)
            <div class="image-container">
                <img src="{{ storage_path('app/public/' . $audit->image) }}" alt="Audit Image" class="audit-image">
            </div>
        @endif

        <table>
            <tr>
                <th>Name</th>
                <td>
                    @php
                        $user = App\Models\User::with('employe')
                            ->where('name', $audit->name)
                            ->first();
                        $fullName =
                            $user && $user->employe
                                ? $user->employe->first_name . ' ' . $user->employe->last_name
                                : $audit->name;
                    @endphp
                    {{ $fullName }}
                </td>
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
</body>

</html>
