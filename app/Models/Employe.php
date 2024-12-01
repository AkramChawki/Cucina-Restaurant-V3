<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'DDN',
        'telephone',
        'address',
        'city',
        'country',
        'marital_status',
        'username',
        'profile_photo',
        'id_card_front',
        'id_card_back',
        'restau',
        'embauche',
        'depart',
        'pdf'
    ];

    protected $dates = ['DDN', 'embauche', 'depart'];

    public static $rules = [
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'DDN' => 'required|date',
        'telephone' => 'required|string|max:255',
        'address' => 'required|string|max:255',
        'city' => 'required|string|max:255',
        'country' => 'required|string|max:255',
        'marital_status' => 'required|in:single,married,other',
        'username' => 'required|string|unique:employes,username',
        'profile_photo' => 'nullable|image|max:10240',
        'id_card_front' => 'required|image|max:10240',
        'id_card_back' => 'required|image|max:10240',
        'restau' => 'required|string',
        'embauche' => 'required|date',
    ];
}
