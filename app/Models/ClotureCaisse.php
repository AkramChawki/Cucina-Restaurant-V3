<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClotureCaisse extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'restau',
        'date',
        'time',
        'responsable',
        'montant',
        'montantE',
        'cartebancaire',
        'cartebancaireLivraison',
        'virement',
        'cheque',
        'compensation',
        'familleAcc',
        'erreurPizza',
        'erreurCuisine',
        'erreurServeur',
        'erreurCaisse',
        'perteEmporte',
        'giveawayPizza',
        'giveawayPasta',
        'glovoC',
        'glovoE',
        'appE',
        'appC',
        'shooting',
        'ComGlovo',
        'signature',
    ];

    protected $casts = [
        'created_at' => 'date:M j, Y',
        'updated_at' => 'date:M j, Y',
    ];
}
