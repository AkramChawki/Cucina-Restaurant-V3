<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response;

class RestValidationMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $tz = 'Africa/Casablanca';
        $now = Carbon::now($tz);

        $startTime = $now->copy()->setTime(5, 0, 0);
        $endTime = $now->copy()->setTime(10, 0, 0);

        $requiresRest = $now->between($startTime, $endTime);

        $request->merge([
            'requires_rest' => $requiresRest
        ]);

        return $next($request);
    }
}