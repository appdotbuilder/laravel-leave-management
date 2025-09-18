import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';



interface Props {
    remainingQuota: number;
    [key: string]: unknown;
}

export default function CreateLeaveRequest({ remainingQuota }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        reason: '',
        start_date: '',
        end_date: '',
    });

    const [calculatedDays, setCalculatedDays] = useState<number>(0);

    const calculateDays = (startDate: string, endDate: string) => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end >= start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                return diffDays;
            }
        }
        return 0;
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setData('start_date', newStartDate);
        const days = calculateDays(newStartDate, data.end_date);
        setCalculatedDays(days);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value;
        setData('end_date', newEndDate);
        const days = calculateDays(data.start_date, newEndDate);
        setCalculatedDays(days);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (calculatedDays > remainingQuota) {
            alert(`Jumlah hari cuti (${calculatedDays}) melebihi kuota tersisa (${remainingQuota})`);
            return;
        }
        
        post(route('leave-requests.store'));
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <AppShell>
            <Head title="Ajukan Cuti" />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Ajukan Permintaan Cuti</h1>
                        <p className="text-gray-600">
                            Lengkapi form di bawah untuk mengajukan cuti
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Reason */}
                                    <div>
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                                            Alasan Cuti *
                                        </label>
                                        <textarea
                                            id="reason"
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Jelaskan alasan mengapa Anda perlu cuti..."
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                            required
                                        />
                                        {errors.reason && (
                                            <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                                        )}
                                    </div>

                                    {/* Date Range */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                                                Tanggal Mulai *
                                            </label>
                                            <input
                                                type="date"
                                                id="start_date"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={data.start_date}
                                                onChange={handleStartDateChange}
                                                min={today}
                                                required
                                            />
                                            {errors.start_date && (
                                                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                                Tanggal Selesai *
                                            </label>
                                            <input
                                                type="date"
                                                id="end_date"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={data.end_date}
                                                onChange={handleEndDateChange}
                                                min={data.start_date || today}
                                                required
                                            />
                                            {errors.end_date && (
                                                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Calculated Days */}
                                    {calculatedDays > 0 && (
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="text-2xl text-blue-500 mr-3">📊</div>
                                                <div>
                                                    <p className="text-sm text-blue-700">Jumlah Hari Cuti</p>
                                                    <p className="text-xl font-bold text-blue-800">{calculatedDays} hari</p>
                                                    {calculatedDays > remainingQuota && (
                                                        <p className="text-sm text-red-600 mt-1">
                                                            ⚠️ Melebihi kuota tersisa ({remainingQuota} hari)
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Form Actions */}
                                    <div className="flex justify-end space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.get(route('leave-requests.index'))}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing || calculatedDays > remainingQuota}
                                        >
                                            {processing ? 'Menyimpan...' : '📝 Ajukan Cuti'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Quota Info */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">📊 Informasi Kuota</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Kuota Tahunan:</span>
                                        <span className="font-medium">12 hari</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Kuota Tersisa:</span>
                                        <span className="font-medium text-green-600">{remainingQuota} hari</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Kuota Terpakai:</span>
                                        <span className="font-medium text-blue-600">{12 - remainingQuota} hari</span>
                                    </div>
                                </div>
                                
                                {/* Quota Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Penggunaan Kuota</span>
                                        <span>{Math.round(((12 - remainingQuota) / 12) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${((12 - remainingQuota) / 12) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Guidelines */}
                            <div className="bg-yellow-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-yellow-800">⚠️ Petunjuk Pengajuan</h3>
                                <ul className="space-y-2 text-sm text-yellow-700">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Cuti tidak dapat diajukan untuk tanggal yang sudah berlalu</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Pastikan kuota cuti Anda mencukupi</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Berikan alasan yang jelas dan lengkap</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Pengajuan akan diproses melalui Kepala Seksi kemudian Kepala UPT</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Process Flow */}
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-blue-800">🔄 Alur Persetujuan</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                            1
                                        </div>
                                        <span className="text-sm text-blue-700">Pengajuan oleh Pegawai</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                            2
                                        </div>
                                        <span className="text-sm text-blue-700">Review & Persetujuan Kepala Seksi</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                            3
                                        </div>
                                        <span className="text-sm text-blue-700">Persetujuan Final Kepala UPT</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                            ✓
                                        </div>
                                        <span className="text-sm text-green-700">Cuti Disetujui</span>
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