<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        $query = LeaveRequest::with(['user', 'sectionHead', 'kepalaUpt']);
        
        // Filter based on user role
        if ($user->isPegawai()) {
            // Employees can only see their own requests
            $query->where('user_id', $user->id);
        } elseif ($user->isKepalaSeksi()) {
            // Section heads can see their own requests and their subordinates' requests
            $subordinateIds = $user->subordinates()->pluck('id')->toArray();
            $query->whereIn('user_id', array_merge([$user->id], $subordinateIds));
        }
        // Kepala UPT can see all requests (no additional filtering)
        
        $leaveRequests = $query->latest()->paginate(10);
        
        return Inertia::render('leave-requests/index', [
            'leaveRequests' => $leaveRequests,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();
        
        return Inertia::render('leave-requests/create', [
            'remainingQuota' => $user->getRemainingLeaveQuota(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveRequestRequest $request)
    {
        $user = auth()->user();
        
        // Calculate days requested
        $startDate = new \DateTime($request->start_date);
        $endDate = new \DateTime($request->end_date);
        $daysRequested = $startDate->diff($endDate)->days + 1;
        
        // Check if user has enough quota
        if ($daysRequested > $user->getRemainingLeaveQuota()) {
            return back()->with('error', 'Jumlah hari cuti melebihi kuota yang tersedia.');
        }
        
        $leaveRequest = LeaveRequest::create([
            'user_id' => $user->id,
            'reason' => $request->reason,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'days_requested' => $daysRequested,
            'status' => 'pending',
        ]);
        
        return redirect()->route('leave-requests.show', $leaveRequest)
            ->with('success', 'Permintaan cuti berhasil diajukan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveRequest $leaveRequest)
    {
        // Check authorization
        $user = auth()->user();
        if (!$this->canViewLeaveRequest($user, $leaveRequest)) {
            abort(403);
        }
        
        $leaveRequest->load(['user', 'sectionHead', 'kepalaUpt']);
        
        return Inertia::render('leave-requests/show', [
            'leaveRequest' => $leaveRequest,
            'canApprove' => $this->canApproveLeaveRequest($user, $leaveRequest),
            'canReject' => $this->canRejectLeaveRequest($user, $leaveRequest),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LeaveRequest $leaveRequest)
    {
        $user = auth()->user();
        $action = $request->input('action');
        
        if ($action === 'approve') {
            return $this->approveLeaveRequest($user, $leaveRequest, $request);
        } elseif ($action === 'reject') {
            return $this->rejectLeaveRequest($user, $leaveRequest, $request);
        }
        
        return back()->with('error', 'Aksi tidak valid.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveRequest $leaveRequest)
    {
        $user = auth()->user();
        
        // Check if user can delete this leave request
        if (!$this->canDeleteLeaveRequest($user, $leaveRequest)) {
            abort(403);
        }
        
        $leaveRequest->delete();
        
        return redirect()->route('leave-requests.index')
            ->with('success', 'Data cuti berhasil dihapus.');
    }

    /**
     * Approve a leave request.
     */
    protected function approveLeaveRequest(User $user, LeaveRequest $leaveRequest, Request $request)
    {
        $notes = $request->input('notes');
        
        if ($user->isKepalaSeksi() && $leaveRequest->status === 'pending') {
            // Section head approval
            $leaveRequest->update([
                'status' => 'approved_by_section_head',
                'section_head_id' => $user->id,
                'section_head_approved_at' => now(),
                'section_head_notes' => $notes,
            ]);
            
            $message = 'Permintaan cuti telah disetujui oleh Kepala Seksi.';
        } elseif ($user->isKepalaUpt() && in_array($leaveRequest->status, ['pending', 'approved_by_section_head'])) {
            // Kepala UPT approval
            $leaveRequest->update([
                'status' => 'approved_by_kepala_upt',
                'kepala_upt_id' => $user->id,
                'kepala_upt_approved_at' => now(),
                'kepala_upt_notes' => $notes,
            ]);
            
            $message = 'Permintaan cuti telah disetujui oleh Kepala UPT.';
        } else {
            return back()->with('error', 'Anda tidak dapat menyetujui permintaan ini.');
        }
        
        return back()->with('success', $message);
    }

    /**
     * Reject a leave request.
     */
    protected function rejectLeaveRequest(User $user, LeaveRequest $leaveRequest, Request $request)
    {
        $notes = $request->input('notes');
        
        if (($user->isKepalaSeksi() || $user->isKepalaUpt()) && $leaveRequest->status !== 'rejected') {
            $leaveRequest->update([
                'status' => 'rejected',
                $user->isKepalaSeksi() ? 'section_head_id' : 'kepala_upt_id' => $user->id,
                $user->isKepalaSeksi() ? 'section_head_approved_at' : 'kepala_upt_approved_at' => now(),
                $user->isKepalaSeksi() ? 'section_head_notes' : 'kepala_upt_notes' => $notes ?: 'Permintaan ditolak.',
            ]);
            
            return back()->with('success', 'Permintaan cuti telah ditolak.');
        }
        
        return back()->with('error', 'Anda tidak dapat menolak permintaan ini.');
    }

    /**
     * Check if user can view the leave request.
     */
    protected function canViewLeaveRequest(User $user, LeaveRequest $leaveRequest): bool
    {
        if ($user->isKepalaUpt()) {
            return true; // Can view all requests
        }
        
        if ($user->isKepalaSeksi()) {
            // Can view own requests and subordinates' requests
            return $leaveRequest->user_id === $user->id || 
                   $user->subordinates()->where('id', $leaveRequest->user_id)->exists();
        }
        
        if ($user->isPegawai()) {
            // Can only view own requests
            return $leaveRequest->user_id === $user->id;
        }
        
        return false;
    }

    /**
     * Check if user can approve the leave request.
     */
    protected function canApproveLeaveRequest(User $user, LeaveRequest $leaveRequest): bool
    {
        if ($user->isKepalaSeksi()) {
            // Can approve subordinates' requests that are pending
            return $leaveRequest->status === 'pending' && 
                   $user->subordinates()->where('id', $leaveRequest->user_id)->exists();
        }
        
        if ($user->isKepalaUpt()) {
            // Can approve any request that is pending or approved by section head
            return in_array($leaveRequest->status, ['pending', 'approved_by_section_head']);
        }
        
        return false;
    }

    /**
     * Check if user can reject the leave request.
     */
    protected function canRejectLeaveRequest(User $user, LeaveRequest $leaveRequest): bool
    {
        return $this->canApproveLeaveRequest($user, $leaveRequest);
    }

    /**
     * Check if user can delete the leave request.
     */
    protected function canDeleteLeaveRequest(User $user, LeaveRequest $leaveRequest): bool
    {
        if ($user->isKepalaUpt()) {
            return true; // Can delete any request
        }
        
        if ($user->isKepalaSeksi()) {
            // Can delete subordinates' requests
            return $user->subordinates()->where('id', $leaveRequest->user_id)->exists();
        }
        
        if ($user->isPegawai()) {
            // Can delete own requests if still pending
            return $leaveRequest->user_id === $user->id && $leaveRequest->status === 'pending';
        }
        
        return false;
    }
}