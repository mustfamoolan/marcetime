<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'quantity_sold',
        'unit_purchase_price',
        'unit_marketing_cost',
        'unit_selling_price',
        'total_cost',
        'total_revenue',
        'total_profit',
        'payment_type',
        'customer_name'
    ];

    protected $casts = [
        'unit_purchase_price' => 'decimal:2',
        'unit_marketing_cost' => 'decimal:2',
        'unit_selling_price' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'total_revenue' => 'decimal:2',
        'total_profit' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function debt()
    {
        return $this->hasOne(Debt::class);
    }

    public function profitDistribution()
    {
        return $this->hasOne(ProfitDistribution::class);
    }
}
