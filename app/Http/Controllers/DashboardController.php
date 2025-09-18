<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isKepalaUpt()) {
            return $this->kepalaUptDashboard($user);
        } elseif ($user->isKepalaSeksi()) {
            return $this->kepalaSeksiDashboard($user);
        } else {
            return $this->pegawaiDashboard($user);
        }
    }

    /**
     * Kepala UPT dashboard.
     */
    protected function kepalaUptDashboard(User $user)
    {
        $stats = [
            'totalEmployees' => User::where('role', 'pegawai')->count(),
            'totalSectionHeads' => User::where('role', 'kepala_seksi')->count(),
            'pendingRequests' => LeaveRequest::where('status', 'pending')->count(),
            'awaitingFinalApproval' => LeaveRequest::where('status', 'approved_by_section_head')->count(),
        ];
        
        $recentRequests = LeaveRequest::with(['user'])
            ->whereIn('status', ['pending', 'approved_by_section_head'])
            ->latest()
            ->take(5)
            ->get();
        
        $currentLeaves = LeaveRequest::with(['user'])
            ->where('status', 'approved_by_kepala_upt')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->get();
        
        return Inertia::render('dashboard', [
            'user' => $user,
            'stats' => $stats,
            'recentRequests' => $recentRequests,
            'currentLeaves' => $currentLeaves,
            'dashboardType' => 'kepala_upt',
        ]);
    }

    /**
     * Kepala Seksi dashboard.
     */
    protected function kepalaSeksiDashboard(User $user)
    {
        $subordinateIds = $user->subordinates()->pluck('id');
        
        $stats = [
            'totalSubordinates' => $subordinateIds->count(),
            'pendingApprovals' => LeaveRequest::whereIn('user_id', $subordinateIds)
                ->where('status', 'pending')
                ->count(),
            'myPendingRequests' => LeaveRequest::where('user_id', $user->id)
                ->where('status', 'pending')
                ->count(),
            'remainingQuota' => $user->getRemainingLeaveQuota(),
        ];
        
        $pendingApprovals = LeaveRequest::with(['user'])
            ->whereIn('user_id', $subordinateIds)
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get();
        
        $currentLeaves = LeaveRequest::with(['user'])
            ->whereIn('user_id', $subordinateIds->push($user->id))
            ->where('status', 'approved_by_kepala_upt')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->get();
        
        return Inertia::render('dashboard', [
            'user' => $user,
            'stats' => $stats,
            'pendingApprovals' => $pendingApprovals,
            'currentLeaves' => $currentLeaves,
            'dashboardType' => 'kepala_seksi',
        ]);
    }

    /**
     * Pegawai dashboard.
     */
    protected function pegawaiDashboard(User $user)
    {
        $stats = [
            'remainingQuota' => $user->getRemainingLeaveQuota(),
            'usedQuota' => 12 - $user->getRemainingLeaveQuota(),
            'totalRequests' => $user->leaveRequests()->count(),
            'approvedRequests' => $user->leaveRequests()
                ->whereIn('status', ['approved_by_section_head', 'approved_by_kepala_upt'])
                ->count(),
        ];
        
        $recentRequests = $user->leaveRequests()
            ->latest()
            ->take(5)
            ->get();
        
        $upcomingLeaves = $user->leaveRequests()
            ->where('status', 'approved_by_kepala_upt')
            ->where('start_date', '>', now())
            ->orderBy('start_date')
            ->take(3)
            ->get();
        
        return Inertia::render('dashboard', [
            'user' => $user,
            'stats' => $stats,
            'recentRequests' => $recentRequests,
            'upcomingLeaves' => $upcomingLeaves,
            'dashboardType' => 'pegawai',
        ]);
    }
}