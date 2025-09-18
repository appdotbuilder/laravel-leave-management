<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeaveRequest>
 */
class LeaveRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('now', '+6 months');
        $endDate = fake()->dateTimeBetween($startDate, '+1 month');
        $days = $startDate->diff($endDate)->days + 1;

        return [
            'user_id' => User::factory(),
            'reason' => fake()->sentence(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'days_requested' => $days,
            'status' => 'pending',
        ];
    }

    /**
     * Indicate that the leave request is approved by section head.
     */
    public function approvedBySectionHead(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved_by_section_head',
            'section_head_id' => User::factory()->kepalaSeksi(),
            'section_head_approved_at' => fake()->dateTimeBetween('-1 week', 'now'),
            'section_head_notes' => fake()->optional()->sentence(),
        ]);
    }

    /**
     * Indicate that the leave request is fully approved.
     */
    public function fullyApproved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved_by_kepala_upt',
            'section_head_id' => User::factory()->kepalaSeksi(),
            'section_head_approved_at' => fake()->dateTimeBetween('-2 weeks', '-1 week'),
            'section_head_notes' => fake()->optional()->sentence(),
            'kepala_upt_id' => User::factory()->kepalaUpt(),
            'kepala_upt_approved_at' => fake()->dateTimeBetween('-1 week', 'now'),
            'kepala_upt_notes' => fake()->optional()->sentence(),
        ]);
    }

    /**
     * Indicate that the leave request is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'section_head_id' => User::factory()->kepalaSeksi(),
            'section_head_approved_at' => fake()->dateTimeBetween('-1 week', 'now'),
            'section_head_notes' => 'Request rejected: ' . fake()->sentence(),
        ]);
    }
}