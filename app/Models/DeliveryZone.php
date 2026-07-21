<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['area', 'province', 'km_from_base', 'fee'])]
class DeliveryZone extends Model
{
    protected function casts(): array
    {
        return [
            'km_from_base' => 'decimal:1',
            'fee' => 'decimal:2',
        ];
    }
}
