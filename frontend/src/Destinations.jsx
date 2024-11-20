import React, { useState } from 'react';

const Destinations = ({destinations}) => {

    // sort
    destinations = destinations.sort((a,b)=> b.destinations.length - a.destinations.length)

    const displayDestinations = destinations.map(d=>{
        return <li>{d.name} ({d.destinations.length})</li>
    })

    return (
        <div>
            <ul>
                {displayDestinations}
            </ul>
        </div>
    )
}

export default Destinations