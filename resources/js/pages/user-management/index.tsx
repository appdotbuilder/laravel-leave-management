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
    gender: string;
    phone: string | null;
    role: string;
    section: string | null;
    annual_leave_quota: number;
    email: string;
    created_at: string;
}

interface PaginationData {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    users: PaginationData;
    canCreateUsers: boolean;
    userRole: string;
    userSection: string | null;
    [key: string]: unknown;
}

export default function UserManagementIndex({ 
    users, 
    canCreateUsers, 
    userRole, 
    userSection 
}: Props) {
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

    const getGenderIcon = (gender: string) => {
        return gender === 'male' ? '👨' : '👩';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleDelete = (userId: number, userName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${userName}? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('user-management.destroy', userId), {
                onSuccess: () => {
                    // The page will refresh automatically
                },
            });
        }
    };

    const canDeleteUser = (user: User): boolean => {
        if (userRole === 'kepala_upt') {
            return user.role !== 'kepala_upt';
        }
        if (userRole === 'kepala_seksi') {
            return user.role === 'pegawai' && user.section === userSection;
        }
        return false;
    };

    return (
        <AppShell>
            <Head title="Manajemen Pengguna" />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">👥 Manajemen Pengguna</h1>
                            <p className="text-gray-600">
                                {userRole === 'kepala_upt' 
                                    ? 'Kelola semua pengguna dalam sistem'
                                    : `Kelola pegawai di Seksi ${userSection}`
                                }
                            </p>
                        </div>
                        <div className="space-x-4">
                            {canCreateUsers && (
                                <Link href={route('user-management.create')}>
                                    <Button>👤 Tambah Pengguna</Button>
                                </Link>
                            )}
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
                                <div className="text-2xl text-blue-500 mr-3">👥</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Pengguna</p>
                                    <p className="text-xl font-bold">{users.total}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl text-green-500 mr-3">👨‍💻</div>
                                <div>
                                    <p className="text-sm text-gray-600">Pegawai</p>
                                    <p className="text-xl font-bold">
                                        {users.data.filter(u => u.role === 'pegawai').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl text-blue-500 mr-3">👨‍💼</div>
                                <div>
                                    <p className="text-sm text-gray-600">Kepala Seksi</p>
                                    <p className="text-xl font-bold">
                                        {users.data.filter(u => u.role === 'kepala_seksi').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl text-purple-500 mr-3">🏢</div>
                                <div>
                                    <p className="text-sm text-gray-600">Kepala UPT</p>
                                    <p className="text-xl font-bold">
                                        {users.data.filter(u => u.role === 'kepala_upt').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold">Daftar Pengguna</h2>
                        </div>
                        
                        {users.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pengguna
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                NIP
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Peran
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Seksi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kontak
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Bergabung
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                                                                <span className="text-white text-lg">
                                                                    {getGenderIcon(user.gender)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.full_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.position}
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                @{user.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.nip}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                                                        {getRoleText(user.role)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.section ? (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                                                            Seksi {user.section}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                    {user.phone && (
                                                        <div className="text-sm text-gray-500">{user.phone}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {formatDate(user.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link href={route('user-management.show', user.id)}>
                                                        <Button size="sm" variant="outline">
                                                            👁️ Lihat
                                                        </Button>
                                                    </Link>
                                                    {canDeleteUser(user) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleDelete(user.id, user.full_name)}
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
                                <div className="text-6xl mb-4">👥</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pengguna</h3>
                                <p className="text-gray-500 mb-6">Mulai dengan menambahkan pengguna pertama</p>
                                {canCreateUsers && (
                                    <Link href={route('user-management.create')}>
                                        <Button>👤 Tambah Pengguna Sekarang</Button>
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {users.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => router.get(route('user-management.index'), { page: users.current_page - 1 })}
                                        >
                                            Sebelumnya
                                        </Button>
                                    )}
                                    {users.current_page < users.last_page && (
                                        <Button
                                            variant="outline"
                                            onClick={() => router.get(route('user-management.index'), { page: users.current_page + 1 })}
                                        >
                                            Selanjutnya
                                        </Button>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Menampilkan {users.from} sampai {users.to} dari{' '}
                                            {users.total} hasil
                                        </p>
                                    </div>
                                    <div className="space-x-2">
                                        {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={page === users.current_page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => router.get(route('user-management.index'), { page })}
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