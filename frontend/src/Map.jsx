import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

const MapUpdater = ({ position, fixedZoom }) => {
    const map = useMap();

    useEffect(() => {
        // map.setView(position, fixedZoom);
        map.flyTo(position, fixedZoom, {
            animate: true,
            duration: 1.5, 
            noMoveStart: true,
        });
    }, [map, position, fixedZoom]);

    return null;
};

const Map = ({ station }) => {

    // const position = [51.505, -0.09]; // Beispielkoordinaten
    const position = [station.latitude, station.longitude]
    const fixedZoom = 13;
    console.log(station)

    return (
        <MapContainer center={position} zoom={fixedZoom} style={{ height: '100%', width: '100%' }} className="bla" >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>
                    {station.name}
                </Popup>
            </Marker>
            <MapUpdater position={position} fixedZoom={fixedZoom} />
        </MapContainer>
    )
}

export default Map;