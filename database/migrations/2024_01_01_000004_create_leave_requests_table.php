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
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('reason')->comment('Reason for leave request');
            $table->date('start_date')->comment('Leave start date');
            $table->date('end_date')->comment('Leave end date');
            $table->integer('days_requested')->comment('Number of days requested');
            $table->enum('status', ['pending', 'approved_by_section_head', 'approved_by_kepala_upt', 'rejected'])->default('pending');
            $table->foreignId('section_head_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('section_head_approved_at')->nullable();
            $table->text('section_head_notes')->nullable();
            $table->foreignId('kepala_upt_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('kepala_upt_approved_at')->nullable();
            $table->text('kepala_upt_notes')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};