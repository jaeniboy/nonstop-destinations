import React from "react";


const Options = ({ options, optionsChange, onSave }) => {
    const handleOptionChange = (key, value) => {
        const updatedOptions = { ...options, [key]: value };
        optionsChange(updatedOptions)
    };


    const { mindist, maxtime, maxwalk } = options
    return (
        <div className="flex justify-center mt-3">
            <div className="flex flex-col px-5 sm:px-0 w-full sm:w-3/4 lg:w-1/2">
                <div className="flex">
                    <div className="flex-1">
                        <label for="mindist">Minimum Distance</label>
                        <input className="w-full" onChange={(e) => handleOptionChange("mindist",e.target.value)} value={mindist} type="range" id="mindist" name="mindist" min="0" max="100" step="10"></input>
                    </div>
                    <div className="w-20 flex pl-5 items-center">{mindist} km</div>
                </div>
                <div className="flex">
                    <div className="flex-1">
                        <label for="maxtime">Maximum Travel Time</label>
                        <input className="w-full" onChange={(e) => handleOptionChange("maxtime",e.target.value)} value={maxtime} type="range" id="maxtime" name="maxtime" min="20" max="120" step="10"></input>
                    </div>
                    <div className="w-20 flex pl-5 items-center">{maxtime} min</div>
                </div>
                <div className="flex">
                    <div className="flex-1">
                        <label for="maxwalk">Maximum Walking Distance</label>
                        <input className="w-full" onChange={(e) => handleOptionChange("maxwalk",e.target.value)} value={maxwalk} type="range" id="maxwalk" name="maxwalk" min="500" max="3000" step="500"></input>
                    </div>
                    <div className="w-20 flex pl-5 items-center">{maxwalk} m</div>
                </div>
                <div className="flex justify-center">
                    <button onClick={onSave} className="w-auto mt-5 bg-primary px-4 py-2 rounded-lg items-center text-white pointer">save</button>
                </div>
            </div>
        </div>
    );
}

export default Options;