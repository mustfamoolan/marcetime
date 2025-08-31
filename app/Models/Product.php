<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'image',
        'purchase_price',
        'marketing_cost',
        'selling_price',
        'quantity',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'purchase_price' => 'decimal:2',
            'marketing_cost' => 'decimal:2',
            'selling_price' => 'decimal:2',
        ];
    }

    /**
     * حساب التكلفة الإجمالية (سعر الشراء + كلفة التسويق)
     */
    public function getTotalCostAttribute(): float
    {
        return $this->purchase_price + $this->marketing_cost;
    }

    /**
     * حساب الربح المتوقع للوحدة الواحدة
     */
    public function getUnitProfitAttribute(): float
    {
        return $this->selling_price - $this->total_cost;
    }

    /**
     * حساب الربح الإجمالي للكمية المتاحة
     */
    public function getTotalPotentialProfitAttribute(): float
    {
        return $this->unit_profit * $this->quantity;
    }

    /**
     * التحقق من توفر المنتج
     */
    public function isInStock(): bool
    {
        return $this->quantity > 0;
    }

    /**
     * تقليل الكمية عند البيع
     */
    public function decreaseQuantity(int $soldQuantity = 1): bool
    {
        if ($this->quantity >= $soldQuantity) {
            $this->quantity -= $soldQuantity;
            return $this->save();
        }
        return false;
    }

    /**
     * علاقة المبيعات
     */
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
