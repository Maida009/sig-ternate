// js/config.js
// ==========================================
// KONFIGURASI SUPABASE - SIG Ternate
// ==========================================

const SUPABASE_URL = 'https://daoqlzvgblsefahvndge.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZnZSmKdWfCb3Sd5Mg6YYkg_12l1yMCq';

// ==========================================
// FUNGSI-FUNGSI API
// ==========================================

/**
 * Mengambil semua data tempat ibadah dari database
 * @returns {Promise<Array>} Array data tempat ibadah
 */
async function getDataIbadah() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Data berhasil diambil:', data.length, 'tempat ibadah');
        return data;
        
    } catch (error) {
        console.error('❌ Gagal mengambil data:', error);
        return [];
    }
}

/**
 * Menambah data tempat ibadah baru
 * @param {Object} data - Objek data tempat ibadah
 * @returns {Promise<boolean>} true jika berhasil
 */
// --- FUNGSI CREATE: Menambah data baru ---
async function saveDataIbadah(dataBaru) {
    try {
        console.log('📤 Sending data to Supabase:', dataBaru);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'  // Penting!
            },
            body: JSON.stringify(dataBaru)
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response OK:', response.ok);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Supabase error:', errorData);
            throw new Error(`HTTP ${response.status}: ${errorData.message}`);
        }
        
        console.log('✅ Data berhasil disimpan');
        return true;
        
    } catch (error) {
        console.error("❌ Gagal menyimpan data:", error);
        return false;
    }
}

/**
 * Update data tempat ibadah
 * @param {number} id - ID data yang akan diupdate
 * @param {Object} data - Objek data baru
 * @returns {Promise<boolean>} true jika berhasil
 */
async function updateDataIbadah(id, data) {
    try {
        // Pastikan nama kolom sesuai dengan database
        const dataToUpdate = {
            nama: data.nama,
            jenis: data.jenis,
            alamat: data.alamat,
            lintang: parseFloat(data.lintang) || parseFloat(data.latitude),
            garis_bujur: parseFloat(data.garis_bujur) || parseFloat(data.longitude)
        };

        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah?pengenal=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(dataToUpdate)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.message}`);
        }

        console.log('✅ Data berhasil diupdate');
        return true;
        
    } catch (error) {
        console.error('❌ Gagal mengupdate data:', error);
        return false;
    }
}

/**
 * Hapus data tempat ibadah
 * @param {number} id - ID data yang akan dihapus
 * @returns {Promise<boolean>} true jika berhasil
 */
async function deleteDataIbadah(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah?pengenal=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        console.log('✅ Data berhasil dihapus');
        return true;
        
    } catch (error) {
        console.error('❌ Gagal menghapus data:', error);
        return false;
    }
}

/**
 * Test koneksi ke Supabase
 * @returns {Promise<boolean>} true jika terhubung
 */
async function testConnection() {
    try {
        console.log('🔄 Testing koneksi ke Supabase...');
        console.log('URL:', SUPABASE_URL);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah?limit=1`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (response.ok) {
            console.log('✅ KONEKSI SUKSES! Database terhubung.');
            console.log('Status:', response.status);
            return true;
        } else {
            console.error('❌ Koneksi gagal:', response.status);
            const errorText = await response.text();
            console.error('Response:', errorText);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error koneksi:', error.message);
        console.error('Periksa URL dan API Key Anda');
        return false;
    }
}

/**
 * Helper: Format data dari database untuk ditampilkan
 * @param {Array} data - Data dari database
 * @returns {Array} Data yang sudah diformat
 */
function formatDataIbadah(data) {
    return data.map(item => ({
        id: item.pengenal,
        nama: item.nama,
        jenis: item.jenis,
        alamat: item.alamat,
        latitude: item.lintang,
        longitude: item.garis_bujur,
        created_at: item.dibuat_pada
    }));
}

// Export functions (untuk module systems)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getDataIbadah,
        saveDataIbadah,
        updateDataIbadah,
        deleteDataIbadah,
        testConnection,
        formatDataIbadah
    };
}