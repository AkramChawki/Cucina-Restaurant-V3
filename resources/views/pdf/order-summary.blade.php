<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta http-equiv="X-UA-Compatible" content="ie=edge" />
	<title>Invoice</title>
	<style>
		@media print {
			@page {
				size: A3;
			}
		}

		ul {
			padding: 0;
			margin: 0 0 1rem 0;
			list-style: none;
		}

		body {
			font-family: "Inter", sans-serif;
			margin: 0;
		}

		table {
			width: 100%;
			border-collapse: collapse;
		}

		table,
		table th,
		table td {
			border: 1px solid silver;
		}

		table th,
		table td {
			text-align: right;
			padding: 8px;
		}

		h1,
		h4,
		p {
			margin: 0;
		}

		.container {
			padding: 20px 0;
			width: 1000px;
			max-width: 90%;
			margin: 0 auto;
		}

		.inv-title {
			padding: 10px;
			border: 1px solid silver;
			text-align: center;
			margin-bottom: 30px;
		}

		.inv-logo {
			width: 150px;
			display: block;
			margin: 0 auto;
			margin-bottom: 40px;
		}

		/* header */
		.inv-header {
			display: flex;
			margin-bottom: 20px;
		}

		.inv-header> :nth-child(1) {
			flex: 2;
		}

		.inv-header> :nth-child(2) {
			flex: 1;
		}

		.inv-header h2 {
			font-size: 20px;
			margin: 0 0 0.3rem 0;
		}

		.inv-header ul li {
			font-size: 15px;
			padding: 3px 0;
		}

		/* body */
		.inv-body table th,
		.inv-body table td {
			text-align: left;
		}

		.inv-body {
			margin-bottom: 30px;
		}

		/* footer */
		.inv-footer {
			display: flex;
			flex-direction: row;
		}

		.inv-footer> :nth-child(1) {
			flex: 2;
		}

		.inv-footer> :nth-child(2) {
			flex: 1;
		}
	</style>
</head>

<body>
	<div class="container">
		<div class="inv-title">
			<h1>Commande</h1>
		</div>
		<img src="https://restaurant.cucinanapoli.com/images/logo/Cucina.png" class="inv-logo" />
		<div class="inv-header">
			<div>
			    @if ($order->restau == "Anoual")
				<h2>Cucina Napoli - Anoual</h2>
				<ul>
					<li>4 BD Anoual</li>
					<li>Casablance</li>
					<li>+212 5 20 33 83 50 | anoual@cucinanapoli.com</li>
				</ul>
				@endif
				@if ($order->restau == "Palmier")
				<h2>Cucina Napoli = Palmier</h2>
				<ul>
					<li>13 rue Ahmed Naciri, Angle Rue Saria Ibnou Zounaim</li>
					<li>Casablanca</li>
					<li>+212 5 20 57 24 34 | palmier@cucinanapoli.com</li>
				</ul>
				@endif
				@if ($order->restau == "Ziraoui")
				<h2>Cucina Napoli = Ziraoui</h2>
				<ul>
					<li>267, Bd Ziraoui</li>
					<li>Casablanca</li>
					<li>+212 5 20 82 32 22 | ziraoui@cucinanapoli.com</li>
				</ul>
				@endif
			</div>
			<div>
				<table>
					<tr>
						<th>Date</th>
						<td>{{$order->created_at}}</td>
					</tr>
					<tr>
						<th>Commande par</th>
						<td>{{$order->name}}</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="inv-body">
			<table>
				<thead>
                    <th>Image</th>
                    <th>Produit</th>
                    @if(isset($showRest) && $showRest)
                    <th>Rest</th>
                    @endif
                    <th>Qty</th>
                    <th>Unite</th>
                </thead>
                <tbody>
					@foreach ($order->products() as $p)
					<tr>
						<td>
							<img src="https://admin.cucinanapoli.com/storage/{{ $p->image }}" alt="" style="display:block;" width="40px" height="40px">
						</td>
						<td>
							<h4>{{ $p->designation }}</h4>
						</td>
						@if(isset($showRest) && $showRest)
						<td>{{ $p->rest ?? '-' }}</td>
						@endif
						<td>{{ $p->qty }}</td>
						<td>{{ $p->unite }}</td>
					</tr>
					@endforeach
				</tbody>
			</table>
		</div>
	</div>
</body>

</html>