<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Produit Non Conforme</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .content {
            margin: 20px;
        }
        .field {
            margin-bottom: 15px;
        }
        .label {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>CUCINA NAPOLI</h1>
        <h2>Produit Non Conforme</h2>
    </div>

    <div class="content">
        <div class="field">
            <span class="label">Restaurant:</span> {{ $produit->restau }}
        </div>
        <div class="field">
            <span class="label">Date:</span> {{ $produit->date->format('d/m/Y') }}
        </div>
        <div class="field">
            <span class="label">Type:</span> {{ ucfirst($produit->type) }}
        </div>
        <div class="field">
            <span class="label">Produit:</span> {{ $produit->produit }}
        </div>
        <div class="field">
            <span class="label">Date de Production:</span> {{ $produit->date_production->format('d/m/Y') }}
        </div>
        <div class="field">
            <span class="label">Problème:</span> {{ $produit->probleme }}
        </div>
        <div class="field">
            <span class="label">Enregistré par:</span> {{ $produit->name }}
        </div>
    </div>
</body>
</html>