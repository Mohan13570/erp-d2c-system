/**
 * LogisticsGPS - Main Application Controller (Full-Stack Client)
 * Connects the Leaflet Map, Chart.js telemetry, scrolling NMEA logs,
 * and anomaly triggers directly to the Node.js Express REST API.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. API Endpoints
    const API_BASE = window.location.origin; // http://localhost:8080
    
    // 2. State Variables
    let selectedShipmentId = "SH-001";
    let shipments = [];
    let telemetryChart = null;
    let activeFilter = "all";
    let searchQuery = "";
    
    // Map objects
    let map = null;
    let tileLayer = null;
    let markers = {};         // shipmentId -> L.marker
    let routeLines = {};      // routeKey -> L.polyline
    
    // Color mapping
    const TYPE_COLORS = {
        marine: "#3b82f6", // Blue
        air: "#06b6d4",    // Cyan
        truck: "#f59e0b",  // Amber
        rail: "#10b981"    // Emerald
    };

    const TYPE_ICONS = {
        marine: "fa-ship",
        air: "fa-plane-departure",
        truck: "fa-truck",
        rail: "fa-train"
    };

    // Predefined routes coordinate waypoints (Latitude, Longitude)
    const ROUTES = {
        shanghai_rotterdam: [
            [31.2304, 121.4737], [22.3964, 114.1095], [10.8231, 106.6297],
            [1.3521, 103.8198], [6.0, 95.0], [7.0, 80.0], [12.5, 52.0],
            [11.9849, 43.1930], [22.0, 38.0], [29.9753, 32.5311], [34.0, 25.0],
            [37.0, 5.0], [36.0, -5.3], [43.0, -9.5], [48.0, -5.0], [51.9244, 4.4777]
        ],
        frankfurt_newyork: [
            [50.0379, 8.5622], [54.0, 0.0], [57.0, -10.0], [61.0, -30.0],
            [58.0, -50.0], [53.0, -60.0], [48.0, -70.0], [40.6413, -73.7781]
        ],
        losangeles_chicago: [
            [34.0522, -118.2437], [35.1983, -111.6513], [35.0844, -106.6504],
            [35.2220, -101.8313], [35.4676, -97.5164], [37.2089, -93.2923],
            [38.6270, -90.1994], [41.8781, -87.6298]
        ],
        xian_duisburg: [
            [34.3416, 108.9398], [43.8256, 87.6168], [43.2220, 76.8512],
            [47.2516, 69.5898], [51.1605, 71.4272], [55.1544, 61.4291],
            [55.7558, 37.6173], [53.9006, 27.5590], [52.2297, 21.0122],
            [52.5200, 13.4050], [51.4344, 6.7623]
        ]
    };

    const ROUTE_NAMES = {
        shanghai_rotterdam: "Maritime Route: Shanghai to Rotterdam",
        frankfurt_newyork: "Air Route: Frankfurt to New York",
        losangeles_chicago: "Overland Route: Los Angeles to Chicago",
        xian_duisburg: "Rail Route: Xi'an to Duisburg Terminal"
    };

    // 3. Initialize Leaflet Map
    function initMap() {
        map = L.map('map', {
            center: [25.0, 10.0],
            zoom: 2,
            minZoom: 2,
            zoomControl: false
        });
        
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Load layer style (CartoDB Dark or Mapbox Satellite if key is supplied)
        loadMapLayer();

        // Draw Route lines on map
        Object.keys(ROUTES).forEach(key => {
            const waypoints = ROUTES[key];
            const type = key === "shanghai_rotterdam" ? "marine" : 
                         key === "frankfurt_newyork" ? "air" : 
                         key === "losangeles_chicago" ? "truck" : "rail";
            const color = TYPE_COLORS[type];
            
            routeLines[key] = L.polyline(waypoints, {
                color: color,
                weight: 3,
                opacity: 0.45,
                dashArray: "6, 8"
            }).addTo(map);
        });

        // Initialize markers placement
        // We will update their positions dynamically once API returns data
        const allWaypoints = Object.values(ROUTES).flat();
        map.fitBounds(L.latLngBounds(allWaypoints), { padding: [40, 40] });
    }

    /**
     * Load Map tile style based on API configs (Mapbox vs OpenSource CartoDB)
     */
    function loadMapLayer() {
        if (tileLayer) {
            map.removeLayer(tileLayer);
        }

        const mapboxToken = localStorage.getItem('mapbox_token');

        if (mapboxToken && mapboxToken.trim() !== '') {
            // Apply premium high-resolution Mapbox Satellite tile server using user's API Key!
            tileLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
                attribution: '© <a href="https://www.mapbox.com/about/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 20,
                tileSize: 512,
                zoomOffset: -1
            });
            console.log("Mapbox Satellite Streets Layer loaded successfully using API Token.");
        } else {
            // Fallback to open-source CartoDB Dark tile server (no key required)
            tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            });
            console.log("OpenSource CartoDB Dark Matter Layer loaded (No API token).");
        }

        tileLayer.addTo(map);
    }

    /**
     * Create HTML code for a custom marker with glowing ring & type icon
     */
    function createMarkerIconHtml(s) {
        const iconClass = TYPE_ICONS[s.type];
        const alertClass = s.status === "Alert" ? "alert-state" : "";
        return `
            <div class="custom-gps-marker ${s.type} ${alertClass}" id="marker-${s.id}">
                <div class="marker-ping-ring"></div>
                <div class="marker-pin-wrapper">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
            </div>
        `;
    }

    /**
     * Generate HTML for marker popups
     */
    function createPopupContent(s) {
        const routeName = ROUTE_NAMES[s.routeKey] || "";
        return `
            <div class="popup-details">
                <div class="popup-title">${s.name} (${s.id})</div>
                <div class="popup-row">Status: <strong>${s.status}</strong></div>
                <div class="popup-row">Route: <strong>${routeName.split(': ')[1]}</strong></div>
                <div class="popup-row">Speed: <strong>${s.speedKmh} km/h</strong></div>
                <div class="popup-row">Temp: <strong>${s.sensors.temp.toFixed(1)} °C</strong></div>
            </div>
        `;
    }

    // 4. Initialize Telemetry Chart (Chart.js)
    function initChart() {
        const ctx = document.getElementById('telemetryChart').getContext('2d');
        
        telemetryChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => i + 1), // 1 to 30 pings
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        yAxisID: 'y-temp',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 1,
                        fill: true
                    },
                    {
                        label: 'G-Force Shock (G)',
                        yAxisID: 'y-shock',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#94a3b8',
                            font: { family: 'Outfit', size: 11 }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: { color: '#64748b', font: { family: 'Outfit', size: 10 } }
                    },
                    'y-temp': {
                        type: 'linear',
                        position: 'left',
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: { color: '#ef4444', font: { family: 'Outfit', size: 10 } },
                        title: {
                            display: true,
                            text: 'Temperature (°C)',
                            color: '#ef4444',
                            font: { family: 'Outfit', size: 11 }
                        }
                    },
                    'y-shock': {
                        type: 'linear',
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#3b82f6', font: { family: 'Outfit', size: 10 } },
                        title: {
                            display: true,
                            text: 'Shock Level (G)',
                            color: '#3b82f6',
                            font: { family: 'Outfit', size: 11 }
                        }
                    }
                }
            }
        });
    }

    // 5. Select Cargo shipment
    function selectShipment(id) {
        selectedShipmentId = id;
        
        // Update styling of sidebar items
        document.querySelectorAll('.shipment-card').forEach(card => {
            if (card.dataset.id === id) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Pan map view to selected shipment coordinate
        const s = shipments.find(item => item.id === id);
        if (s) {
            map.panTo([s.lat, s.lon]);
            
            // Highlight route polyline
            Object.keys(routeLines).forEach(key => {
                const isSelectedRoute = (key === s.routeKey);
                routeLines[key].setStyle({
                    weight: isSelectedRoute ? 5 : 3,
                    opacity: isSelectedRoute ? 0.95 : 0.45
                });
            });

            // Update details
            updateTelemetryDisplay(s);
            updateSimulationControlButtons(s);
            fetchNmeaLogs(s.id);
        }
    }

    // 6. Update UI Telemetry Cards
    function updateTelemetryDisplay(s) {
        // Selected Shipment Label
        const routeName = ROUTE_NAMES[s.routeKey] || "";
        document.getElementById('selected-cargo-label').innerHTML = `
            <i class="fa-solid ${TYPE_ICONS[s.type]}"></i> 
            <strong>${s.name} (${s.id})</strong> &mdash; ${routeName.split(': ')[1]}
        `;

        // Update raw text cards
        const cardTemp = document.getElementById('card-temp');
        const cardHumidity = document.getElementById('card-humidity');
        const cardShock = document.getElementById('card-shock');
        const cardBattery = document.getElementById('card-battery');
        const cardLatch = document.getElementById('card-latch');

        // Check limits
        const isTempBreached = (s.id === "SH-002" && (s.sensors.temp > 8.0 || s.sensors.temp < 2.0)) || 
                               (s.id !== "SH-002" && s.sensors.temp > 35.0);
        const isShockBreached = s.sensors.shock > 1.5;
        const isLatchTampered = !s.sensors.latchClosed;

        // Set Card classes & Values
        setCardValue(cardTemp, `${s.sensors.temp.toFixed(1)} °C`, s.id === "SH-002" ? "Cold: 2-8°C" : "Target: <35°C", isTempBreached);
        setCardValue(cardHumidity, `${s.sensors.humidity.toFixed(1)} %`, s.id === "SH-002" ? "Target: 45-55%" : "Target: 40-70%", false);
        setCardValue(cardShock, `${s.sensors.shock.toFixed(2)} G`, "Max allowed: 1.5G", isShockBreached);
        setCardValue(cardBattery, `${s.sensors.battery.toFixed(1)} %`, "Capacity remaining", s.sensors.battery < 20);
        
        const latchValText = s.sensors.latchClosed ? "SECURED" : "BREACHED";
        setCardValue(cardLatch, latchValText, "Security Latch", isLatchTampered);

        // Fetch history for Chart.js from API
        fetch(`${API_BASE}/api/gps/shipments/${s.id}/history`)
            .then(res => res.json())
            .then(history => {
                if (telemetryChart && history) {
                    telemetryChart.data.datasets[0].data = history.temp || [];
                    telemetryChart.data.datasets[1].data = history.shock || [];
                    telemetryChart.update();
                }
            })
            .catch(err => console.error("Error fetching historical charts:", err));
    }

    function setCardValue(cardEl, value, range, isAlert) {
        cardEl.querySelector('.sensor-value').textContent = value;
        cardEl.querySelector('.sensor-range').textContent = range;
        if (isAlert) {
            cardEl.classList.add('alert');
        } else {
            cardEl.classList.remove('alert');
        }
    }

    // Enable/disable anomaly controls based on shipment state
    function updateSimulationControlButtons(s) {
        const btns = document.querySelectorAll('.btn-anomaly');
        const btnResolve = document.getElementById('btn-resolve-alerts');

        if (s.status === "Delivered") {
            btns.forEach(b => b.disabled = true);
            btnResolve.disabled = true;
        } else {
            btns.forEach(b => b.disabled = false);
            btnResolve.disabled = s.alerts.length === 0;
        }
    }

    // 7. Render Tracking List Sidebar
    function renderShipmentList() {
        const container = document.getElementById('shipment-list');
        
        // Filter & Search shipments
        const filteredShipments = shipments.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery) || 
                                  s.id.toLowerCase().includes(searchQuery) ||
                                  s.description.toLowerCase().includes(searchQuery);
            if (!matchesSearch) return false;

            if (activeFilter === "all") return true;
            if (activeFilter === "transit") return s.status === "In Transit" || s.status === "Delayed";
            if (activeFilter === "alert") return s.status === "Alert";
            if (activeFilter === "delivered") return s.status === "Delivered";
            return true;
        });

        // Generate HTML
        let html = '';
        if (filteredShipments.length === 0) {
            html = `<div class="empty-alerts">No active shipments match query.</div>`;
        } else {
            filteredShipments.forEach(s => {
                const routeName = ROUTE_NAMES[s.routeKey] || "";
                const typeIcon = TYPE_ICONS[s.type];
                const activeClass = s.id === selectedShipmentId ? "active" : "";
                const alertClass = s.status === "Alert" ? "card-alert" : "";
                const statusLabelClass = s.status.toLowerCase().replace(" ", "-");

                html += `
                    <div class="shipment-card ${activeClass} ${alertClass}" data-id="${s.id}">
                        <div class="card-header">
                            <span class="cargo-id">${s.id}</span>
                            <span class="status-badge ${statusLabelClass}">${s.status}</span>
                        </div>
                        <div class="cargo-name">
                            <i class="fa-solid ${typeIcon}"></i> ${s.name}
                        </div>
                        <div class="cargo-route">
                            <i class="fa-solid fa-arrows-left-right"></i>
                            <span>${routeName.split(': ')[1]}</span>
                        </div>
                        <div class="cargo-footer-stats">
                            <div class="card-stat">
                                <i class="fa-solid fa-gauge-simple"></i>
                                <span>${s.speedKmh} km/h</span>
                            </div>
                            <div class="card-stat">
                                <i class="fa-solid fa-temperature-three-quarters"></i>
                                <span>${s.sensors.temp.toFixed(1)}°C</span>
                            </div>
                            <div class="card-stat">
                                <i class="fa-solid fa-battery-half"></i>
                                <span>${s.sensors.battery.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        container.innerHTML = html;

        // Add event listeners
        container.querySelectorAll('.shipment-card').forEach(card => {
            card.addEventListener('click', () => {
                selectShipment(card.dataset.id);
            });
        });
    }

    // 8. Fetch NMEA Sentence logs from REST API
    function fetchNmeaLogs(id) {
        const consoleEl = document.getElementById('nmea-console-log');
        if (!consoleEl) return;

        fetch(`${API_BASE}/api/gps/shipments/${id}/nmea`)
            .then(res => res.json())
            .then(nmeaArray => {
                if (!nmeaArray || nmeaArray.length === 0) {
                    consoleEl.innerHTML = '<div class="terminal-line system-line">[SYSTEM] Waiting for device telemetry stream...</div>';
                    return;
                }
                
                consoleEl.innerHTML = '';
                nmeaArray.forEach(line => {
                    const lineEl = document.createElement('div');
                    lineEl.className = 'terminal-line';
                    lineEl.textContent = `[${id}] ${line}`;
                    
                    if (line.includes("*") && (line.includes("GPGGA") && (line.includes("03") || line.includes("5.4")))) {
                        // Mark anomaly line
                        lineEl.classList.add('alert-line');
                    }
                    consoleEl.appendChild(lineEl);
                });
                consoleEl.scrollTop = consoleEl.scrollHeight;
            })
            .catch(err => console.error("Error reading NMEA UART logs:", err));
    }

    // 9. Update global summary numbers
    function updateGlobalStats() {
        const activeAlertCount = shipments.filter(s => s.status === "Alert").length;
        const deliveredCount = shipments.filter(s => s.status === "Delivered").length;
        
        document.getElementById('stat-total').textContent = shipments.length;
        document.getElementById('stat-alerts').textContent = activeAlertCount;
        document.getElementById('stat-delivered').textContent = deliveredCount;
        
        const alertPill = document.querySelector('.stat-pill.warning');
        if (activeAlertCount > 0) {
            alertPill.classList.add('alert-pulse');
            alertPill.style.borderColor = 'var(--color-danger)';
        } else {
            alertPill.classList.remove('alert-pulse');
            alertPill.style.borderColor = 'var(--border-color)';
        }
    }

    // 10. Update Alerts log table
    function updateAlertsLog() {
        const tbody = document.getElementById('alerts-log-body');
        let html = '';
        const allAlerts = [];

        shipments.forEach(s => {
            if (s.alerts && Array.isArray(s.alerts)) {
                s.alerts.forEach(a => {
                    allAlerts.push({
                        id: s.id,
                        name: s.name,
                        ...a
                    });
                });
            }
        });

        if (allAlerts.length === 0) {
            html = `
                <tr>
                    <td colspan="5" class="empty-alerts">No active warnings or alerts on the selected shipment.</td>
                </tr>
            `;
        } else {
            allAlerts.forEach(a => {
                const severityClass = a.level.toLowerCase();
                const resolvedText = a.resolved ? '<span class="status-badge delivered">RESOLVED</span>' : '<span class="status-badge alert">ACTIVE</span>';
                const rowClass = a.resolved ? '' : `row-${severityClass}`;

                html += `
                    <tr class="${rowClass}">
                        <td style="font-family:var(--font-mono); font-size:12px;">${a.timestamp}</td>
                        <td><strong>${a.id}</strong> (${a.name})</td>
                        <td class="severity-cell ${severityClass}">${a.level}</td>
                        <td>${a.message}</td>
                        <td>${resolvedText}</td>
                    </tr>
                `;
            });
        }

        tbody.innerHTML = html;
    }

    // 11. Core Simulation Loop (Updates Map, Sidebar list, chart, terminal stream)
    function runSimulationStep() {
        // Clock update
        const now = new Date();
        document.getElementById('simulation-clock').textContent = now.toLocaleTimeString();

        // 1. Fetch latest state from REST API
        fetch(`${API_BASE}/api/gps/shipments`)
            .then(res => res.json())
            .then(data => {
                shipments = data;

                // 2. Update Map Markers Positions & Popups
                shipments.forEach(s => {
                    let marker = markers[s.id];
                    if (!marker) {
                        // Create marker dynamically if missing
                        const iconHtml = createMarkerIconHtml(s);
                        const customIcon = L.divIcon({
                            html: iconHtml,
                            className: 'custom-gps-marker-container',
                            iconSize: [40, 40],
                            iconAnchor: [20, 20]
                        });
                        marker = L.marker([s.lat, s.lon], { icon: customIcon }).addTo(map);
                        marker.bindPopup(createPopupContent(s), { offset: [0, -10] });
                        marker.on('click', () => selectShipment(s.id));
                        markers[s.id] = marker;
                    } else {
                        // Move marker position smoothly
                        marker.setLatLng([s.lat, s.lon]);
                        marker.setPopupContent(createPopupContent(s));
                    }

                    // Update marker alert glow
                    const markerDom = document.getElementById(`marker-${s.id}`);
                    if (markerDom) {
                        if (s.status === "Alert") {
                            markerDom.classList.add('alert-state');
                        } else {
                            markerDom.classList.remove('alert-state');
                        }
                    }
                });

                // 3. Render dashboard segments
                renderShipmentList();
                updateGlobalStats();
                updateAlertsLog();

                // 4. If current shipment is selected, update console and widgets
                const s = shipments.find(item => item.id === selectedShipmentId);
                if (s) {
                    // Update sensor metrics
                    const cardTemp = document.getElementById('card-temp');
                    const cardHumidity = document.getElementById('card-humidity');
                    const cardShock = document.getElementById('card-shock');
                    const cardBattery = document.getElementById('card-battery');
                    const cardLatch = document.getElementById('card-latch');

                    const isTempBreached = (s.id === "SH-002" && (s.sensors.temp > 8.0 || s.sensors.temp < 2.0)) || 
                                           (s.id !== "SH-002" && s.sensors.temp > 35.0);
                    const isShockBreached = s.sensors.shock > 1.5;
                    const isLatchTampered = !s.sensors.latchClosed;

                    setCardValue(cardTemp, `${s.sensors.temp.toFixed(1)} °C`, s.id === "SH-002" ? "Cold: 2-8°C" : "Target: <35°C", isTempBreached);
                    setCardValue(cardHumidity, `${s.sensors.humidity.toFixed(1)} %`, s.id === "SH-002" ? "Target: 45-55%" : "Target: 40-70%", false);
                    setCardValue(cardShock, `${s.sensors.shock.toFixed(2)} G`, "Max allowed: 1.5G", isShockBreached);
                    setCardValue(cardBattery, `${s.sensors.battery.toFixed(1)} %`, "Capacity remaining", s.sensors.battery < 20);
                    setCardValue(cardLatch, s.sensors.latchClosed ? "SECURED" : "BREACHED", "Security Latch", isLatchTampered);

                    updateSimulationControlButtons(s);
                    fetchNmeaLogs(s.id);
                }
            })
            .catch(err => console.error("Error communicating with tracking server:", err));
    }

    // Run poll every 1 second
    setInterval(runSimulationStep, 1000);

    // 12. Setup UI Handlers
    
    // Tab Switching
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            trigger.classList.add('active');
            const targetTab = trigger.dataset.tab;
            document.getElementById(`tab-${targetTab}`).classList.add('active');

            if (targetTab === 'telemetry' && telemetryChart) {
                telemetryChart.resize();
                telemetryChart.update();
            }
        });
    });

    // Anomaly Injection Event triggers (POST request to server)
    document.querySelectorAll('.btn-anomaly').forEach(btn => {
        btn.addEventListener('click', () => {
            const anomalyType = btn.dataset.anomaly;
            
            fetch(`${API_BASE}/api/gps/alerts/trigger`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedShipmentId, type: anomalyType })
            })
            .then(res => res.json())
            .then(data => {
                console.log(`Anomaly ${anomalyType} queued in server database.`);
                // Trigger instant poll to show warning
                runSimulationStep();
            })
            .catch(err => console.error("Error queueing anomaly:", err));
        });
    });

    // Reset Cargo GPS unit / Clear Alerts (POST request to server)
    const btnResolveAlerts = document.getElementById('btn-resolve-alerts');
    btnResolveAlerts.addEventListener('click', () => {
        fetch(`${API_BASE}/api/gps/alerts/resolve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedShipmentId })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Device telemetry alerts marked as resolved.");
            runSimulationStep();
        })
        .catch(err => console.error("Error resolving alerts:", err));
    });

    // Clear Terminal local logs
    document.getElementById('btn-clear-terminal').addEventListener('click', () => {
        const consoleEl = document.getElementById('nmea-console-log');
        if (consoleEl) {
            consoleEl.innerHTML = '<div class="terminal-line system-line">[SYSTEM] Terminal console log buffer cleared.</div>';
        }
    });

    // Search bar filter
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderShipmentList();
    });

    // Filter Pill clicks
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            activeFilter = pill.dataset.filter;
            renderShipmentList();
        });
    });

    // Modal Control Handlers
    const modal = document.getElementById('map-config-modal');
    const btnOpenModal = document.getElementById('btn-map-config');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnSaveModal = document.getElementById('btn-save-map-config');
    const mapboxInput = document.getElementById('mapbox-token-input');

    btnOpenModal.addEventListener('click', () => {
        // Load current key if set
        mapboxInput.value = localStorage.getItem('mapbox_token') || '';
        modal.classList.add('open');
    });

    btnCloseModal.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    // Close when clicking backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    btnSaveModal.addEventListener('click', () => {
        const token = mapboxInput.value.trim();
        localStorage.setItem('mapbox_token', token);
        modal.classList.remove('open');
        // Reload map styles layers
        loadMapLayer();
    });

    // 13. Initialize App
    initMap();
    initChart();
    
    // Initial fetch to load first set of coordinates
    fetch(`${API_BASE}/api/gps/shipments`)
        .then(res => res.json())
        .then(data => {
            shipments = data;
            selectShipment(selectedShipmentId);
            runSimulationStep();
        })
        .catch(err => console.error("Initial load connection failed:", err));
});
