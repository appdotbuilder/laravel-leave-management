import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
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
    email: string;
    phone: string | null;
}

interface LeaveRequest {
    id: number;
    user_id: number;
    reason: string;
    start_date: string;
    end_date: string;
    days_requested: number;
    status: string;
    section_head_approved_at: string | null;
    section_head_notes: string | null;
    kepala_upt_approved_at: string | null;
    kepala_upt_notes: string | null;
    created_at: string;
    updated_at: string;
    user: User;
    section_head?: User;
    kepala_upt?: User;
}

interface Props {
    leaveRequest: LeaveRequest;
    canApprove: boolean;
    canReject: boolean;
    [key: string]: unknown;
}

export default function ShowLeaveRequest({ leaveRequest, canApprove, canReject }: Props) {
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
    
    const { data, setData, post, processing } = useForm({
        action: '',
        notes: '',
    });

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
                return 'Menunggu Persetujuan';
            case 'approved_by_section_head':
                return 'Disetujui oleh Kepala Seksi';
            case 'approved_by_kepala_upt':
                return 'Disetujui Lengkap';
            case 'rejected':
                return 'Ditolak';
            default:
                return 'Status Tidak Diketahui';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleApproval = (action: 'approve' | 'reject') => {
        setActionType(action);
        setData('action', action);
        setShowApprovalForm(true);
    };

    const submitApproval = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('leave-requests.update', leaveRequest.id), {
            onSuccess: () => {
                setShowApprovalForm(false);
                setData('notes', '');
            },
        });
    };

    return (
        <AppShell>
            <Head title={`Detail Cuti - ${leaveRequest.user.full_name}`} />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                📋 Detail Permintaan Cuti
                            </h1>
                            <p className="text-gray-600">
                                Permintaan cuti dari {leaveRequest.user.full_name}
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => router.get(route('leave-requests.index'))}
                            >
                                ← Kembali
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Leave Request Details */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">📝 Informasi Cuti</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Pemohon</h3>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <span className="text-lg font-medium text-white">
                                                        {leaveRequest.user.full_name.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-lg font-medium text-gray-900">
                                                    {leaveRequest.user.full_name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {leaveRequest.user.position} - Seksi {leaveRequest.user.section}
                                                </p>
                                                <p className="text-sm text-gray-500">NIP: {leaveRequest.user.nip}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(leaveRequest.status)}`}>
                                            {getStatusText(leaveRequest.status)}
                                        </span>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Diajukan pada: {formatDateTime(leaveRequest.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Tanggal Mulai</h3>
                                        <p className="text-lg font-medium text-gray-900">
                                            {formatDate(leaveRequest.start_date)}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Tanggal Selesai</h3>
                                        <p className="text-lg font-medium text-gray-900">
                                            {formatDate(leaveRequest.end_date)}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Hari</h3>
                                        <p className="text-lg font-medium text-gray-900">
                                            {leaveRequest.days_requested} hari
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Alasan Cuti</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-900">{leaveRequest.reason}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Approval History */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">🔄 Riwayat Persetujuan</h2>
                                
                                <div className="space-y-4">
                                    {/* Initial Request */}
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">📝</span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                Permintaan cuti diajukan
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDateTime(leaveRequest.created_at)} oleh {leaveRequest.user.full_name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Section Head Approval */}
                                    {leaveRequest.section_head_approved_at && (
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                                    leaveRequest.status === 'rejected' ? 'bg-red-500' : 'bg-green-500'
                                                }`}>
                                                    <span className="text-white text-sm">
                                                        {leaveRequest.status === 'rejected' ? '❌' : '✅'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {leaveRequest.status === 'rejected' ? 'Ditolak' : 'Disetujui'} oleh Kepala Seksi
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateTime(leaveRequest.section_head_approved_at)}
                                                    {leaveRequest.section_head && ` oleh ${leaveRequest.section_head.full_name}`}
                                                </p>
                                                {leaveRequest.section_head_notes && (
                                                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                        <strong>Catatan:</strong> {leaveRequest.section_head_notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Kepala UPT Approval */}
                                    {leaveRequest.kepala_upt_approved_at && (
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm">✅</span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Disetujui oleh Kepala UPT
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateTime(leaveRequest.kepala_upt_approved_at)}
                                                    {leaveRequest.kepala_upt && ` oleh ${leaveRequest.kepala_upt.full_name}`}
                                                </p>
                                                {leaveRequest.kepala_upt_notes && (
                                                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                        <strong>Catatan:</strong> {leaveRequest.kepala_upt_notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Approval Form */}
                            {(canApprove || canReject) && !showApprovalForm && leaveRequest.status !== 'rejected' && leaveRequest.status !== 'approved_by_kepala_upt' && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-xl font-semibold mb-4">⚖️ Aksi Persetujuan</h2>
                                    <div className="flex space-x-4">
                                        {canApprove && (
                                            <Button
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApproval('approve')}
                                            >
                                                ✅ Setujui
                                            </Button>
                                        )}
                                        {canReject && (
                                            <Button
                                                variant="outline"
                                                className="border-red-600 text-red-600 hover:bg-red-50"
                                                onClick={() => handleApproval('reject')}
                                            >
                                                ❌ Tolak
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Approval Form Modal */}
                            {showApprovalForm && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-xl font-semibold mb-4">
                                        {actionType === 'approve' ? '✅ Setujui Permintaan' : '❌ Tolak Permintaan'}
                                    </h2>
                                    
                                    <form onSubmit={submitApproval} className="space-y-4">
                                        <div>
                                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                                Catatan {actionType === 'reject' ? '(Wajib untuk penolakan)' : '(Opsional)'}
                                            </label>
                                            <textarea
                                                id="notes"
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                placeholder={`Berikan catatan untuk ${actionType === 'approve' ? 'persetujuan' : 'penolakan'} ini...`}
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                required={actionType === 'reject'}
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowApprovalForm(false)}
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                                            >
                                                {processing ? 'Memproses...' : 
                                                 actionType === 'approve' ? '✅ Konfirmasi Persetujuan' : '❌ Konfirmasi Penolakan'
                                                }
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">📊 Informasi Cepat</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">ID Permintaan:</span>
                                        <span className="font-medium">#{leaveRequest.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Durasi:</span>
                                        <span className="font-medium">{leaveRequest.days_requested} hari</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Seksi:</span>
                                        <span className="font-medium">Seksi {leaveRequest.user.section}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-blue-800">👤 Kontak Pemohon</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex">
                                        <span className="text-blue-600 w-16">Email:</span>
                                        <span className="text-blue-700">{leaveRequest.user.username}@company.com</span>
                                    </div>
                                    {leaveRequest.user.phone && (
                                        <div className="flex">
                                            <span className="text-blue-600 w-16">Telepon:</span>
                                            <span className="text-blue-700">{leaveRequest.user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action History */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">📅 Timeline</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>Dibuat: {formatDate(leaveRequest.created_at)}</p>
                                    <p>Terakhir diupdate: {formatDate(leaveRequest.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}