<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class TimeBasedAuth
{
    public function handle(Request $request, Closure $next)
{
    if (Auth::check()) {
        $user = Auth::user();
        
        $restrictedRoles = ['Cuisine', 'Pizzeria'];
        
        $userRoles = json_decode($user->role, true);
        
        if (is_array($userRoles) && count($userRoles) === 1 && in_array($userRoles[0], $restrictedRoles)) {
            $now = Carbon::now('Africa/Casablanca');
            
            $morningStart = Carbon::createFromTime(11, 0, 0, 'Africa/Casablanca');
            $morningEnd = Carbon::createFromTime(16, 25, 0, 'Africa/Casablanca');
            $nightStart = Carbon::createFromTime(22, 0, 0, 'Africa/Casablanca');
            $nightEnd = Carbon::createFromTime(3, 0, 0, 'Africa/Casablanca')->addDay();

            if (!$now->between($morningStart, $morningEnd) && 
                !$now->between($nightStart, $nightEnd)) {
                Auth::logout();
                return redirect()->route('login')->with('error', 'You can only log in between 11:00-16:00 and 22:00-01:00.');
            }
        }
    }

    return $next($request);
}
}