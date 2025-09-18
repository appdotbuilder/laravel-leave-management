<?php

namespace Database\Seeders;

use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LeaveManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Kepala UPT
        $kepalaUpt = User::create([
            'name' => 'Dr. Ahmad Wijaya',
            'username' => 'kepala_upt',
            'full_name' => 'Dr. Ahmad Wijaya, M.Si',
            'nip' => '196501011990031001',
            'position' => 'Kepala UPT',
            'gender' => 'male',
            'phone' => '+62 812-3456-7890',
            'role' => 'kepala_upt',
            'section' => null,
            'annual_leave_quota' => 12,
            'email' => 'kepala.upt@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create Section Heads
        $kepalaSeksiA = User::create([
            'name' => 'Siti Nurhaliza, S.Kom',
            'username' => 'kepala_seksi_a',
            'full_name' => 'Siti Nurhaliza, S.Kom',
            'nip' => '197203151995122001',
            'position' => 'Kepala Seksi A',
            'gender' => 'female',
            'phone' => '+62 813-4567-8901',
            'role' => 'kepala_seksi',
            'section' => 'A',
            'annual_leave_quota' => 12,
            'supervisor_id' => $kepalaUpt->id,
            'email' => 'kepala.seksi.a@example.com',
            'password' => Hash::make('password'),
        ]);

        $kepalaSeksiB = User::create([
            'name' => 'Budi Santoso, S.T',
            'username' => 'kepala_seksi_b',
            'full_name' => 'Budi Santoso, S.T',
            'nip' => '198007101998031002',
            'position' => 'Kepala Seksi B',
            'gender' => 'male',
            'phone' => '+62 814-5678-9012',
            'role' => 'kepala_seksi',
            'section' => 'B',
            'annual_leave_quota' => 12,
            'supervisor_id' => $kepalaUpt->id,
            'email' => 'kepala.seksi.b@example.com',
            'password' => Hash::make('password'),
        ]);

        $kepalaSeksiC = User::create([
            'name' => 'Maria Indrawati, S.E',
            'username' => 'kepala_seksi_c',
            'full_name' => 'Maria Indrawati, S.E',
            'nip' => '198512252010122001',
            'position' => 'Kepala Seksi C',
            'gender' => 'female',
            'phone' => '+62 815-6789-0123',
            'role' => 'kepala_seksi',
            'section' => 'C',
            'annual_leave_quota' => 12,
            'supervisor_id' => $kepalaUpt->id,
            'email' => 'kepala.seksi.c@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create Employees for Section A
        $employeesA = [
            [
                'name' => 'Andi Pratama',
                'username' => 'andi_pratama',
                'full_name' => 'Andi Pratama, A.Md',
                'nip' => '199005142015031001',
                'position' => 'Staff Teknis',
                'gender' => 'male',
                'phone' => '+62 816-7890-1234',
                'supervisor_id' => $kepalaSeksiA->id,
            ],
            [
                'name' => 'Dewi Lestari',
                'username' => 'dewi_lestari',
                'full_name' => 'Dewi Lestari, S.Pd',
                'nip' => '199203081016032001',
                'position' => 'Staff Administrasi',
                'gender' => 'female',
                'phone' => '+62 817-8901-2345',
                'supervisor_id' => $kepalaSeksiA->id,
            ],
            [
                'name' => 'Riko Hermawan',
                'username' => 'riko_hermawan',
                'full_name' => 'Riko Hermawan',
                'nip' => '199408172018031002',
                'position' => 'Staff Operasional',
                'gender' => 'male',
                'phone' => '+62 818-9012-3456',
                'supervisor_id' => $kepalaSeksiA->id,
            ],
        ];

        foreach ($employeesA as $employee) {
            User::create(array_merge($employee, [
                'role' => 'pegawai',
                'section' => 'A',
                'annual_leave_quota' => 12,
                'email' => strtolower(str_replace(' ', '.', $employee['name'])) . '@example.com',
                'password' => Hash::make('password'),
            ]));
        }

        // Create Employees for Section B
        $employeesB = [
            [
                'name' => 'Sari Wulandari',
                'username' => 'sari_wulandari',
                'full_name' => 'Sari Wulandari, S.Kom',
                'nip' => '199106252017032001',
                'position' => 'Programmer',
                'gender' => 'female',
                'phone' => '+62 819-0123-4567',
                'supervisor_id' => $kepalaSeksiB->id,
            ],
            [
                'name' => 'Agus Setiawan',
                'username' => 'agus_setiawan',
                'full_name' => 'Agus Setiawan, A.Md.T',
                'nip' => '198909302014031001',
                'position' => 'Teknisi',
                'gender' => 'male',
                'phone' => '+62 820-1234-5678',
                'supervisor_id' => $kepalaSeksiB->id,
            ],
        ];

        foreach ($employeesB as $employee) {
            User::create(array_merge($employee, [
                'role' => 'pegawai',
                'section' => 'B',
                'annual_leave_quota' => 12,
                'email' => strtolower(str_replace(' ', '.', $employee['name'])) . '@example.com',
                'password' => Hash::make('password'),
            ]));
        }

        // Create Employees for Section C
        $employeesC = [
            [
                'name' => 'Linda Wijayanti',
                'username' => 'linda_wijayanti',
                'full_name' => 'Linda Wijayanti, S.E',
                'nip' => '199304122019032001',
                'position' => 'Staff Keuangan',
                'gender' => 'female',
                'phone' => '+62 821-2345-6789',
                'supervisor_id' => $kepalaSeksiC->id,
            ],
            [
                'name' => 'Hendra Kusuma',
                'username' => 'hendra_kusuma',
                'full_name' => 'Hendra Kusuma, S.H',
                'nip' => '198701082012031001',
                'position' => 'Staff Hukum',
                'gender' => 'male',
                'phone' => '+62 822-3456-7890',
                'supervisor_id' => $kepalaSeksiC->id,
            ],
            [
                'name' => 'Fitri Rahayu',
                'username' => 'fitri_rahayu',
                'full_name' => 'Fitri Rahayu, S.Sos',
                'nip' => '199502282020032001',
                'position' => 'Staff Humas',
                'gender' => 'female',
                'phone' => '+62 823-4567-8901',
                'supervisor_id' => $kepalaSeksiC->id,
            ],
        ];

        foreach ($employeesC as $employee) {
            User::create(array_merge($employee, [
                'role' => 'pegawai',
                'section' => 'C',
                'annual_leave_quota' => 12,
                'email' => strtolower(str_replace(' ', '.', $employee['name'])) . '@example.com',
                'password' => Hash::make('password'),
            ]));
        }

        // Create some sample leave requests
        $employees = User::where('role', 'pegawai')->get();
        $sectionHeads = User::where('role', 'kepala_seksi')->get();

        // Create leave requests for employees
        foreach ($employees->take(5) as $employee) {
            LeaveRequest::factory()->create([
                'user_id' => $employee->id,
            ]);
        }

        // Create some approved leave requests
        foreach ($employees->skip(2)->take(3) as $employee) {
            LeaveRequest::factory()->approvedBySectionHead()->create([
                'user_id' => $employee->id,
                'section_head_id' => $sectionHeads->where('section', $employee->section)->first()->id,
            ]);
        }

        // Create a fully approved leave request
        LeaveRequest::factory()->fullyApproved()->create([
            'user_id' => $employees->first()->id,
            'section_head_id' => $sectionHeads->where('section', $employees->first()->section)->first()->id,
            'kepala_upt_id' => $kepalaUpt->id,
        ]);

        // Create leave request from section head
        LeaveRequest::factory()->create([
            'user_id' => $kepalaSeksiA->id,
        ]);
    }
}