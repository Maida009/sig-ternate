// ===================================================================
// js/config.js
// Konfigurasi Supabase untuk SIG Tempat Ibadah Ternate
// ===================================================================

// ⚠️ PENTING: Pastikan URL dan Key sesuai project Anda
const SUPABASE_URL = 'https://daoqlzvgblsefahvndge.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZnZSmKdWfCb3Sd5Mg6YYkg_12l1yMCq';

// ===================================================================
// FUNGSI CRUD
// ===================================================================

/**
 * READ: Mengambil semua data tempat ibadah
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
            const err = await response.text();
            console.error(`❌ HTTP ${response.status}:`, err);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error('❌ getDataIbadah error:', error.message);
        return [];
    }
}

/**
 * CREATE: Menambah data baru
 */
async function saveDataIbadah(dataBaru) {
    try {
        console.log('📤 Sending to Supabase:', dataBaru);
        
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

        console.log('📥 Status:', response.status, 'OK:', response.ok);

        if (!response.ok) {
            const err = await response.text();
            console.error('❌ Supabase Error:', err);
            // Tampilkan error yang lebih spesifik
            if (err.includes('duplicate key')) {
                console.error('⚠️ Data sudah ada (duplicate)');
            } else if (err.includes('null value in column')) {
                console.error('⚠️ Ada kolom wajib yang kosong');
            }
            return false;
        }

        console.log('✅ Data saved successfully');
        return true;
    } catch (error) {
        console.error('❌ saveDataIbadah error:', error.message);
        return false;
    }
}

/**
 * UPDATE: Mengubah data yang sudah ada
 */
async function updateDataIbadah(id, dataUbah) {
    try {
        console.log('🔄 Updating ID:', id, dataUbah);
        
        // Gunakan filter 'id' (primary key standar)
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(dataUbah)
        });

        console.log('📥 Status:', response.status, 'OK:', response.ok);

        if (!response.ok) {
            const err = await response.text();
            console.error('❌ Supabase Error:', err);
            return false;
        }

        console.log('✅ Data updated successfully');
        return true;
    } catch (error) {
        console.error('❌ updateDataIbadah error:', error.message);
        return false;
    }
}

/**
 * DELETE: Menghapus data
 */
async function deleteDataIbadah(id) {
    try {
        console.log('🗑️ Deleting ID:', id);
        
        // Gunakan filter 'id'
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tempat_ibadah?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        console.log('📥 Status:', response.status, 'OK:', response.ok);

        if (!response.ok) {
            const err = await response.text();
            console.error('❌ Supabase Error:', err);
            return false;
        }

        console.log('✅ Data deleted successfully');
        return true;
    } catch (error) {
        console.error('❌ deleteDataIbadah error:', error.message);
        return false;
    }
}

/**
 * TEST: Mengecek koneksi ke Supabase
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

// ===================================================================
// FORMAT MAPPING (Web ↔ Database)
// ===================================================================

/**
 * Database → Web: Format data dari Supabase agar cocok untuk frontend
 * Mendukung kedua nama kolom: latitude/lintang, longitude/garis_bujur
 */
function formatDataIbadah(data) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
        id: item.id,
        nama: item.nama,
        jenis: item.jenis,
        agama: item.jenis === 'Masjid' ? 'Islam' : 'Kristen',
        alamat: item.alamat || '',
        kelurahan: item.kelurahan || '-',
        kecamatan: item.kecamatan || '-',
        kapasitas: item.kapasitas || 0,
        // Fleksibel: ambil latitude atau lintang, longitude atau garis_bujur
        latitude: item.latitude !== undefined ? item.latitude : (item.lintang || 0),
        longitude: item.longitude !== undefined ? item.longitude : (item.garis_bujur || 0),
        created_at: item.created_at || item.dibuat_pada
    }));
}

/**
 * Web → Database: Format data dari form agar cocok untuk Supabase
 * Mengirim nama kolom standar: latitude, longitude
 */
function formatForSupabase(data) {
    return {
        nama: data.nama,
        jenis: data.jenis,
        alamat: data.alamat,
        kelurahan: data.kelurahan || '',
        kecamatan: data.kecamatan || '',
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        kapasitas: parseInt(data.kapasitas) || 0
    };
}

// ===================================================================
// EXPORT (Opsional - untuk Node.js environment)
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