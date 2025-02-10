<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fiche Maintenance Préventive</title>
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
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            background-color: #f5f5f5;
            padding: 5px;
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
            <div class="title">FICHE MAINTENANCE PRÉVENTIVE</div>
        </div>

        <div class="info">
            <div class="info-row">
                <strong>Restaurant:</strong> {{ $fiche->restau }}
            </div>
            <div class="info-row">
                <strong>Date:</strong> {{ $fiche->date->format('d/m/Y') }}
            </div>
            <div class="info-row">
                <strong>Mois:</strong> {{ \Carbon\Carbon::parse($fiche->data['mois'])->format('m/Y') }}
            </div>
            <div class="info-row">
                <strong>Responsable:</strong> {{ $fiche->name }}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Cette Fiche concerne les Lots</div>
            <table>
                <thead>
                    <tr>
                        <th>LOT</th>
                        <th>Fréquence</th>
                        <th>Travaux A prévoir</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Gaz</td>
                        <td>Chaque mois</td>
                        <td>Contrôle des 4 Feux et friteuse, nettoyage, reglage des feux...</td>
                    </tr>
                    <tr>
                        <td>Froid</td>
                        <td>Chaque mois</td>
                        <td>Nettoyage des batteries des Armoires, contrôle des thermostats, contrôle des portes et Joints ...</td>
                    </tr>
                    <tr>
                        <td>Chambres froides</td>
                        <td>Chaque mois</td>
                        <td>Contrôle des Groupes, contrôle Gel, contrôle des joints et portes, thermostats...</td>
                    </tr>
                    <tr>
                        <td>Hotte Four</td>
                        <td>Chaque mois</td>
                        <td>Nettoyage et ramonage de la gaine</td>
                    </tr>
                    <tr>
                        <td>Climatisation</td>
                        <td>Chaque mois</td>
                        <td>Nettoyage des filtres de clim, contrôle des groupes</td>
                    </tr>
                    <tr>
                        <td>Desinsectisation et deratisation</td>
                        <td>Chaque semaine</td>
                        <td>Injection produit, fumiginisation...</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Travaux Effectués</div>
            <table>
                <thead>
                    <tr>
                        <th>LOT</th>
                        <th>Personne</th>
                        <th>Détail Travaux</th>
                        <th>Signature Controleur</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($fiche->data['rows'] as $row)
                        <tr>
                            <td>{{ $row['lot'] }}</td>
                            <td>{{ $row['personne'] }}</td>
                            <td>{{ $row['detailTravaux'] }}</td>
                            <td>{{ $row['signatureControleur'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">SIGNATURE RESPONSABLE</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">SIGNATURE RESPONSABLE MAINTENANCE</div>
            </div>
        </div>
    </div>
</body>
</html>