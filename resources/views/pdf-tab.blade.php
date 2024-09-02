<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Opening PDF...</title>
    <script>
        window.onload = function() {
            window.open("{{ $pdf_url }}");
            window.location.href = "/";
        };
    </script>
</head>
<body>
    <p>L'ouverture du PDF dans une nouvelle ongle...</p>
</body>
</html>
