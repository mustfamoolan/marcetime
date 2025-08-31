<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء المستخدمين الافتراضيين

        // مصطفى - المدير (70% من الأرباح)
        User::create([
            'name' => 'مصطفى',
            'email' => 'mustafa@marcetime.com',
            'password' => bcrypt('123456'),
            'role' => 'manager',
            'profit_percentage' => 70.00,
        ]);

        // دنيا - الشريك (30% من الأرباح)
        User::create([
            'name' => 'دنيا',
            'email' => 'donia@marcetime.com',
            'password' => bcrypt('123456'),
            'role' => 'partner',
            'profit_percentage' => 30.00,
        ]);
    }
}
