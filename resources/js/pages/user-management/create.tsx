import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';



interface Props {
    availableRoles: string[];
    availableSections: string[];
    userRole: string;
    userSection: string | null;
    [key: string]: unknown;
}

export default function CreateUser({ 
    availableRoles, 
    availableSections, 
    userRole, 
    userSection 
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        full_name: '',
        nip: '',
        position: '',
        gender: '',
        phone: '',
        role: availableRoles.length === 1 ? availableRoles[0] : '',
        section: availableSections.length === 1 ? availableSections[0] : '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user-management.store'));
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

    const needsSection = data.role === 'kepala_seksi' || data.role === 'pegawai';

    return (
        <AppShell>
            <Head title="Tambah Pengguna" />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 Tambah Pengguna Baru</h1>
                        <p className="text-gray-600">
                            {userRole === 'kepala_upt' 
                                ? 'Buat akun pengguna baru untuk sistem'
                                : `Tambahkan pegawai baru di Seksi ${userSection}`
                            }
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                                            👤 Informasi Personal
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nama Lengkap *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="full_name"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Contoh: Dr. Ahmad Wijaya, M.Si"
                                                    value={data.full_name}
                                                    onChange={(e) => setData('full_name', e.target.value)}
                                                    required
                                                />
                                                {errors.full_name && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="nip" className="block text-sm font-medium text-gray-700 mb-2">
                                                    NIP (Nomor Induk Pegawai) *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="nip"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="16 digit NIP"
                                                    maxLength={16}
                                                    value={data.nip}
                                                    onChange={(e) => setData('nip', e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                    required
                                                />
                                                {errors.nip && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.nip}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Jabatan *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="position"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Contoh: Staff Teknis"
                                                    value={data.position}
                                                    onChange={(e) => setData('position', e.target.value)}
                                                    required
                                                />
                                                {errors.position && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Jenis Kelamin *
                                                </label>
                                                <select
                                                    id="gender"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    value={data.gender}
                                                    onChange={(e) => setData('gender', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Pilih jenis kelamin</option>
                                                    <option value="male">👨 Laki-laki</option>
                                                    <option value="female">👩 Perempuan</option>
                                                </select>
                                                {errors.gender && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nomor Telepon
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Contoh: +62 812-3456-7890"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                />
                                                {errors.phone && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role and Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                                            🏢 Informasi Organisasi
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Peran *
                                                </label>
                                                <select
                                                    id="role"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    value={data.role}
                                                    onChange={(e) => setData('role', e.target.value)}
                                                    required
                                                    disabled={availableRoles.length === 1}
                                                >
                                                    <option value="">Pilih peran</option>
                                                    {availableRoles.map((role) => (
                                                        <option key={role} value={role}>
                                                            {getRoleText(role)}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.role && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                                                )}
                                            </div>

                                            {needsSection && (
                                                <div>
                                                    <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Seksi *
                                                    </label>
                                                    <select
                                                        id="section"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        value={data.section}
                                                        onChange={(e) => setData('section', e.target.value)}
                                                        required
                                                        disabled={availableSections.length === 1}
                                                    >
                                                        <option value="">Pilih seksi</option>
                                                        {availableSections.map((section) => (
                                                            <option key={section} value={section}>
                                                                Seksi {section}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.section && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.section}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Account Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                                            🔐 Informasi Akun
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Username *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Username untuk login"
                                                    value={data.username}
                                                    onChange={(e) => setData('username', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                                                    required
                                                />
                                                {errors.username && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="alamat@email.com"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Password *
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Minimal 8 karakter"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    required
                                                />
                                                {errors.password && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Konfirmasi Password *
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password_confirmation"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Ulangi password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end space-x-4 pt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.get(route('user-management.index'))}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing ? 'Menyimpan...' : '👤 Buat Pengguna'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Guidelines */}
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-blue-800">📋 Petunjuk Pengisian</h3>
                                <ul className="space-y-2 text-sm text-blue-700">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>NIP harus 16 digit dan unik</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Username akan digunakan untuk login</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Password minimal 8 karakter</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Email harus valid dan unik</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Role Information */}
                            <div className="bg-green-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-green-800">🏢 Informasi Peran</h3>
                                <div className="space-y-3 text-sm">
                                    {availableRoles.includes('kepala_seksi') && (
                                        <div className="text-green-700">
                                            <strong>Kepala Seksi:</strong>
                                            <p>Dapat mengelola pegawai dan menyetujui cuti di seksinya</p>
                                        </div>
                                    )}
                                    {availableRoles.includes('pegawai') && (
                                        <div className="text-green-700">
                                            <strong>Pegawai:</strong>
                                            <p>Dapat mengajukan cuti dan melihat status pengajuannya</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Default Quota */}
                            <div className="bg-yellow-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-yellow-800">📊 Kuota Default</h3>
                                <div className="text-sm text-yellow-700">
                                    <p>Setiap pengguna akan mendapatkan kuota cuti tahunan sebanyak <strong>12 hari</strong>.</p>
                                </div>
                            </div>

                            {/* Hierarchy */}
                            {userRole === 'kepala_upt' && (
                                <div className="bg-purple-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-purple-800">🔄 Hierarki Organisasi</h3>
                                    <div className="space-y-2 text-sm text-purple-700">
                                        <div>• Kepala Seksi melapor ke Kepala UPT</div>
                                        <div>• Pegawai melapor ke Kepala Seksi di seksinya</div>
                                        <div>• Supervisor akan ditetapkan otomatis</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}