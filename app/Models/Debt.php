<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'customer_name',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'status'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function payments()
    {
        return $this->hasMany(DebtPayment::class);
    }

    public function updateStatus()
    {
        $this->remaining_amount = $this->total_amount - $this->paid_amount;

        // تأكد من أن المبلغ المتبقي لا يقل عن الصفر
        if ($this->remaining_amount <= 0) {
            $this->remaining_amount = 0;
            $this->status = 'paid';
        } elseif ($this->paid_amount > 0) {
            $this->status = 'partial';
        } else {
            $this->status = 'pending';
        }

        $this->save();
    }
}
