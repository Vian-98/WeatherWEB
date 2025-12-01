const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const ICON_BASE_URL = 'https://openweathermap.org/img/wn';
let currentCity = 'Jakarta';
let isCelsius = true;
let favorites = [];
let autoUpdateInterval = null;
const cityNameMapping = {
    'aceh': 'Banda Aceh',
    'bali': 'Denpasar',
    'lombok': 'Mataram',
    'bangka': 'Pangkal Pinang',
    'jambi': 'Jambi',
    'riau': 'Pekanbaru',
    'bengkulu': 'Bengkulu',
    'lampung': 'Bandar Lampung',
    'banten': 'Serang',
    'jabar': 'Bandung',
    'jateng': 'Semarang',
    'jatim': 'Surabaya',
    'kalbar': 'Pontianak',
    'kalteng': 'Palangkaraya',
    'kalsel': 'Banjarmasin',
    'kaltim': 'Samarinda',
    'kaltara': 'Tanjung Selor',
    'sulut': 'Manado',
    'sulteng': 'Palu',
    'sulsel': 'Makassar',
    'sultra': 'Kendari',
    'gorontalo': 'Gorontalo',
    'sulbar': 'Mamuju',
    'maluku': 'Ambon',
    'malut': 'Ternate',
    'papua': 'Jayapura',
    'papbar': 'Manokwari',
    'ntb': 'Mataram',
    'ntt': 'Kupang'
};
const popularCities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
    'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi',
    'Yogyakarta', 'Malang', 'Bogor', 'Batam', 'Denpasar',
    'Bandar Lampung', 'Padang', 'Manado', 'Samarinda', 'Pontianak',
    'Singapore', 'Kuala Lumpur', 'Bangkok', 'Manila', 'Tokyo',
    'Seoul', 'Beijing', 'Shanghai', 'Hong Kong', 'Sydney',
    'Melbourne', 'London', 'Paris', 'New York', 'Los Angeles'
];
const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    unitToggle: document.getElementById('unit-toggle'),
    citySearch: document.getElementById('city-search'),
    searchBtn: document.getElementById('search-btn'),
    refreshBtn: document.getElementById('refresh-btn'),
    autocompleteList: document.getElementById('autocomplete-list'),
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('error-message'),
    demoBanner: document.getElementById('demo-banner'),
    closeBanner: document.getElementById('close-banner'),
    apiInfoLink: document.getElementById('api-info-link'),
    currentLocation: document.getElementById('current-location'),
    currentDate: document.getElementById('current-date'),
    currentIcon: document.getElementById('current-icon'),
    currentTemp: document.getElementById('current-temp'),
    currentCondition: document.getElementById('current-condition'),
    currentDescription: document.getElementById('current-description'),
    currentHumidity: document.getElementById('current-humidity'),
    currentWind: document.getElementById('current-wind'),
    currentFeelsLike: document.getElementById('current-feels-like'),
    favoriteBtn: document.getElementById('favorite-btn'),
    forecastContainer: document.getElementById('forecast-container'),
    favoritesContainer: document.getElementById('favorites-container'),
    hourlyContainer: document.getElementById('hourly-container')
};
function initApp() {
    loadPreferences();
    applyTheme();
    setupEventListeners();
    loadFavorites();
    fetchWeatherData(currentCity);
    startAutoUpdate();
    console.info('✅ Weather Dashboard menggunakan Open-Meteo API (Gratis, tanpa API key)');
    console.info('🌐 API: https://open-meteo.com');
}
function setupEventListeners() {
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.unitToggle.addEventListener('click', toggleUnit);
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    elements.citySearch.addEventListener('input', handleAutocomplete);
    elements.citySearch.addEventListener('focus', handleAutocomplete);
    document.addEventListener('click', (e) => {
        if (!elements.citySearch.contains(e.target)) {
            elements.autocompleteList.classList.remove('active');
        }
    });
    elements.refreshBtn.addEventListener('click', () => {
        elements.refreshBtn.classList.add('loading');
        fetchWeatherData(currentCity);
    });
    elements.favoriteBtn.addEventListener('click', toggleFavorite);
    if (elements.closeBanner) {
        elements.closeBanner.addEventListener('click', () => {
            elements.demoBanner.classList.add('hidden');
            localStorage.setItem('hideDemoBanner', 'true');
        });
    }
    if (elements.apiInfoLink) {
        elements.apiInfoLink.addEventListener('click', (e) => {
            e.preventDefault();
            showApiInfo();
        });
    }
    if (elements.demoBanner) {
        elements.demoBanner.classList.add('hidden');
    }
}
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}
function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}
function toggleUnit() {
    isCelsius = !isCelsius;
    elements.unitToggle.querySelector('.unit-text').textContent = isCelsius ? '°C' : '°F';
    localStorage.setItem('unit', isCelsius ? 'celsius' : 'fahrenheit');
    if (currentCity) {
        fetchWeatherData(currentCity);
    }
}
function convertTemp(temp) {
    if (isCelsius) {
        return Math.round(temp);
    } else {
        return Math.round((temp * 9/5) + 32);
    }
}
function getUnitSymbol() {
    return isCelsius ? 'C' : 'F';
}
function handleAutocomplete() {
    const searchTerm = elements.citySearch.value.toLowerCase().trim();
    if (searchTerm.length < 1) {
        elements.autocompleteList.classList.remove('active');
        return;
    }
    
    const matches = [];
    
    for (const [alias, cityName] of Object.entries(cityNameMapping)) {
        if (alias.includes(searchTerm) || cityName.toLowerCase().includes(searchTerm)) {
            if (!matches.includes(cityName)) {
                matches.push(cityName);
            }
        }
    }
    
    popularCities.forEach(city => {
        if (city.toLowerCase().includes(searchTerm) && !matches.includes(city)) {
            matches.push(city);
        }
    });
    
    const limitedMatches = matches.slice(0, 8);
    
    if (limitedMatches.length > 0) {
        elements.autocompleteList.innerHTML = limitedMatches.map(city => 
            `<div class="autocomplete-item" data-city="${city}">${city}</div>`
        ).join('');
        elements.autocompleteList.classList.add('active');
        elements.autocompleteList.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                elements.citySearch.value = item.dataset.city;
                elements.autocompleteList.classList.remove('active');
                handleSearch();
            });
        });
    } else {
        elements.autocompleteList.classList.remove('active');
    }
}
function handleSearch() {
    const city = elements.citySearch.value.trim();
    if (city) {
        currentCity = city;
        fetchWeatherData(city);
        elements.autocompleteList.classList.remove('active');
    }
}
async function fetchWeatherData(city) {
    showLoading(true);
    hideError();
    try {
        const currentWeather = await fetchCurrentWeather(city);
        const forecast = await fetchForecast(city);
        const hourlyData = await fetchHourlyForecast(city);
        updateCurrentWeather(currentWeather);
        updateForecast(forecast);
        renderHourlyForecast(hourlyData);
        saveWeatherCache(city, { currentWeather, forecast, hourlyData, timestamp: Date.now() });
        updateFavoriteButton();
        showLoading(false);
        elements.refreshBtn.classList.remove('loading');
    } catch (error) {
        console.error('❌ Error fetching weather data:', error);
        const cachedData = loadWeatherCache(city);
        if (cachedData) {
            console.log('📦 Loading from cache:', city);
            updateCurrentWeather(cachedData.currentWeather);
            updateForecast(cachedData.forecast);
            if (cachedData.hourlyData) {
                renderHourlyForecast(cachedData.hourlyData);
            }
            const cacheTime = new Date(cachedData.timestamp).toLocaleString('id-ID');
            showError(`Mode Offline - Data terakhir: ${cacheTime}`);
        } else {
            showError('Gagal memuat data cuaca. Pastikan nama kota benar dan coba lagi.');
        }
        showLoading(false);
        elements.refreshBtn.classList.remove('loading');
    }
}
async function getCityCoordinates(city) {
    const cityLower = city.toLowerCase().trim();
    const mappedCity = cityNameMapping[cityLower] || city;
    const url = `${GEOCODING_API}?name=${encodeURIComponent(mappedCity)}&count=1&language=id&format=json`;
    console.log('🌍 Getting coordinates for:', mappedCity, cityLower !== mappedCity.toLowerCase() ? `(mapped from: ${city})` : '');
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Geocoding error: ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error(`City not found: ${city}`);
    }
    const result = data.results[0];
    console.log('✅ Coordinates found:', result);
    return {
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        country: result.country_code?.toUpperCase() || 'ID'
    };
}
function getWeatherDescription(code) {
    const descriptions = {
        0: { main: 'Clear', description: 'cerah', icon: '01d' },
        1: { main: 'Clear', description: 'cerah sebagian', icon: '01d' },
        2: { main: 'Clouds', description: 'berawan sebagian', icon: '02d' },
        3: { main: 'Clouds', description: 'berawan', icon: '03d' },
        45: { main: 'Fog', description: 'berkabut', icon: '50d' },
        48: { main: 'Fog', description: 'kabut tebal', icon: '50d' },
        51: { main: 'Drizzle', description: 'gerimis ringan', icon: '09d' },
        53: { main: 'Drizzle', description: 'gerimis', icon: '09d' },
        55: { main: 'Drizzle', description: 'gerimis lebat', icon: '09d' },
        61: { main: 'Rain', description: 'hujan ringan', icon: '10d' },
        63: { main: 'Rain', description: 'hujan', icon: '10d' },
        65: { main: 'Rain', description: 'hujan lebat', icon: '10d' },
        71: { main: 'Snow', description: 'salju ringan', icon: '13d' },
        73: { main: 'Snow', description: 'salju', icon: '13d' },
        75: { main: 'Snow', description: 'salju lebat', icon: '13d' },
        77: { main: 'Snow', description: 'butiran salju', icon: '13d' },
        80: { main: 'Rain', description: 'hujan ringan', icon: '09d' },
        81: { main: 'Rain', description: 'hujan', icon: '09d' },
        82: { main: 'Rain', description: 'hujan deras', icon: '09d' },
        85: { main: 'Snow', description: 'salju ringan', icon: '13d' },
        86: { main: 'Snow', description: 'salju lebat', icon: '13d' },
        95: { main: 'Thunderstorm', description: 'badai petir', icon: '11d' },
        96: { main: 'Thunderstorm', description: 'badai petir dengan hujan es', icon: '11d' },
        99: { main: 'Thunderstorm', description: 'badai petir kuat', icon: '11d' }
    };
    return descriptions[code] || { main: 'Unknown', description: 'tidak diketahui', icon: '01d' };
}
async function fetchCurrentWeather(city) {
    try {
        const coords = await getCityCoordinates(city);
        const url = `${WEATHER_API}?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
        console.log('🌤️ Fetching weather for:', coords.name);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        const data = await response.json();
        console.log('✅ Weather data:', data);
        const current = data.current;
        const weatherInfo = getWeatherDescription(current.weather_code);
        return {
            name: coords.name,
            sys: { country: coords.country },
            weather: [weatherInfo],
            main: {
                temp: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                feels_like: current.apparent_temperature
            },
            wind: {
                speed: current.wind_speed_10m / 3.6 
            },
            dt: Math.floor(Date.now() / 1000)
        };
    } catch (error) {
        console.error('❌ Error fetching weather:', error);
        throw error;
    }
}
async function fetchForecast(city) {
    try {
        const coords = await getCityCoordinates(city);
        const url = `${WEATHER_API}?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
        console.log('📅 Fetching forecast for:', coords.name);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Forecast API error: ${response.status}`);
        }
        const data = await response.json();
        console.log('✅ Forecast data:', data);
        const forecastList = [];
        const daily = data.daily;
        for (let i = 1; i < 6; i++) { 
            const weatherInfo = getWeatherDescription(daily.weather_code[i]);
            const date = new Date(daily.time[i]);
            forecastList.push({
                dt: Math.floor(date.getTime() / 1000),
                main: {
                    temp: (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2,
                    temp_min: daily.temperature_2m_min[i],
                    temp_max: daily.temperature_2m_max[i],
                    humidity: 70 
                },
                weather: [weatherInfo],
                wind: { speed: 3 } 
            });
        }
        return { list: forecastList };
    } catch (error) {
        console.error('❌ Error fetching forecast:', error);
        throw error;
    }
}
async function fetchHourlyForecast(city) {
    try {
        const coords = await getCityCoordinates(city);
        const url = `${WEATHER_API}?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=2`;
        console.log('⏰ Fetching hourly forecast for:', coords.name);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Hourly API error: ${response.status}`);
        }
        const data = await response.json();
        console.log('✅ Hourly data:', data);
        return data.hourly;
    } catch (error) {
        console.error('❌ Error fetching hourly:', error);
        throw error;
    }
}
function updateCurrentWeather(data) {
    elements.currentLocation.textContent = `${data.name}, ${data.sys.country}`;
    elements.currentDate.textContent = formatDate(new Date());
    const iconCode = data.weather[0].icon;
    elements.currentIcon.querySelector('img').src = `${ICON_BASE_URL}/${iconCode}@4x.png`;
    elements.currentIcon.querySelector('img').alt = data.weather[0].description;
    elements.currentTemp.textContent = convertTemp(data.main.temp);
    elements.currentCondition.textContent = capitalizeWords(data.weather[0].main);
    elements.currentDescription.textContent = capitalizeWords(data.weather[0].description);
    elements.currentHumidity.textContent = `${data.main.humidity}%`;
    elements.currentWind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    elements.currentFeelsLike.textContent = `${convertTemp(data.main.feels_like)}°${getUnitSymbol()}`;
}
function updateForecast(data) {
    const dailyForecasts = getDailyForecasts(data.list);
    elements.forecastContainer.innerHTML = dailyForecasts.map(forecast => `
        <div class="forecast-card">
            <div class="forecast-date">${formatShortDate(new Date(forecast.dt * 1000))}</div>
            <div class="forecast-day">${getDayName(new Date(forecast.dt * 1000))}</div>
            <div class="forecast-icon">
                <img src="${ICON_BASE_URL}/${forecast.weather[0].icon}@2x.png" 
                     alt="${forecast.weather[0].description}">
            </div>
            <div class="forecast-temp">
                <span class="temp-max">${convertTemp(forecast.main.temp_max)}°</span>
                <span>/</span>
                <span class="temp-min">${convertTemp(forecast.main.temp_min)}°</span>
            </div>
            <div class="forecast-description">${capitalizeWords(forecast.weather[0].description)}</div>
        </div>
    `).join('');
}
function renderHourlyForecast(hourlyData) {
    if (!elements.hourlyContainer) return;
    
    const now = new Date();
    const next12Hours = hourlyData.time
        .map((time, index) => ({
            time: new Date(time),
            temp: hourlyData.temperature_2m[index],
            code: hourlyData.weather_code[index]
        }))
        .filter(item => item.time >= now)
        .slice(0, 8);

    elements.hourlyContainer.innerHTML = next12Hours.map(item => {
        const hour = item.time.getHours();
        const timeStr = hour === 0 ? '00:00' : `${hour}:00`;
        const weatherInfo = getWeatherDescription(item.code);
        
        return `
            <div class="hourly-item">
                <div class="hourly-time">${timeStr}</div>
                <img src="${ICON_BASE_URL}/${weatherInfo.icon}@2x.png" 
                     alt="${weatherInfo.description}" 
                     class="hourly-icon">
                <div class="hourly-temp">${convertTemp(item.temp)}°</div>
            </div>
        `;
    }).join('');
    
    console.log('📊 Hourly forecast rendered');
}
function getDailyForecasts(list) {
    const dailyData = {};
    list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                ...item,
                main: {
                    ...item.main,
                    temp_min: item.main.temp_min,
                    temp_max: item.main.temp_max
                }
            };
        } else {
            dailyData[date].main.temp_min = Math.min(dailyData[date].main.temp_min, item.main.temp_min);
            dailyData[date].main.temp_max = Math.max(dailyData[date].main.temp_max, item.main.temp_max);
        }
    });
    return Object.values(dailyData).slice(0, 5);
}
function toggleFavorite() {
    const cityName = elements.currentLocation.textContent;
    if (isFavorite(cityName)) {
        removeFavorite(cityName);
    } else {
        addFavorite(cityName);
    }
    updateFavoriteButton();
    saveFavorites();
    renderFavorites();
}
function isFavorite(cityName) {
    return favorites.some(fav => fav.name === cityName);
}
function addFavorite(cityName) {
    if (!isFavorite(cityName) && favorites.length < 10) {
        favorites.push({
            name: cityName,
            addedAt: Date.now()
        });
    }
}
function removeFavorite(cityName) {
    favorites = favorites.filter(fav => fav.name !== cityName);
}
function updateFavoriteButton() {
    const cityName = elements.currentLocation.textContent;
    if (isFavorite(cityName)) {
        elements.favoriteBtn.classList.add('active');
    } else {
        elements.favoriteBtn.classList.remove('active');
    }
}
async function renderFavorites() {
    if (favorites.length === 0) {
        elements.favoritesContainer.innerHTML = '<p class="empty-state">Belum ada kota favorit. Tambahkan kota dengan mengklik ikon ♥</p>';
        return;
    }
    elements.favoritesContainer.innerHTML = '';
    for (const favorite of favorites) {
        try {
            const cityName = favorite.name.split(',')[0].trim();
            const weather = await fetchCurrentWeather(cityName);
            const card = document.createElement('div');
            card.className = 'favorite-city-card';
            card.innerHTML = `
                <div class="favorite-city-info" data-city="${cityName}">
                    <div class="favorite-city-name">${favorite.name}</div>
                    <div class="favorite-city-temp">${convertTemp(weather.main.temp)}°${getUnitSymbol()} • ${capitalizeWords(weather.weather[0].description)}</div>
                </div>
                <button class="remove-favorite" data-city="${favorite.name}" aria-label="Remove from favorites">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            `;
            card.querySelector('.favorite-city-info').addEventListener('click', () => {
                currentCity = cityName;
                elements.citySearch.value = cityName;
                fetchWeatherData(cityName);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            card.querySelector('.remove-favorite').addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(favorite.name);
                saveFavorites();
                renderFavorites();
                updateFavoriteButton();
            });
            elements.favoritesContainer.appendChild(card);
        } catch (error) {
            console.error(`Error loading favorite ${favorite.name}:`, error);
        }
    }
}
function loadPreferences() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const savedUnit = localStorage.getItem('unit') || 'celsius';
    isCelsius = savedUnit === 'celsius';
    elements.unitToggle.querySelector('.unit-text').textContent = isCelsius ? '°C' : '°F';
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
        currentCity = savedCity;
        elements.citySearch.value = savedCity;
    }
}
function loadFavorites() {
    const saved = localStorage.getItem('favorites');
    if (saved) {
        try {
            favorites = JSON.parse(saved);
            renderFavorites();
        } catch (error) {
            console.error('Error loading favorites:', error);
            favorites = [];
        }
    }
}
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
function startAutoUpdate() {
    autoUpdateInterval = setInterval(() => {
        console.log('Auto-updating weather data...');
        fetchWeatherData(currentCity);
        renderFavorites();
    }, 300000);
}
function stopAutoUpdate() {
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
    }
}
function showLoading(show) {
    if (show) {
        elements.loading.classList.remove('hidden');
    } else {
        elements.loading.classList.add('hidden');
    }
}
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');
}
function hideError() {
    elements.errorMessage.classList.add('hidden');
}
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}
function formatShortDate(date) {
    const options = { 
        day: 'numeric', 
        month: 'short'
    };
    return date.toLocaleDateString('id-ID', options);
}
function getDayName(date) {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('id-ID', options);
}
function capitalizeWords(str) {
    return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}
function saveWeatherCache(city, data) {
    try {
        const cacheKey = `weather_cache_${city.toLowerCase()}`;
        localStorage.setItem(cacheKey, JSON.stringify(data));
        console.log('💾 Weather data cached for:', city);
    } catch (error) {
        console.error('Failed to save cache:', error);
    }
}
function loadWeatherCache(city) {
    try {
        const cacheKey = `weather_cache_${city.toLowerCase()}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            const ageHours = (Date.now() - data.timestamp) / (1000 * 60 * 60);
            if (ageHours < 24) {
                return data;
            } else {
                localStorage.removeItem(cacheKey);
            }
        }
    } catch (error) {
        console.error('Failed to load cache:', error);
    }
    return null;
}
window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastCity', currentCity);
    stopAutoUpdate();
});
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
window.weatherApp = {
    fetchWeatherData,
    toggleTheme,
    toggleUnit,
    favorites,
    currentCity
};
