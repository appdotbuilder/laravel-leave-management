<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('name');
            $table->string('full_name')->after('username');
            $table->string('nip')->unique()->after('full_name')->comment('Nomor Induk Pegawai');
            $table->string('position')->after('nip');
            $table->enum('gender', ['male', 'female'])->after('position');
            $table->string('phone')->nullable()->after('gender');
            $table->enum('role', ['kepala_upt', 'kepala_seksi', 'pegawai'])->default('pegawai')->after('phone');
            $table->enum('section', ['A', 'B', 'C'])->nullable()->after('role')->comment('Section for Kepala Seksi and Pegawai');
            $table->integer('annual_leave_quota')->default(12)->after('section')->comment('Annual leave days available');
            $table->foreignId('supervisor_id')->nullable()->after('annual_leave_quota')->constrained('users')->onDelete('set null');
            
            // Indexes
            $table->index('username');
            $table->index('nip');
            $table->index('role');
            $table->index('section');
            $table->index(['role', 'section']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['supervisor_id']);
            $table->dropColumn([
                'username',
                'full_name', 
                'nip',
                'position',
                'gender',
                'phone',
                'role',
                'section',
                'annual_leave_quota',
                'supervisor_id'
            ]);
        });
    }
};