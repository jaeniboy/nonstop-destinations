import React from 'react';
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { colors } from "../colors";
import { iconMapping } from './IconMapper';

const icon = (image, color) => {
    return (
        L.divIcon({
            className: 'custom-div-icon',
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"><path d="M12 2C8.13 2 5 5.13 5 9c0 3.17 2.95 7.57 6.25 13.13 0.3 0.52 0.59 0.99 0.89 1.46 0.3-0.47 0.59-0.94 0.89-1.46C16.05 16.57 19 12.17 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}" stroke="white"  stroke-width="0.5"/><circle cx="12" cy="9" r="6" fill="white" stroke="${color}" stroke-width="1"/><image href="${image}" x="7" y="3.5" width="10" height="10"/></svg>`,
            iconSize: [24, 24],
            iconAnchor: [20, 44],
            popupAnchor: [0, -35]
        })
    )
}

const calculateZoom = (x) => {
    const zoom = 14.76 - 0.00108 * x;
    return zoom
}

const MapUpdater = ({ position, fixedZoom }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(position, fixedZoom, {
            animate: true,
            duration: 1.5,
            noMoveStart: true,
        });
    }, [map, position, fixedZoom]);

    return null;
};

const Map = ({ station, radius }) => {
    const position = [station.latitude, station.longitude]
    const fixedZoom = calculateZoom(radius)
    const fillBlueOptions = { fillColor: colors.primary, color: colors.primary, fillOpacity: 0.1 }
    const markers = station.destinations.map(d => {
        const iconMap = iconMapping(d.tags) // return values based on destination type
        return (
            <Marker key={d.id} position={[d.lat, d.lon]} icon={icon(iconMap.image, iconMap.color)}>
                {d.tags.name ? <Popup>{d.tags.name}</Popup> : <Popup>no name provided</Popup>}
            </Marker>
        )
    })

    return (

        <MapContainer center={position} zoom={fixedZoom} style={{ height: '100%', width: '100%' }} >
            <TileLayer
               url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            //    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" // noch etwas aufgeräumter
            //    url="https://sgx.geodatenzentrum.de/wmts_basemapde/tile/1.0.0/de_basemapde_web_raster_grau/default/GLOBAL_WEBMERCATOR/{z}/{y}/{x}.png" // schwart-weiß
            //    url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png" // etwas aufgeräumter
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
                // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Circle center={position} radius={radius} pathOptions={fillBlueOptions} />
            {markers}
            <MapUpdater position={position} fixedZoom={fixedZoom} />
        </MapContainer>

    )
}

export default Map;