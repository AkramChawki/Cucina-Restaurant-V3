<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fiche de Controle Restaurant</title>
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
            <div class="title">FICHE DE CONTROLE RESTAURANTS</div>
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

        <!-- SALLE -->
        <div class="section">
            <div class="section-title">SALLE</div>
            <table>
                <tr>
                    <td>TABLE</td>
                    <td><div class="box">{{ $data['salle']['table'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>CHAISE</td>
                    <td><div class="box">{{ $data['salle']['chaise'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>DEOBACTE</td>
                    <td><div class="box">{{ $data['salle']['deobacte'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>TORCHON</td>
                    <td><div class="box">{{ $data['salle']['torchon'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>SERVEUR</td>
                    <td><div class="box">{{ $data['salle']['serveur'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>BALAI DE SALLE</td>
                    <td><div class="box">{{ $data['salle']['balai_de_salle'] ? '✓' : '' }}</div></td>
                </tr>
            </table>
        </div>

        <!-- POSTE PIZZA -->
        <div class="section">
            <div class="section-title">POSTE PIZZA</div>
            <table>
                <tr>
                    <td>DISTRIBUTEUR ESSUI MAIN</td>
                    <td><div class="box">{{ $data['poste_pizza']['distributeur_essui_main'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>DISTRIBUTEUR SAVON A MAIN</td>
                    <td><div class="box">{{ $data['poste_pizza']['distributeur_savon'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>DEOBACTE</td>
                    <td><div class="box">{{ $data['poste_pizza']['deobacte'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>TORCHON</td>
                    <td><div class="box">{{ $data['poste_pizza']['torchon'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>POSTE</td>
                    <td>{{ $data['poste_pizza']['poste'] }}</td>
                </tr>
            </table>
        </div>

        <!-- TOILETTE -->
        <div class="section">
            <div class="section-title">TOILETTE</div>
            <table>
                <tr>
                    <td>DISTRIBUTEUR PAPIER HYGIENE</td>
                    <td><div class="box">{{ $data['toilette']['distributeur_papier_hygiene'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>DISTRIBUTEUR SAVON A MAIN</td>
                    <td><div class="box">{{ $data['toilette']['distributeur_savon'] ? '✓' : '' }}</div></td>
                </tr>
            </table>
        </div>

        <!-- CUISINE -->
        <div class="section">
            <div class="section-title">CUISINE</div>
            <table>
                @foreach($data['cuisine'] as $key => $value)
                    <tr>
                        <td>{{ strtoupper(str_replace('_', ' ', $key)) }}</td>
                        <td>
                            @if(is_bool($value))
                                <div class="box">{{ $value ? '✓' : '' }}</div>
                            @else
                                {{ $value }}
                            @endif
                        </td>
                    </tr>
                @endforeach
            </table>
        </div>

        <!-- LAVABO CLIENTS -->
        <div class="section">
            <div class="section-title">LAVABO CLIENTS</div>
            <table>
                <tr>
                    <td>DISTRIBUTEUR PAPIER ZIG ZAG</td>
                    <td><div class="box">{{ $data['lavabo_clients']['distributeur_papier'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>DISTRIBUTEUR SAVON A MAIN</td>
                    <td><div class="box">{{ $data['lavabo_clients']['distributeur_savon'] ? '✓' : '' }}</div></td>
                </tr>
            </table>
        </div>

        <!-- SUPPORT MURAL SALLE -->
        <div class="section">
            <div class="section-title">SUPPORT MURAL SALLE</div>
            <table>
                <tr>
                    <td width="33%">RACLETTE</td>
                    <td><div class="box">{{ $data['support_mural_salle']['raclette'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>BALAI DOUCE</td>
                    <td><div class="box">{{ $data['support_mural_salle']['balai_douce'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>BALAI DURE</td>
                    <td><div class="box">{{ $data['support_mural_salle']['balai_dure'] ? '✓' : '' }}</div></td>
                </tr>
            </table>
        </div>

        <!-- SUPPORT MURAL CUISINE -->
        <div class="section">
            <div class="section-title">SUPPORT MURAL CUISINE</div>
            <table>
                <tr>
                    <td width="33%">RACLETTE</td>
                    <td><div class="box">{{ $data['support_mural_cuisine']['raclette'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>BALAI DOUCE</td>
                    <td><div class="box">{{ $data['support_mural_cuisine']['balai_douce'] ? '✓' : '' }}</div></td>
                </tr>
                <tr>
                    <td>BALAI DURE</td>
                    <td><div class="box">{{ $data['support_mural_cuisine']['balai_dure'] ? '✓' : '' }}</div></td>
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