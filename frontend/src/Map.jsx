import React from 'react';
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { colors } from "../colors";
import playground from "./assets/Playground.svg"

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

    console.log(station)

    // const position = [51.505, -0.09]; // Beispielkoordinaten
    const position = [station.latitude, station.longitude]
    const fixedZoom = calculateZoom(radius)//12.2//-0.0005 * radius + 13.5 //12.5;
    const fillBlueOptions = { fillColor: colors.primary, color: colors.primary }
    // const fillBlueOptions = { fillColor: 'blue', color: "blue" }
    const markers = station.destinations.map(d=>{
        return(
            <Marker key={d.id} position={[d.lat,d.lon]} icon={customIcon}>
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