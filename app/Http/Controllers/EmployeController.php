<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\Presence;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeController extends Controller
{
    public function employe()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('Restaurants/Employe', ["restaurants" => $restaurants]);
    }

    public function employeAdd()
    {
        return Inertia::render('Restaurants/AddEmploye');
    }

    public function store(Request $request)
    {
        $data = $request->validate(Employe::$rules);

        // Handle profile photo
        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        // Handle ID card front
        if ($request->hasFile('id_card_front')) {
            $data['id_card_front'] = $request->file('id_card_front')->store('id-cards', 'public');
        }

        // Handle ID card back
        if ($request->hasFile('id_card_back')) {
            $data['id_card_back'] = $request->file('id_card_back')->store('id-cards', 'public');
        }

        Employe::create($data);

        return redirect('/')->with('success', 'Employee added successfully.');
    }

    function attendance()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('Restaurants/Presence', ["restaurants" => $restaurants]);
    }

    public function manageAttendance(Request $request)
    {
        $restau = $request->query('restau');
        $restaurant = Restaurant::where("slug", $restau)->firstOrFail();
        $employes = Employe::where("restau", $restau)->get(); // Changed firstOrFail() to get()
        return Inertia::render('Restaurants/ManagePresence', [
            'restaurant' => $restaurant,
            'employes' => $employes
        ]);
    }
}
