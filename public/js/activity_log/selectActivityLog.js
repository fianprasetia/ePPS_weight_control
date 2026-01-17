selectContent()
async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        // alert("ksong")
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    fetch(data)
        .then((response) => response.json())
        .then((data) => dataContent(data));
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["activity_log"]
        await log()
    }
}
async function log() {
    const logUrl = mainUrl + 'log/user_activity.log';

    fetch(logUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.text();
        })
        .then(text => {
            const container = document.getElementById('logContainer');
            container.innerHTML = '';

            const lines = text.trim().split('\n');
            const parsedLogs = [];

            // Parse semua log valid
            lines.forEach(line => {
                try {
                    const log = JSON.parse(line);
                    parsedLogs.push(log);
                } catch (e) {
                    console.error('Gagal parsing log:', line);
                }
            });

            // Urutkan berdasarkan timestamp DESC
            parsedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Tampilkan ke HTML
            parsedLogs.forEach(log => {
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                let actionData = log['4.action'];
                let actionString = '';

                // Cek apakah berupa array
                if (Array.isArray(actionData)) {
                    // Ambil semua objek dalam array dan ubah jadi string
                    actionString = actionData.map(obj => JSON.stringify(obj)).join(', ');
                } else if (typeof actionData === 'object') {
                    // Jika langsung berupa object
                    actionString = JSON.stringify(actionData);
                } else {
                    actionString = String(actionData); // fallback kalau bukan object atau array
                }
                entry.innerHTML = `
            <div class="timestamp"><strong>${formatTimestamp(log.timestamp)}</strong></div>
            <div><strong>${user}:</strong> ${log['1.username']}</div>
            <div><strong>${status}:</strong> ${log['3.status']}</div>
            <div><strong>${message}:</strong> ${log.message}</div>
            <div><strong>${dataa}:</strong></div>
            <div>[${actionString}]</div>
             <hr>
          `;

                container.appendChild(entry);
            });
            setTimeout(() => {
                hideSpinner();
            }, 1000);
        })
        .catch(error => {
            document.getElementById('logContainer').textContent = 'Gagal memuat log: ' + error.message;
        });

}
