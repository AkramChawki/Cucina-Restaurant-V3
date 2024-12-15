<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>FICHE INDIVIDUELLE DE RENSEIGNEMENT DU PERSONNEL</title>
    <style>
        @page {
            margin: 20px;
            size: A4 portrait;
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            margin: 0;
            padding: 15px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
        }
        .header img {
            height: 45px;
            width: auto;
        }
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            margin: 10px 0;
            padding: 5px;
            background-color: aqua;
        }
        .section {
            margin: 10px 0;
        }
        .field {
            margin: 5px 0;
        }
        .photos {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            gap: 10px;
        }
        .photo {
            flex: 1;
            text-align: center;
        }
        .photo img {
            width: 180px;
            height: 120px;
            object-fit: cover;
        }
        .photo-label {
            font-size: 10px;
            margin-top: 3px;
        }
        .addresses {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://restaurant.cucinanapoli.com/images/logo/Cucina.png" alt="Logo">
    </div>

    <div class="title">Cucina Napoli</div>
    <div class="title">FICHE INDIVIDUELLE DE RENSEIGNEMENT DU PERSONNEL</div>

    <div class="section">
        <div class="field">
            <strong>Nom et prénom :</strong> {{ $employee->first_name }} {{ $employee->last_name }}
        </div>

        <div class="field">
            <strong>Date de naissance :</strong> {{ $employee->DDN }}
        </div>

        <div class="field">
            <strong>Situation matrimoniale :</strong> {{ ucfirst($employee->marital_status) }}
        </div>
        <div class="field">
            <strong>Date d'embauche :</strong> {{ ucfirst($employee->embauche) }}
        </div>

        <div class="addresses">
            <div class="field"><strong>Adresses :</strong></div>
            <div class="field"><strong>Lieu de résidence :</strong> {{ $employee->address }}, {{ $employee->city }}, {{ $employee->country }}</div>
            <div class="field"><strong>Contact téléphonique :</strong> {{ $employee->telephone }}</div>
        </div>
    </div>

    <div class="photos">
        <div class="photo">
            <img src="{{ public_path('storage/' . $employee->profile_photo) }}" alt="Photo de profil">
            <div class="photo-label">Photo de profil</div>
        </div>
        <div class="photo">
            <img src="{{ public_path('storage/' . $employee->id_card_front) }}" alt="CIN Recto">
            <div class="photo-label">CIN Recto</div>
        </div>
        <div class="photo">
            <img src="{{ public_path('storage/' . $employee->id_card_back) }}" alt="CIN Verso">
            <div class="photo-label">CIN Verso</div>
        </div>
    </div>
</body>
</html>