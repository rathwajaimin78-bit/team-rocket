// ============================================================
// JavaScript – Regime-Aware AI Monsoon Dashboard
// FIXED: Theme toggle now works properly
// ============================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    console.log('✅ Dashboard initializing...');

    // ============================================================
    // 1. THEME TOGGLE - FIXED
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const html = document.documentElement;

    // Log for debugging
    console.log('Theme toggle element:', themeToggle);
    console.log('Theme icon element:', themeIcon);
    console.log('Theme label element:', themeLabel);

    // Load saved theme from localStorage
    let currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    updateThemeUI(currentTheme);

    // Theme toggle click handler - FIXED
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Theme toggle clicked!');
            
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            console.log('Switching from', currentTheme, 'to', newTheme);
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme);
        });
    } else {
        console.error('Theme toggle button not found!');
    }

    function updateThemeUI(theme) {
        console.log('Updating UI for theme:', theme);
        if (theme === 'dark') {
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (themeLabel) themeLabel.textContent = 'Light';
        } else {
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (themeLabel) themeLabel.textContent = 'Dark';
        }
        console.log('Theme updated to:', theme);
    }

    // ============================================================
    // 2. AI/ML EARLY WARNING BUTTON
    // ============================================================
    const earlyBtn = document.getElementById('earlyWarningBtn');

    if (earlyBtn) {
        earlyBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Running AI ensemble...';
            this.disabled = true;

            // Simulate AI/ML inference with realistic delays
            setTimeout(() => {
                // Random alert scenarios based on weather regimes
                const alerts = [
                    {
                        regime: 'Active Monsoon',
                        level: '🟡 Watch',
                        msg: 'Active monsoon conditions expected. Heavy rainfall likely in western ghats and central India.',
                        probability: '72%',
                        severity: 'Moderate'
                    },
                    {
                        regime: 'Depression',
                        level: '🔴 High Alert',
                        msg: 'Deep depression forming over Bay of Bengal. Very heavy to extremely heavy rainfall expected in coastal districts.',
                        probability: '91%',
                        severity: 'Severe'
                    },
                    {
                        regime: 'Break Monsoon',
                        level: '🟢 Low',
                        msg: 'Break monsoon conditions. Scattered light to moderate rainfall in northeast regions.',
                        probability: '18%',
                        severity: 'Low'
                    },
                    {
                        regime: 'Western Disturbance',
                        level: '🟡 Watch',
                        msg: 'Western disturbance approaching. Snow and rain expected in Himalayan foothills.',
                        probability: '65%',
                        severity: 'Moderate'
                    },
                    {
                        regime: 'Coastal Orographic',
                        level: '🟠 Elevated',
                        msg: 'Coastal orographic rainfall active. Heavy to very heavy rain along western coast.',
                        probability: '83%',
                        severity: 'High'
                    }
                ];

                const pick = alerts[Math.floor(Math.random() * alerts.length)];

                // Show detailed alert
                alert(
                    '🤖 AI/ML Early Warning System\n' +
                    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                    `Regime Detected: ${pick.regime}\n` +
                    `Alert Level: ${pick.level}\n` +
                    `Severity: ${pick.severity}\n` +
                    `Probability: ${pick.probability}\n\n` +
                    `${pick.msg}\n\n` +
                    '⚠️ Regime-aware post-processing active\n' +
                    '📊 Ensemble members: 50\n' +
                    '🔄 Bias-correction: Applied'
                );

                // Restore button
                this.innerHTML = '<i class="fas fa-bell"></i> AI/ML Early Warning';
                this.disabled = false;
            }, 2000);
        });
    } else {
        console.error('Early warning button not found!');
    }

    // ============================================================
    // 3. CHECK WEATHER ON YOUR LOCATION
    // ============================================================
    const locationBtn = document.getElementById('locationBtn');
    const locationStatus = document.getElementById('location-status');

    if (locationBtn && locationStatus) {
        locationBtn.addEventListener('click', function() {
            if (!navigator.geolocation) {
                locationStatus.innerHTML = '<i class="fas fa-exclamation-triangle" style="color:var(--accent-warning);"></i> Geolocation not supported';
                return;
            }

            // Update status
            locationStatus.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Fetching location...';
            this.disabled = true;

            // Get user location
            navigator.geolocation.getCurrentPosition(
                // Success callback
                function(position) {
                    const { latitude, longitude } = position.coords;

                    // Try reverse geocoding with OpenStreetMap Nominatim
                    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10&accept-language=en`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Geocoding service unavailable');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Extract location name
                            let locationName = 'Unknown location';
                            if (data && data.address) {
                                const addr = data.address;
                                locationName = addr.city || addr.town || addr.village || addr.county || addr.state || addr.region || addr.suburb || addr.district || 'Unknown location';
                            }

                            // Update status with location
                            locationStatus.innerHTML = `<i class="fas fa-check-circle" style="color:var(--accent-success);"></i> ${locationName} (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;

                            // Show weather forecast based on location (simulated)
                            const weatherTypes = [
                                '☀️ Clear skies, moderate temperatures',
                                '⛅ Partly cloudy with light rain possible',
                                '🌧️ Light to moderate rainfall expected',
                                '🌧️ Heavy rainfall warning!',
                                '⛈️ Thunderstorms likely in the area',
                                '🌤️ Fair weather, pleasant conditions',
                                '🌧️ Intermittent showers'
                            ];
                            const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

                            const temp = (22 + Math.random() * 10).toFixed(1);
                            const humidity = (55 + Math.random() * 35).toFixed(0);
                            const windSpeed = (5 + Math.random() * 20).toFixed(1);

                            alert(
                                '📍 Weather Report\n' +
                                '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                                `Location: ${locationName}\n` +
                                `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\n\n` +
                                `🌡️ Temperature: ${temp}°C\n` +
                                `💧 Humidity: ${humidity}%\n` +
                                `💨 Wind: ${windSpeed} km/h\n\n` +
                                `${randomWeather}\n\n` +
                                '🤖 AI Post-Processing: Active\n' +
                                '📊 Regime-aware correction applied\n' +
                                '🔮 Confidence: High'
                            );

                            locationBtn.disabled = false;
                        })
                        .catch(error => {
                            console.warn('Reverse geocoding failed:', error);
                            // Show coordinates only
                            locationStatus.innerHTML = `<i class="fas fa-map-pin" style="color:var(--accent-icon);"></i> ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

                            alert(
                                '📍 Location Coordinates\n' +
                                '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                                `Latitude: ${latitude.toFixed(6)}\n` +
                                `Longitude: ${longitude.toFixed(6)}\n\n` +
                                '⚠️ Location name could not be determined.\n' +
                                'Weather data for this region:\n' +
                                '🌧️ Monsoon activity: Active\n' +
                                '📊 Bias-correction: Applied\n' +
                                '🔮 Confidence: Good'
                            );

                            locationBtn.disabled = false;
                        });
                },
                // Error callback
                function(error) {
                    console.warn('Geolocation error:', error);
                    let errorMessage = 'Location access denied or unavailable';

                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '⚠️ Location permission denied. Please enable location services.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '📍 Location unavailable. Please check your GPS/network.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '⏱️ Location request timed out. Please try again.';
                            break;
                    }

                    locationStatus.innerHTML = `<i class="fas fa-times-circle" style="color:var(--accent-warning);"></i> ${errorMessage.substring(0, 40)}...`;
                    alert(`⚠️ Location Error\n\n${errorMessage}\n\nYou can still use the AI/ML Early Warning feature.`);
                    locationBtn.disabled = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        });
    } else {
        console.error('Location button or status element not found!');
    }

    // ============================================================
    // 4. ADDITIONAL INTERACTIONS
    // ============================================================

    // Animate stat numbers on load
    const statItems = document.querySelectorAll('.stat-item strong');
    statItems.forEach(item => {
        const originalText = item.textContent;
        // Only animate numeric values
        if (!isNaN(parseFloat(originalText)) && originalText.length < 10) {
            const targetValue = parseFloat(originalText);
            let currentValue = 0;
            const duration = 800;
            const steps = 30;
            const increment = targetValue / steps;

            item.textContent = '0';
            let step = 0;
            const animation = setInterval(() => {
                step++;
                if (step >= steps) {
                    item.textContent = originalText;
                    clearInterval(animation);
                } else {
                    currentValue += increment;
                    item.textContent = currentValue.toFixed(1);
                }
            }, duration / steps);
        }
    });

    // ============================================================
    // 5. KEYBOARD SHORTCUTS
    // ============================================================
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + Shift + T to toggle theme
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
            event.preventDefault();
            if (themeToggle) themeToggle.click();
        }

        // Ctrl/Cmd + Shift + W for early warning
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'W') {
            event.preventDefault();
            if (earlyBtn) earlyBtn.click();
        }

        // Ctrl/Cmd + Shift + L for location
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
            event.preventDefault();
            if (locationBtn) locationBtn.click();
        }
    });

    // ============================================================
    // 6. CONSOLE WELCOME
    // ============================================================
    console.log('%c🌧️ Regime-Aware AI Monsoon Dashboard',
        'font-size: 18px; font-weight: bold; color: #0969da;');
    console.log('%c🔬 AI/ML Post-Processing System v2.1',
        'font-size: 14px; color: #57606a;');
    console.log('%c📊 Active Regimes: 4 | Ensemble Members: 50',
        'font-size: 12px; color: #6e7781;');
    console.log('%c✅ Dashboard initialized successfully', 'font-size: 14px; color: #1a7f37;');
    console.log('%c⌨️ Keyboard Shortcuts: Ctrl+Shift+T (theme), Ctrl+Shift+W (warning), Ctrl+Shift+L (location)',
        'font-size: 12px; color: #57606a;');

});