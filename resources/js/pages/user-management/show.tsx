import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    username: string;
    full_name: string;
    nip: string;
    position: string;
    gender: string;
    phone: string | null;
    role: string;
    section: string | null;
    annual_leave_quota: number;
    email: string;
    created_at: string;
    updated_at: string;
}

interface LeaveRequest {
    id: number;
    reason: string;
    start_date: string;
    end_date: string;
    days_requested: number;
    status: string;
    created_at: string;
}

interface UserWithRelations extends User {
    supervisor?: User;
    subordinates?: User[];
    leave_requests?: LeaveRequest[];
}

interface Props {
    user: UserWithRelations;
    canEdit: boolean;
    canDelete: boolean;
    [key: string]: unknown;
}

export default function ShowUser({ user, canDelete }: Props) {
    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'kepala_upt':
                return 'bg-purple-100 text-purple-800';
            case 'kepala_seksi':
                return 'bg-blue-100 text-blue-800';
            case 'pegawai':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'kepala_upt':
                return 'Kepala UPT';
            case 'kepala_seksi':
                return 'Kepala Seksi';
            case 'pegawai':
                return 'Pegawai';
            default:
                return role;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved_by_section_head':
                return 'bg-blue-100 text-blue-800';
            case 'approved_by_kepala_upt':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'approved_by_section_head':
                return 'Disetujui Kepala Seksi';
            case 'approved_by_kepala_upt':
                return 'Disetujui Lengkap';
            case 'rejected':
                return 'Ditolak';
            default:
                return 'Unknown';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getGenderIcon = (gender: string) => {
        return gender === 'male' ? '👨' : '👩';
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.full_name}? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('user-management.destroy', user.id), {
                onSuccess: () => {
                    router.get(route('user-management.index'));
                },
            });
        }
    };

    const calculateUsedLeave = () => {
        if (!user.leave_requests) return 0;
        return user.leave_requests
            .filter(request => ['approved_by_section_head', 'approved_by_kepala_upt'].includes(request.status))
            .reduce((total, request) => total + request.days_requested, 0);
    };

    const usedLeave = calculateUsedLeave();
    const remainingLeave = user.annual_leave_quota - usedLeave;

    return (
        <AppShell>
            <Head title={`Profil - ${user.full_name}`} />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                👤 Profil Pengguna
                            </h1>
                            <p className="text-gray-600">
                                Detail informasi pengguna {user.full_name}
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => router.get(route('user-management.index'))}
                            >
                                ← Kembali
                            </Button>
                            {canDelete && (
                                <Button
                                    variant="outline"
                                    className="text-red-600 hover:text-red-800"
                                    onClick={handleDelete}
                                >
                                    🗑️ Hapus
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Profile */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-6">
                                    <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center mr-6">
                                        <span className="text-3xl text-white">
                                            {getGenderIcon(user.gender)}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
                                        <p className="text-gray-600">{user.position}</p>
                                        <div className="flex items-center mt-2 space-x-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeClass(user.role)}`}>
                                                {getRoleText(user.role)}
                                            </span>
                                            {user.section && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                                    Seksi {user.section}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">NIP</h3>
                                        <p className="text-gray-900">{user.nip}</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                                        <p className="text-gray-900">{user.email}</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
                                        <p className="text-gray-900">@{user.username}</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Telepon</h3>
                                        <p className="text-gray-900">{user.phone || '-'}</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Jenis Kelamin</h3>
                                        <p className="text-gray-900">
                                            {user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Bergabung</h3>
                                        <p className="text-gray-900">{formatDate(user.created_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Leave Summary */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">📊 Ringkasan Cuti</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{user.annual_leave_quota}</div>
                                        <div className="text-sm text-blue-600">Kuota Tahunan</div>
                                    </div>
                                    
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{usedLeave}</div>
                                        <div className="text-sm text-red-600">Kuota Terpakai</div>
                                    </div>
                                    
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{remainingLeave}</div>
                                        <div className="text-sm text-green-600">Kuota Tersisa</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Penggunaan Kuota</span>
                                        <span>{Math.round((usedLeave / user.annual_leave_quota) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${Math.min((usedLeave / user.annual_leave_quota) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Leave Requests */}
                            {user.leave_requests && user.leave_requests.length > 0 && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold mb-4">📋 Riwayat Cuti Terbaru</h3>
                                    
                                    <div className="space-y-3">
                                        {user.leave_requests.slice(0, 5).map((request) => (
                                            <div key={request.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                                <div>
                                                    <p className="font-medium text-sm">{request.reason.substring(0, 50)}...</p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(request.start_date)} - {formatDate(request.end_date)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {request.days_requested} hari • {formatDate(request.created_at)}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(request.status)}`}>
                                                    {getStatusText(request.status)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {user.leave_requests.length > 5 && (
                                        <div className="mt-4 text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get(route('leave-requests.index'), { user_id: user.id })}
                                            >
                                                Lihat Semua Riwayat
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Subordinates */}
                            {user.subordinates && user.subordinates.length > 0 && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold mb-4">👥 Tim/Bawahan</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.subordinates.map((subordinate) => (
                                            <div key={subordinate.id} className="flex items-center p-3 bg-gray-50 rounded">
                                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                                                    <span className="text-white text-sm">
                                                        {getGenderIcon(subordinate.gender)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{subordinate.full_name}</p>
                                                    <p className="text-xs text-gray-600">{subordinate.position}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">🚀 Aksi Cepat</h3>
                                <div className="space-y-3">
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                        onClick={() => router.get(route('leave-requests.index'), { user_id: user.id })}
                                    >
                                        📋 Lihat Semua Cuti
                                    </Button>
                                    
                                    {user.role === 'pegawai' && (
                                        <Button
                                            className="w-full justify-start"
                                            variant="outline"
                                            onClick={() => router.get(route('leave-requests.create'))}
                                        >
                                            📝 Ajukan Cuti
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Hierarchy Info */}
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-blue-800">🏢 Hierarki</h3>
                                <div className="space-y-3 text-sm">
                                    {user.supervisor && (
                                        <div>
                                            <span className="text-blue-600 font-medium">Atasan:</span>
                                            <p className="text-blue-700">{user.supervisor.full_name}</p>
                                            <p className="text-blue-600 text-xs">{user.supervisor.position}</p>
                                        </div>
                                    )}
                                    
                                    {user.subordinates && user.subordinates.length > 0 && (
                                        <div>
                                            <span className="text-blue-600 font-medium">
                                                Bawahan: {user.subordinates.length} orang
                                            </span>
                                        </div>
                                    )}
                                    
                                    {user.section && (
                                        <div>
                                            <span className="text-blue-600 font-medium">Seksi:</span>
                                            <p className="text-blue-700">Seksi {user.section}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">📅 Informasi Akun</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">Dibuat:</span>
                                        <p>{formatDate(user.created_at)}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Terakhir diupdate:</span>
                                        <p>{formatDate(user.updated_at)}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">ID Pengguna:</span>
                                        <p>#{user.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}