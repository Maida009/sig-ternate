// Check authentication
if (!localStorage.getItem('currentUser')) {
    window.location.href = 'index.html';
}

// Display current user
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
document.getElementById('user-display').textContent = `👤 ${currentUser.username}`;

// Initialize Map (OpenStreetMap)
const map = L.map('map').setView([0.775, 127.370], 13);

// Add OSM Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// ===================================================================
// 1. DATA TEMPAT IBADAH (Point) - Dari Tahap 3
// ===================================================================
// Ganti baris: const tempatIbadahData = [...] 
// dengan kode berikut:

let tempatIbadahData = [];

async function loadDataIbadah() {
    try {
        const response = await fetch('data/data_ibadah_perbaikan.json');
        if (!response.ok) throw new Error('Gagal memuat data');
        const json = await response.json();
        tempatIbadahData = json.tempat_ibadah;
        
        // Jalankan fungsi tampilan setelah data siap
        displayPlaces(tempatIbadahData);
        updateStats();
        console.log('✅ Data tempat ibadah berhasil dimuat:', tempatIbadahData.length, 'lokasi');
    } catch (error) {
        console.error('❌ Error loading data:', error);
        document.getElementById('placeList').innerHTML = 
            '<p style="color:red; text-align:center;">Gagal memuat data. Pastikan file JSON ada di folder data/</p>';
    }
}

// Panggil fungsi saat halaman dibuka
loadDataIbadah();

// ===================================================================
// 2. DATA PERMUKIMAN (Polygon) - Dari Tahap 3
// ===================================================================
const permukimanData = [
    // Ternate Tengah - Makassar Barat
    {
        id: 1,
        nama_permukiman: "Makassar Barat - RT 01",
        jumlah_kk: 150,
        kelurahan: "Makassar Barat",
        kecamatan: "Ternate Tengah",
        geometry: {
            type: "Polygon",
            coordinates: [[
                [127.378, 0.802],
                [127.385, 0.802],
                [127.385, 0.806],
                [127.378, 0.806],
                [127.378, 0.802]
            ]]
        }
    },
    {
        id: 2,
        nama_permukiman: "Makassar Barat - RT 02",
        jumlah_kk: 180,
        kelurahan: "Makassar Barat",
        kecamatan: "Ternate Tengah",
        geometry: {
            type: "Polygon",
            coordinates: [[
                [127.385, 0.802],
                [127.392, 0.802],
                [127.392, 0.806],
                [127.385, 0.806],
                [127.385, 0.802]
            ]]
        }
    },
    // Ternate Tengah - Makassar Selatan
    {
        id: 3,
        nama_permukiman: "Makassar Selatan - RT 01",
        jumlah_kk: 120,
        kelurahan: "Makassar Selatan",
        kecamatan: "Ternate Tengah",
        geometry: {
            type: "Polygon",
            coordinates: [[
                [127.382, 0.785],
                [127.389, 0.785],
                [127.389, 0.789],
                [127.382, 0.789],
                [127.382, 0.785]
            ]]
        }
    },
    // Ternate Selatan - Sasa
    {
        id: 4,
        nama_permukiman: "Sasa - RT 01",
        jumlah_kk: 200,
        kelurahan: "Sasa",
        kecamatan: "Ternate Selatan",
        geometry: {
            type: "Polygon",
            coordinates: [[
                [127.365, 0.760],
                [127.372, 0.760],
                [127.372, 0.764],
                [127.365, 0.764],
                [127.365, 0.760]
            ]]
        }
    },
    {
        id: 5,
        nama_permukiman: "Sasa - RT 02",
        jumlah_kk: 175,
        kelurahan: "Sasa",
        kecamatan: "Ternate Selatan",
        geometry: {
            type: "Polygon",
            coordinates: [[
                [127.372, 0.760],
                [127.379, 0.760],
                [127.379, 0.764],
                [127.372, 0.764],
                [127.372, 0.760]
            ]]
        }
    },
    // Ternate Selatan - Ngade
    {
        id: 6,
        nama_permukiman: "Ngade - RT 01",
        jumlah_kk: 160,
        kelurahan: "Ngade",
        kecamatan: "Ternate Selatan",
        geometry: {
            type: "Polygon",
            coordinates: [[
                [127.362, 0.766],
                [127.369, 0.766],
                [127.369, 0.770],
                [127.362, 0.770],
                [127.362, 0.766]
            ]]
        }
    }
];

// ===================================================================
// 3. DATA BATAS WILAYAH (Polygon)
// ===================================================================
const batasKecamatanData = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { nama: "Ternate Tengah", luas: "15.5 km²" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [127.360, 0.780],
                    [127.420, 0.780],
                    [127.420, 0.810],
                    [127.360, 0.810],
                    [127.360, 0.780]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { nama: "Ternate Selatan", luas: "18.2 km²" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [127.340, 0.750],
                    [127.390, 0.750],
                    [127.390, 0.780],
                    [127.340, 0.780],
                    [127.340, 0.750]
                ]]
            }
        }
    ]
};

const batasKelurahanData = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { nama: "Makassar Barat", kecamatan: "Ternate Tengah" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [127.375, 0.795],
                    [127.395, 0.795],
                    [127.395, 0.808],
                    [127.375, 0.808],
                    [127.375, 0.795]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { nama: "Makassar Selatan", kecamatan: "Ternate Tengah" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [127.375, 0.780],
                    [127.395, 0.780],
                    [127.395, 0.795],
                    [127.375, 0.795],
                    [127.375, 0.780]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { nama: "Sasa", kecamatan: "Ternate Selatan" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [127.360, 0.755],
                    [127.375, 0.755],
                    [127.375, 0.768],
                    [127.360, 0.768],
                    [127.360, 0.755]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { nama: "Ngade", kecamatan: "Ternate Selatan" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [127.355, 0.762],
                    [127.372, 0.762],
                    [127.372, 0.775],
                    [127.355, 0.775],
                    [127.355, 0.762]
                ]]
            }
        }
    ]
};

// ===================================================================
// 4. DATA JARINGAN JALAN (Line)
// ===================================================================
const jaringanJalanData = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { nama: "Jl. Merdeka", kelas: "Kolektor", kondisi: "Baik" },
            geometry: {
                type: "LineString",
                coordinates: [
                    [127.380, 0.800],
                    [127.385, 0.805]
                ]
            }
        },
        {
            type: "Feature",
            properties: { nama: "Jl. Sultan Babullah", kelas: "Utama", kondisi: "Baik" },
            geometry: {
                type: "LineString",
                coordinates: [
                    [127.375, 0.795],
                    [127.390, 0.800]
                ]
            }
        },
        {
            type: "Feature",
            properties: { nama: "Jl. Raya Sasa", kelas: "Kolektor", kondisi: "Sedang" },
            geometry: {
                type: "LineString",
                coordinates: [
                    [127.360, 0.760],
                    [127.370, 0.765]
                ]
            }
        }
    ]
};

// ===================================================================
// LAYER GROUPS
// ===================================================================
let markers = [];
let bufferLayer = null;
let overlayLayer = null;

// Layer controls
let layerBatasKecamatan = L.geoJSON(batasKecamatanData, {
    style: { color: "#ff0000", weight: 3, fillOpacity: 0, dashArray: "10 10" }
}).addTo(map);

let layerBatasKelurahan = L.geoJSON(batasKelurahanData, {
    style: { color: "#000000", weight: 2, fillOpacity: 0, dashArray: "5 5" }
}).addTo(map);

let layerPermukiman = L.geoJSON({
    type: "FeatureCollection",
    features: permukimanData
}, {
    style: { color: "#ffff00", fillColor: "#ffff00", fillOpacity: 0.3, weight: 1 },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`
            <b>Permukiman:</b> ${feature.properties.nama_permukiman}<br>
            <b>Kelurahan:</b> ${feature.properties.kelurahan}<br>
            <b>Jumlah KK:</b> ${feature.properties.jumlah_kk}
        `);
    }
}).addTo(map);

let layerJalan = L.geoJSON(jaringanJalanData, {
    style: { color: "#808080", weight: 3 },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`
            <b>Jalan:</b> ${feature.properties.nama}<br>
            <b>Kelas:</b> ${feature.properties.kelas}<br>
            <b>Kondisi:</b> ${feature.properties.kondisi}
        `);
    }
}).addTo(map);

let layerTempatIbadah = L.layerGroup();

// ===================================================================
// ICON MARKERS
// ===================================================================
const getIcon = (agama) => {
    const colors = {
        'Islam': '#2E8B57',
        'Kristen': '#4169E1',
        'Katolik': '#8B4513'
    };
    const color = colors[agama] || '#333';
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:${color};width:30px;height:30px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

// ===================================================================
// DISPLAY PLACES
// ===================================================================
function displayPlaces(data) {
    const placeList = document.getElementById('placeList');
    placeList.innerHTML = '';
    
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    
    if (data.length === 0) {
        placeList.innerHTML = '<p class="loading">Tidak ada data</p>';
        return;
    }
    
    data.forEach(place => {
        // Add to list
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <h3>${place.nama}</h3>
            <p>📍 ${place.alamat || place.kelurahan}</p>
            <p>🏛️ ${place.jenis} - ${place.kecamatan}</p>
            <p>👥 Kapasitas: ${place.kapasitas} jamaah</p>
            <span class="badge badge-${place.agama.toLowerCase()}">${place.agama}</span>
        `;
        card.onclick = () => {
            map.setView([place.latitude, place.longitude], 16);
            marker.openPopup();
        };
        placeList.appendChild(card);
        
        // Add marker
        const marker = L.marker([place.latitude, place.longitude], {
            icon: getIcon(place.agama)
        }).addTo(map);
        
        marker.bindPopup(`
            <b>${place.nama}</b><br>
            ${place.jenis}<br>
            ${place.agama}<br>
            ${place.alamat}<br>
            ${place.kelurahan}, ${place.kecamatan}<br>
            Kapasitas: ${place.kapasitas} jamaah
        `);
        
        markers.push(marker);
    });
}

// ===================================================================
// FILTER & SEARCH
// ===================================================================
function filterData(agama) {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (agama === 'all') {
        displayPlaces(tempatIbadahData);
    } else {
        const filtered = tempatIbadahData.filter(p => p.agama === agama);
        displayPlaces(filtered);
    }
}

document.getElementById('searchInput').addEventListener('input', function(e) {
    const keyword = e.target.value.toLowerCase();
    const filtered = tempatIbadahData.filter(p => 
        p.nama.toLowerCase().includes(keyword) ||
        (p.alamat && p.alamat.toLowerCase().includes(keyword)) ||
        p.kelurahan.toLowerCase().includes(keyword)
    );
    displayPlaces(filtered);
});

// ===================================================================
// ANALISIS SPASIAL (BUFFER & OVERLAY)
// ===================================================================
function runBuffer(radius, colorName) {
    if (bufferLayer) {
        map.removeLayer(bufferLayer);
    }
    
    const points = tempatIbadahData.map(p => turf.point([p.longitude, p.latitude]));
    const featureCollection = turf.featureCollection(points);
    const buffered = turf.buffer(featureCollection, radius, { units: 'meters' });
    
    const colors = {
        'green': '#27ae60',
        'blue': '#2980b9',
        'orange': '#f39c12'
    };
    
    const color = colors[colorName] || '#27ae60';
    
    bufferLayer = L.geoJSON(buffered, {
        style: {
            color: color,
            fillColor: color,
            fillOpacity: 0.25,
            weight: 2
        }
    }).addTo(map);
    
    map.fitBounds(bufferLayer.getBounds());
    alert(`✅ Analisis Buffer ${radius}m berhasil dibuat!`);
}

function runOverlay() {
    if (!tempatIbadahData.length) {
        alert('❌ Tidak ada data untuk dianalisis!');
        return;
    }
    
    alert('🔄 Menjalankan analisis overlay...');
    
    const points = tempatIbadahData.map(p => turf.point([p.longitude, p.latitude]));
    const featureCollection = turf.featureCollection(points);
    const buffer1km = turf.buffer(featureCollection, 1000, { units: 'meters' });
    
    const permukimanFeatures = permukimanData.map(p => turf.polygon(p.geometry.coordinates));
    const permukimanCollection = turf.featureCollection(permukimanFeatures);
    
    const uncoveredAreas = [];
    permukimanFeatures.forEach((area, index) => {
        const isCovered = turf.booleanWithin(area, buffer1km);
        if (!isCovered) {
            uncoveredAreas.push(permukimanData[index]);
        }
    });
    
    if (overlayLayer) {
        map.removeLayer(overlayLayer);
    }
    
    if (uncoveredAreas.length > 0) {
        const uncoveredGeoJSON = {
            type: "FeatureCollection",
            features: uncoveredAreas.map(u => ({
                type: "Feature",
                properties: u,
                geometry: u.geometry
            }))
        };
        
        overlayLayer = L.geoJSON(uncoveredGeoJSON, {
            style: {
                color: '#c0392b',
                fillColor: '#c0392b',
                fillOpacity: 0.4,
                weight: 2,
                dashArray: '10 10'
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`
                    <b>⚠️ Area Tidak Terlayani</b><br>
                    ${feature.properties.nama_permukiman}<br>
                    KK: ${feature.properties.jumlah_kk}
                `);
            }
        }).addTo(map);
        
        map.fitBounds(overlayLayer.getBounds());
        alert(`✅ Ditemukan ${uncoveredAreas.length} area tidak terlayani!`);
    } else {
        alert('✅ Semua permukiman telah terlayani!');
    }
}

function clearAnalysis() {
    if (bufferLayer) {
        map.removeLayer(bufferLayer);
        bufferLayer = null;
    }
    if (overlayLayer) {
        map.removeLayer(overlayLayer);
        overlayLayer = null;
    }
    alert('🗑️ Analisis telah dihapus');
}

// ===================================================================
// TOGGLE LAYERS
// ===================================================================
function toggleLayer(layerName) {
    const checkbox = event.target;
    
    switch(layerName) {
        case 'batasKecamatan':
            if (checkbox.checked) {
                map.addLayer(layerBatasKecamatan);
            } else {
                map.removeLayer(layerBatasKecamatan);
            }
            break;
        case 'batasKelurahan':
            if (checkbox.checked) {
                map.addLayer(layerBatasKelurahan);
            } else {
                map.removeLayer(layerBatasKelurahan);
            }
            break;
        case 'permukiman':
            if (checkbox.checked) {
                map.addLayer(layerPermukiman);
            } else {
                map.removeLayer(layerPermukiman);
            }
            break;
        case 'jalan':
            if (checkbox.checked) {
                map.addLayer(layerJalan);
            } else {
                map.removeLayer(layerJalan);
            }
            break;
    }
}

// ===================================================================
// LEGEND
// ===================================================================
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `
        <strong>Keterangan</strong><br>
        <div class="legend-item"><div class="legend-color" style="background:#2E8B57"></div>Islam</div>
        <div class="legend-item"><div class="legend-color" style="background:#4169E1"></div>Kristen</div>
        <div class="legend-item"><div class="legend-color" style="background:#8B4513"></div>Katolik</div>
        <div class="legend-item"><div class="legend-color" style="background:#ffff00"></div>Permukiman</div>
    `;
    return div;
};
legend.addTo(map);

// ===================================================================
// INITIALIZE
// ===================================================================
displayPlaces(tempatIbadahData);

console.log('✅ Aplikasi SIG loaded!');
console.log(`📊 Total: ${tempatIbadahData.length} tempat ibadah`);
console.log(`🏘️ Total: ${permukimanData.length} permukiman`);