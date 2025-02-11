<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rapport d'Infraction</title>
    <style>
        body {
            font-family: "Inter", sans-serif;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        .title {
            text-align: center;
            font-size: 24px;
            margin-bottom: 40px;
        }

        .info-row {
            margin-bottom: 20px;
            font-size: 16px;
        }

        .info-row strong {
            display: inline-block;
            width: 150px;
            font-weight: bold;
        }

        .infraction-text {
            margin: 20px 0;
            padding: 20px;
            background-color: #f8f8f8;
            border-radius: 5px;
        }

        .photo {
            margin: 20px 0;
        }

        .photo img {
            max-width: 100%;
            height: auto;
            display: block;
        }

        .datetime {
            text-align: right;
            margin-top: 40px;
        }

        .logo {
            width: 150px;
            display: block;
            margin: 0 auto;
            margin-bottom: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://restaurant.cucinanapoli.com/images/logo/Cucina.png" class="logo" />
        
        <h1 class="title">Rapport d'Infraction</h1>

        <div class="info-row">
            <strong>Restaurant:</strong> {{ $infraction->restaurant }}
        </div>

        <div class="info-row">
            <strong>Poste:</strong> {{ $infraction->poste }}
        </div>

        <div class="info-row">
            <strong>Employé:</strong> {{ $infraction->employe->first_name }} {{ $infraction->employe->last_name }}
        </div>

        <div class="info-row">
            <strong>Infraction constatée:</strong>
            <div class="infraction-text">
                {{ $infraction->infraction_constatee }}
            </div>
        </div>

        @if($infraction->photo_path)
        <div class="info-row">
            <strong>Photo:</strong>
            <div class="photo">
                <img src="{{ storage_path('app/public/' . $infraction->photo_path) }}" style="max-width: 400px;">
            </div>
        </div>
        @endif

        <div class="datetime">
            <p>Date: {{ \Carbon\Carbon::parse($infraction->infraction_date)->format('d/m/Y') }}</p>
            <p>Heure: {{ \Carbon\Carbon::parse($infraction->infraction_time)->format('H:i') }}</p>
        </div>
    </div>
</body>
</html>