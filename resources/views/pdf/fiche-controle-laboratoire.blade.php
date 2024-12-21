<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fiche de Controle Laboratoire</title>
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
        
        .box {
            width: 20px;
            height: 20px;
            border: 1px solid #000;
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
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
            <div class="title">FICHE DE CONTROLE LABORATOIRE</div>
        </div>

        <div class="info">
            <div class="info-row">
                <strong>Restaurant:</strong> {{ $fiche->restau }}
            </div>
            <div class="info-row">
                <strong>Date:</strong> {{ $fiche->date->format('d/m/Y') }}
            </div>
        </div>

        @php
            $data = $fiche->data;
        @endphp

        <!-- POSTE PIZZA -->
        <div class="section">
            <div class="section-title">POSTE PIZZA</div>
            <table>
                <tr>
                    <td>DISTRIBUTEUR ESSUI MAIN</td>
                    <td><div class="box">{{ $data['postes']['pizza']['distributeur_essui_main'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>DISTRIBUTEUR SAVON A MAIN</td>
                    <td><div class="box">{{ $data['postes']['pizza']['distributeur_savon'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>TORCHANT</td>
                    <td><div class="box">{{ $data['postes']['pizza']['torchant'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>DEOBACT</td>
                    <td><div class="box">{{ $data['postes']['pizza']['deobact'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>POSTE</td>
                    <td>{{ $data['postes']['pizza']['poste'] }}</td>
                </tr>
            </table>
        </div>

        <!-- Continue with similar sections for each poste -->
        <!-- POSTE CHAUD -->
        <div class="section">
            <div class="section-title">POSTE CHAUD</div>
            <!-- Similar table structure -->
        </div>

        <!-- Add all other sections following the same pattern -->

        <!-- Support Mural Sections -->
        <div class="section">
            <div class="section-title">SUPPORT MURAL -BAS-</div>
            <table>
                <tr>
                    <td width="33%">RACLETTE</td>
                    <td><div class="box">{{ $data['support_mural_bas']['raclette'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>BALAI DOUCE</td>
                    <td><div class="box">{{ $data['support_mural_bas']['balai_douce'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>BALAI DURE</td>
                    <td><div class="box">{{ $data['support_mural_bas']['balai_dure'] ? '✓' : '' }}</div></td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">SUPPORT MURAL -HAUT-</div>
            <table>
                <tr>
                    <td width="33%">RACLETTE</td>
                    <td><div class="box">{{ $data['support_mural_haut']['raclette'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>BALAI DOUCE</td>
                    <td><div class="box">{{ $data['support_mural_haut']['balai_douce'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>BALAI DURE</td>
                    <td><div class="box">{{ $data['support_mural_haut']['balai_dure'] ? '✓' : '' }}</div></td>
                </tr>
            </table>
        </div>

        <!-- Additional sections -->
        <div class="section">
            <div class="section-title">VESTIAIRE</div>
            <table>
                <tr>
                    <td>HOMME</td>
                    <td>{{ $data['vestiaire']['homme'] }}</td>
                </tr>
                <tr>
                    <td>FEMME</td>
                    <td>{{ $data['vestiaire']['femme'] }}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <table>
                <tr>
                    <td>SALLE A MANGER</td>
                    <td>{{ $data['salle_a_manger'] }}</td>
                </tr>
                <tr>
                    <td>SALLE DE PRIERE</td>
                    <td>{{ $data['salle_de_priere'] }}</td>
                </tr>
            </table>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">SIGNATURE RESPONSABLE</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">SIGNATURE RESPONSABLE D HYGIENE</div>
            </div>
        </div>
    </div>
</body>
</html>