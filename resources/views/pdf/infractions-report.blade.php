<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport des Infractions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .date-range {
            text-align: center;
            margin-bottom: 20px;
            font-style: italic;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
        tr:nth-child(even) {
            background-color: #fafafa;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport des Infractions</h1>
    </div>

    @if($date_from || $date_to)
        <div class="date-range">
            Période: 
            @if($date_from)
                Du {{ \Carbon\Carbon::parse($date_from)->format('d/m/Y') }}
            @endif
            @if($date_to)
                au {{ \Carbon\Carbon::parse($date_to)->format('d/m/Y') }}
            @endif
        </div>
    @endif

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Heure</th>
                <th>Restaurant</th>
                <th>Employé</th>
                <th>Poste</th>
                <th>Infraction</th>
            </tr>
        </thead>
        <tbody>
            @foreach($infractions as $infraction)
                <tr>
                    <td>{{ $infraction->infraction_date->format('d/m/Y') }}</td>
                    <td>{{ $infraction->infraction_time->format('H:i') }}</td>
                    <td>{{ $infraction->restaurant }}</td>
                    <td>{{ $infraction->employe->first_name }} {{ $infraction->employe->last_name }}</td>
                    <td>{{ $infraction->poste }}</td>
                    <td>{{ $infraction->infraction_constatee }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Généré le {{ now()->format('d/m/Y H:i') }}</p>
        <p>Total des infractions: {{ $infractions->count() }}</p>
    </div>
</body>
</html>