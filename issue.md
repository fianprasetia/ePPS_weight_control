# Implementasi Komunikasi WebSocket untuk QZ Tray Printer (Browser -> Server -> Local Agent)

## Deskripsi Tugas
Tugas ini bertujuan untuk merapikan dan melengkapi arsitektur komunikasi WebSocket antara **Browser**, **Cloud Server**, dan **Local Agent (localhost:4000)** untuk kebutuhan mengambil daftar printer melalui QZ Tray.

**Alur Komunikasi:**
```text
Browser
    │
    │ socket.emit("getPrinters")
    ▼
Cloud Server
    │
    │ requestPrinters
    ▼
Local Agent (localhost:4000)
    │
    │ qz.printers.find()
    ▼
Cloud Server
    │
    │ callback(printers)
    ▼
Browser
```

## Spesifikasi Implementasi

### 1. Skrip Local Agent (Referensi)
Pastikan agen lokal (_local agent_) memiliki penanganan event `requestPrinters` dengan menggunakan `callback` acknowledgement dari Socket.IO. Berikut adalah acuan kode yang diimplementasikan pada local agent:

```javascript
socket.on("requestPrinters", async (data, callback) => {
    console.log("Request Printer:", data);
    
    try {
        if (data.scaleId !== SCALE_ID) {
            return callback({
                success: false,
                message: "Scale ID tidak sesuai"
            });
        }
        
        console.log("Connect QZ");
        if (!qz.websocket.isActive()) {
            await qz.websocket.connect();
        }
        
        console.log("QZ Connected");
        const printers = await qz.printers.find();
        
        console.log(printers);
        
        callback({
            success: true,
            printers
        });
        
    } catch (err) {
        callback({
            success: false,
            message: err.message
        });
    }
});
```

### 2. Pembaruan pada `server.js` (Cloud Server)
Pada kode *Cloud Server* (`server.js`), kita perlu melengkapi struktur *Socket Events* yang sudah ada agar mencakup 3 fungsi utama ini:
- ✅ **Registrasi agent (`registerAgent`)**: Menyimpan ID socket berdasarkan `scaleId`.
- ✅ **Pengambilan daftar printer (`getPrinters`)**: Mem-forward request dari browser menuju spesifik agent, menggunakan `timeout` dan `callback`.
- ✅ **Penghapusan agent otomatis saat disconnect**: Saat agent atau browser terputus koneksinya, bersihkan memori dari *map* agar status agen benar-benar offline (menghindari memory leak/false positive).

#### Detail Kode untuk `server.js`:

Cari bagian `io.on('connection', (socket) => { ... })` di `server.js` lalu perbarui/sesuaikan event listeners-nya sebagai berikut:

**1. Event `registerAgent`**
Ubah metode registrasi agent dengan menambahkan variabel `scaleId` di dalam _instance_ socket, agar mudah dikenali ketika event _disconnect_ dipicu.
```javascript
socket.on("registerAgent", (data) => {
    // Simpan ke koleksi Map
    agents.set(data.scaleId, socket.id);
    
    // Simpan identitas scaleId pada instance socket itu sendiri
    socket.scaleId = data.scaleId; 
    
    console.log(`Agent ${data.scaleId} registered (${socket.id})`);
});
```

**2. Event `getPrinters`**
Lengkapi event handler ini untuk me-routing _request_ dengan acknowledgement. Bagian ini sebelumnya sudah lumayan lengkap di `server.js`, namun perhatikan dengan detail.
```javascript
socket.on("getPrinters", (data, callback) => {
    console.log("Request dari browser:", data);
    
    const agentSocketId = agents.get(data.scaleId);

    // Cek apakah agent terdaftar
    if (!agentSocketId) {
        return callback({
            success: false,
            message: "Agent Offline"
        });
    }

    // Forward request ke agent
    io.to(agentSocketId)
        .timeout(3000)
        .emit(
            "requestPrinters",
            { scaleId: data.scaleId },
            (err, responses) => {
                // Handle jika tidak ada balasan dari local agent dalam 3000ms
                if (err) {
                    return callback({
                        success: false,
                        message: "Agent Timeout"
                    });
                }
                
                console.log("Response dari Local Agent:", responses[0]);
                
                // Teruskan data balasan ke browser
                callback(responses[0]);
            }
        );
});
```

**3. Event `disconnect`**
Tambahkan logika **Otomatis Hapus Agent** ketika Socket terputus.
```javascript
socket.on('disconnect', () => {
    console.log('Socket Disconnect:', socket.id);
    
    // Jika socket ini merupakan agent yang sudah ter-register, hapus datanya dari Map
    if (socket.scaleId) {
        agents.delete(socket.scaleId);
        console.log(`Agent ${socket.scaleId} terputus dan dihapus dari registry.`);
    }
});
```

---

## Rencana Pengetesan (Testing Plan)
Setelah implementasi dilakukan, jalankan urutan tes berikut untuk memastikan fitur berjalan dengan baik:

1. **Jalankan Aplikasi:**
   Jalankan server menggunakan `node server.js` dan pastikan tidak ada error sintaks.
2. **Koneksikan & Register Local Agent:**
   Gunakan skrip Node.js (sebagai simulator agent) untuk koneksi ke Socket.IO Server dan trigger `registerAgent` dengan payload `{ scaleId: "SC-001" }`.
   *Ekspektasi*: Di console `server.js` akan muncul `"Agent SC-001 registered (xxxx)"`.
3. **Ambil Data dari Browser:**
   Gunakan socket.io client dari sisi Frontend/Browser. Jalankan perintah `socket.emit("getPrinters", { scaleId: "SC-001" }, (response) => console.log(response))`.
   *Ekspektasi*: Data mengalir lancar dari Browser -> Server -> Agent, dan callback mengembalikan _Array_ dari printers QZ.
4. **Tes Timeout Agent:**
   Beri delay lebih dari 3 detik (3000ms) pada respons callback agen atau hilangkan pemanggilan callback dari agen sama sekali.
   *Ekspektasi*: Browser mendapat respons `{ success: false, message: "Agent Timeout" }`.
5. **Tes Fitur Auto Remove Agent (Disconnect):**
   * Matikan proses simulator Agent.
   * *Ekspektasi*: Di console `server.js` muncul pesan `"Agent SC-001 terputus dan dihapus dari registry."`.
   * Panggil kembali `getPrinters` dari Browser.
   * *Ekspektasi*: Browser otomatis mendapatkan respons `{ success: false, message: "Agent Offline" }`.
