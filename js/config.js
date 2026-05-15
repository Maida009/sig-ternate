// ===================================================================
// js/config.js
// Konfigurasi Supabase untuk SIG Tempat Ibadah Ternate
// ===================================================================

// ⚠️ PENTING: Ganti dengan URL dan Key project Anda
const SUPABASE_URL = 'https://daoqlzvgblsefahvndge.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZnZSmKdWfCb3Sd5Mg6YYkg_12l1yMCq';

// ===================================================================
// FUNGSI CRUD (Create, Read, Update, Delete)
// ===================================================================

/**
 * READ: Mengambil semua data tempat ibadah
 * @returns {Promise<Array>} Data mentah dari Supabase
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
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Gagal mengambil data:', error);
        return [];
    }
}

/**
 * CREATE: Menambah data baru
 * @param {Object} dataBaru - Objek data dengan format Supabase
 * @returns {Promise<boolean>} True jika berhasil
 */
async function saveDataIbadah(dataBaru) {
    try {
        console.log('📤 Sending data to Supabase:', dataBaru);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal' 
            },
            body: JSON.stringify(dataBaru)
        });

        console.log('📥 Response status:', response.status, 'OK:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Supabase Error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        console.log('✅ Data berhasil disimpan');
        return true;
    } catch (error) {
        console.error('❌ Error saveDataIbadah:', error.message);
        return false;
    }
}

/**
 * UPDATE: Mengubah data yang sudah ada
 * @param {number} id - ID (pengenal) data yang akan diupdate
 * @param {Object} dataUbah - Objek data baru
 * @returns {Promise<boolean>} True jika berhasil
 */
async function updateDataIbadah(id, dataUbah) {
    try {
        console.log('🔄 Updating ID (pengenal):', id, dataUbah);
        
        // PENTING: Gunakan filter 'pengenal' karena itu nama kolom Primary Key di DB Anda
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah?pengenal=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(dataUbah)
        });

        console.log('📥 Response status:', response.status, 'OK:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Supabase Error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        console.log('✅ Data berhasil diupdate');
        return true;
    } catch (error) {
        console.error('❌ Error updateDataIbadah:', error.message);
        return false;
    }
}

/**
 * DELETE: Menghapus data
 * @param {number} id - ID (pengenal) data yang akan dihapus
 * @returns {Promise<boolean>} True jika berhasil
 */
async function deleteDataIbadah(id) {
    try {
        console.log('🗑️ Deleting ID (pengenal):', id);
        
        // PENTING: Gunakan filter 'pengenal'
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah?pengenal=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        console.log('📥 Response status:', response.status, 'OK:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Supabase Error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        console.log('✅ Data berhasil dihapus');
        return true;
    } catch (error) {
        console.error('❌ Error deleteDataIbadah:', error.message);
        return false;
    }
}

// ===================================================================
// FUNGSI HELPER & UTILITIES
// ===================================================================

/**
 * TEST: Mengecek koneksi ke Supabase
 * @returns {Promise<boolean>} True jika terhubung
 */
async function testConnection() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah?limit=1`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('❌ Connection test failed:', error);
        return false;
    }
}

/**
 * FORMAT: Mengubah data dari Supabase agar cocok untuk Web (Peta/Data)
 * Database: { pengenal, lintang, garis_bujur, ... }
 * Web:      { id, latitude, longitude, ... }
 */
function formatDataIbadah(data) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
        id: item.pengenal || item.id,           // Map 'pengenal' -> 'id'
        nama: item.nama,
        jenis: item.jenis,
        agama: item.jenis === 'Masjid' ? 'Islam' : 'Kristen',
        alamat: item.alamat || '',
        kelurahan: item.kelurahan || '-',
        kecamatan: item.kecamatan || '-',
        kapasitas: item.kapasitas || 0,
        latitude: item.lintang || item.latitude,       // Map 'lintang' -> 'latitude'
        longitude: item.garis_bujur || item.longitude, // Map 'garis_bujur' -> 'longitude'
        created_at: item.dibuat_pada || item.created_at
    }));
}

/**
 * FORMAT: Mengubah data dari Web agar cocok untuk Supabase
 * Web:      { latitude, longitude, ... }
 * Database: { lintang, garis_bujur, ... }
 */
function formatForSupabase(data) {
    return {
        nama: data.nama,
        jenis: data.jenis,
        alamat: data.alamat,
        kelurahan: data.kelurahan || '',
        kecamatan: data.kecamatan || '',
        // Map 'latitude' -> 'lintang' dan 'longitude' -> 'garis_bujur'
        lintang: parseFloat(data.latitude),
        garis_bujur: parseFloat(data.longitude)
    };
}

// ===================================================================
// EXPORT (Untuk kompatibilitas module jika diperlukan)
// ===================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getDataIbadah,
        saveDataIbadah,
        updateDataIbadah,
        deleteDataIbadah,
        testConnection,
        formatDataIbadah,
        formatForSupabase,
        SUPABASE_URL,
        SUPABASE_KEY
    };
}