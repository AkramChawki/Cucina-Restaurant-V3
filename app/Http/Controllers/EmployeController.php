<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\Presence;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeController extends Controller
{
    function index() {
        return Inertia::render('Restaurants/Employe',);
        
    }
    public function ajouteremploye()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('Restaurants/AjouterEmploye', ["restaurants" => $restaurants]);
    }

    public function employeAdd()
    {
        return Inertia::render('Restaurants/AddEmploye');
    }

    public function store(Request $request)
    {
        $data = $request->validate(Employe::$rules);

        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        if ($request->hasFile('id_card_front')) {
            $data['id_card_front'] = $request->file('id_card_front')->store('id-cards', 'public');
        }

        if ($request->hasFile('id_card_back')) {
            $data['id_card_back'] = $request->file('id_card_back')->store('id-cards', 'public');
        }

        Employe::create($data);

        return redirect('/')->with('success', 'Employee added successfully.');
    }

    function modifieremploye() {
        $restaurants = Restaurant::all();
        return Inertia::render('Restaurants/ModifierEmploye', ["restaurants" => $restaurants]);
    }

    function employeEdit(Request $request) {
        $restau = $request->query('restau');
        $employes = Employe::where('restau', $restau)->get();
        return Inertia::render('Restaurants/EditEmploye', [
            'employes' => $employes
        ]);
    }

    function employeUpdate($id)  {

        $restaurants = Restaurant::all();
        $employe = Employe::findOrFail($id);
        return Inertia::render('Restaurants/UpdateEmploye', [
            'employe' => $employe,
            "restaurants" => $restaurants
        ]);
    }

    function update($id, Request $request)  {
        $employe = Employe::findOrFail($id);
        
        // Get only the fields that were actually sent in the request
        $data = $request->only([
            'first_name', 'last_name', 'DDN', 'telephone', 
            'address', 'city', 'country', 'marital_status',
            'username', 'restau', 'embauche', 'depart'
        ]);
    
        // Add validation for only the fields that were sent
        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'DDN' => 'required|date',
            'telephone' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'marital_status' => 'required|in:single,married,other',
            'username' => 'required|string|unique:employes,username,' . $id,
            'restau' => 'required|string',
            'embauche' => 'required|date',
            'depart' => 'nullable|date'
        ];
    
        // Only validate image files if they were actually uploaded
        if ($request->hasFile('profile_photo')) {
            $rules['profile_photo'] = 'nullable|image|max:10240';
            $data['profile_photo'] = $request->file('profile_photo')->store('profile-photos', 'public');
        }
    
        if ($request->hasFile('id_card_front')) {
            $rules['id_card_front'] = 'nullable|image|max:10240';
            $data['id_card_front'] = $request->file('id_card_front')->store('id-cards', 'public');
        }
    
        if ($request->hasFile('id_card_back')) {
            $rules['id_card_back'] = 'nullable|image|max:10240';
            $data['id_card_back'] = $request->file('id_card_back')->store('id-cards', 'public');
        }
    
        $validated = $request->validate($rules);
        
        $employe->update($data);
    
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
    $month = $request->input('month', now()->month);
    $year = $request->input('year', now()->year);

    // Get restaurant info
    $restaurant = Restaurant::where('slug', $restau)->first();

    // Get employees with presence records
    $employes = Employe::where('restau', $restau)->get();
    
    $presences = collect($employes)->map(function ($employe) use ($month, $year) {
        $presence = Presence::firstOrCreate(
            [
                'employe_id' => $employe->id,
                'month' => $month,
                'year' => $year,
            ],
            [
                'attendance_data' => []
            ]
        );

        return [
            'employe' => $employe,
            'presence' => $presence
        ];
    });

    return Inertia::render('Restaurants/ManagePresence', [
        'restaurant' => $restaurant,  // Pass the restaurant object
        'presences' => $presences,
        'currentMonth' => [
            'month' => $month,
            'year' => $year
        ]
    ]);
}

    public function updateAttendance(Request $request)
    {
        $request->validate([
            'employe_id' => 'required|exists:employes,id',
            'day' => 'required|integer|between:1,31',
            'status' => 'required|in:present,absent,conge-paye,conge-non-paye,repos,continue',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer'
        ]);

        $presence = Presence::firstOrCreate(
            [
                'employe_id' => $request->employe_id,
                'month' => $request->month,
                'year' => $request->year,
            ],
            [
                'attendance_data' => []
            ]
        );

        $attendanceData = $presence->attendance_data;
        $attendanceData[$request->day] = $request->status;
        $presence->attendance_data = $attendanceData;
        $presence->save();

        return redirect()->back()->with('success', 'Employee added successfully.');
    }
}
