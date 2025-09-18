import React from 'react';
import { Head, Link } from '@inertiajs/react';
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
    role: string;
    section: string | null;
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
    section_head?: User;
    kepala_upt?: User;
}

interface PaginationData {
    data: LeaveRequest[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    leaveRequests: PaginationData;
    userRole: string;
    [key: string]: unknown;
}

export default function LeaveRequestsIndex({ leaveRequests, userRole }: Props) {
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

    const canDeleteRequest = (request: LeaveRequest): boolean => {
        if (userRole === 'kepala_upt') {
            return true;
        }
        if (userRole === 'kepala_seksi') {
            return request.user.role === 'pegawai';
        }
        return request.status === 'pending';
    };

    const handleDelete = (requestId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data cuti ini?')) {
            router.delete(route('leave-requests.destroy', requestId), {
                onSuccess: () => {
                    // The page will refresh automatically
                },
            });
        }
    };

    return (
        <AppShell>
            <Head title="Daftar Permintaan Cuti" />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Permintaan Cuti</h1>
                            <p className="text-gray-600">
                                Kelola dan pantau semua permintaan cuti
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Link href={route('leave-requests.create')}>
                                <Button>📝 Ajukan Cuti</Button>
                            </Link>
                            <Button 
                                variant="outline"
                                onClick={() => router.get(route('dashboard'))}
                            >
                                🏠 Dashboard
                            </Button>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl text-blue-500 mr-3">📊</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Permintaan</p>
                                    <p className="text-xl font-bold">{leaveRequests.total}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl text-yellow-500 mr-3">⏳</div>
                                <div>
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-xl font-bold">
                                        {leaveRequests.data.filter(r => r.status === 'pending').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl text-green-500 mr-3">✅</div>
                                <div>
                                    <p className="text-sm text-gray-600">Disetujui</p>
                                    <p className="text-xl font-bold">
                                        {leaveRequests.data.filter(r => r.status === 'approved_by_kepala_upt').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl text-red-500 mr-3">❌</div>
                                <div>
                                    <p className="text-sm text-gray-600">Ditolak</p>
                                    <p className="text-xl font-bold">
                                        {leaveRequests.data.filter(r => r.status === 'rejected').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leave Requests Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold">Daftar Permintaan Cuti</h2>
                        </div>
                        
                        {leaveRequests.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pemohon
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Alasan
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hari
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {leaveRequests.data.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {request.user.full_name.charAt(0)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {request.user.full_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {request.user.position} - Seksi {request.user.section}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {request.reason.length > 50
                                                            ? request.reason.substring(0, 50) + '...'
                                                            : request.reason
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(request.start_date)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        s/d {formatDate(request.end_date)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium">
                                                        {request.days_requested}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(request.status)}`}>
                                                        {getStatusText(request.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link href={route('leave-requests.show', request.id)}>
                                                        <Button size="sm" variant="outline">
                                                            👁️ Lihat
                                                        </Button>
                                                    </Link>
                                                    {canDeleteRequest(request) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleDelete(request.id)}
                                                        >
                                                            🗑️ Hapus
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada permintaan cuti</h3>
                                <p className="text-gray-500 mb-6">Mulai dengan mengajukan cuti pertama Anda</p>
                                <Link href={route('leave-requests.create')}>
                                    <Button>📝 Ajukan Cuti Sekarang</Button>
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {leaveRequests.last_page > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {leaveRequests.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => router.get(route('leave-requests.index'), { page: leaveRequests.current_page - 1 })}
                                        >
                                            Sebelumnya
                                        </Button>
                                    )}
                                    {leaveRequests.current_page < leaveRequests.last_page && (
                                        <Button
                                            variant="outline"
                                            onClick={() => router.get(route('leave-requests.index'), { page: leaveRequests.current_page + 1 })}
                                        >
                                            Selanjutnya
                                        </Button>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Menampilkan {leaveRequests.from} sampai {leaveRequests.to} dari{' '}
                                            {leaveRequests.total} hasil
                                        </p>
                                    </div>
                                    <div className="space-x-2">
                                        {Array.from({ length: leaveRequests.last_page }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={page === leaveRequests.current_page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => router.get(route('leave-requests.index'), { page })}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}