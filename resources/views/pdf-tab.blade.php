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
    <p>Opening PDF in a new tab...</p>
</body>
</html>
