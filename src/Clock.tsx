import React, { useEffect, useState } from 'react';
import { instantiate } from '@assemblyscript/loader';
import './Clock.css';

// Function to fetch and instantiate the WebAssembly module
const loadWasmModule = async () => {
    const response = await fetch('release.wasm');
    const wasmArrayBuffer = await response.arrayBuffer();
    return await instantiate(wasmArrayBuffer);
};

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [wasmModule, setWasmModule] = useState<any>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Load the WebAssembly module
        loadWasmModule()
            .then(module => {
                setWasmModule(module);
            })
            .catch(error => {
                console.error("Error loading WASM module:", error);
            });

        return () => clearInterval(intervalId);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    let hourAngle = 0;
    let minuteAngle = 0;
    let secondAngle = 0;

    if (wasmModule) {
        // Call the getClockAngles function from the WebAssembly module
        const angles = wasmModule.exports.getClockAngles(hours, minutes, seconds);
        hourAngle = angles[0];
        minuteAngle = angles[1];
        secondAngle = angles[2];
    } else {
        // Fallback to JS calculations while the WebAssembly module loads
        hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;
        minuteAngle = (minutes / 60) * 360;
        secondAngle = (seconds / 60) * 360;
    }

    // Calculate positions for numbers
    const numberPositions = Array.from({ length: 12 }, (_, index) => {
        const angle = (index + 1) * 30; // Each number is 30 degrees apart
        const x = 80 * Math.sin((angle * Math.PI) / 180);
        const y = -80 * Math.cos((angle * Math.PI) / 180);
        return { x, y, number: index + 1 };
    });

    return (
        <div className="clock">
            {numberPositions.map(({ x, y, number }) => (
                <div
                    key={number}
                    className="number"
                    style={{ left: `calc(45% + ${x}px)`, top: `calc(45% + ${y}px)` }}
                >
                    {number}
                </div>
            ))}
            <div className="hand hour" style={{ transform: `rotate(${hourAngle}deg)` }} />
            <div className="hand minute" style={{ transform: `rotate(${minuteAngle}deg)` }} />
            <div className="hand second" style={{ transform: `rotate(${secondAngle}deg)` }} />
        </div>
    );
};

export default Clock;
