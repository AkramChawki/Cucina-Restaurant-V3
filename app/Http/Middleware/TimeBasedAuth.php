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
        
        // The restricted roles
        $restrictedRoles = ['Cuisine', 'Pizzeria'];
        
        // Get the user's roles
        $userRoles = json_decode($user->role, true);
        
        // Check if the user has only one of the restricted roles
        if (is_array($userRoles) && count($userRoles) === 1 && in_array($userRoles[0], $restrictedRoles)) {
            $now = Carbon::now('Europe/Paris'); // GMT+1 timezone
            
            $morningStart = Carbon::createFromTime(11, 0, 0, 'Europe/Paris');
            $morningEnd = Carbon::createFromTime(11, 30, 0, 'Europe/Paris');
            $nightStart = Carbon::createFromTime(22, 0, 0, 'Europe/Paris');
            $nightEnd = Carbon::createFromTime(1, 0, 0, 'Europe/Paris')->addDay();

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