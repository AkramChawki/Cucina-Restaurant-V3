<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style type="text/css">
        * {
            font-size: 12px;
            font-family: 'Times New Roman';
        }

        td,
        th,
        tr,
        table {
            border-top: 1px solid black;
            border-collapse: collapse;
        }

        td.description,
        th.description {
            width: 75px;
            max-width: 75px;
        }

        td.quantity,
        th.quantity {
            width: 40px;
            max-width: 40px;
            word-break: break-all;
        }

        td.price,
        th.price {
            width: 40px;
            max-width: 40px;
            word-break: break-all;
        }

        .centered {
            text-align: center;
            align-content: center;
        }

        .ticket {
            width: 155px;
            max-width: 155px;
        }

        img {
            max-width: inherit;
            width: inherit;
        }

        @media print {

            .hidden-print,
            .hidden-print * {
                display: none !important;
            }
        }
    </style>
</head>

<body>
    <div class="ticket">
        <img src="https://restaurant.cucinanapoli.com/images/logo/Cucina.png" alt="Logo">
        <h1>Recu</h1>
        @if ($order->restau == 'Anoual')
            <h2>Cucina Napoli - Anoual</h2>
            <ul>
                <li>4 BD Anoual</li>
                <li>Casablance</li>
                <li>+212 5 20 33 83 50 | anoual@cucinanapoli.com</li>
            </ul>
        @endif
        @if ($order->restau == 'Palmier')
            <h2>Cucina Napoli = Palmier</h2>
            <ul>
                <li>13 rue Ahmed Naciri, Angle Rue Saria Ibnou Zounaim</li>
                <li>Casablanca</li>
                <li>+212 5 20 57 24 34 | palmier@cucinanapoli.com</li>
            </ul>
        @endif
        @if ($order->restau == 'Ziraoui')
            <h2>Cucina Napoli = Ziraoui</h2>
            <ul>
                <li>267, Bd Ziraoui</li>
                <li>Casablanca</li>
                <li>+212 6 65 38 03 34 | ziraoui@cucinanapoli.com</li>
            </ul>
        @endif
        <table>
            <tr>
                <th>Date</th>
                <td>{{ $order->created_at }}</td>
            </tr>
            <tr>
                <th>Commande par</th>
                <td>{{ $order->name }}</td>
            </tr>
        </table>
        <table>
            <thead>
                <tr>
                    <th class="quantity">Q</th>
                    <th class="description">Designation</th>
                    <th class="price">Unite</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->products() as $p)
                    <tr>
                        <td class="quantity">{{ $p->qty }}</td>
                        <td class="description">{{ $p->designation }}</td>
                        <td class="price">{{ $p->unite }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <p class="centered">Cucina Napoli - LA VERRA PIZZA NAPOLETANA</p>
    </div>
</body>

</html>
