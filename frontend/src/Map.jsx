import React from 'react';
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { colors } from "../colors";
import playground from "./assets/Playground.svg"
import museum from "./assets/Museum.svg"
import attraction from "./assets/Attractions.svg"

//todo: markers mit custom icons
//todo: filterfunktion, um icons richtig zuzuordnen

const customIcon = new L.Icon({
    // iconUrl: playground,
    iconUrl: playground,
    shadowUrl: null,

    iconSize: [20, 20],     //[38, 95], // size of the icon
    shadowSize: null,   //[50, 64], // size of the shadow
    iconAnchor: null,  //[22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: null, // [4, 62],  // the same for the shadow
    popupAnchor: null, // [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const divIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"><path d="M12 2C8.13 2 5 5.13 5 9c0 3.17 2.95 7.57 6.25 13.13 0.3 0.52 0.59 0.99 0.89 1.46 0.3-0.47 0.59-0.94 0.89-1.46C16.05 16.57 19 12.17 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${colors.secondary}"/><circle cx="12" cy="8" r="7" fill="white" stroke="${colors.secondary}" stroke-width="1"/><image href="${attraction}" x="7" y="3" width="10" height="10"/></svg>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
})

const calculateZoom = (x) => {
    const zoom = 14.76 - 0.00108 * x;
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

    console.log(station)

    // const position = [51.505, -0.09]; // Beispielkoordinaten
    const position = [station.latitude, station.longitude]
    const fixedZoom = calculateZoom(radius)//12.2//-0.0005 * radius + 13.5 //12.5;
    const fillBlueOptions = { fillColor: colors.primary, color: colors.primary }
    // const fillBlueOptions = { fillColor: 'blue', color: "blue" }
    const markers = station.destinations.map(d => {
        return (
            <Marker key={d.id} position={[d.lat, d.lon]} icon={divIcon}>
                <Popup>{d.tags.name}</Popup>
            </Marker>
        )
    })

    return (
        <MapContainer center={position} zoom={fixedZoom} style={{ height: '100%', width: '100%' }} className="bla" >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Circle center={position} radius={radius} pathOptions={fillBlueOptions}>

            </Circle>
            {markers}
            <MapUpdater position={position} fixedZoom={fixedZoom} />
        </MapContainer>
    )
}

export default Map;