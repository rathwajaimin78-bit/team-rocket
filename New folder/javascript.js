// ============================================================
// JavaScript – Regime-Aware AI Monsoon Dashboard
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // 1. THEME TOGGLE
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    let currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 2. MODAL LOGIC
    const modal = document.getElementById('aiModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close-btn');

    function openModal(titleHTML, bodyHTML) {
        modalTitle.innerHTML = titleHTML;
        modalBody.innerHTML = bodyHTML;
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 3. MASTER CITY DATA (16 Cities)
    const cityData = {
        "Ahmedabad": { regime: "Dry / Break", icon: "fa-cloud-sun", heavy: 15, vheavy: 2, bias1: 5.4, bias2: 4.1, temp: "36°C", rain: "0 mm/hr", wind: "12 km/h", risk: "Low", msg: "Stable atmospheric conditions detected. No significant convective activity in the grid." },
        "Mumbai": { regime: "Coastal", icon: "fa-water", heavy: 84, vheavy: 47, bias1: 21.3, bias2: 18.7, temp: "28°C", rain: "34 mm/hr", wind: "35 km/h", risk: "High", msg: "Deep coastal trough active. High probability of localized urban flooding in low-lying areas." },
        "New Delhi": { regime: "Break Monsoon", icon: "fa-cloud-sun", heavy: 12, vheavy: 3, bias1: 7.8, bias2: 6.2, temp: "34°C", rain: "0 mm/hr", wind: "8 km/h", risk: "Low", msg: "Trough shifted to foothills. Isolated heat-induced convection possible but generally dry." },
        "Chennai": { regime: "Depression", icon: "fa-cyclone", heavy: 92, vheavy: 68, bias1: 46.2, bias2: 42.0, temp: "29°C", rain: "70 mm/hr", wind: "65 km/h", risk: "Severe", msg: "Severe cyclonic circulation approaching coast. Extreme rainfall and gale winds expected." },
        "Bengaluru": { regime: "Active Monsoon", icon: "fa-cloud-rain", heavy: 35, vheavy: 10, bias1: 12.1, bias2: 10.5, temp: "23°C", rain: "2 mm/hr", wind: "18 km/h", risk: "Low", msg: "Pleasant drizzle with overcast skies. No major anomalies detected by AI." },
        "Kochi": { regime: "Active Monsoon", icon: "fa-cloud-showers-heavy", heavy: 75, vheavy: 30, bias1: 18.4, bias2: 16.2, temp: "27°C", rain: "22 mm/hr", wind: "25 km/h", risk: "Moderate", msg: "Offshore trough producing sustained moderate rainfall. Minor waterlogging possible." },
        "Kolkata": { regime: "Depression", icon: "fa-bolt", heavy: 60, vheavy: 25, bias1: 28.5, bias2: 24.3, temp: "31°C", rain: "15 mm/hr", wind: "30 km/h", risk: "Moderate", msg: "Scattered severe thunderstorms driven by bay depression. Lightning risk high." },
        "Hyderabad": { regime: "Active Monsoon", icon: "fa-cloud", heavy: 28, vheavy: 5, bias1: 9.6, bias2: 8.2, temp: "30°C", rain: "5 mm/hr", wind: "15 km/h", risk: "Low", msg: "Cloudy with spells of light rain. Standard monsoon progression." },
        "Pune": { regime: "Orographic", icon: "fa-mountain", heavy: 88, vheavy: 55, bias1: 32.1, bias2: 28.4, temp: "25°C", rain: "45 mm/hr", wind: "28 km/h", risk: "High", msg: "Intense orographic lifting along the ghats. Flash flooding and landslide risk elevated." },
        "Jaipur": { regime: "Dry / Break", icon: "fa-sun", heavy: 5, vheavy: 0, bias1: 2.1, bias2: 1.5, temp: "35°C", rain: "0 mm/hr", wind: "10 km/h", risk: "Low", msg: "Hot and dry conditions. Monsoon trough well south of the region." },
        "Lucknow": { regime: "Active Monsoon", icon: "fa-cloud-rain", heavy: 45, vheavy: 15, bias1: 15.2, bias2: 13.8, temp: "32°C", rain: "8 mm/hr", wind: "14 km/h", risk: "Low", msg: "Humid with scattered light rain. Normal agricultural conditions." },
        "Surat": { regime: "Coastal", icon: "fa-water", heavy: 82, vheavy: 42, bias1: 25.6, bias2: 22.1, temp: "29°C", rain: "55 mm/hr", wind: "45 km/h", risk: "Severe", msg: "Coastal squalls and heavy localized dumping. High tide interaction poses flood risk." },
        "Guwahati": { regime: "Orographic", icon: "fa-mountain", heavy: 95, vheavy: 75, bias1: 52.4, bias2: 48.1, temp: "26°C", rain: "60 mm/hr", wind: "20 km/h", risk: "Severe", msg: "Continuous extreme downpour. River catchment areas rapidly filling. Evacuation warning." },
        "Bhopal": { regime: "Active Monsoon", icon: "fa-cloud-showers-heavy", heavy: 55, vheavy: 20, bias1: 14.8, bias2: 12.5, temp: "28°C", rain: "18 mm/hr", wind: "16 km/h", risk: "Moderate", msg: "Widespread moderate rainfall across the grid. Dam levels increasing optimally." },
        "Indore": { regime: "Active Monsoon", icon: "fa-cloud", heavy: 40, vheavy: 12, bias1: 11.2, bias2: 9.8, temp: "27°C", rain: "4 mm/hr", wind: "14 km/h", risk: "Low", msg: "Light showers. AI detects stable variance in rainfall patterns." },
        "Patna": { regime: "Break Monsoon", icon: "fa-cloud-sun", heavy: 18, vheavy: 4, bias1: 6.5, bias2: 5.2, temp: "32°C", rain: "0 mm/hr", wind: "10 km/h", risk: "Low", msg: "Clear skies to partly cloudy. Subdued monsoon activity." }
    };

    let selectedCityId = "Ahmedabad"; // Default

    // 4. DYNAMIC UI UPDATES ON CITY CHANGE
    const citySelector = document.getElementById('citySelector');
    
    // Dynamic Card Elements
    const dynCityName = document.getElementById('dyn-city-name');
    const dynRegimeTxt = document.getElementById('dyn-regime-txt');
    const dynRegimeIcon = document.getElementById('dyn-regime-icon');
    const dynHeavyTxt = document.getElementById('dyn-heavy-txt');
    const dynHeavyBar = document.getElementById('dyn-heavy-bar');
    const dynVheavyTxt = document.getElementById('dyn-vheavy-txt');
    const dynVheavyBar = document.getElementById('dyn-vheavy-bar');
    const dynBias1 = document.getElementById('dyn-bias1');
    const dynBias2 = document.getElementById('dyn-bias2');
    const dynCard = document.getElementById('dynamic-city-card');

    citySelector.addEventListener('change', function(e) {
        selectedCityId = e.target.value;
        const data = cityData[selectedCityId];

        // Update DOM
        dynCityName.innerText = selectedCityId;
        dynRegimeTxt.innerText = data.regime;
        dynRegimeIcon.className = 'fas ' + data.icon;
        
        // The values will naturally get picked up by the 3s interval, but let's set base instantly
        dynHeavyTxt.innerText = data.heavy + '%';
        dynHeavyBar.style.width = data.heavy + '%';
        dynVheavyTxt.innerText = data.vheavy + '%';
        dynVheavyBar.style.width = data.vheavy + '%';
        dynBias1.innerText = data.bias1;
        dynBias2.innerText = data.bias2;

        // Flash Animation
        dynCard.classList.remove('ai-focus-card');
        void dynCard.offsetWidth;
        dynCard.classList.add('ai-focus-card');
    });

    // 5. AI TERMINAL ANALYSIS BUTTON
    const analyzeBtn = document.getElementById('analyzeBtn');

    analyzeBtn.addEventListener('click', function() {
        const data = cityData[selectedCityId];
        
        // Severity styling
        const severityClass = data.risk === 'Severe' || data.risk === 'High' ? 'severity-high' : data.risk === 'Moderate' ? 'severity-med' : 'severity-low';

        // HTML shell for terminal and results
        const shellHTML = `
            <div class="ai-terminal" id="terminal-screen">
                <p id="term-l1" style="display:none">> Connecting to INSAT-3D orbital cluster... <span class="success">[OK]</span></p>
                <p id="term-l2" style="display:none">> Initializing XGBoost localized model for <strong>${selectedCityId}</strong>... <span class="success">[OK]</span></p>
                <p id="term-l3" style="display:none">> Applying orographic and quantile bias-corrections... <span class="success">[DONE]</span></p>
                <p id="term-l4" style="display:none">> Generating probabilistic forecast matrix... <span class="cursor-blink"></span></p>
            </div>
            <div id="ai-results" style="display:none; animation: fadeIn 1s ease;">
                <div class="alert-severity-badge ${severityClass}" style="margin-bottom: 20px;">
                    <i class="fas fa-microchip"></i> AI Report: ${selectedCityId}
                </div>
                
                <div class="weather-detail-grid">
                    <div class="weather-detail-item">
                        <span class="weather-detail-label">Extrapolated Temp</span>
                        <span class="weather-detail-value"><i class="fas fa-thermometer-half"></i> ${data.temp}</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="weather-detail-label">Current Condition</span>
                        <span class="weather-detail-value"><i class="fas ${data.icon}"></i> ${data.regime}</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="weather-detail-label">Rainfall Rate</span>
                        <span class="weather-detail-value"><i class="fas fa-tint"></i> ${data.rain}</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="weather-detail-label">Computed Risk</span>
                        <span class="weather-detail-value"><i class="fas fa-exclamation-triangle"></i> ${data.risk}</span>
                    </div>
                </div>
                <div class="safety-tips" style="margin-top:1.5rem">
                    <h4><i class="fas fa-brain"></i> Neural Insight</h4>
                    <p>${data.msg}</p>
                </div>
            </div>
        `;

        openModal('<i class="fas fa-satellite"></i> XGBoost Neural Interface', shellHTML);

        // Terminal animation sequence
        setTimeout(() => { document.getElementById('term-l1').style.display = 'block'; }, 400);
        setTimeout(() => { document.getElementById('term-l2').style.display = 'block'; }, 1100);
        setTimeout(() => { document.getElementById('term-l3').style.display = 'block'; }, 1800);
        setTimeout(() => { 
            document.getElementById('term-l4').style.display = 'block'; 
        }, 2500);
        setTimeout(() => {
            const cursor = document.querySelector('.cursor-blink');
            if(cursor) cursor.style.display = 'none';
            document.getElementById('ai-results').style.display = 'block';
        }, 3400);
    });

    // 6. GLOBAL EMERGENCY ALERT (Randomizer)
    const earlyWarningBtn = document.getElementById('earlyWarningBtn');
    earlyWarningBtn.addEventListener('click', function() {
        const keys = Object.keys(cityData);
        // Find a random severe/high city
        const severeCities = keys.filter(k => cityData[k].risk === 'Severe' || cityData[k].risk === 'High');
        const alertCity = severeCities[Math.floor(Math.random() * severeCities.length)];
        const data = cityData[alertCity];

        const contentHTML = `
            <div class="alert-severity-badge severity-high">
                <i class="fas fa-exclamation-triangle"></i> 🔴 HIGH ALERT — ${alertCity}
            </div>
            <p style="margin-bottom: 15px;"><strong>Emergency AI Broadcast:</strong> ${data.msg}</p>
            
            <div class="weather-detail-grid">
                <div class="weather-detail-item">
                    <span class="weather-detail-label">Detected Regime</span>
                    <span class="weather-detail-value"><i class="fas ${data.icon}"></i> ${data.regime}</span>
                </div>
                <div class="weather-detail-item">
                    <span class="weather-detail-label">Heavy Rain Prob.</span>
                    <span class="weather-detail-value"><i class="fas fa-percent"></i> ${data.heavy}%</span>
                </div>
                <div class="weather-detail-item">
                    <span class="weather-detail-label">Rainfall Rate</span>
                    <span class="weather-detail-value"><i class="fas fa-tint"></i> ${data.rain}</span>
                </div>
                <div class="weather-detail-item">
                    <span class="weather-detail-label">Est. Wind Speed</span>
                    <span class="weather-detail-value"><i class="fas fa-wind"></i> ${data.wind}</span>
                </div>
            </div>
        `;
        openModal('<i class="fas fa-broadcast-tower"></i> Global Emergency System', contentHTML);
    });

    // 7. LIVE DASHBOARD DATA ANIMATION (Updating Every 3 Seconds)
    function updateValue(id, base, variance, isPercent, barId = null) {
        const el = document.getElementById(id);
        if (!el) return;

        let val = base + (Math.random() * variance * 2 - variance);
        let displayStr = '';

        if (isPercent) {
            val = Math.max(0, Math.min(100, Math.round(val)));
            displayStr = val + '%';
        } else {
            val = Math.max(0, val);
            displayStr = val.toFixed(2);
        }

        el.innerText = displayStr;
        el.classList.remove('value-updated');
        void el.offsetWidth;
        el.classList.add('value-updated');

        if (barId) {
            const bar = document.getElementById(barId);
            if (bar) {
                bar.style.width = displayStr;
                if (isPercent) {
                    bar.className = 'prob-fill';
                    if (val >= 60) bar.classList.add('high');
                    else if (val >= 30) bar.classList.add('med');
                }
            }
        }
    }

    setInterval(() => {
        // Global Stats (4 values)
        updateValue('live-ets', 0.78, 0.04, false);
        updateValue('live-pod', 0.72, 0.05, false);
        updateValue('live-far', 0.21, 0.03, false);
        updateValue('live-fss', 0.69, 0.04, false);
        
        // Dynamic Card using current selected city's base data
        const currentData = cityData[selectedCityId];
        updateValue('dyn-heavy-txt', currentData.heavy, 8, true, 'dyn-heavy-bar');
        updateValue('dyn-vheavy-txt', currentData.vheavy, 4, true, 'dyn-vheavy-bar');
        updateValue('dyn-bias1', currentData.bias1, 1.5, false);
        updateValue('dyn-bias2', currentData.bias2, 1.5, false);
        
        // Delhi Baseline
        updateValue('del-heavy-txt', 12, 5, true, 'del-heavy-bar');
        updateValue('del-vheavy-txt', 3, 2, true, 'del-vheavy-bar');
        updateValue('del-bias1', 7.8, 1, false);
        updateValue('del-bias2', 6.2, 1, false);
        
        // Chennai Baseline
        updateValue('che-heavy-txt', 92, 6, true, 'che-heavy-bar');
        updateValue('che-vheavy-txt', 68, 8, true, 'che-vheavy-bar');
        updateValue('che-bias1', 46.2, 3, false);
        updateValue('che-bias2', 42.0, 3, false);
        
        // Network status glitch
        const nnStatus = document.getElementById('nn-status');
        if (nnStatus && Math.random() > 0.85) {
            nnStatus.innerText = "Processing...";
            nnStatus.style.color = "var(--accent-warning)";
            setTimeout(() => {
                nnStatus.innerText = "Online";
                nnStatus.style.color = "var(--accent-success)";
            }, 600);
        }
    }, 3000);

});
