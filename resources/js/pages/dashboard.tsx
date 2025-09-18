import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface DashboardStats {
    [key: string]: number;
}

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
}

interface LeaveRequest {
    id: number;
    user_id: number;
    reason: string;
    start_date: string;
    end_date: string;
    days_requested: number;
    status: string;
    created_at: string;
    user: User;
}

interface Props {
    user: User;
    stats: DashboardStats;
    dashboardType: 'kepala_upt' | 'kepala_seksi' | 'pegawai';
    recentRequests?: LeaveRequest[];
    pendingApprovals?: LeaveRequest[];
    currentLeaves?: LeaveRequest[];
    upcomingLeaves?: LeaveRequest[];
    [key: string]: unknown;
}

export default function Dashboard({
    user,
    stats,
    dashboardType,
    recentRequests = [],
    pendingApprovals = [],
    currentLeaves = [],
    upcomingLeaves = [],
}: Props) {
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

    const renderKepalaUptDashboard = () => (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-blue-500 mr-4">👥</div>
                        <div>
                            <p className="text-sm text-gray-600">Total Pegawai</p>
                            <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-green-500 mr-4">👨‍💼</div>
                        <div>
                            <p className="text-sm text-gray-600">Kepala Seksi</p>
                            <p className="text-2xl font-bold">{stats.totalSectionHeads}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-yellow-500 mr-4">⏳</div>
                        <div>
                            <p className="text-sm text-gray-600">Permintaan Baru</p>
                            <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-purple-500 mr-4">🔄</div>
                        <div>
                            <p className="text-sm text-gray-600">Menunggu Persetujuan</p>
                            <p className="text-2xl font-bold">{stats.awaitingFinalApproval}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Requests and Current Leaves */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">📋 Permintaan Terbaru</h3>
                    {recentRequests.length > 0 ? (
                        <div className="space-y-3">
                            {recentRequests.map((request) => (
                                <div key={request.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">{request.user.full_name}</p>
                                        <p className="text-sm text-gray-600">{request.reason.substring(0, 50)}...</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(request.status)}`}>
                                        {getStatusText(request.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Tidak ada permintaan baru</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">🏖️ Sedang Cuti</h3>
                    {currentLeaves.length > 0 ? (
                        <div className="space-y-3">
                            {currentLeaves.map((leave) => (
                                <div key={leave.id} className="flex justify-between items-center p-3 bg-green-50 rounded">
                                    <div>
                                        <p className="font-medium">{leave.user.full_name}</p>
                                        <p className="text-sm text-gray-600">
                                            {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                        {leave.days_requested} hari
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Tidak ada yang sedang cuti</p>
                    )}
                </div>
            </div>
        </>
    );

    const renderKepalaSeksiDashboard = () => (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-blue-500 mr-4">👥</div>
                        <div>
                            <p className="text-sm text-gray-600">Bawahan</p>
                            <p className="text-2xl font-bold">{stats.totalSubordinates}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-yellow-500 mr-4">✅</div>
                        <div>
                            <p className="text-sm text-gray-600">Perlu Persetujuan</p>
                            <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-purple-500 mr-4">📝</div>
                        <div>
                            <p className="text-sm text-gray-600">Permintaan Saya</p>
                            <p className="text-2xl font-bold">{stats.myPendingRequests}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-green-500 mr-4">🏖️</div>
                        <div>
                            <p className="text-sm text-gray-600">Kuota Tersisa</p>
                            <p className="text-2xl font-bold">{stats.remainingQuota}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Approvals and Current Leaves */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">⏳ Menunggu Persetujuan Saya</h3>
                    {pendingApprovals.length > 0 ? (
                        <div className="space-y-3">
                            {pendingApprovals.map((request) => (
                                <div key={request.id} className="p-3 bg-yellow-50 rounded">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-medium">{request.user.full_name}</p>
                                        <Button 
                                            size="sm" 
                                            onClick={() => router.get(route('leave-requests.show', request.id))}
                                        >
                                            Review
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-600">{request.reason.substring(0, 50)}...</p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(request.start_date)} - {formatDate(request.end_date)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Tidak ada yang menunggu persetujuan</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">🏖️ Tim Sedang Cuti</h3>
                    {currentLeaves.length > 0 ? (
                        <div className="space-y-3">
                            {currentLeaves.map((leave) => (
                                <div key={leave.id} className="flex justify-between items-center p-3 bg-green-50 rounded">
                                    <div>
                                        <p className="font-medium">{leave.user.full_name}</p>
                                        <p className="text-sm text-gray-600">
                                            {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                        {leave.days_requested} hari
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Tidak ada tim yang sedang cuti</p>
                    )}
                </div>
            </div>
        </>
    );

    const renderPegawaiDashboard = () => (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-green-500 mr-4">🏖️</div>
                        <div>
                            <p className="text-sm text-gray-600">Kuota Tersisa</p>
                            <p className="text-2xl font-bold">{stats.remainingQuota}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-blue-500 mr-4">📊</div>
                        <div>
                            <p className="text-sm text-gray-600">Kuota Terpakai</p>
                            <p className="text-2xl font-bold">{stats.usedQuota}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-purple-500 mr-4">📝</div>
                        <div>
                            <p className="text-sm text-gray-600">Total Pengajuan</p>
                            <p className="text-2xl font-bold">{stats.totalRequests}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-3xl text-yellow-500 mr-4">✅</div>
                        <div>
                            <p className="text-sm text-gray-600">Disetujui</p>
                            <p className="text-2xl font-bold">{stats.approvedRequests}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">🚀 Aksi Cepat</h3>
                <div className="flex space-x-4">
                    <Button onClick={() => router.get(route('leave-requests.create'))}>
                        📝 Ajukan Cuti
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => router.get(route('leave-requests.index'))}
                    >
                        📋 Lihat Riwayat
                    </Button>
                </div>
            </div>

            {/* Recent Requests and Upcoming Leaves */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">📋 Pengajuan Terbaru</h3>
                    {recentRequests.length > 0 ? (
                        <div className="space-y-3">
                            {recentRequests.map((request) => (
                                <div key={request.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="text-sm text-gray-600">{request.reason.substring(0, 50)}...</p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(request.start_date)} - {formatDate(request.end_date)}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(request.status)}`}>
                                        {getStatusText(request.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Belum ada pengajuan</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">📅 Cuti Mendatang</h3>
                    {upcomingLeaves.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingLeaves.map((leave) => (
                                <div key={leave.id} className="p-3 bg-blue-50 rounded">
                                    <p className="font-medium">{leave.reason.substring(0, 50)}...</p>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                                    </p>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                        {leave.days_requested} hari
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Tidak ada cuti mendatang</p>
                    )}
                </div>
            </div>
        </>
    );

    const getDashboardTitle = () => {
        switch (dashboardType) {
            case 'kepala_upt':
                return '🏢 Dashboard Kepala UPT';
            case 'kepala_seksi':
                return `👨‍💼 Dashboard Kepala Seksi ${user.section}`;
            case 'pegawai':
                return '👨‍💻 Dashboard Pegawai';
            default:
                return 'Dashboard';
        }
    };

    return (
        <AppShell>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {getDashboardTitle()}
                        </h1>
                        <p className="text-gray-600">
                            Selamat datang, {user.full_name} - {user.position}
                        </p>
                    </div>

                    {/* Dashboard Content */}
                    {dashboardType === 'kepala_upt' && renderKepalaUptDashboard()}
                    {dashboardType === 'kepala_seksi' && renderKepalaSeksiDashboard()}
                    {dashboardType === 'pegawai' && renderPegawaiDashboard()}
                </div>
            </div>
        </AppShell>
    );
}