import React, { useEffect, useState } from 'react';
import './Clock.css';

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;
    const minuteAngle = (minutes / 60) * 360;
    const secondAngle = (seconds / 60) * 360;

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
