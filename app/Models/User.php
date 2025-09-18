<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $username
 * @property string $full_name
 * @property string $nip
 * @property string $position
 * @property string $gender
 * @property string|null $phone
 * @property string $role
 * @property string|null $section
 * @property int $annual_leave_quota
 * @property int|null $supervisor_id
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property mixed $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $supervisor
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $subordinates
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LeaveRequest> $leaveRequests
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LeaveRequest> $sectionHeadApprovals
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LeaveRequest> $kepalaUptApprovals
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereAnnualLeaveQuota($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereFullName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereNip($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereSection($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereSupervisorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUsername($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User kepalaUpt()
 * @method static \Illuminate\Database\Eloquent\Builder|User kepalaSeksi()
 * @method static \Illuminate\Database\Eloquent\Builder|User pegawai()
 * @method static \Illuminate\Database\Eloquent\Builder|User inSection($section)
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'full_name',
        'nip',
        'position',
        'gender',
        'phone',
        'role',
        'section',
        'annual_leave_quota',
        'supervisor_id',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the supervisor that this user reports to.
     */
    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    /**
     * Get all users that report to this user.
     */
    public function subordinates(): HasMany
    {
        return $this->hasMany(User::class, 'supervisor_id');
    }

    /**
     * Get all leave requests made by this user.
     */
    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * Get all leave requests approved by this user as section head.
     */
    public function sectionHeadApprovals(): HasMany
    {
        return $this->hasMany(LeaveRequest::class, 'section_head_id');
    }

    /**
     * Get all leave requests approved by this user as kepala UPT.
     */
    public function kepalaUptApprovals(): HasMany
    {
        return $this->hasMany(LeaveRequest::class, 'kepala_upt_id');
    }

    /**
     * Scope a query to only include Kepala UPT users.
     */
    public function scopeKepalaUpt($query)
    {
        return $query->where('role', 'kepala_upt');
    }

    /**
     * Scope a query to only include Kepala Seksi users.
     */
    public function scopeKepalaSeksi($query)
    {
        return $query->where('role', 'kepala_seksi');
    }

    /**
     * Scope a query to only include Pegawai users.
     */
    public function scopePegawai($query)
    {
        return $query->where('role', 'pegawai');
    }

    /**
     * Scope a query to only include users in a specific section.
     */
    public function scopeInSection($query, $section)
    {
        return $query->where('section', $section);
    }

    /**
     * Check if user is Kepala UPT.
     */
    public function isKepalaUpt(): bool
    {
        return $this->role === 'kepala_upt';
    }

    /**
     * Check if user is Kepala Seksi.
     */
    public function isKepalaSeksi(): bool
    {
        return $this->role === 'kepala_seksi';
    }

    /**
     * Check if user is Pegawai.
     */
    public function isPegawai(): bool
    {
        return $this->role === 'pegawai';
    }

    /**
     * Get the remaining leave quota for this user.
     */
    public function getRemainingLeaveQuota(): int
    {
        $usedLeave = $this->leaveRequests()
            ->whereIn('status', ['approved_by_section_head', 'approved_by_kepala_upt'])
            ->whereYear('start_date', now()->year)
            ->sum('days_requested');

        return max(0, $this->annual_leave_quota - $usedLeave);
    }
}