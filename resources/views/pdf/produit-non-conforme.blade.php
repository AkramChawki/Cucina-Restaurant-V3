<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Produit Non Conforme</title>
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
            border: 1px solid #ddd;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 24px;
            color: #666;
            margin-bottom: 30px;
        }
        
        .content {
            margin: 20px 0;
        }
        
        .field {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        
        .label {
            font-weight: bold;
            color: #2c3e50;
            width: 200px;
            display: inline-block;
        }
        
        .value {
            color: #34495e;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
        }

        .warning-box {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .timestamp {
            font-size: 12px;
            color: #888;
            text-align: right;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CUCINA NAPOLI</div>
            <div class="subtitle">Rapport de Produit Non Conforme</div>
        </div>

        <div class="content">
            <div class="field">
                <span class="label">Restaurant:</span>
                <span class="value">{{ $produit->restau }}</span>
            </div>

            <div class="field">
                <span class="label">Date:</span>
                <span class="value">{{ $produit->date->format('d/m/Y') }}</span>
            </div>

            <div class="field">
                <span class="label">Type:</span>
                <span class="value">{{ ucfirst($produit->type) }}</span>
            </div>

            <div class="field">
                <span class="label">Produit:</span>
                <span class="value">{{ $produit->produit }}</span>
            </div>

            <div class="field">
                <span class="label">Date de Production:</span>
                <span class="value">{{ $produit->date_production->format('d/m/Y') }}</span>
            </div>

            <div class="warning-box">
                <span class="label">Problème Identifié:</span>
                <span class="value">{{ $produit->probleme }}</span>
            </div>

            <div class="field">
                <span class="label">Enregistré par:</span>
                <span class="value">{{ $produit->name }}</span>
            </div>

            <div class="timestamp">
                Document généré le {{ now()->format('d/m/Y à H:i') }}
            </div>
        </div>

        <div class="footer">
            Ce document est généré automatiquement par le système de gestion de qualité de Cucina Napoli.
            Pour toute question, veuillez contacter le service qualité.
        </div>
    </div>
</body>
</html>