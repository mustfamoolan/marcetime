<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Balance extends Model
{
    use HasFactory;

    protected $fillable = [
        'capital_balance',
        'mustafa_balance',
        'donia_balance',
        'total_capital_all_time',
        'total_mustafa_all_time',
        'total_donia_all_time',
        'total_profit_all_time'
    ];

    protected $casts = [
        'capital_balance' => 'decimal:2',
        'mustafa_balance' => 'decimal:2',
        'donia_balance' => 'decimal:2',
        'total_capital_all_time' => 'decimal:2',
        'total_mustafa_all_time' => 'decimal:2',
        'total_donia_all_time' => 'decimal:2',
        'total_profit_all_time' => 'decimal:2'
    ];
}
