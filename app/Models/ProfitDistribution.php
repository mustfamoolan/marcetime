<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfitDistribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'mustafa_share',
        'donia_share'
    ];

    protected $casts = [
        'mustafa_share' => 'decimal:2',
        'donia_share' => 'decimal:2',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
