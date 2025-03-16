import React from "react";
import { BsXLg } from "react-icons/bs";


const Options = ({ options, optionsChange, onSave, onClose }) => {
    const handleOptionChange = (key, value) => {
        const updatedOptions = { ...options, [key]: value };
        optionsChange(updatedOptions)
    };


    const { mindist, maxtime, maxwalk } = options
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000]"></div>


            <div className="fixed inset-0 flex items-center justify-center z-[2001]">
                <div className="z-[2001] bg-white p-4 mx-4 rounded-md shadow-xl relative flex justify-center mt-3">
                    <div className="flex flex-col sm:px-0 w-full sm:w-3/4 lg:w-1/2">
                    <div onClick={onClose} className="flex justify-end cursor-pointer text-gray-500">
                        <BsXLg/>
                    </div>
                        <div className="flex">
                            <div className="flex-1">
                                <Label for="mindist">What area do you already know well?</Label>
                                <input className="w-full" onChange={(e) => handleOptionChange("mindist", e.target.value)} value={mindist} type="range" id="mindist" name="mindist" min="0" max="100" step="10"></input>
                            </div>
                            <div className="w-20 flex pl-5 items-center text-md text-sm text-gray-700">{mindist} km</div>
                        </div>
                        <div className="flex">
                            <div className="flex-1">
                                <Label for="maxtime">How long can your journey last?</Label>
                                <input className="w-full" onChange={(e) => handleOptionChange("maxtime", e.target.value)} value={maxtime} type="range" id="maxtime" name="maxtime" min="20" max="120" step="10"></input>
                            </div>
                            <div className="w-20 flex pl-5 items-center text-md text-sm text-gray-700">{maxtime} min</div>
                        </div>
                        <div className="flex">
                            <div className="flex-1">
                                <Label for="maxwalk">How far are you willing to walk?</Label>
                                <input className="w-full" onChange={(e) => handleOptionChange("maxwalk", e.target.value)} value={maxwalk} type="range" id="maxwalk" name="maxwalk" min="500" max="3000" step="500"></input>
                            </div>
                            <div className="w-20 flex pl-5 items-center text-md text-sm text-gray-700">{maxwalk} m</div>
                        </div>
                        <div className="flex justify-center">
                            <button onClick={onSave} className="w-auto mt-5 bg-primary px-4 py-2 rounded-lg items-center text-white pointer">save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const Label = ({ children, forValue }) => {
    return (<label for={forValue} className="text-xs text-gray-600">{children}</label>)
}

export default Options;