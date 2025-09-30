// Admin Dashboard JavaScript
const API_BASE_URL = 'http://localhost:5000/api';
let reportsData = [];

// Cameroon regions
const cameroonRegions = [
  { id: 'centre', name: 'Centre', capital: 'Yaoundé', icon: 'fas fa-city', cities: ['Yaoundé', 'Mbalmayo', 'Obala', 'Akonolinga'] },
  { id: 'littoral', name: 'Littoral', capital: 'Douala', icon: 'fas fa-ship', cities: ['Douala', 'Nkongsamba', 'Edéa', 'Limbé'] },
  { id: 'ouest', name: 'Ouest', capital: 'Bafoussam', icon: 'fas fa-mountain', cities: ['Bafoussam', 'Dschang', 'Bandjoun', 'Mbouda'] },
  { id: 'nord-ouest', name: 'Nord-Ouest', capital: 'Bamenda', icon: 'fas fa-tree', cities: ['Bamenda', 'Kumbo', 'Wum', 'Ndop'] },
  { id: 'sud-ouest', name: 'Sud-Ouest', capital: 'Buea', icon: 'fas fa-water', cities: ['Buea', 'Kumba', 'Tiko', 'Mamfe'] },
  { id: 'nord', name: 'Nord', capital: 'Garoua', icon: 'fas fa-sun', cities: ['Garoua', 'Maroua', 'Ngaoundéré', 'Guider'] },
  { id: 'adamaoua', name: 'Adamaoua', capital: 'Ngaoundéré', icon: 'fas fa-mountain', cities: ['Ngaoundéré', 'Tibati', 'Tignère', 'Banyo'] },
  { id: 'est', name: 'Est', capital: 'Bertoua', icon: 'fas fa-leaf', cities: ['Bertoua', 'Batouri', 'Yokadouma', 'Abong-Mbang'] },
  { id: 'extreme-nord', name: 'Extrême-Nord', capital: 'Maroua', icon: 'fas fa-desert', cities: ['Maroua', 'Kousseri', 'Mora', 'Waza'] },
  { id: 'sud', name: 'Sud', capital: 'Ebolowa', icon: 'fas fa-tree', cities: ['Ebolowa', 'Sangmélima', 'Kribi', 'Campo'] }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initializeSearch();
  loadData();
  renderRegions();
});

// Navigation
function initNavigation() {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
      switchSection(this.dataset.section);
    });
  });
}

function switchSection(section) {
  document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
  document.querySelector(`[data-section="${section}"]`).classList.add('active');
  
  document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(`${section}-section`).classList.add('active');
  
  loadSectionData(section);
}

function loadSectionData(section) {
  switch(section) {
    case 'reports': loadReports(); break;
    case 'files': loadFiles(); break;
  }
}

// Data loading
async function loadData() {
  try {
    const stats = await fetchStats();
    document.getElementById('criticalReports').textContent = stats.critical || 0;
    document.getElementById('totalReports').textContent = stats.total || 0;
    document.getElementById('resolvedReports').textContent = stats.resolved || 0;
    document.getElementById('pendingReports').textContent = stats.pending || 0;
    document.getElementById('reportsBadge').textContent = stats.total || 0;
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

async function fetchStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    const result = await response.json();
    return result.data || { total: 0, critical: 0, resolved: 0, pending: 0 };
  } catch (error) {
    return { total: 0, critical: 0, resolved: 0, pending: 0 };
  }
}

async function loadReports() {
  try {
    const reports = await fetchReports();
    renderReportsTable(reports);
  } catch (error) {
    console.error('Error loading reports:', error);
  }
}

async function fetchReports() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    return generateMockReports();
  }
}

function generateMockReports() {
  return [
    {
      id: 1,
      referenceNumber: 'REF001',
      fullName: 'Jean Dupont',
      incidentType: 'phishing',
      region: 'Centre',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      referenceNumber: 'REF002',
      fullName: 'Marie Martin',
      incidentType: 'malware',
      region: 'Littoral',
      status: 'resolved',
      priority: 'critical',
      createdAt: '2024-01-14'
    }
  ];
}

function renderReportsTable(reports) {
  const tbody = document.getElementById('reportsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = reports.map(report => `
    <tr>
      <td>${report.referenceNumber}</td>
      <td>${report.fullName}</td>
      <td>${report.incidentType}</td>
      <td>${report.region}</td>
      <td><span class="status-badge status-${report.status}">${report.status}</span></td>
      <td>${new Date(report.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="action-btn" onclick="viewReport('${report.id}')">Voir</button>
        <button class="action-btn" onclick="downloadReport('${report.id}')">Télécharger</button>
      </td>
    </tr>
  `).join('');
}

function renderRegions() {
  const grid = document.getElementById('regionsGrid');
  if (!grid) return;
  
  grid.innerHTML = cameroonRegions.map(region => `
    <div class="region-card" data-region="${region.id}">
      <div class="region-header">
        <h3><i class="${region.icon}"></i> ${region.name}</h3>
        <span class="region-capital">${region.capital}</span>
      </div>
      <div class="region-stats">
        <div class="stat-item">
          <span class="stat-number" id="${region.id}-reports">0</span>
          <span class="stat-label">Signalements</span>
        </div>
      </div>
      <div class="region-cities">
        ${region.cities.map(city => `<span class="city-tag">${city}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

async function loadFiles() {
  const files = generateMockFiles();
  renderFilesGrid(files);
}

function generateMockFiles() {
  return [
    { id: 1, name: 'evidence1.pdf', size: '2.5 MB', type: 'pdf', reportId: 'REF001' },
    { id: 2, name: 'screenshot.png', size: '1.2 MB', type: 'image', reportId: 'REF002' }
  ];
}

function renderFilesGrid(files) {
  const grid = document.getElementById('filesGrid');
  if (!grid) return;
  
  grid.innerHTML = files.map(file => `
    <div class="file-card">
      <div class="file-icon">
        <i class="fas fa-file-${file.type === 'pdf' ? 'pdf' : 'image'}"></i>
      </div>
      <div class="file-name">${file.name}</div>
      <div class="file-size">${file.size}</div>
      <div class="file-actions">
        <button class="download-btn" onclick="downloadFile('${file.id}')">Télécharger</button>
        <button class="view-btn" onclick="viewFile('${file.id}')">Voir</button>
      </div>
    </div>
  `).join('');
}

// Actions
async function viewReport(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${id}`);
    const result = await response.json();
    
    if (result.success) {
      showReportModal(result.data);
    }
  } catch (error) {
    console.error('Error viewing report:', error);
  }
}

function showReportModal(report) {
  const modalBody = document.getElementById('reportModalBody');
  if (!modalBody) return;
  
  modalBody.innerHTML = `
    <div class="report-details">
      <div class="row">
        <div class="col-md-6">
          <h6>Informations personnelles</h6>
          <p><strong>Référence:</strong> ${report.reference_number}</p>
          <p><strong>Nom:</strong> ${report.full_name}</p>
          <p><strong>Email:</strong> ${report.email}</p>
          <p><strong>Téléphone:</strong> ${report.phone || 'N/A'}</p>
        </div>
        <div class="col-md-6">
          <h6>Détails de l'incident</h6>
          <p><strong>Type:</strong> ${report.incident_type}</p>
          <p><strong>Date:</strong> ${new Date(report.incident_date).toLocaleDateString()}</p>
          <p><strong>Région:</strong> ${report.incident_location || 'N/A'}</p>
          <p><strong>Statut:</strong> <span class="status-badge status-${report.status}">${report.status}</span></p>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-12">
          <h6>Description</h6>
          <p>${report.description}</p>
        </div>
      </div>
      ${report.files && report.files.length > 0 ? `
        <div class="row mt-3">
          <div class="col-12">
            <h6>Fichiers joints (${report.files.length})</h6>
            <div class="files-list">
              ${report.files.map(file => `
                <div class="file-item">
                  <i class="fas fa-file"></i>
                  <span>${file.originalName}</span>
                  <button class="btn btn-sm btn-primary" onclick="downloadFile('${file.id}')">Télécharger</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  // Show modal using Bootstrap
  const modal = new bootstrap.Modal(document.getElementById('reportModal'));
  modal.show();
}

function downloadReport(id) {
  // Generate and download report as PDF/Excel
  window.open(`${API_BASE_URL}/admin/reports/${id}/export`, '_blank');
}

function downloadFile(id) {
  // Direct download via API
  window.open(`${API_BASE_URL}/admin/files/download/${id}`, '_blank');
}

function viewFile(id) {
  // For images, open in new tab; for others, download
  fetch(`${API_BASE_URL}/admin/files/${id}`)
    .then(response => response.json())
    .then(result => {
      if (result.success && result.data.mimeType.startsWith('image/')) {
        window.open(`${API_BASE_URL}/admin/files/download/${id}`, '_blank');
      } else {
        downloadFile(id);
      }
    })
    .catch(() => downloadFile(id));
}

function refreshData() {
  loadData();
  if (document.querySelector('.admin-section.active').id === 'reports-section') {
    loadReports();
  }
}

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      filterReports(query);
    });
  }
}

function filterReports(query) {
  const rows = document.querySelectorAll('#reportsTableBody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}
