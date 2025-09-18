import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <>
            <Head title="Sistem Manajemen Cuti" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 text-white p-2 rounded-lg">
                                <span className="text-xl">📋</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Sistem Manajemen Cuti</h1>
                        </div>
                        <div className="space-x-4">
                            <Link href={route('login')}>
                                <Button variant="outline">Masuk</Button>
                            </Link>
                            <Link href={route('register')}>
                                <Button>Daftar</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                            📊 Sistem Manajemen Cuti UPT
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Platform terintegrasi untuk mengelola pengajuan dan persetujuan cuti karyawan 
                            dengan alur kerja yang terstruktur dan efisien.
                        </p>
                        <div className="space-x-4">
                            <Link href={route('login')}>
                                <Button size="lg" className="px-8 py-3 text-lg">
                                    🚀 Mulai Sekarang
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                                📖 Pelajari Lebih Lanjut
                            </Button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Manajemen Hierarki</h3>
                            <p className="text-gray-600">
                                Sistem dengan 3 level: Kepala UPT, Kepala Seksi (A, B, C), dan Pegawai 
                                dengan alur persetujuan yang jelas.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Pengajuan Cuti</h3>
                            <p className="text-gray-600">
                                Pegawai dapat mengajukan cuti dengan validasi kuota otomatis dan 
                                pembatasan tanggal mundur.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Alur Persetujuan</h3>
                            <p className="text-gray-600">
                                Proses persetujuan bertingkat: Kepala Seksi → Kepala UPT 
                                dengan tracking status real-time.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Dashboard Analytics</h3>
                            <p className="text-gray-600">
                                Monitoring kuota cuti, statistik pengajuan, dan laporan 
                                untuk setiap level pengguna.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Keamanan Data</h3>
                            <p className="text-gray-600">
                                Sistem autentikasi yang aman dengan role-based access control 
                                untuk melindungi data pegawai.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-4">📱</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Responsive Design</h3>
                            <p className="text-gray-600">
                                Akses dari mana saja dengan antarmuka yang responsif 
                                dan user-friendly di semua perangkat.
                            </p>
                        </div>
                    </div>

                    {/* User Roles Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
                        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                            👨‍💼 Peran Pengguna & Akses
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-blue-50 rounded-lg">
                                <div className="text-4xl mb-4">🏢</div>
                                <h4 className="font-semibold text-lg mb-2 text-blue-800">Kepala UPT</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>✓ Monitor semua cuti</li>
                                    <li>✓ Persetujuan final</li>
                                    <li>✓ Manajemen pengguna</li>
                                    <li>✓ Laporan lengkap</li>
                                </ul>
                            </div>
                            
                            <div className="text-center p-6 bg-green-50 rounded-lg">
                                <div className="text-4xl mb-4">👨‍💼</div>
                                <h4 className="font-semibold text-lg mb-2 text-green-800">Kepala Seksi</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>✓ Persetujuan level 1</li>
                                    <li>✓ Kelola pegawai seksi</li>
                                    <li>✓ Ajukan cuti sendiri</li>
                                    <li>✓ Monitor seksi</li>
                                </ul>
                            </div>
                            
                            <div className="text-center p-6 bg-purple-50 rounded-lg">
                                <div className="text-4xl mb-4">👨‍💻</div>
                                <h4 className="font-semibold text-lg mb-2 text-purple-800">Pegawai</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>✓ Ajukan cuti</li>
                                    <li>✓ Cek kuota tersisa</li>
                                    <li>✓ Track status</li>
                                    <li>✓ Lihat riwayat</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center bg-blue-600 text-white rounded-xl p-12">
                        <h3 className="text-3xl font-bold mb-4">
                            🎯 Siap Memulai Manajemen Cuti yang Efisien?
                        </h3>
                        <p className="text-xl mb-8 opacity-90">
                            Bergabunglah dengan sistem yang telah mempermudah proses administrasi cuti
                        </p>
                        <div className="space-x-4">
                            <Link href={route('register')}>
                                <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                                    🚀 Daftar Sekarang
                                </Button>
                            </Link>
                            <Link href={route('login')}>
                                <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                                    🔑 Masuk ke Akun
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-12 text-gray-600">
                        <p>&copy; 2024 Sistem Manajemen Cuti UPT. Semua hak dilindungi.</p>
                    </div>
                </div>
            </div>
        </>
    );
}