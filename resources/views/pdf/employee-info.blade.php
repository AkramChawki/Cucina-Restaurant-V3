<!-- resources/views/pdfs/employee-info.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>FICHE INDIVIDUELLE DE RENSEIGNEMENT DU PERSONNEL</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            padding: 10px;
            background-color: aqua;
        }
        .section {
            margin: 15px 0;
        }
        .field {
            margin: 10px 0;
        }
        .photos {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }
        .photo {
            width: 30%;
            text-align: center;
        }
        .photo img {
            max-width: 100%;
            height: auto;
        }
        .photo-label {
            font-size: 12px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('logo.png') }}" alt="Logo" height="60">
    </div>

    <div class="title">ANNEXE 4</div>
    <div class="title">FICHE INDIVIDUELLE DE RENSEIGNEMENT DU PERSONNEL</div>

    <div class="section">
        <div class="field">
            Nom et prénom : {{ $employee->first_name }} {{ $employee->last_name }}
        </div>

        <div class="field">
            Date et lieu de naissance : {{ $employee->DDN }}
        </div>

        <div class="field">
            Situation matrimoniale : {{ ucfirst($employee->marital_status) }}
        </div>

        <div class="addresses">
            <div class="field">Adresses :</div>
            <div class="field">Lieu de résidence : {{ $employee->address }}, {{ $employee->city }}, {{ $employee->country }}</div>
            <div class="field">Contact téléphonique : {{ $employee->telephone }}</div>
            <div class="field">Adresse postale : {{ $employee->address }}</div>
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