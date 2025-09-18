<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\LeaveRequest
 *
 * @property int $id
 * @property int $user_id
 * @property string $reason
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon $end_date
 * @property int $days_requested
 * @property string $status
 * @property int|null $section_head_id
 * @property \Illuminate\Support\Carbon|null $section_head_approved_at
 * @property string|null $section_head_notes
 * @property int|null $kepala_upt_id
 * @property \Illuminate\Support\Carbon|null $kepala_upt_approved_at
 * @property string|null $kepala_upt_notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\User|null $sectionHead
 * @property-read \App\Models\User|null $kepalaUpt
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereDaysRequested($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereKepalaUptApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereKepalaUptId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereKepalaUptNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereSectionHeadApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereSectionHeadId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereSectionHeadNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest pending()
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest approved()
 * @method static \Illuminate\Database\Eloquent\Builder|LeaveRequest rejected()
 * @method static \Database\Factories\LeaveRequestFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class LeaveRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'reason',
        'start_date',
        'end_date',
        'days_requested',
        'status',
        'section_head_id',
        'section_head_approved_at',
        'section_head_notes',
        'kepala_upt_id',
        'kepala_upt_approved_at',
        'kepala_upt_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'section_head_approved_at' => 'datetime',
        'kepala_upt_approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who made this leave request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the section head who approved this request.
     */
    public function sectionHead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'section_head_id');
    }

    /**
     * Get the kepala UPT who approved this request.
     */
    public function kepalaUpt(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kepala_upt_id');
    }

    /**
     * Scope a query to only include pending requests.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved requests.
     */
    public function scopeApproved($query)
    {
        return $query->whereIn('status', ['approved_by_section_head', 'approved_by_kepala_upt']);
    }

    /**
     * Scope a query to only include rejected requests.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Get the status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pending',
            'approved_by_section_head' => 'Approved by Section Head',
            'approved_by_kepala_upt' => 'Fully Approved',
            'rejected' => 'Rejected',
            default => 'Unknown',
        };
    }

    /**
     * Check if the request is fully approved.
     */
    public function isFullyApproved(): bool
    {
        return $this->status === 'approved_by_kepala_upt';
    }

    /**
     * Check if the request is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if the request is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}