<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Cucina Napoli - Un restaurant offrant une panoplie de plats traditionnels de la cuisine italienne. L’endroit
        est
        authentique et l’ambiance chaleureus </title>
    <link rel="canonical" href="https://cucinanapoli.com" />
    <link rel="shortcut icon" type="image/png" href="images/favicon/favicon.webp">
    <meta name="author" content="Cucina Napoli">
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name"
        content="Cucina Napoli - Un restaurant offrant une panoplie de plats traditionnels de la cuisine italienne. L’endroit est authentique et l’ambiance chaleureuse" />
    <meta property="og:type" content="website" />
    <meta property="og:title"
        content="Cucina Napoli - Un restaurant offrant une panoplie de plats traditionnels de la cuisine italienne. L’endroit est authentique et l’ambiance chaleureuse" />
    <meta property="og:description"
        content="Un restaurant offrant une panoplie de plats traditionnels de la cuisine italienne. L’endroit est authentique et l’ambiance chaleureuse" />
    <meta property="og:url" content="https://www.cucinanapoli.com/" />
    <meta name="Publisher" content="Cucina Napoli">
    <meta name="Identifier-Url" content="cucinanapolicom">
    <meta name="Revisit-After" content="1 day">
    <meta name="Robots" content="all">
    <meta name="Rating" content="general">
    <meta name="Distribution" content="global">
    <meta name="Subject" content="Restaurant Italien">
    <meta name="Copyright" content="Cucina Napoli">
    <meta name="keywords"
        content="restaurant, restaurant casablanca, restaurant mohammedia, restaurant ain diab, restaurant à proximité, restaurant à proximité de ma position, restaurant à casablanca, restaurant à mohammedia,
                                   restaurant casablanca pas cher, restaurants italiens casablanca,restaurant italien casablanca menu, pizza italienne casablanca, cucina pizza, Cucina Napoli, Restaurant Italien, Restaurant Italien à Casablanca, PIZZAS, INSALATA, Burgers, SANDWICH ITALIEN SANDWICH ITALIEN PANUOZZO, PLATS, PASTA, DESSERTS, JUS, BOISSONS, Restaurant 2 mars, restaurant italien, restaurant italien casablanca, restaurant italien dar bouazza, restaurant italien ain diab, restaurant italien à proximité, restaurant italien à casablanca, pizza à emporter restaurant italien, restaurant italien casablanca ain diab, restaurant italien casablanca gauthier, restaurant italien casablanca menu">
    <link rel="shortcut icon" type="image/png" href="images/favicon/favicon.webp">
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
    <script src="https://cdn.jsdelivr.net/npm/@preline/tabs@1.3.1/index.min.js"></script>

</body>

</html>
