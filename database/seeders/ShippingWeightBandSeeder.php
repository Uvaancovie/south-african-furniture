<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShippingWeightBandSeeder extends Seeder
{
    public function run(): void
    {
        $bands = [
            ['max_kg' => 1.000,       'rate_per_kg' => 3.0000, 'label' => 'Up to 1 kg',  'sort_order' => 1, 'active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['max_kg' => 5.000,       'rate_per_kg' => 2.5000, 'label' => '1 – 5 kg',    'sort_order' => 2, 'active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['max_kg' => 15.000,      'rate_per_kg' => 2.0000, 'label' => '5 – 15 kg',   'sort_order' => 3, 'active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['max_kg' => 30.000,      'rate_per_kg' => 1.7500, 'label' => '15 – 30 kg',  'sort_order' => 4, 'active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['max_kg' => 99999.999,  'rate_per_kg' => 1.5000, 'label' => '30 kg+',      'sort_order' => 5, 'active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($bands as $band) {
            DB::table('shipping_weight_bands')->updateOrInsert(
                ['max_kg' => $band['max_kg']],
                $band
            );
        }
    }
}
