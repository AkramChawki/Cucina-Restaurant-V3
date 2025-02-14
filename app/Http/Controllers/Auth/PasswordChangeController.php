<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PasswordChangeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('password.change')->except(['show', 'update']);
    }

    public function show()
    {
        if (!auth()->user()->password_change_required) {
            return redirect()->route('home');
        }
        
        return Inertia::render('Auth/PasswordChange');
    }

    public function update(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = $request->user();
        
        if ($user->password_change_required) {
            $user->password = Hash::make($request->password);
            $user->password_change_required = false;
            $user->save();

            return redirect()->route('home')->with('status', 'Mot de passe modifié avec succès');
        }

        return redirect()->route('home');
    }
}