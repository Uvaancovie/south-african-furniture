<?php

use App\Models\DeliveryZone;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('delivery_zones', function (Blueprint $table) {
            $table->string('province', 100)->nullable()->after('area');
        });

        DeliveryZone::whereNull('province')->each(function ($zone) {
            $parts = explode(' - ', $zone->area, 2);
            $zone->province = $parts[0];
            $zone->area = $parts[1] ?? $zone->area;
            $zone->save();
        });

        Schema::table('delivery_zones', function (Blueprint $table) {
            $table->string('province', 100)->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('delivery_zones', function (Blueprint $table) {
            $table->dropColumn('province');
        });
    }
};
