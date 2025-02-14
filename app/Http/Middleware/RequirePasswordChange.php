<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequirePasswordChange
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->password_change_required) {
            return redirect()->route('password.change');
        }

        return $next($request);
    }
}