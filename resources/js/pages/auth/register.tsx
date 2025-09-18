import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Registrasi Ditutup" description="Sistem ini hanya untuk pengguna yang telah terdaftar">
            <Head title="Registrasi" />
            
            <div className="text-center space-y-6">
                <div className="text-6xl">🔒</div>
                
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Registrasi Tidak Tersedia
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Sistem Manajemen Cuti ini adalah sistem tertutup. 
                        Akun pengguna hanya dapat dibuat oleh administrator sistem.
                    </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                    <p className="font-medium mb-2">📝 Untuk mendapatkan akses:</p>
                    <ul className="text-left space-y-1 ml-4">
                        <li>• Hubungi Kepala UPT atau administrator sistem</li>
                        <li>• Sediakan informasi pribadi dan data kepegawaian</li>
                        <li>• Tunggu akun Anda dibuat oleh administrator</li>
                    </ul>
                </div>

                <TextLink href={route('login')}>
                    <Button className="w-full">
                        🔑 Kembali ke Halaman Login
                    </Button>
                </TextLink>

                <div className="text-center text-sm text-muted-foreground">
                    Sudah punya akun?{' '}
                    <TextLink href={route('login')}>
                        Masuk di sini
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}