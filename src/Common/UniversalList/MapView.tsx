import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet using CDN to avoid bundler issues
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    iconSize: [25, 41],
    shadowSize: [41, 41]
});

interface MapViewProps {
    data: any[];
    loading: boolean;
    renderMarker?: (item: any) => React.ReactNode;
    latField?: string;
    lngField?: string;
}

const isValidCoordinate = (lat: number, lng: number) => {
    return !isNaN(lat) && !isNaN(lng) &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180;
};

// Helper to extract nested field value (e.g. "location.lat")
const getFieldValue = (item: any, field: string): number | null => {
    const parts = field.split('.');
    let value: any = item;
    for (const part of parts) {
        if (value == null) return null;
        value = value[part];
    }
    return value != null ? Number(value) : null;
};

// Component to update map center based on data
const MapUpdater = ({ data, latField, lngField }: { data: any[]; latField: string; lngField: string }) => {
    const map = useMap();

    useEffect(() => {
        if (data && data.length > 0) {
            const validCoords = data
                .map(item => {
                    const lat = getFieldValue(item, latField);
                    const lng = getFieldValue(item, lngField);
                    return (lat != null && lng != null && isValidCoordinate(lat, lng)) ? [lat, lng] as L.LatLngTuple : null;
                })
                .filter((c): c is L.LatLngTuple => c !== null);

            console.log(`MapUpdater: Found ${validCoords.length} valid coordinates out of ${data.length} items.`);

            if (validCoords.length > 0) {
                const bounds = L.latLngBounds(validCoords);
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                    console.log('MapUpdater: Fitting bounds to', bounds);
                }
            } else {
                console.warn('MapUpdater: No valid coordinates found to center map.');
            }
        }
    }, [data, map, latField, lngField]);

    return null;
};

const MapView = ({
    data,
    loading,
    renderMarker,
    latField = 'lat',
    lngField = 'lng',
}: MapViewProps) => {

    const defaultCenter: [number, number] = [25.276987, 55.296249]; // Dubai as default
    const zoom = 13;

    // Debugging logs
    useEffect(() => {
        console.log('MapView Data:', data);
        console.log('MapView Fields:', { latField, lngField });
    }, [data, latField, lngField]);

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            {/* Loading overlay for map */}
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(255,255,255,0.6)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <MapContainer center={defaultCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {data && data.map((item, index) => {
                    const lat = getFieldValue(item, latField);
                    const lng = getFieldValue(item, lngField);

                    // Debug individual items
                    if (index < 3) console.log(`Item ${index} coords:`, { lat, lng, raw: item });

                    if (lat == null || lng == null || !isValidCoordinate(lat, lng)) return null;

                    return (
                        <Marker key={index} position={[lat, lng]} icon={DefaultIcon}>
                            <Popup>
                                {renderMarker ? renderMarker(item) : (
                                    <div>
                                        <h6>{item.name || item.title || 'Item'}</h6>
                                        <p>{item.description || item.address}</p>
                                    </div>
                                )}
                            </Popup>
                        </Marker>
                    );
                })}
                <MapUpdater data={data} latField={latField} lngField={lngField} />
            </MapContainer>
        </div>
    );
};

export default MapView;
