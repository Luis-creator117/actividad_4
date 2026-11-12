// ============================================================
// CONFIGURACIÓN GLOBAL
// ============================================================
// API corregida que no requiere autenticación
const API_URL = 'https://countries.dev/countries';
const ITEMS_PER_PAGE = 12;

// Estado de la aplicación
let allCountries = [];
let filteredCountries = [];
let currentPage = 1;

// Referencias al DOM
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');
const emptyState = document.getElementById('emptyState');
const countriesGrid = document.getElementById('countriesGrid');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');

// ============================================================
// FUNCIONES DE UI (mostrar/ocultar estados)
// ============================================================
function showLoading() {
  loadingSpinner.classList.remove('hidden');
  errorMessage.classList.add('hidden');
  emptyState.classList.add('hidden');
  countriesGrid.innerHTML = '';
  pagination.classList.add('hidden');
}

function hideLoading() {
  loadingSpinner.classList.add('hidden');
}

function showError(message) {
  hideLoading();
  errorText.textContent = message;
  errorMessage.classList.remove('hidden');
  countriesGrid.innerHTML = '';
  pagination.classList.add('hidden');
}

function showEmptyState() {
  hideLoading();
  emptyState.classList.remove('hidden');
  countriesGrid.innerHTML = '';
  pagination.classList.add('hidden');
}

// ============================================================
// CONSUMO DE LA API (fetch + async/await)
// ============================================================
async function fetchCountries() {
  showLoading();
  try {
    const response = await fetch(API_URL);

    // Verificar código de estado HTTP
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validar que la respuesta sea un array
    if (!Array.isArray(data)) {
      throw new Error('Formato de respuesta inesperado.');
    }

    // --------------------------------------------------------
    // CORRECCIÓN: Adaptar los datos de la nueva API
    // --------------------------------------------------------
    allCountries = data
      .map(country => {
        // 1. Validar si el nombre viene como texto o como objeto
        const nombrePais = (typeof country.name === 'string') 
          ? country.name 
          : (country.name?.common || 'Sin nombre');

        // 2. Validar si la capital viene como texto o como lista
        const capitalPais = Array.isArray(country.capital) 
          ? (country.capital[0] || 'Sin capital') 
          : (country.capital || 'Sin capital');

        // 3. Convertir el código de país (ej. "CA") a emoji de bandera 🇨🇦
        let banderaEmoji = country.flag || country.code || '🏳️';
        if (banderaEmoji.length === 2) {
          banderaEmoji = banderaEmoji.toUpperCase().replace(/./g, char => 
            String.fromCodePoint(char.charCodeAt(0) + 127397)
          );
        }

        return {
          name: nombrePais,
          capital: capitalPais,
          region: country.region || 'Sin región',
          population: country.population || 0,
          flag: banderaEmoji
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    filteredCountries = [...allCountries];

    hideLoading();
    renderPage();
  } catch (error) {
    console.error('Error al consumir la API:', error);
    showError(
      error.message.includes('Failed to fetch')
        ? 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
        : `Error: ${error.message}`
    );
  }
}

// ============================================================
// RENDERIZADO Y PAGINACIÓN
// ============================================================
function renderPage() {
  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = filteredCountries.slice(start, end);

  if (pageItems.length === 0) {
    showEmptyState();
    return;
  }

  emptyState.classList.add('hidden');

  // Crear tarjetas dinámicamente en el DOM
  countriesGrid.innerHTML = pageItems
    .map(
      country => `
      <article class="card">
        <span class="flag">${country.flag}</span>
        <h3>${country.name}</h3>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Región:</strong> ${country.region}</p>
        <p><strong>Población:</strong> ${country.population.toLocaleString('es-ES')}</p>
      </article>
    `
    )
    .join('');

  pagination.classList.remove('hidden');
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

// ============================================================
// FILTRADO (búsqueda + región)
// ============================================================
function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedRegion = regionFilter.value;

  filteredCountries = allCountries.filter(country => {
    const matchesName = country.name.toLowerCase().includes(searchTerm);
    const matchesRegion = selectedRegion === '' || country.region === selectedRegion;
    return matchesName && matchesRegion;
  });

  currentPage = 1; // Reiniciar paginación al filtrar
  renderPage();
}

// ============================================================
// EVENT LISTENERS
// ============================================================
searchInput.addEventListener('input', applyFilters);
regionFilter.addEventListener('change', applyFilters);

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

nextBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
});

retryBtn.addEventListener('click', fetchCountries);

// ============================================================
// INICIALIZACIÓN
// ============================================================
fetchCountries();