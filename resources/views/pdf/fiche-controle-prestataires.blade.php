<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Liste des Prestataires</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 10px;
            border-bottom: 2px solid #333;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .info {
            margin-bottom: 20px;
        }
        .info-row {
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
        }
        .signature-line {
            border-bottom: 1px solid #000;
            height: 40px;
            margin-bottom: 10px;
        }
        .signature-label {
            text-align: center;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">LISTE DES PRESTATAIRES</div>
        </div>

        <div class="info">
            <div class="info-row">
                <strong>Date:</strong> {{ $fiche->date->format('d/m/Y') }}
            </div>
            <div class="info-row">
                <strong>Responsable:</strong> {{ $fiche->name }}
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>LOT</th>
                    <th>Nom Prestataire</th>
                    <th>N° Téléphone</th>
                </tr>
            </thead>
            <tbody>
                @foreach($fiche->data['prestataires'] as $prestataire)
                    <tr>
                        <td>{{ $prestataire['lot'] }}</td>
                        <td>{{ $prestataire['nom'] }}</td>
                        <td>{{ $prestataire['telephone'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">SIGNATURE RESPONSABLE</div>
            </div>
        </div>
    </div>
</body>
</html>