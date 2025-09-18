<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Only Kepala UPT and Kepala Seksi can access user management
        if (!$user->isKepalaUpt() && !$user->isKepalaSeksi()) {
            abort(403);
        }
        
        $query = User::query();
        
        if ($user->isKepalaSeksi()) {
            // Section heads can only manage employees in their section
            $query->where('section', $user->section)
                  ->where('role', 'pegawai');
        }
        
        $users = $query->latest()->paginate(10);
        
        return Inertia::render('user-management/index', [
            'users' => $users,
            'canCreateUsers' => $user->isKepalaUpt() || $user->isKepalaSeksi(),
            'userRole' => $user->role,
            'userSection' => $user->section,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();
        
        // Only Kepala UPT and Kepala Seksi can create users
        if (!$user->isKepalaUpt() && !$user->isKepalaSeksi()) {
            abort(403);
        }
        
        $availableRoles = [];
        $availableSections = ['A', 'B', 'C'];
        
        if ($user->isKepalaUpt()) {
            $availableRoles = ['kepala_seksi', 'pegawai'];
        } elseif ($user->isKepalaSeksi()) {
            $availableRoles = ['pegawai'];
            $availableSections = [$user->section]; // Can only create employees in their section
        }
        
        return Inertia::render('user-management/create', [
            'availableRoles' => $availableRoles,
            'availableSections' => $availableSections,
            'userRole' => $user->role,
            'userSection' => $user->section,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $currentUser = auth()->user();
        
        // Authorization checks
        if (!$currentUser->isKepalaUpt() && !$currentUser->isKepalaSeksi()) {
            abort(403);
        }
        
        $data = $request->validated();
        
        // Additional validation based on current user role
        if ($currentUser->isKepalaSeksi()) {
            // Section heads can only create employees in their section
            if ($data['role'] !== 'pegawai' || $data['section'] !== $currentUser->section) {
                return back()->with('error', 'Anda hanya dapat membuat pegawai di seksi Anda.');
            }
        }
        
        // Set supervisor based on role and section
        $supervisorId = null;
        if ($data['role'] === 'pegawai') {
            // Find section head for this section
            $sectionHead = User::where('role', 'kepala_seksi')
                              ->where('section', $data['section'])
                              ->first();
            $supervisorId = $sectionHead?->id;
        } elseif ($data['role'] === 'kepala_seksi') {
            // Section heads report to Kepala UPT
            $kepalaUpt = User::where('role', 'kepala_upt')->first();
            $supervisorId = $kepalaUpt?->id;
        }
        
        $user = User::create([
            'name' => $data['full_name'],
            'username' => $data['username'],
            'full_name' => $data['full_name'],
            'nip' => $data['nip'],
            'position' => $data['position'],
            'gender' => $data['gender'],
            'phone' => $data['phone'],
            'role' => $data['role'],
            'section' => $data['section'],
            'annual_leave_quota' => 12,
            'supervisor_id' => $supervisorId,
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        
        return redirect()->route('user-management.show', $user)
            ->with('success', 'Pengguna berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $currentUser = auth()->user();
        
        // Check if user can view this profile
        if (!$this->canViewUser($currentUser, $user)) {
            abort(403);
        }
        
        $user->load(['supervisor', 'subordinates', 'leaveRequests']);
        
        return Inertia::render('user-management/show', [
            'user' => $user,
            'canEdit' => $this->canEditUser($currentUser, $user),
            'canDelete' => $this->canDeleteUser($currentUser, $user),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $currentUser = auth()->user();
        
        // Check if user can delete
        if (!$this->canDeleteUser($currentUser, $user)) {
            abort(403);
        }
        
        $user->delete();
        
        return redirect()->route('user-management.index')
            ->with('success', 'Pengguna berhasil dihapus.');
    }

    /**
     * Check if current user can view the specified user.
     */
    protected function canViewUser(User $currentUser, User $user): bool
    {
        if ($currentUser->isKepalaUpt()) {
            return true; // Can view all users
        }
        
        if ($currentUser->isKepalaSeksi()) {
            // Can view employees in their section
            return $user->role === 'pegawai' && $user->section === $currentUser->section;
        }
        
        return false;
    }

    /**
     * Check if current user can edit the specified user.
     */
    protected function canEditUser(User $currentUser, User $user): bool
    {
        if ($currentUser->isKepalaUpt()) {
            return $user->role !== 'kepala_upt'; // Cannot edit other Kepala UPT
        }
        
        if ($currentUser->isKepalaSeksi()) {
            // Can edit employees in their section
            return $user->role === 'pegawai' && $user->section === $currentUser->section;
        }
        
        return false;
    }

    /**
     * Check if current user can delete the specified user.
     */
    protected function canDeleteUser(User $currentUser, User $user): bool
    {
        if ($currentUser->isKepalaUpt()) {
            return $user->role !== 'kepala_upt'; // Cannot delete other Kepala UPT
        }
        
        if ($currentUser->isKepalaSeksi()) {
            // Can delete employees in their section
            return $user->role === 'pegawai' && $user->section === $currentUser->section;
        }
        
        return false;
    }
}