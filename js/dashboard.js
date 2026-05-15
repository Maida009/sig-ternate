// Check authentication
window.addEventListener('load', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'index.html';
    }
    
    // Initialize charts
    initCharts();
});

// Initialize Charts
function initCharts() {
    // Doughnut Chart for Kecamatan
    const ctx = document.getElementById('kecamatanChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Ternate Selatan', 'Ternate Utara', 'Ternate Tengah', 'Pulau Ternate'],
                datasets: [{
                    data: [35, 25, 28, 12],
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FF9800',
                        '#9C27B0'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
    
    // Bar Chart for Kelurahan
    const kelurahanContainer = document.getElementById('kelurahanChart');
    if (kelurahanContainer) {
        kelurahanContainer.innerHTML = `
            <div class="bar-chart">
                <div class="bar-item">
                    <span class="bar-label">Makassar Barat</span>
                    <div class="bar-wrapper">
                        <div class="bar-fill" style="width: 85%"></div>
                    </div>
                    <span class="bar-value">1,245</span>
                </div>
                <div class="bar-item">
                    <span class="bar-label">Kampung Baru</span>
                    <div class="bar-wrapper">
                        <div class="bar-fill" style="width: 72%"></div>
                    </div>
                    <span class="bar-value">982</span>
                </div>
                <div class="bar-item">
                    <span class="bar-label">Tanah Tinggi</span>
                    <div class="bar-wrapper">
                        <div class="bar-fill" style="width: 65%"></div>
                    </div>
                    <span class="bar-value">856</span>
                </div>
                <div class="bar-item">
                    <span class="bar-label">Ubo-ubo</span>
                    <div class="bar-wrapper">
                        <div class="bar-fill" style="width: 58%"></div>
                    </div>
                    <span class="bar-value">743</span>
                </div>
                <div class="bar-item">
                    <span class="bar-label">Maliaro</span>
                    <div class="bar-wrapper">
                        <div class="bar-fill" style="width: 45%"></div>
                    </div>
                    <span class="bar-value">621</span>
                </div>
            </div>
        `;
    }
}

// Logout function
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Add CSS for bar chart
const style = document.createElement('style');
style.textContent = `
    .bar-chart {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .bar-item {
        display: grid;
        grid-template-columns: 150px 1fr 80px;
        align-items: center;
        gap: 15px;
    }
    
    .bar-label {
        font-size: 14px;
        color: #4a5568;
        font-weight: 500;
    }
    
    .bar-wrapper {
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #66BB6A);
        border-radius: 4px;
        transition: width 1s ease;
    }
    
    .bar-value {
        font-size: 14px;
        font-weight: 600;
        color: #2d3748;
        text-align: right;
    }
`;
document.head.appendChild(style);