import Leaflet from "leaflet"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from "react";

// Leaflet.Icon.Default.imagePath = "../node_modules/leaflet";

// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete Leaflet.Icon.Default.prototype._getIconUrl;

const defaultIcon = new Leaflet.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// component to fix map resizing issues
const MapRevalidator = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);
    return null;
};

export const EcommerceMap = ({ style, data }: any) => {

    const defaultLat = 39.0742;
    const defaultLng = 21.8243;
    const zoom = 6;

    let center: [number, number] = [defaultLat, defaultLng];
    if (data && data.length > 0 && data[0].addressLatitude && data[0].addressLongitude) {
        center = [data[0].addressLatitude, data[0].addressLongitude];
    } else if (data && data.addressLatitude && data.addressLongitude) {
        // Handle single object passed as data
        center = [data.addressLatitude, data.addressLongitude];
    }

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ width: "100%", height: "100%", minHeight: "400px", ...style }}
            className="leaflet-map"
        >
            <MapRevalidator />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {Array.isArray(data) ? data.map((item: any, index: number) => {
                const latitude = item.addressLatitude;
                const longitude = item.addressLongitude;
                if (latitude && longitude) {
                    return <Marker key={index} position={[latitude, longitude]} icon={defaultIcon}></Marker>
                }
                return null;
            }) : (data && data.addressLatitude && data.addressLongitude && (
                <Marker position={[data.addressLatitude, data.addressLongitude]} icon={defaultIcon}></Marker>
            ))}
        </MapContainer>
    )
}