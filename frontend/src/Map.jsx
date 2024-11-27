import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { colors } from "../colors"

const calculateZoom = (x) => {
    const zoom =  14.76 - 0.00108 * x;
    return zoom
}

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

const Map = ({ station, radius }) => {

    // const position = [51.505, -0.09]; // Beispielkoordinaten
    const position = [station.latitude, station.longitude]
    const fixedZoom = calculateZoom(radius)//12.2//-0.0005 * radius + 13.5 //12.5;
    const fillBlueOptions = { fillColor: colors.primary, color: colors.primary }
    // const fillBlueOptions = { fillColor: 'blue', color: "blue" }
    console.log(station)

    return (
        <MapContainer center={position} zoom={fixedZoom} style={{ height: '100%', width: '100%' }} className="bla" >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Circle center={position} radius={radius} pathOptions={fillBlueOptions}>

            </Circle>
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