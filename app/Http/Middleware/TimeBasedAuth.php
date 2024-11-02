<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TimeBasedAuth
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();

            $restrictedRoles = ['Cuisine', 'Pizzeria', 'Labo'];

            $userRoles = json_decode($user->role, true);

            if (is_array($userRoles) && count($userRoles) === 1 && in_array($userRoles[0], $restrictedRoles)) {
                $tz = 'Africa/Casablanca';
                $now = Carbon::now($tz);

                $morningStart = $now->copy()->setTime(11, 0, 0);
                $morningEnd = $now->copy()->setTime(16, 30, 0);
                $nightStart = $now->copy()->setTime(22, 0, 0);
                $nightEnd = $now->copy()->setTime(3, 0, 0);

                $isAllowedTime = $now->between($morningStart, $morningEnd) ||
                    $now->between($nightStart, $now->copy()->endOfDay()) ||
                    $now->between($now->copy()->startOfDay(), $nightEnd);

                if (!$isAllowedTime) {
                    Auth::logout();
                    return redirect()->route('login')->with('error', 'You can only log in between 11:00-16:00 and 22:00-02:00.');
                }
            }
        }
        return $next($request);
    }
}
