import React, { useState } from 'react';

const Destinations = ({stations}) => {

    // sort
    stations = stations.sort((a,b)=> b.destinations.length - a.destinations.length)

    const displayStations = stations.map(d=>{
        return <li key={d.id}>{d.name} ({d.destinations.length})</li>
    })

    return (
        <div>
            <ul>
                {displayStations}
            </ul>
        </div>
    )
}

export default Destinations