<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Infraction Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .content {
            margin-bottom: 20px;
        }
        .info-row {
            margin: 10px 0;
        }
        .label {
            font-weight: bold;
            margin-right: 10px;
        }
        .photo {
            max-width: 300px;
            margin: 20px 0;
        }
        .datetime {
            margin-top: 30px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport d'Infraction</h1>
    </div>

    <div class="content">
        <div class="info-row">
            <span class="label">Restaurant:</span>
            <span>{{ $infraction->restaurant }}</span>
        </div>

        <div class="info-row">
            <span class="label">Poste:</span>
            <span>{{ $infraction->poste }}</span>
        </div>

        <div class="info-row">
            <span class="label">Employé:</span>
            <span>{{ $infraction->employe->first_name }} {{ $infraction->employe->last_name }}</span>
        </div>

        <div class="info-row">
            <span class="label">Infraction constatée:</span>
            <p>{{ $infraction->infraction_constatee }}</p>
        </div>

        @if($infraction->photo_path)
            <div class="info-row">
                <span class="label">Photo:</span><br>
                <img src="{{ storage_path('app/public/' . $infraction->photo_path) }}" class="photo">
            </div>
        @endif

        <div class="datetime">
            <p>Date: {{ $infraction->infraction_date->format('d/m/Y') }}</p>
            <p>Heure: {{ $infraction->infraction_time->format('H:i') }}</p>
        </div>
    </div>
</body>
</html>