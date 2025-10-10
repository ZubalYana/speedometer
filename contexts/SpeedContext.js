import React, { createContext, useState, useRef, useEffect } from 'react';
import * as Location from 'expo-location';

export const SpeedContext = createContext();

export const SpeedProvider = ({ children, onNewSpeed }) => {
    const [speed, setSpeed] = useState(0);
    const [highestSpeed, setHighestSpeed] = useState(0);
    const [distance, setDistance] = useState(0);
    const [timePassed, setTimePassed] = useState(0);
    const [started, setStarted] = useState(false);
    const [speedBreak, setSpeedBreak] = useState(false);
    const speedQueue = useRef([]);
    const locationSubscription = useRef(null);
    const lastLocation = useRef(null);
    const lastTimestamp = useRef(null);

    const haversineMeters = (lat1, lon1, lat2, lon2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const updateSpeed = (newSpeed) => {
        speedQueue.current.push(newSpeed);
        if (speedQueue.current.length > 3) speedQueue.current.shift();
        const smoothSpeed = speedQueue.current.reduce((a, b) => a + b, 0) / speedQueue.current.length;

        setSpeed(smoothSpeed);
        setHighestSpeed(prev => Math.max(prev, smoothSpeed));
        setSpeedBreak(smoothSpeed > 1);

        // Push to App-level speedHistory
        if (onNewSpeed) {
            onNewSpeed(smoothSpeed); // App will handle history
        }
    };

    const startTracking = async () => {
        if (locationSubscription.current) {
            await locationSubscription.current.remove();
            locationSubscription.current = null;
        }

        locationSubscription.current = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Highest, distanceInterval: 1, timeInterval: 1000 },
            (position) => {
                if (!position?.coords) return;
                const { latitude, longitude, speed: rawSpeed } = position.coords;
                const nowTs = position.timestamp ?? Date.now();

                if (lastLocation.current && lastTimestamp.current) {
                    const dist = haversineMeters(
                        lastLocation.current.latitude,
                        lastLocation.current.longitude,
                        latitude,
                        longitude
                    );
                    const deltaSec = (nowTs - lastTimestamp.current) / 1000;
                    const safeDelta = deltaSec > 1 ? deltaSec : 1;
                    if (dist >= 2) setDistance(d => d + dist);

                    const calcSpeed = dist / safeDelta;
                    const usedSpeed = rawSpeed != null && rawSpeed >= 0 ? rawSpeed : calcSpeed;
                    updateSpeed(usedSpeed);
                } else {
                    const usedSpeed = rawSpeed != null && rawSpeed >= 0 ? rawSpeed : 0;
                    updateSpeed(usedSpeed);
                }

                lastLocation.current = { latitude, longitude };
                lastTimestamp.current = nowTs;
            }
        );
    };

    const stopTracking = async () => {
        if (locationSubscription.current) {
            await locationSubscription.current.remove();
            locationSubscription.current = null;
        }
        lastLocation.current = null;
        lastTimestamp.current = null;
    };

    useEffect(() => {
        let timer;
        if (started) timer = setInterval(() => setTimePassed(t => t + 1), 1000);
        else clearInterval(timer);
        return () => clearInterval(timer);
    }, [started]);

    return (
        <SpeedContext.Provider
            value={{
                speed,
                highestSpeed,
                distance,
                timePassed,
                started,
                speedBreak,
                setStarted,
                startTracking,
                stopTracking
            }}
        >
            {children}
        </SpeedContext.Provider>
    );
};