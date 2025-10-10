import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, GajrajOne_400Regular } from '@expo-google-fonts/gajraj-one';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../App';

SplashScreen.preventAutoHideAsync();

const haversineMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const SpeedTracker = ({ setSpeedHistory }) => {
    const [fontsLoaded] = useFonts({ GajrajOne_400Regular });
    const [speed, setSpeed] = useState(0);
    const [highestSpeed, setHighestSpeed] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);
    const [started, setStarted] = useState(false);
    const [timePassed, setTimePassed] = useState(0);
    const [speedBreak, setSpeedBreak] = useState(false);
    const [averageSpeed, setAverageSpeed] = useState(0);
    const [distance, setDistance] = useState(0);
    const speedQueue = useRef([]);

    const locationSubscription = useRef(null);
    const lastLocation = useRef(null);
    const lastTimestamp = useRef(null);

    const { darkMode } = useContext(ThemeContext);
    const colors = useMemo(() => ({
        bg: darkMode ? '#0f0f0f' : '#f9f9f9',
        card: darkMode ? '#1a1a1a' : '#ffffff',
        text: darkMode ? '#f1f1f1' : '#111111',
        subText: darkMode ? '#bbb' : '#555',
        border: darkMode ? '#f1f1f1' : '#222',
        accent: '#ff0e0e',
    }), [darkMode]);

    const saveSpeedData = async (newSpeed) => {
        try {
            const newEntry = { speed: newSpeed, timestamp: Date.now() };
            const existing = await AsyncStorage.getItem('speedHistory');
            const parsed = existing ? JSON.parse(existing) : [];
            parsed.push(newEntry);
            await AsyncStorage.setItem('speedHistory', JSON.stringify(parsed));
        } catch (err) {
            console.error('Failed to save speed data:', err);
        }
    };

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') setErrorMsg('Permission to access location was denied');
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
        return () => timer && clearInterval(timer);
    }, [started]);

    useEffect(() => {
        setAverageSpeed(timePassed > 0 ? distance / timePassed : 0);
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
                    if (!position?.coords) return;
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
                        const safeDelta = deltaSec > 1 ? deltaSec : 1;
                        if (dist >= 2) setDistance((d) => d + dist);

                        const calcSpeed = dist / safeDelta;
                        const usedSpeed = rawSpeed != null && rawSpeed >= 0 ? rawSpeed : calcSpeed;
                        updateSpeed(usedSpeed);
                    } else {
                        const usedSpeed = rawSpeed != null && rawSpeed >= 0 ? rawSpeed : 0;
                        updateSpeed(usedSpeed);
                    }

                    lastLocation.current = { latitude, longitude };
                    lastTimestamp.current = nowTs;
                },
                (err) => setErrorMsg(err?.message ?? 'Location watch error')
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
        } catch {
            // ignore
        }
    };

    const updateSpeed = (newSpeed) => {
        speedQueue.current.push(newSpeed);
        if (speedQueue.current.length > 3) speedQueue.current.shift();
        const smoothSpeed = speedQueue.current.reduce((a, b) => a + b, 0) / speedQueue.current.length;

        setSpeed(smoothSpeed);
        setHighestSpeed((prev) => Math.max(prev, smoothSpeed));
        setSpeedBreak(smoothSpeed > 1);
        if (typeof setSpeedHistory === 'function') {
            setSpeedHistory((prev) => [...prev.slice(-59), smoothSpeed]);
        }
        saveSpeedData(smoothSpeed);
    };

    if (!fontsLoaded) {
        return (
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading font...</Text>
            </View>
        );
    }

    return (
        <View style={[
            styles.container,
            { backgroundColor: speedBreak ? colors.accent : colors.bg }
        ]}>
            {errorMsg ? (
                <Text style={[styles.error, { color: colors.accent }]}>{errorMsg}</Text>
            ) : (
                <Text style={[styles.speed, { color: colors.text }]}>
                    {speed < 1000 ? `${speed.toFixed(2)} m/s` : `${(speed / 1000).toFixed(2)} k/h`}
                </Text>
            )}

            {speedBreak && (
                <Text style={[styles.speedError, { color: darkMode ? colors.card : colors.text }]}>
                    ⚠️ Перевищено допустиму швидкість!
                </Text>
            )}

            <TouchableOpacity
                onPress={() => setStarted((s) => !s)}
                style={[styles.startBtn, { backgroundColor: colors.accent }]}
                activeOpacity={0.8}
            >
                <View style={styles.btnContent}>
                    <MaterialIcons
                        name={started ? 'pause' : 'play-arrow'}
                        size={43}
                        color={colors.text}
                        style={{ marginLeft: -5 }}
                    />
                    <Text style={[styles.btnText, { color: colors.text }]}>
                        {started ? 'PAUSE' : 'START'}
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={{ marginBottom: -100 }}>
                <View style={styles.statsRow}>
                    <View style={styles.statContainer}>
                        <Text style={[styles.statHighlighted, { color: colors.accent }]}>
                            {timePassed < 60 ? `${timePassed}s` : `${(timePassed / 60).toFixed(1)}min`}
                        </Text>
                        <Text style={[styles.statText, { color: colors.subText }]}>Time</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={[styles.statHighlighted, { color: colors.accent }]}>
                            {highestSpeed < 1000 ? `${highestSpeed.toFixed(2)}m/s` : `${(highestSpeed / 1000).toFixed(2)}k/h`}
                        </Text>
                        <Text style={[styles.statText, { color: colors.subText }]}>Top speed</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statContainer}>
                        <Text style={[styles.statHighlighted, { color: colors.accent }]}>
                            {averageSpeed < 1000 ? `${averageSpeed.toFixed(2)}m/s` : `${(averageSpeed / 1000).toFixed(2)}k/h`}
                        </Text>
                        <Text style={[styles.statText, { color: colors.subText }]}>Average</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={[styles.statHighlighted, { color: colors.accent }]}>
                            {distance < 100 ? `${distance.toFixed(2)}m` : `${(distance / 1000).toFixed(2)}km`}
                        </Text>
                        <Text style={[styles.statText, { color: colors.subText }]}>Distance</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
    },
    speed: {
        fontSize: 64,
        fontWeight: 'bold',
        fontFamily: 'GajrajOne_400Regular',
    },
    error: {
        fontSize: 18,
        marginTop: 10,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    speedError: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 10,
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    startBtn: {
        width: 220,
        height: 60,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 50,
    },
    statsRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 65,
        marginBottom: 20,
    },
    statContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    statText: {
        fontSize: 18,
        marginVertical: 4,
        fontWeight: '600',
    },
    statHighlighted: {
        fontSize: 32,
        fontWeight: 'bold',
    },
});

export default SpeedTracker;
