<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reason' => 'required|string|min:10|max:500',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reason.required' => 'Alasan cuti harus diisi.',
            'reason.min' => 'Alasan cuti minimal 10 karakter.',
            'reason.max' => 'Alasan cuti maksimal 500 karakter.',
            'start_date.required' => 'Tanggal mulai cuti harus diisi.',
            'start_date.date' => 'Format tanggal mulai cuti tidak valid.',
            'start_date.after_or_equal' => 'Tanggal mulai cuti tidak boleh sebelum hari ini.',
            'end_date.required' => 'Tanggal selesai cuti harus diisi.',
            'end_date.date' => 'Format tanggal selesai cuti tidak valid.',
            'end_date.after_or_equal' => 'Tanggal selesai cuti tidak boleh sebelum tanggal mulai.',
        ];
    }
}