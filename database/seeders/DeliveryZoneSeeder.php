<?php

namespace Database\Seeders;

use App\Models\DeliveryZone;
use Illuminate\Database\Seeder;

class DeliveryZoneSeeder extends Seeder
{
    public function run(): void
    {
        DeliveryZone::query()->delete();

        $zones = [
            ['area' => 'Johannesburg', 'province' => 'Gauteng', 'km_from_base' => 0, 'fee' => 85.00],
            ['area' => 'Pretoria', 'province' => 'Gauteng', 'km_from_base' => 55, 'fee' => 145.00],
            ['area' => 'Ekurhuleni', 'province' => 'Gauteng', 'km_from_base' => 20, 'fee' => 105.00],
            ['area' => 'Midrand', 'province' => 'Gauteng', 'km_from_base' => 15, 'fee' => 95.00],
            ['area' => 'Centurion', 'province' => 'Gauteng', 'km_from_base' => 45, 'fee' => 130.00],
            ['area' => 'Soweto', 'province' => 'Gauteng', 'km_from_base' => 25, 'fee' => 110.00],
            ['area' => 'Randburg', 'province' => 'Gauteng', 'km_from_base' => 10, 'fee' => 90.00],
            ['area' => 'Sandton', 'province' => 'Gauteng', 'km_from_base' => 8, 'fee' => 85.00],
            ['area' => 'Roodepoort', 'province' => 'Gauteng', 'km_from_base' => 22, 'fee' => 105.00],
            ['area' => 'Krugersdorp', 'province' => 'Gauteng', 'km_from_base' => 35, 'fee' => 120.00],

            ['area' => 'Cape Town CBD', 'province' => 'Western Cape', 'km_from_base' => 0, 'fee' => 85.00],
            ['area' => 'Stellenbosch', 'province' => 'Western Cape', 'km_from_base' => 50, 'fee' => 180.00],
            ['area' => 'Paarl', 'province' => 'Western Cape', 'km_from_base' => 65, 'fee' => 200.00],
            ['area' => 'George', 'province' => 'Western Cape', 'km_from_base' => 420, 'fee' => 650.00],
            ['area' => 'Somerset West', 'province' => 'Western Cape', 'km_from_base' => 45, 'fee' => 160.00],
            ['area' => 'Bellville', 'province' => 'Western Cape', 'km_from_base' => 20, 'fee' => 110.00],

            ['area' => 'Durban CBD', 'province' => 'KwaZulu-Natal', 'km_from_base' => 0, 'fee' => 85.00],
            ['area' => 'Umhlanga', 'province' => 'KwaZulu-Natal', 'km_from_base' => 18, 'fee' => 125.00],
            ['area' => 'Ballito', 'province' => 'KwaZulu-Natal', 'km_from_base' => 45, 'fee' => 200.00],
            ['area' => 'Pietermaritzburg', 'province' => 'KwaZulu-Natal', 'km_from_base' => 80, 'fee' => 280.00],
            ['area' => 'Richards Bay', 'province' => 'KwaZulu-Natal', 'km_from_base' => 180, 'fee' => 450.00],
            ['area' => 'Pinetown', 'province' => 'KwaZulu-Natal', 'km_from_base' => 22, 'fee' => 135.00],
            ['area' => 'Westville', 'province' => 'KwaZulu-Natal', 'km_from_base' => 12, 'fee' => 110.00],

            ['area' => 'Gqeberha', 'province' => 'Eastern Cape', 'km_from_base' => 0, 'fee' => 95.00],
            ['area' => 'East London', 'province' => 'Eastern Cape', 'km_from_base' => 300, 'fee' => 520.00],
            ['area' => 'Mthatha', 'province' => 'Eastern Cape', 'km_from_base' => 450, 'fee' => 680.00],
            ['area' => 'Port Alfred', 'province' => 'Eastern Cape', 'km_from_base' => 150, 'fee' => 380.00],

            ['area' => 'Mbombela', 'province' => 'Mpumalanga', 'km_from_base' => 0, 'fee' => 100.00],
            ['area' => 'Witbank', 'province' => 'Mpumalanga', 'km_from_base' => 150, 'fee' => 350.00],
            ['area' => 'Middelburg', 'province' => 'Mpumalanga', 'km_from_base' => 170, 'fee' => 380.00],

            ['area' => 'Polokwane', 'province' => 'Limpopo', 'km_from_base' => 0, 'fee' => 100.00],
            ['area' => 'Tzaneen', 'province' => 'Limpopo', 'km_from_base' => 100, 'fee' => 280.00],
            ['area' => 'Lephalale', 'province' => 'Limpopo', 'km_from_base' => 250, 'fee' => 480.00],

            ['area' => 'Mahikeng', 'province' => 'North West', 'km_from_base' => 0, 'fee' => 95.00],
            ['area' => 'Rustenburg', 'province' => 'North West', 'km_from_base' => 250, 'fee' => 450.00],
            ['area' => 'Potchefstroom', 'province' => 'North West', 'km_from_base' => 200, 'fee' => 400.00],

            ['area' => 'Bloemfontein', 'province' => 'Free State', 'km_from_base' => 0, 'fee' => 95.00],
            ['area' => 'Welkom', 'province' => 'Free State', 'km_from_base' => 150, 'fee' => 320.00],
            ['area' => 'Bethlehem', 'province' => 'Free State', 'km_from_base' => 260, 'fee' => 480.00],

            ['area' => 'Kimberley', 'province' => 'Northern Cape', 'km_from_base' => 0, 'fee' => 100.00],
            ['area' => 'Upington', 'province' => 'Northern Cape', 'km_from_base' => 400, 'fee' => 600.00],
            ['area' => 'Springbok', 'province' => 'Northern Cape', 'km_from_base' => 700, 'fee' => 950.00],
        ];

        foreach ($zones as $zone) {
            DeliveryZone::create($zone);
        }
    }
}
