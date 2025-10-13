/**
 * CyberThreatMap - Interactive threat visualization module
 * A robust implementation of a Leaflet-based threat visualization map
 */
const CyberThreatMap = (() => {
    // Private state
    let mapInstance = null;
    let markers = null;
    let updateInterval = null;
    let isInitialized = false;
    let threatData = [];
    
    // Default configuration with professional styling
    const defaultConfig = {
        mapOptions: {
            center: [7.3697, 12.3547], // Center on Cameroon
            zoom: 7,
            minZoom: 6, // Restrict minimum zoom to keep focus on Cameroon
            maxZoom: 18, // Allow higher zoom for street details
            zoomControl: false, // We'll add custom controls
            attributionControl: false,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            dragging: true,
            maxBounds: [[1.5, 8.0], [13.5, 16.5]], // Strict Cameroon boundaries
            maxBoundsViscosity: 1.0, // Strong boundary enforcement
            zoomAnimation: true,
            fadeAnimation: true,
            markerZoomAnimation: true,
            transform3DLimit: 2^23
        },
        // High-quality street map with cities and roads
        tileLayer: {
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            options: {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 18
            }
        },
        updateInterval: 8000, // 8 seconds for more dynamic feel
        initialThreats: 12,
        maxThreats: 35,
        threatTypes: [
            { name: 'phishing', label: 'Phishing', icon: '🎣', weight: 3 },
            { name: 'malware', label: 'Malware', icon: '🦠', weight: 4 },
            { name: 'ddos', label: 'DDoS Attack', icon: '⚡', weight: 3 },
            { name: 'data_breach', label: 'Data Breach', icon: '🔓', weight: 5 },
            { name: 'ransomware', label: 'Ransomware', icon: '🔒', weight: 5 },
            { name: 'social_engineering', label: 'Social Engineering', icon: '🎭', weight: 2 },
            { name: 'cryptojacking', label: 'Cryptojacking', icon: '⛏️', weight: 3 },
            { name: 'account_takeover', label: 'Account Takeover', icon: '👤', weight: 4 }
        ],
        cities: [
            { name: 'Yaoundé', lat: 3.8480, lng: 11.5021, population: 2440462 },
            { name: 'Douala', lat: 4.0511, lng: 9.7679, population: 1906962 },
            { name: 'Garoua', lat: 7.3697, lng: 12.3547, population: 436899 },
            { name: 'Bamenda', lat: 5.9631, lng: 10.1591, population: 393835 },
            { name: 'Maroua', lat: 10.5833, lng: 14.2000, population: 319941 },
            { name: 'Ngaoundéré', lat: 6.1319, lng: 12.3991, population: 231357 },
            { name: 'Bafoussam', lat: 5.4667, lng: 10.4167, population: 290768 },
            { name: 'Bertoua', lat: 3.5167, lng: 12.1167, population: 218111 },
            { name: 'Kumba', lat: 4.6333, lng: 9.4500, population: 144268 },
            { name: 'Edéa', lat: 3.8000, lng: 10.1333, population: 203149 }
        ],
        // Cameroon coordinate boundaries
        cameroonBounds: {
            north: 13.083333,
            south: 1.65,
            east: 16.2,
            west: 8.5
        },
        // Professional severity levels with gradients and animations
        severities: [
            { 
                level: 'low', 
                color: '#10B981', 
                glowColor: 'rgba(16, 185, 129, 0.6)',
                icon: '🟢', 
                radius: 8,
                pulseRadius: 12,
                animationDuration: 2000
            },
            { 
                level: 'medium', 
                color: '#F59E0B', 
                glowColor: 'rgba(245, 158, 11, 0.6)',
                icon: '🟡', 
                radius: 12,
                pulseRadius: 18,
                animationDuration: 1500
            },
            { 
                level: 'high', 
                color: '#EF4444', 
                glowColor: 'rgba(239, 68, 68, 0.6)',
                icon: '🔴', 
                radius: 16,
                pulseRadius: 24,
                animationDuration: 1000
            },
            { 
                level: 'critical', 
                color: '#DC2626', 
                glowColor: 'rgba(220, 38, 38, 0.8)',
                icon: '🚨', 
                radius: 20,
                pulseRadius: 30,
                animationDuration: 800
            }
        ],
        // Animation settings
        animations: {
            markerAppear: {
                duration: 800,
                easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            },
            markerPulse: {
                duration: 2000,
                iterations: 'infinite'
            },
            threatUpdate: {
                duration: 600,
                easing: 'ease-in-out'
            }
        }
    };

    // Private methods
    const createMap = (elementId, config) => {
        try {
            // Create map instance with professional styling
            mapInstance = L.map(elementId, config.mapOptions);
            
            // Add layer switcher for better map visibility
            addLayerSwitcher();
            
            // Add custom CSS for professional styling
            addCustomMapStyles();
            
            // Initialize marker cluster group with professional styling
            if (typeof L.markerClusterGroup === 'function') {
                markers = L.markerClusterGroup({
                    maxClusterRadius: 50,
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    iconCreateFunction: function(cluster) {
                        const count = cluster.getChildCount();
                        let className = 'marker-cluster-small';
                        if (count > 10) className = 'marker-cluster-medium';
                        if (count > 20) className = 'marker-cluster-large';
                        
                        return new L.DivIcon({
                            html: `<div class="cluster-inner"><span>${count}</span></div>`,
                            className: `marker-cluster ${className}`,
                            iconSize: new L.Point(40, 40)
                        });
                    }
                });
                mapInstance.addLayer(markers);
                console.log('✅ Professional marker clustering enabled');
            } else {
                console.warn('⚠️ Marker clustering not available, using simple markers');
                markers = L.featureGroup().addTo(mapInstance);
            }
            
            // Add professional custom controls
            addMapControls();
            
            // Add map event listeners for smooth interactions
            addMapEventListeners();
            
            return mapInstance;
        } catch (error) {
            console.error('Failed to create map:', error);
            throw error;
        }
    };
    
    // Add layer switching functionality for better map visibility
    const addLayerSwitcher = () => {
        const baseLayers = {
            "Streets (Detailed)": L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 18
            }),
            "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                maxZoom: 18
            }),
            "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }),
            "CartoDB Light": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            })
        };

        // Add the default layer
        baseLayers["Streets (Detailed)"].addTo(mapInstance);
        
        // Add layer control
        L.control.layers(baseLayers).addTo(mapInstance);
        
        return baseLayers;
    };

    // Add custom CSS styles for professional appearance
    const addCustomMapStyles = () => {
        if (document.getElementById('threat-map-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'threat-map-styles';
        style.textContent = `
            /* Professional Map Container */
            .leaflet-container {
                background: #f8f9fa !important;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                overflow: hidden;
            }
            
            /* Layer Control Styling */
            .leaflet-control-layers {
                background: rgba(255, 255, 255, 0.95) !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                border: none !important;
            }
            
            .leaflet-control-layers-toggle {
                background-image: none !important;
                background-color: #4c94be !important;
                border-radius: 6px !important;
                width: 36px !important;
                height: 36px !important;
            }
            
            .leaflet-control-layers-toggle:after {
                content: '🗺️';
                font-size: 16px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            /* Professional Marker Clusters */
            .marker-cluster {
                background: linear-gradient(135deg, #4c94be, #2563eb);
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(76, 148, 190, 0.4);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .marker-cluster:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(76, 148, 190, 0.6);
            }
            
            .cluster-inner {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
            }
            
            .cluster-inner span {
                color: white;
                font-weight: 600;
                font-size: 12px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            }
            
            .marker-cluster-small { width: 30px; height: 30px; }
            .marker-cluster-medium { width: 40px; height: 40px; }
            .marker-cluster-large { width: 50px; height: 50px; }
            
            /* Animated Threat Markers */
            .threat-marker {
                border-radius: 50%;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: visible;
            }
            
            .threat-marker::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border-radius: 50%;
                background: inherit;
                opacity: 0.3;
                animation: pulse 2s infinite;
                z-index: -1;
            }
            
            .threat-marker.critical::before {
                animation: pulse-critical 1s infinite;
            }
            
            .threat-marker.high::before {
                animation: pulse-high 1.5s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.3; }
                50% { transform: scale(1.5); opacity: 0.1; }
                100% { transform: scale(2); opacity: 0; }
            }
            
            @keyframes pulse-critical {
                0% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(2); opacity: 0.2; }
                100% { transform: scale(3); opacity: 0; }
            }
            
            @keyframes pulse-high {
                0% { transform: scale(1); opacity: 0.4; }
                50% { transform: scale(1.8); opacity: 0.15; }
                100% { transform: scale(2.5); opacity: 0; }
            }
            
            /* Professional Popups */
            .leaflet-popup-content-wrapper {
                background: rgba(10, 25, 47, 0.95) !important;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(76, 148, 190, 0.3);
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                color: #e6f1ff;
            }
            
            .leaflet-popup-tip {
                background: rgba(10, 25, 47, 0.95) !important;
                border: 1px solid rgba(76, 148, 190, 0.3);
                border-top: none;
                border-right: none;
            }
            
            .threat-popup {
                padding: 16px;
                min-width: 280px;
            }
            
            .threat-popup h4 {
                margin: 0 0 12px 0;
                color: #4c94be;
                font-size: 18px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .threat-popup .severity-badge {
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .severity-low { background: rgba(16, 185, 129, 0.2); color: #10B981; }
            .severity-medium { background: rgba(245, 158, 11, 0.2); color: #F59E0B; }
            .severity-high { background: rgba(239, 68, 68, 0.2); color: #EF4444; }
            .severity-critical { background: rgba(220, 38, 38, 0.2); color: #DC2626; }
            
            /* Professional Controls */
            .leaflet-control {
                border: none !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
                background: rgba(10, 25, 47, 0.9) !important;
                backdrop-filter: blur(10px);
            }
            
            .leaflet-control a {
                background: transparent !important;
                color: #4c94be !important;
                border: none !important;
                transition: all 0.3s ease;
            }
            
            .leaflet-control a:hover {
                background: rgba(76, 148, 190, 0.2) !important;
                color: #5ba3d0 !important;
                transform: scale(1.05);
            }
            
            /* Loading Animation */
            .map-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                color: #4c94be;
                font-size: 18px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .loading-spinner {
                width: 24px;
                height: 24px;
                border: 2px solid rgba(76, 148, 190, 0.3);
                border-top: 2px solid #4c94be;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Additional Professional Styling */
            .threat-legend {
                background: rgba(10, 25, 47, 0.95) !important;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(76, 148, 190, 0.3);
                border-radius: 12px;
                padding: 16px;
                color: #e6f1ff;
                min-width: 180px;
            }
            
            .legend-header h4 {
                margin: 0 0 12px 0;
                color: #4c94be;
                font-size: 16px;
                font-weight: 600;
            }
            
            .legend-items {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .legend-item {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
            }
            
            .legend-icon {
                font-size: 16px;
                margin-right: 8px;
                display: inline-block;
                width: 20px;
                text-align: center;
            }
            
            .threat-info-control {
                background: rgba(10, 25, 47, 0.95) !important;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(76, 148, 190, 0.3);
                border-radius: 8px;
                padding: 10px;
                color: #e6f1ff;
                min-width: 120px;
                font-size: 12px;
                z-index: 1000 !important;
            }
            
            .info-header {
                display: flex;
                align-items: center;
                gap: 4px;
                margin-bottom: 6px;
                font-weight: 600;
                color: #4c94be;
                font-size: 9px;
            }
            
            .status-indicator {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #10B981;
                animation: pulse-indicator 2s infinite;
            }
            
            @keyframes pulse-indicator {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            
            .info-stats {
                display: flex;
                gap: 10px;
            }
            
            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .stat-value {
                font-size: 14px;
                font-weight: 700;
                color: #4c94be;
            }
            
            .stat-label {
                font-size: 9px;
                color: #a8b2d1;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            
            /* Enhanced Professional Popup Styling */
            .popup-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(76, 148, 190, 0.2);
            }
            
            .threat-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .threat-title h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #4c94be;
            }
            
            .threat-icon {
                font-size: 18px;
            }
            
            .popup-content {
                margin-bottom: 16px;
            }
            
            .threat-meta {
                margin-bottom: 12px;
            }
            
            .meta-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
                padding: 4px 0;
            }
            
            .meta-label {
                font-size: 12px;
                color: #a8b2d1;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .meta-value {
                font-size: 13px;
                color: #e6f1ff;
                font-weight: 500;
            }
            
            .status-active {
                color: #EF4444;
            }
            
            .status-resolved {
                color: #10B981;
            }
            
            .threat-description {
                background: rgba(76, 148, 190, 0.1);
                border-radius: 6px;
                padding: 10px;
                margin-top: 8px;
            }
            
            .threat-description p {
                margin: 0;
                font-size: 13px;
                line-height: 1.4;
                color: #e6f1ff;
            }
            
            .popup-footer {
                padding-top: 12px;
                border-top: 1px solid rgba(76, 148, 190, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .threat-id {
                font-size: 11px;
                color: #a8b2d1;
                font-family: monospace;
                font-weight: 600;
            }
            
            .threat-priority {
                font-size: 11px;
                color: #4c94be;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            /* Notification Menu Styling */
            .notification-menu {
                background: rgba(10, 25, 47, 0.95) !important;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(76, 148, 190, 0.3);
                border-radius: 8px;
                margin-top: 8px;
                color: #e6f1ff;
                min-width: 280px;
                max-width: 320px;
                font-size: 12px;
            }
            
            .notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                border-bottom: 1px solid rgba(76, 148, 190, 0.2);
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            .notification-header:hover {
                background: rgba(76, 148, 190, 0.1);
            }
            
            .xyberclan-logo {
                font-size: 14px;
                margin-right: 8px;
            }
            
            .notification-header span {
                flex: 1;
                font-weight: 600;
                font-size: 11px;
                color: #4c94be;
            }
            
            .notification-toggle {
                color: #a8b2d1;
                transition: transform 0.3s ease;
            }
            
            .notification-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
            }
            
            .notification-content.expanded {
                max-height: 200px;
                overflow-y: auto;
            }
            
            .notification-list {
                padding: 8px;
            }
            
            .resolved-threat-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 6px 8px;
                margin-bottom: 4px;
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.2);
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .resolved-threat-item:hover {
                background: rgba(16, 185, 129, 0.15);
                transform: translateX(2px);
            }
            
            .resolved-threat-info {
                display: flex;
                flex-direction: column;
                flex: 1;
            }
            
            .resolved-threat-type {
                font-size: 11px;
                font-weight: 600;
                color: #10B981;
                margin-bottom: 2px;
            }
            
            .resolved-threat-location {
                font-size: 10px;
                color: #a8b2d1;
            }
            
            .resolved-threat-time {
                font-size: 9px;
                color: #10B981;
                font-weight: 500;
            }
            
            .resolved-threat-icon {
                font-size: 12px;
                margin-right: 6px;
            }
            
            .no-resolved-threats {
                text-align: center;
                padding: 16px;
                color: #a8b2d1;
                font-size: 11px;
                font-style: italic;
            }
            
            /* Click Animation */
            @keyframes markerClick {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
            
            /* Map Loading State */
            .map-loading-state {
                position: relative;
                overflow: hidden;
            }
            
            .map-loading-state::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(76, 148, 190, 0.1), transparent);
                animation: loading-sweep 2s infinite;
                z-index: 1000;
            }
            
            @keyframes loading-sweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Notification Menu Styles */
            .notification-menu {
                background: rgba(15, 23, 42, 0.98);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(76, 148, 190, 0.4);
                border-radius: 8px;
                margin-top: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(76, 148, 190, 0.1);
                overflow: hidden;
                transition: all 0.3s ease;
                max-width: 280px;
                min-width: 250px;
                z-index: 1000 !important;
            }
            
            .notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                background: linear-gradient(135deg, rgba(76, 148, 190, 0.15), rgba(76, 148, 190, 0.08));
                border-bottom: 1px solid rgba(76, 148, 190, 0.25);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .notification-header:hover {
                background: rgba(76, 148, 190, 0.15);
            }
            
            .xybershield-logo {
                font-size: 16px;
                margin-right: 8px;
                filter: drop-shadow(0 0 4px rgba(76, 148, 190, 0.5));
            }
            
            .notification-header span {
                color: #e2e8f0;
                font-weight: 600;
                font-size: 11px;
                flex: 1;
            }
            
            .notification-toggle {
                color: #4c94be;
                font-size: 12px;
                transition: transform 0.3s ease;
                padding: 4px;
                border-radius: 4px;
            }
            
            .notification-toggle:hover {
                background: rgba(76, 148, 190, 0.2);
            }
            
            .notification-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
            }
            
            .notification-content.expanded {
                max-height: 400px;
            }
            
            .notification-list {
                padding: 8px;
                max-height: 350px;
                overflow-y: auto;
            }
            
            .notification-list::-webkit-scrollbar {
                width: 4px;
            }
            
            .notification-list::-webkit-scrollbar-track {
                background: rgba(15, 23, 42, 0.5);
            }
            
            .notification-list::-webkit-scrollbar-thumb {
                background: rgba(76, 148, 190, 0.5);
                border-radius: 2px;
            }
            
            .resolved-threat-item {
                background: rgba(22, 78, 99, 0.08);
                border: 1px solid rgba(76, 148, 190, 0.15);
                border-radius: 4px;
                margin-bottom: 4px;
                padding: 6px 8px;
                transition: all 0.2s ease;
            }
            
            .resolved-threat-item:hover {
                background: rgba(22, 78, 99, 0.2);
                border-color: rgba(76, 148, 190, 0.4);
                transform: translateY(-1px);
            }
            
            .resolved-threat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
            }
            
            .threat-type-badge {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 9px;
                font-weight: 600;
            }
            
            .threat-type-badge.critical {
                background: rgba(239, 68, 68, 0.2);
                color: #fca5a5;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }
            
            .threat-type-badge.high {
                background: rgba(245, 101, 101, 0.2);
                color: #fbb6ce;
                border: 1px solid rgba(245, 101, 101, 0.3);
            }
            
            .threat-type-badge.medium {
                background: rgba(251, 191, 36, 0.2);
                color: #fde68a;
                border: 1px solid rgba(251, 191, 36, 0.3);
            }
            
            .threat-type-badge.low {
                background: rgba(34, 197, 94, 0.2);
                color: #bbf7d0;
                border: 1px solid rgba(34, 197, 94, 0.3);
            }
            
            .resolved-badge {
                background: rgba(34, 197, 94, 0.2);
                color: #bbf7d0;
                padding: 1px 4px;
                border-radius: 3px;
                font-size: 8px;
                font-weight: 600;
                border: 1px solid rgba(34, 197, 94, 0.3);
            }
            
            .resolved-threat-details {
                font-size: 9px;
                color: #cbd5e1;
            }
            
            .threat-location {
                display: flex;
                align-items: center;
                gap: 3px;
                margin-bottom: 3px;
                color: #4c94be;
                font-weight: 500;
                font-size: 9px;
            }
            
            .resolution-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 3px;
                border-top: 1px solid rgba(76, 148, 190, 0.08);
            }
            
            .resolved-by {
                color: #4c94be;
                font-weight: 700;
                font-size: 8px;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            
            .resolved-time {
                color: #94a3b8;
                font-size: 8px;
            }
            
            .no-resolved-threats {
                text-align: center;
                padding: 20px;
                color: #64748b;
            }
            
            .no-threats-icon {
                font-size: 24px;
                margin-bottom: 8px;
                opacity: 0.5;
            }
            
            .no-threats-text {
                font-size: 12px;
                font-style: italic;
            }
            
            /* Enhanced Threat Popup Styles */
            .leaflet-popup-content-wrapper {
                background: rgba(15, 23, 42, 0.98) !important;
                backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(76, 148, 190, 0.4) !important;
                border-radius: 12px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(76, 148, 190, 0.2) !important;
                padding: 0 !important;
                z-index: 10000 !important;
            }
            
            .leaflet-popup-content {
                margin: 0 !important;
                font-family: 'Inter', sans-serif !important;
            }
            
            .leaflet-popup {
                z-index: 10000 !important;
            }
            
            .leaflet-popup-pane {
                z-index: 10000 !important;
            }
            
            .leaflet-popup-close-button {
                color: #94a3b8 !important;
                font-size: 16px !important;
                font-weight: bold !important;
                right: 8px !important;
                top: 8px !important;
                width: 20px !important;
                height: 20px !important;
                background: rgba(76, 148, 190, 0.1) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.2s ease !important;
                z-index: 10001 !important;
            }
            
            .leaflet-popup-close-button:hover {
                background: rgba(76, 148, 190, 0.2) !important;
                color: #e2e8f0 !important;
            }
            
            .threat-popup {
                color: #e2e8f0;
                font-size: 11px;
                line-height: 1.4;
                min-width: 220px;
                max-width: 250px;
            }
            
            .popup-header {
                background: linear-gradient(135deg, rgba(76, 148, 190, 0.15), rgba(76, 148, 190, 0.08));
                padding: 10px 12px;
                border-bottom: 1px solid rgba(76, 148, 190, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 12px 12px 0 0;
            }
            
            .threat-title {
                display: flex;
                align-items: center;
                gap: 6px;
                flex: 1;
            }
            
            .threat-title h4 {
                margin: 0;
                font-size: 12px;
                font-weight: 700;
                color: #e2e8f0;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }
            
            .threat-icon {
                font-size: 14px;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
            }
            
            .severity-badge {
                padding: 3px 6px;
                border-radius: 4px;
                font-size: 8px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: 1px solid;
            }
            
            .severity-critical {
                background: rgba(239, 68, 68, 0.2);
                color: #fca5a5;
                border-color: rgba(239, 68, 68, 0.4);
            }
            
            .severity-high {
                background: rgba(245, 101, 101, 0.2);
                color: #fbb6ce;
                border-color: rgba(245, 101, 101, 0.4);
            }
            
            .severity-medium {
                background: rgba(251, 191, 36, 0.2);
                color: #fde68a;
                border-color: rgba(251, 191, 36, 0.4);
            }
            
            .severity-low {
                background: rgba(34, 197, 94, 0.2);
                color: #bbf7d0;
                border-color: rgba(34, 197, 94, 0.4);
            }
            
            .popup-content {
                padding: 10px 12px;
            }
            
            .threat-meta {
                margin-bottom: 8px;
            }
            
            .meta-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
                padding: 2px 0;
            }
            
            .meta-label {
                font-size: 9px;
                color: #94a3b8;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            
            .meta-value {
                font-size: 10px;
                color: #e2e8f0;
                font-weight: 500;
                text-align: right;
            }
            
            .status-active {
                color: #fca5a5 !important;
            }
            
            .status-resolved {
                color: #bbf7d0 !important;
            }
            
            .threat-description {
                background: rgba(22, 78, 99, 0.1);
                border: 1px solid rgba(76, 148, 190, 0.15);
                border-radius: 6px;
                padding: 8px;
                margin-bottom: 8px;
            }
            
            .threat-description p {
                margin: 0;
                font-size: 9px;
                line-height: 1.4;
                color: #cbd5e1;
            }
            
            .popup-footer {
                background: rgba(10, 25, 47, 0.5);
                padding: 8px 12px;
                border-top: 1px solid rgba(76, 148, 190, 0.15);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 0 0 12px 12px;
            }
            
            .threat-id {
                font-size: 8px;
                color: #4c94be;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .threat-priority {
                font-size: 8px;
                color: #94a3b8;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    };
    
    const addMapControls = () => {
        // Professional zoom controls with custom styling
        L.control.zoom({
            position: 'bottomright',
            zoomInTitle: 'Zoom avant',
            zoomOutTitle: 'Zoom arrière'
        }).addTo(mapInstance);
        
        // Custom scale control
        L.control.scale({
            imperial: false,
            metric: true,
            position: 'bottomleft'
        }).addTo(mapInstance);
        
      
        
        // Add custom info control with dynamic values
        const infoControl = L.control({ position: 'topleft' });
        infoControl.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'threat-info-control');
            div.innerHTML = `
                <div class="info-header">
                    <div class="status-indicator"></div>
                    <span>Surveillance en Temps Réel</span>
                </div>
                <div class="info-stats">
                    <div class="stat-item">
                        <span class="stat-value" id="map-active-threats">0</span>
                        <span class="stat-label">Actives</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="map-total-threats">0</span>
                        <span class="stat-label">Total</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="map-resolved-threats">0</span>
                        <span class="stat-label">Résolues</span>
                    </div>
                </div>
            `;
            return div;
        };
        infoControl.addTo(mapInstance);
        
        // Add notification menu for resolved threats
        const notificationControl = L.control({ position: 'topleft' });
        notificationControl.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'notification-menu');
            div.innerHTML = `
                <div class="notification-header">
                    <div class="xybershield-logo">🛡️</div>
                    <span>XyberShield - Menaces Résolues</span>
                    <div class="notification-toggle" id="notification-toggle">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                <div class="notification-content" id="notification-content">
                    <div class="notification-list" id="resolved-threats-list">
                        <!-- Resolved threats will be populated here -->
                    </div>
                </div>
            `;
            
            // Add toggle functionality
            const toggle = div.querySelector('#notification-toggle');
            const content = div.querySelector('#notification-content');
            let isExpanded = false;
            
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                isExpanded = !isExpanded;
                content.classList.toggle('expanded', isExpanded);
                toggle.innerHTML = isExpanded ? 
                    '<i class="fas fa-chevron-up"></i>' : 
                    '<i class="fas fa-chevron-down"></i>';
            });
            
            return div;
        };
        notificationControl.addTo(mapInstance);
    };
    
    // Add map event listeners for smooth interactions
    const addMapEventListeners = () => {
        // Update threat counter on map movement
        mapInstance.on('moveend zoomend', updateThreatCounterForCurrentView);
        
        // Add smooth zoom animations
        mapInstance.on('zoomstart', () => {
            mapInstance.getContainer().style.cursor = 'wait';
        });
        
        mapInstance.on('zoomend', () => {
            mapInstance.getContainer().style.cursor = '';
        });
        
        // Add loading states for better UX
        mapInstance.on('loading', () => {
            const container = mapInstance.getContainer();
            container.classList.add('map-loading-state');
        });
        
        mapInstance.on('load', () => {
            const container = mapInstance.getContainer();
            container.classList.remove('map-loading-state');
        });
    };
    
    const generateRandomThreat = () => {
        const type = defaultConfig.threatTypes[
            Math.floor(Math.random() * defaultConfig.threatTypes.length)
        ];
        const severity = defaultConfig.severities[
            Math.floor(Math.random() * defaultConfig.severities.length)
        ];
        const city = defaultConfig.cities[
            Math.floor(Math.random() * defaultConfig.cities.length)
        ];
        
        // Use city coordinates with small random offset for realistic positioning
        const baseCoords = city;
        const latOffset = (Math.random() - 0.5) * 0.1; // Small offset around city
        const lngOffset = (Math.random() - 0.5) * 0.1;
        
        return {
            id: Date.now() + Math.random(),
            type: type.name,
            typeLabel: type.label,
            typeIcon: type.icon,
            severity: severity.level,
            severityConfig: severity,
            city: city.name,
            lat: baseCoords.lat + latOffset,
            lng: baseCoords.lng + lngOffset,
            timestamp: Date.now(),
            status: Math.random() > 0.3 ? 'active' : 'resolved',
            description: generateThreatDescription(type, severity, city)
        };
    };
    
    const generateThreatDescription = (type, severity, city) => {
        const descriptions = {
            phishing: [
                `Tentative de phishing détectée ciblant les services bancaires`,
                `Campagne d'hameçonnage par email en cours`,
                `Site web frauduleux imitant des services gouvernementaux`
            ],
            malware: [
                `Propagation de malware via pièces jointes`,
                `Trojan bancaire détecté sur le réseau`,
                `Logiciel malveillant ciblant les données personnelles`
            ],
            ddos: [
                `Attaque DDoS sur infrastructure critique`,
                `Surcharge malveillante des serveurs`,
                `Déni de service distribué en cours`
            ],
            data_breach: [
                `Violation de données personnelles détectée`,
                `Accès non autorisé aux bases de données`,
                `Fuite d'informations sensibles confirmée`
            ],
            ransomware: [
                `Attaque de rançongiciel en cours`,
                `Chiffrement malveillant des fichiers système`,
                `Demande de rançon détectée`
            ]
        };
        
        const typeDescriptions = descriptions[type.name] || ['Menace cybernétique détectée'];
        const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
        
        return `${description} dans la région de ${city.name}`;
    };
    
    const createThreatMarker = (threat) => {
        const severity = threat.severityConfig;
        
        // Create animated marker with professional styling
        const marker = L.circleMarker([threat.lat, threat.lng], {
            radius: severity.radius,
            fillColor: severity.color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
            className: `threat-marker ${threat.severity} ${threat.status}`
        });
        
        // Add glow effect for active threats
        if (threat.status === 'active') {
            marker.setStyle({
                shadowSize: severity.pulseRadius,
                shadowBlur: 15,
                shadowColor: severity.glowColor
            });
        }
        
        // Create professional popup with enhanced styling
        const timeAgo = getTimeAgo(threat.timestamp);
        const statusIcon = threat.status === 'active' ? '🔴' : '✅';
        const statusText = threat.status === 'active' ? 'Actif' : 'Résolu';
        
        const popupContent = `
            <div class="threat-popup">
                <div class="popup-header">
                    <div class="threat-title">
                        <span class="threat-icon">${threat.typeIcon}</span>
                        <h4>${threat.typeLabel}</h4>
                    </div>
                    <div class="severity-badge severity-${threat.severity}">
                        ${threat.severity.toUpperCase()}
                    </div>
                </div>
                <div class="popup-content">
                    <div class="threat-meta">
                        <div class="meta-row">
                            <span class="meta-label">Localisation</span>
                            <span class="meta-value">${threat.city}, Cameroun</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Statut</span>
                            <span class="meta-value status-${threat.status}">${statusIcon} ${statusText}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Détecté</span>
                            <span class="meta-value">${timeAgo}</span>
                        </div>
                    </div>
                    <div class="threat-description">
                        <p>${threat.description}</p>
                    </div>
                </div>
                <div class="popup-footer">
                    <div class="threat-id">Incident #${threat.id.toString().slice(-6).toUpperCase()}</div>
                    <div class="threat-priority">Priorité: ${threat.severity === 'critical' ? 'Critique' : threat.severity === 'high' ? 'Élevée' : threat.severity === 'medium' ? 'Moyenne' : 'Faible'}</div>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup',
            closeButton: true,
            autoClose: false,
            closeOnEscapeKey: true,
            keepInView: true,
            autoPan: true
        });
        
        // Add hover effects
        marker.on('mouseover', function() {
            this.setStyle({
                radius: severity.radius * 1.2,
                weight: 3
            });
        });
        
        marker.on('mouseout', function() {
            this.setStyle({
                radius: severity.radius,
                weight: 2
            });
        });
        
        // Add click animation
        marker.on('click', function() {
            const element = this.getElement();
            if (element) {
                element.style.animation = 'none';
                element.offsetHeight; // Trigger reflow
                element.style.animation = 'markerClick 0.3s ease-out';
            }
        });
        
        return marker;
    };
    
    // Helper function to get human-readable time ago
    const getTimeAgo = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours}h`;
        return `Il y a ${days}j`;
    };
    
    const updateThreats = () => {
        try {
            // Randomly add or remove threats
            if (threatData.length < defaultConfig.maxThreats && Math.random() > 0.7) {
                // Add new threat
                const newThreat = generateRandomThreat();
                threatData.push(newThreat);
                const marker = createThreatMarker(newThreat);
                markers.addLayer(marker);
            } else if (threatData.length > 5 && Math.random() > 0.8) {
                // Remove random threat
                const index = Math.floor(Math.random() * threatData.length);
                const [removed] = threatData.splice(index, 1);
                markers.eachLayer(layer => {
                    if (layer.getLatLng().equals(removed.coordinates)) {
                        markers.removeLayer(layer);
                    }
                });
            }
            
            // Update threat counter
            updateThreatCounter();
            
        } catch (error) {
            console.error('Error updating threats:', error);
        }
    };
    
    const updateThreatCounter = () => {
        try {
            const activeThreats = threatData.filter(t => t.status === 'active').length;
            const resolvedThreats = threatData.filter(t => t.status === 'resolved').length;
            const totalThreats = threatData.length;
            
            // Calculate threats in last hour
            const oneHourAgo = Date.now() - 3600000;
            const threatsLastHour = threatData.filter(t => t.timestamp > oneHourAgo).length;
            
            // Calculate unique countries affected (all threats have Cameroon cities)
            const uniqueCities = [...new Set(threatData.map(t => t.city))];
            const countriesAffected = uniqueCities.length > 0 ? 1 : 0; // Only Cameroon for now
            
            // Update main threat counter
            const threatCounter = document.getElementById('threat-counter');
            if (threatCounter) {
                threatCounter.innerHTML = `
                    <div class="threat-count">
                        <span class="active-count">${activeThreats}</span>
                        <span class="total-count">/ ${totalThreats} menaces</span>
                    </div>
                    <div class="threat-label">en temps réel</div>
                `;
                
                threatCounter.classList.add('updated');
                setTimeout(() => threatCounter.classList.remove('updated'), 300);
            }
            
            // Update map control values
            const mapActiveThreats = document.getElementById('map-active-threats');
            const mapTotalThreats = document.getElementById('map-total-threats');
            const mapResolvedThreats = document.getElementById('map-resolved-threats');
            
            if (mapActiveThreats) mapActiveThreats.textContent = activeThreats;
            if (mapTotalThreats) mapTotalThreats.textContent = totalThreats;
            if (mapResolvedThreats) mapResolvedThreats.textContent = resolvedThreats;
            
            // Update main page statistics
            const totalThreatsElement = document.getElementById('totalThreats');
            const activeCountriesElement = document.getElementById('activeCountries');
            const threatsLastHourElement = document.getElementById('threatsLastHour');
            
            if (totalThreatsElement) {
                totalThreatsElement.textContent = totalThreats;
                totalThreatsElement.classList.add('updated');
                setTimeout(() => totalThreatsElement.classList.remove('updated'), 300);
            }
            
            if (activeCountriesElement) {
                activeCountriesElement.textContent = countriesAffected;
                activeCountriesElement.classList.add('updated');
                setTimeout(() => activeCountriesElement.classList.remove('updated'), 300);
            }
            
            if (threatsLastHourElement) {
                threatsLastHourElement.textContent = threatsLastHour;
                threatsLastHourElement.classList.add('updated');
                setTimeout(() => threatsLastHourElement.classList.remove('updated'), 300);
            }
            
            // Update last updated time
            const lastUpdatedElement = document.querySelector('#last-updated span');
            if (lastUpdatedElement) {
                const now = new Date();
                const timeString = now.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                });
                lastUpdatedElement.textContent = timeString;
                
                // Add visual feedback
                const lastUpdatedContainer = document.getElementById('last-updated');
                if (lastUpdatedContainer) {
                    lastUpdatedContainer.classList.add('updated');
                    setTimeout(() => lastUpdatedContainer.classList.remove('updated'), 300);
                }
            }
            
            // Update DERNIER HEURE section
            const dernierHeureSection = document.querySelector('.dernier-heure');
            if (dernierHeureSection) {
                const recentThreats = threatData
                    .filter(t => t.timestamp > Date.now() - 3600000) // Last hour
                    .slice(0, 3);
                
                const threatsList = dernierHeureSection.querySelector('.threats-list');
                if (threatsList && recentThreats.length > 0) {
                    threatsList.innerHTML = recentThreats.map(threat => `
                        <div class="threat-item">
                            <div class="threat-icon">${threat.typeIcon}</div>
                            <div class="threat-info">
                                <div class="threat-type">${threat.typeLabel}</div>
                                <div class="threat-location">${threat.city}, Cameroun</div>
                                <div class="threat-time">${new Date(threat.timestamp).toLocaleTimeString('fr-FR')}</div>
                            </div>
                        </div>
                    `).join('');
                }
            }
            
            // Update notification menu with resolved threats by XyberClan
            updateResolvedThreatsNotification();
        } catch (error) {
            console.error('❌ Error updating threat counter:', error);
        }
    };
    
    const updateResolvedThreatsNotification = () => {
        try {
            const resolvedThreatsContainer = document.getElementById('resolved-threats-list');
            if (!resolvedThreatsContainer) return;
            
            // Get resolved threats attributed to XyberShield (simulate XyberShield resolution)
            const resolvedByXyberShield = threatData
                .filter(threat => threat.status === 'resolved')
                .map(threat => ({
                    ...threat,
                    resolvedBy: 'XyberShield',
                    resolvedAt: threat.timestamp + Math.random() * 3600000 // Simulate resolution time
                }))
                .sort((a, b) => b.resolvedAt - a.resolvedAt) // Most recent first
                .slice(0, 5); // Show only last 5 resolved threats
            
            if (resolvedByXyberShield.length === 0) {
                resolvedThreatsContainer.innerHTML = `
                    <div class="no-resolved-threats">
                        <div class="no-threats-icon">🛡️</div>
                        <div class="no-threats-text">Aucune menace résolue récemment</div>
                    </div>
                `;
                return;
            }
            
            resolvedThreatsContainer.innerHTML = resolvedByXyberShield.map(threat => `
                <div class="resolved-threat-item">
                    <div class="resolved-threat-header">
                        <div class="threat-type-badge ${threat.severity}">
                            <span class="threat-icon">${threat.typeIcon}</span>
                            <span class="threat-type">${threat.typeLabel}</span>
                        </div>
                        <div class="resolution-status">
                            <span class="resolved-badge">✓ Résolu</span>
                        </div>
                    </div>
                    <div class="resolved-threat-details">
                        <div class="threat-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${threat.city}
                        </div>
                        <div class="resolution-info">
                            <span class="resolved-by">XyberShield</span>
                            <span class="resolved-time">${getTimeAgo(threat.resolvedAt)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('❌ Error updating resolved threats notification:', error);
        }
    };

    const updateThreatCounterForCurrentView = () => {
        try {
            if (!mapInstance) return;
            
            const bounds = mapInstance.getBounds();
            const visibleThreats = threatData.filter(threat => {
                const latLng = L.latLng(threat.lat, threat.lng);
                return bounds.contains(latLng);
            });
            
            const threatCounter = document.getElementById('threat-counter');
            if (threatCounter) {
                const activeVisibleThreats = visibleThreats.filter(t => 
                    t.status === 'active' || t.status === 'new'
                ).length;
                
                const zoom = mapInstance.getZoom();
                const viewInfo = zoom > 8 ? 'zone actuelle' : 'Cameroun';
                
                threatCounter.innerHTML = `
                    <div class="threat-count">
                        <span class="active-count">${activeVisibleThreats}</span>
                        <span class="total-count">/ ${visibleThreats.length} menaces</span>
                    </div>
                    <div class="threat-label">${viewInfo}</div>
                    <div class="zoom-info">Zoom: ${zoom}</div>
                `;
                
                threatCounter.classList.add('updated');
                setTimeout(() => threatCounter.classList.remove('updated'), 300);
            }
        } catch (error) {
            console.error('❌ Error updating threat counter for current view:', error);
        }
    };        
                    
    // Public API
    return {
        /**
         * Initialize the threat map
         * @param {string} elementId - ID of the map container
         * @param {Object} userConfig - Optional configuration overrides
         * @returns {Promise} Resolves when initialization is complete
         */
        init: function(elementId, userConfig = {}) {
            return new Promise((resolve, reject) => {
                try {
                    if (isInitialized) {
                        console.warn('ThreatMap is already initialized');
                        return resolve(this);
                    }
                    
                    console.log('🚀 Initializing CyberThreatMap...');
                    
                    // Merge configs
                    const config = {
                        ...defaultConfig,
                        mapOptions: {
                            ...defaultConfig.mapOptions,
                            ...(userConfig.mapOptions || {})
                        },
                        ...userConfig
                    };
                    
                    // Create map
                    createMap(elementId, config);
                    
                    // Hide loading indicator
                    const loadingElement = document.getElementById('map-loading');
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                    
                    // Generate initial threats
                    for (let i = 0; i < config.initialThreats; i++) {
                        const threat = generateRandomThreat();
                        threatData.push(threat);
                        const marker = createThreatMarker(threat);
                        markers.addLayer(marker);
                    }
                    
                    // Set up periodic updates
                    updateInterval = setInterval(updateThreats, config.updateInterval);
                    
                    // Update UI
                    updateThreatCounter();
                    
                    isInitialized = true;
                    console.log('✅ CyberThreatMap initialized successfully');
                    
                    // Dispatch custom event
                    const event = new CustomEvent('cyberthreatmap:ready', { 
                        detail: { 
                            map: mapInstance,
                            threatData: [...threatData]
                        } 
                    });
                    document.dispatchEvent(event);
                    
                    resolve(this);
                    
                } catch (error) {
                    console.error('❌ Failed to initialize CyberThreatMap:', error);
                    reject(error);
                }
            });
        },
        
        /**
         * Get the Leaflet map instance
         * @returns {L.Map|null} The Leaflet map instance or null if not initialized
         */
        getMap: function() {
            return mapInstance;
        },
        
        /**
         * Check if the map is initialized
         * @returns {boolean} True if initialized, false otherwise
         */
        isInitialized: function() {
            return isInitialized;
        },
        
        /**
         * Get current threat data
         * @returns {Array} Array of threat objects
         */
        getThreatData: function() {
            return [...threatData];
        },
        
        /**
         * Clean up and destroy the map
         */
        destroy: function() {
            console.log('♻️ Cleaning up CyberThreatMap...');
            
            // Clear update interval
            if (updateInterval) {
                clearInterval(updateInterval);
                updateInterval = null;
            }
            
            // Remove map instance
            if (mapInstance) {
                mapInstance.remove();
                mapInstance = null;
            }
            
            // Clear data
            threatData = [];
            isInitialized = false;
            
            console.log('✅ CyberThreatMap cleaned up successfully');
        }
    };
})();

// Check for required dependencies
function checkDependencies() {
    if (typeof L === 'undefined') {
        console.error('❌ Leaflet is not loaded');
        return false;
    }
    
    if (typeof L.markerClusterGroup !== 'function') {
        console.warn('⚠️ Leaflet.markercluster is not loaded, some features may be limited');
    }
    
    return true;
}

// Export the CyberThreatMap
if (typeof module !== 'undefined' && module.exports) {
    // Node/CommonJS
    module.exports = { CyberThreatMap };
} else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], () => ({ CyberThreatMap }));
} else {
    // Browser globals
    window.CyberThreatMap = CyberThreatMap;
}

// Auto-initialization when loaded directly in browser
if (typeof window !== 'undefined') {
    const initialize = () => {
        const mapElement = document.querySelector('[data-threat-map]');
        if (mapElement) {
            const elementId = mapElement.id || 'threatMap';
            const config = mapElement.dataset.config ? JSON.parse(mapElement.dataset.config) : {};
            CyberThreatMap.init(elementId, config);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
}
