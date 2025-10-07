import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, GajrajOne_400Regular } from '@expo-google-fonts/gajraj-one';
import { MaterialIcons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

const haversineMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const SpeedTracker = () => {
    const [fontsLoaded] = useFonts({ GajrajOne_400Regular });

    const [speed, setSpeed] = useState(0);
    const [highestSpeed, setHighestSpeed] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);
    const [started, setStarted] = useState(false);
    const [timePassed, setTimePassed] = useState(0);
    const [speedBreak, setSpeedBreak] = useState(false);
    const [averageSpeed, setAverageSpeed] = useState(0);
    const [distance, setDistance] = useState(0);
    const locationSubscription = useRef(null);
    const lastLocation = useRef(null);
    const lastTimestamp = useRef(null);

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            }
        })();
    }, []);

    useEffect(() => {
        let timer;
        if (started) {
            startTracking();
            timer = setInterval(() => setTimePassed((t) => t + 1), 1000);
        } else {
            stopTracking();
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [started]);

    useEffect(() => {
        if (timePassed > 0) {
            setAverageSpeed(distance / timePassed);
        } else {
            setAverageSpeed(0);
        }
    }, [distance, timePassed]);

    const startTracking = async () => {
        try {
            if (locationSubscription.current) {
                await locationSubscription.current.remove();
                locationSubscription.current = null;
            }

            locationSubscription.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    distanceInterval: 1,
                    timeInterval: 1000,
                },
                (position) => {
                    if (!position || !position.coords) return;
                    const { latitude, longitude, speed: rawSpeed } = position.coords;
                    const nowTs = position.timestamp ?? Date.now();

                    if (lastLocation.current && lastTimestamp.current && latitude != null && longitude != null) {
                        const dist = haversineMeters(
                            lastLocation.current.latitude,
                            lastLocation.current.longitude,
                            latitude,
                            longitude
                        );

                        const deltaSec = (nowTs - lastTimestamp.current) / 1000;
                        const safeDelta = deltaSec > 0 ? deltaSec : 1;

                        if (dist > 0.5) {
                            setDistance((d) => d + dist);
                        }

                        let calcSpeed = dist / safeDelta;
                        const usedSpeed = (rawSpeed != null && rawSpeed >= 0) ? rawSpeed : calcSpeed;

                        setSpeed(usedSpeed);
                        setHighestSpeed((prev) => Math.max(prev, usedSpeed));
                        setSpeedBreak(usedSpeed > 1);
                    } else {
                        const usedSpeed = (rawSpeed != null && rawSpeed >= 0) ? rawSpeed : 0;
                        setSpeed(usedSpeed);
                        setHighestSpeed((prev) => Math.max(prev, usedSpeed));
                        setSpeedBreak(usedSpeed > 10);
                    }

                    lastLocation.current = { latitude, longitude };
                    lastTimestamp.current = nowTs;
                },
                (err) => {
                    setErrorMsg(err?.message ?? 'Location watch error');
                }
            );
        } catch (e) {
            setErrorMsg(e.message ?? String(e));
        }
    };

    const stopTracking = async () => {
        try {
            if (locationSubscription.current) {
                await locationSubscription.current.remove();
                locationSubscription.current = null;
            }
            lastLocation.current = null;
            lastTimestamp.current = null;
        } catch (e) {
            //ignore
        }
    };

    if (!fontsLoaded) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Loading font...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: speedBreak ? 'red' : '#0f0f0fff' }]}>
            {errorMsg ? (
                <Text style={styles.error}>{errorMsg}</Text>
            ) : (
                <Text style={styles.speed}>{speed.toFixed(2)} m/s</Text>
            )}

            {speedBreak && <Text style={styles.speedError}>⚠️ Перевищено допустиму швидкість!</Text>}

            <TouchableOpacity onPress={() => setStarted((s) => !s)} style={styles.startBtn} activeOpacity={0.8}>
                <View style={styles.btnContent}>
                    <MaterialIcons name={started ? 'pause' : 'play-arrow'} size={43} color="#f1f1f1ff" style={{ marginLeft: -5 }} />
                    <Text style={styles.btnText}>{started ? 'PAUSE' : 'START'}</Text>
                </View>
            </TouchableOpacity>

            <View style={{ marginBottom: -160 }}>
                <View style={styles.statsRow}>
                    <View style={styles.statContainer}>
                        <Text style={styles.statHightlighted}>{timePassed}s</Text>
                        <Text style={styles.statText}>Time</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statHightlighted}>{highestSpeed.toFixed(2)} m/s</Text>
                        <Text style={styles.statText}>Top speed</Text>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statContainer}>
                        <Text style={styles.statHightlighted}>{averageSpeed.toFixed(2)} m/s</Text>
                        <Text style={styles.statText}>Average</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statHightlighted}>
                            {distance < 100 ?
                                distance.toFixed(2) + 'm'
                                :
                                (distance / 1000).toFixed(2) + 'km'
                            }
                        </Text>
                        <Text style={styles.statText}>Distance</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
    speed: { fontSize: 64, fontWeight: 'bold', fontFamily: 'GajrajOne_400Regular', color: '#f1f1f1ff' },
    error: { color: 'red', fontSize: 18, marginTop: 10 },
    speedError: { color: 'black', fontSize: 20, fontWeight: '600', marginTop: 10 },
    btnContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    btnText: { fontSize: 24, fontWeight: 'bold', color: '#f1f1f1ff', marginLeft: 5 },
    startBtn: { width: 220, height: 60, backgroundColor: '#ff0e0eff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 50 },
    statsRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 65, marginBottom: 20 },
    statContainer: { flexDirection: 'column', alignItems: 'center' },
    statText: { fontSize: 18, color: '#d3d3d3ff', marginVertical: 4, fontWeight: '600' },
    statHightlighted: { fontSize: 32, fontWeight: 'bold', color: '#ff0e0ed5' },
});

export default SpeedTracker;
