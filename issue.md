# Issue: Refactoring API `insertWeightControl`

**Tujuan:**
Memperbaiki fungsi `insertWeightControl` pada `controller/mill_activation.js` sehingga API dapat memasukkan data dengan aman (transaksi database yang benar, perbaikan error referensi) serta mengembalikan format JSON yang sesuai dengan standar frontend (terdapat penggabungan `weight_control` dan `company_data`).

## Detail Pekerjaan / Tasks:
1. **Pembersihan Kode (Clean Up):** 
   Hapus deklarasi respon `res.json("mauk")` di awal fungsi yang memblokir eksekusi kode dan memicu `HTTP_HEADERS_SENT` error.
2. **Perbaikan ReferenceError:** 
   Pada fungsi `model.mll_weight_control.create`, perbaiki atribut `note` menjadi `data.note || null` agar tidak memunculkan `ReferenceError: note is not defined`.
3. **Manajemen Transaksi (Transaction Management):** 
   Pastikan melakukan:
   - `await transaction.commit()` jika seluruh proses (termasuk insert dan query balasan) sukses.
   - `await transaction.rollback()` di dalam blok `catch`, atau jika proses create bernilai false/gagal, untuk mencegah koneksi database menggantung.
4. **Pembentukan Format Response:**
   Ubah respons dari fungsi `insertWeightControl` agar me-return sebuah object dengan struktur `{ weight_control, company_data }`. Hal ini dapat dicapai melalui 2 langkah query setelah data ter-create:
   - *Query 1:* Dapatkan data spesifik `mll_weight_control` (menggunakan `findOne`) yang baru saja dimasukkan. Sertakan tabel relasinya (misal dengan `include`) ke `adm_company` sebagai `company` dan `factory` agar atribut `name` dari kedua entity tersebut terambil.
   - *Query 2:* Dapatkan array berisi informasi anak perusahaan atau hirarki levelnya menggunakan `model.adm_company.findAll`. (Dari contoh struktur JSON, ini adalah semua entri company, estate, division, dan block dengan parameter terkait. Sesuaikan konfigurasinya misalnya mencari parent tertentu menggunakan property `parent_code`).
5. **Kirimkan payload ke `responseHelper`:**
   Lempar object gabungan tadi ke `responseHelper.success(res, message, { weight_control: dataWeightControl, company_data: dataCompany })`.

## Ekspektasi JSON Response:
API harus menghasilkan *output payload* (di dalam key `"data"`) yang persis berisi format ini:

```json
{
    "success": true,
    "message": "Data Sukses",
    "requestId": "f9598050-04a9-4112-9d57-73b70f396337",
    "data": {
        "weight_control": {
            "weight_control_code": 85,
            "code_company": "GCG",
            "mill": "TASM",
            "note": "",
            "createdAt": "2026-05-23T09:14:47.794Z",
            "updatedAt": "2026-05-23T09:14:47.794Z",
            "company": {
                "name": "PT. GADING CEMPAKA GRAHA"
            },
            "factory": {
                "name": "TALANG SEPUCUK MILL"
            }
        },
        "company_data": [
            {
                "code_company": "CAGE",
                "name": "CINTA GADING ESTATE",
                "code_company_type": "Plantation",
                "parent_code": "GCG",
                "level": "03",
                "address": "Jl. Lintas KayuAgung - Talang Sepucuk KM. 20 Kec. Pedamaran Kab.Ogan Komering Ilir",
                "province": "16",
                "phone_number": "",
                "email": "",
                "city": "Palembang",
                "zip_code": "",
                "tax_identification_number": "",
                "capacity": 0,
                "createdAt": "2024-07-31T06:14:51.502Z",
                "updatedAt": "2024-08-30T17:54:22.100Z"
            },
            {
                "code_company": "TAGE",
                "name": "TANJUNG SERANG ESTATE",
                "code_company_type": "Plantation",
                "parent_code": "GCG",
                "level": "03",
                "address": "Jl. Lintas KayuAgung - Talang Sepucuk KM. 20 Kec. Pedamaran Kab.Ogan Komering Ilir",
                "province": "16",
                "phone_number": "",
                "email": null,
                "city": "Palembang",
                "zip_code": "",
                "tax_identification_number": "",
                "capacity": 0,
                "createdAt": "2024-07-31T06:14:52.062Z",
                "updatedAt": "2024-07-31T06:14:52.062Z"
            }
            // ... (beserta entries division dan block hierarchy lainnya)
        ]
    }
}
```
