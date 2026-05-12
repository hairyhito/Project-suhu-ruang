// --- 1. NAVIGASI HALAMAN ---
function switchPage(pageId, navElement) {
    document.querySelectorAll('.page-section').forEach(page => page.classList.add('d-none'));
    document.getElementById(pageId).classList.remove('d-none');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-nav', 'text-white');
        link.classList.add('text-white-50');
    });
    navElement.classList.add('active-nav', 'text-white');
    navElement.classList.remove('text-white-50');
}

// --- 2. LOGIKA KENDALI AKTUATOR (TOMBOL SWITCH) ---
function toggleDevice(device, element) {
    element.classList.toggle('active');
    const isON = element.classList.contains('active');
    
    // Nanti logika fetch API untuk kirim sinyal ke ESP32 diletakkan di sini
    console.log(`Perangkat [${device}] sekarang ${isON ? 'MENYALA' : 'MATI'}`);
}

// --- 3. LOGIKA MODE RUANGAN ---
function setMode(modeType, element) {
    // Reset visual tombol mode
    document.querySelectorAll('.glass-btn').forEach(btn => btn.classList.remove('active-mode'));
    element.classList.add('active-mode');

    const feedback = document.getElementById('modeFeedback');
    
    if (modeType === 'sleep') {
        feedback.innerHTML = '<i class="fa-solid fa-check text-info me-1"></i> Mode Tidur: Target suhu sejuk (22-24°C). AC direkomendasikan menyala.';
    } else if (modeType === 'workout') {
        feedback.innerHTML = '<i class="fa-solid fa-bolt text-warning me-1"></i> Mode Olahraga: Fokus sirkulasi maksimal untuk rutinitas berat. Nyalakan kipas.';
    } else {
        feedback.innerHTML = 'Mode Normal aktif: Mempertahankan sirkulasi standar.';
    }
}

// --- 4. INISIALISASI GRAFIK TREN (CHART.JS) ---
const ctx = document.getElementById('trendChart').getContext('2d');
const timeLabels = [];
const tempData = [];
const humData = [];

// Desain grafik gaya "Technical Indicator"
const trendChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [
            {
                label: 'Suhu (°C)',
                borderColor: '#00f2fe', // Biru Neon
                backgroundColor: 'rgba(0, 242, 254, 0.1)',
                data: tempData,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Kelembapan (%)',
                borderColor: '#ff007f', // Pink Neon
                backgroundColor: 'transparent',
                borderDash: [5, 5], // Garis putus-putus
                data: humData,
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        color: 'rgba(255, 255, 255, 0.7)',
        scales: {
            x: { 
                ticks: { color: 'rgba(255, 255, 255, 0.5)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            y: {
                type: 'linear', display: true, position: 'left',
                ticks: { color: '#00f2fe' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            y1: {
                type: 'linear', display: true, position: 'right',
                ticks: { color: '#ff007f' },
                grid: { drawOnChartArea: false } // Jangan tumpuk garis gridnya
            }
        },
        plugins: {
            legend: { labels: { color: '#fff' } }
        }
    }
});

// --- 5. LOGIKA PENARIKAN DATA SENSOR & UPDATE UI ---
function fetchRoomData() {
    const mockTemp = (Math.random() * (30 - 24) + 24).toFixed(1); 
    const mockHum = (Math.random() * (70 - 50) + 50).toFixed(1); 
    
    // Update Teks Page 1
    document.getElementById('tempValue').innerHTML = `${mockTemp}<span class="fs-4">°C</span>`;
    document.getElementById('humValue').innerHTML = `${mockHum}<span class="fs-4">%</span>`;

    // Update Grafik Page 2
    const now = new Date();
    const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    if (timeLabels.length > 12) {
        timeLabels.shift();
        tempData.shift();
        humData.shift();
    }
    timeLabels.push(timeString);
    tempData.push(mockTemp);
    humData.push(mockHum);
    
    trendChart.update();
}

// Jalankan interval pembaruan data
setInterval(fetchRoomData, 4000);
fetchRoomData();