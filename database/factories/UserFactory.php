<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();
        $fullName = $firstName . ' ' . $lastName;
        
        return [
            'name' => $fullName,
            'username' => fake()->unique()->userName(),
            'full_name' => $fullName,
            'nip' => fake()->unique()->numerify('################'),
            'position' => fake()->jobTitle(),
            'gender' => fake()->randomElement(['male', 'female']),
            'phone' => fake()->phoneNumber(),
            'role' => 'pegawai',
            'section' => fake()->randomElement(['A', 'B', 'C']),
            'annual_leave_quota' => 12,
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the user is a Kepala UPT.
     */
    public function kepalaUpt(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'kepala_upt',
            'section' => null,
            'position' => 'Kepala UPT',
        ]);
    }

    /**
     * Indicate that the user is a Kepala Seksi.
     */
    public function kepalaSeksi(string $section = null): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'kepala_seksi',
            'section' => $section ?? fake()->randomElement(['A', 'B', 'C']),
            'position' => 'Kepala Seksi',
        ]);
    }

    /**
     * Indicate that the user is a Pegawai.
     */
    public function pegawai(string $section = null): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'pegawai',
            'section' => $section ?? fake()->randomElement(['A', 'B', 'C']),
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}