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

            if (in_array($user->role, $restrictedRoles) && 
                !$this->isTimeInRange($user->role)) {
                Auth::logout();
                return redirect()->route('login')->with('error', 'You can only log in between 11:00-16:00 and 22:00-02:00.');
            }
        }

        return $next($request);
    }

    private function isTimeInRange($role)
    {
        $now = Carbon::now('Europe/Paris');

        $allowedRanges = [
            'Cuisine' => [
                ['start' => '11:00', 'end' => '16:00'],
                ['start' => '22:00', 'end' => '02:00']
            ],
            'Pizzeria' => [
                ['start' => '11:00', 'end' => '16:00'],
                ['start' => '22:00', 'end' => '02:00']
            ]
        ];

        foreach ($allowedRanges[$role] as $range) {
            $start = Carbon::createFromFormat('H:i', $range['start'], 'Europe/Paris');
            $end = Carbon::createFromFormat('H:i', $range['end'], 'Europe/Paris');

            if ($now->between($start, $end)) {
                return true;
            }
        }

        return false;
    }
}