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
        $validated = $request->validate(Employe::$rules);

        if ($request->hasFile('profile_photo')) {
            $profilePhoto = $request->file('profile_photo');
            $profilePhotoName = time() . '_profile_' . $profilePhoto->getClientOriginalName();
            $profilePhoto->move(public_path('employe/profile'), $profilePhotoName);
            $validated['profile_photo'] = 'employe/profile/' . $profilePhotoName;
        }

        if ($request->hasFile('id_card_front')) {
            $idCardFront = $request->file('id_card_front');
            $idCardFrontName = time() . '_front_' . $idCardFront->getClientOriginalName();
            $idCardFront->move(public_path('employe/identity'), $idCardFrontName);
            $validated['id_card_front'] = 'employe/identity/' . $idCardFrontName;
        }

        if ($request->hasFile('id_card_back')) {
            $idCardBack = $request->file('id_card_back');
            $idCardBackName = time() . '_back_' . $idCardBack->getClientOriginalName();
            $idCardBack->move(public_path('employe/identity'), $idCardBackName);
            $validated['id_card_back'] = 'employe/identity/' . $idCardBackName;
        }

        $employee = Employe::create($validated);

        return redirect('/')->with('success', 'Employee added successfully.');
    }

    function attendance() {
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
