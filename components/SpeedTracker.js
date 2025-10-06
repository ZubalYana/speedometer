import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as SplashScreen from "expo-splash-screen";
import { useFonts, GajrajOne_400Regular } from "@expo-google-fonts/gajraj-one";
import { MaterialIcons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

const SpeedTracker = () => {
    const [fontsLoaded] = useFonts({
        GajrajOne_400Regular,
    });

    const [speed, setSpeed] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);
    const [speedBreak, setSpeedBreak] = useState(false);
    const [highestSpeed, setHighestSpeed] = useState(0);
    const [started, setStarted] = useState(false);
    const [timePassed, setTimePassed] = useState(0);
    const [averageSpeed, setAverageSpeed] = useState(0);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        const getLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            startTracking();
        };

        const startTracking = async () => {
            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 0.1,
                    timeInterval: 1,
                },
                (position) => {
                    const speedInMetersPerSecond = position.coords.speed;
                    if (speedInMetersPerSecond < 0) {
                        setSpeed(0)
                    } else {
                        setSpeed(speedInMetersPerSecond);
                    }

                },
                (error) => {
                    setErrorMsg(error.message);
                }
            );
        };

        getLocationPermission();
    }, []);

    useEffect(() => {
        if (speed > 1) setSpeedBreak(true);
        else setSpeedBreak(false);
    }, [speed]);

    useEffect(() => {
        if (speed > highestSpeed) setHighestSpeed(speed);
    }, [speed]);

    useEffect(() => {
        if (started) {
            const interval = setInterval(() => setTimePassed((t) => t + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [started]);

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
            {/* <Text style={styles.highestSpeed}>
                Найвища швидкість:{' '}
                <Text style={styles.highestSpeed_hightlight}>
                    {highestSpeed.toFixed(2)} м/сек
                </Text>
            </Text>
            <TouchableOpacity onPress={() => setHighestSpeed(0)} style={styles.resetHighest}>
                <Text>Скинути</Text>
            </TouchableOpacity> */}

            {errorMsg ? (
                <Text style={styles.error}>{errorMsg}</Text>
            ) : (
                <Text style={styles.speed}>{speed.toFixed(2)} M/S</Text>
            )}
            {speedBreak && <Text style={styles.speedError}>⚠️ Перевищено допустиму швидкість!</Text>}
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 65 }}>
                <Text style={styles.stats}>Time: {timePassed}s</Text>
                <Text style={styles.stats}>Distance:</Text>
            </View>

            <TouchableOpacity
                onPress={() => setStarted(!started)}
                style={styles.startBtn}
                activeOpacity={0.8}
            >
                <View style={styles.btnContent}>
                    <MaterialIcons
                        name={started ? "pause" : "play-arrow"}
                        size={43}
                        color="#f1f1f1ff"
                        style={{ marginLeft: -5 }}
                    />
                    <Text style={styles.btnText}>{started ? "PAUSE" : "START"}</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
    speed: { fontSize: 64, fontWeight: 'bold', fontFamily: 'GajrajOne_400Regular', color: '#f1f1f1ff' },
    error: { color: 'red', fontSize: 18, marginTop: 10 },
    speedError: { color: 'black', fontSize: 20, fontWeight: '600', marginTop: 10 },
    highestSpeed: { fontSize: 18, marginBottom: 10, color: '#f1f1f1ff' },
    highestSpeed_hightlight: { fontWeight: 'bold' },
    resetHighest: {
        marginVertical: 10,
        backgroundColor: '#ff7a7a',
        padding: 10,
        borderRadius: 5,
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f1f1f1ff',
        marginLeft: 5,
    },
    startBtn: {
        marginTop: 30,
        width: 220,
        height: 60,
        backgroundColor: '#ff0e0eff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    stats: { fontSize: 18, marginBottom: 10, color: '#f1f1f1ff' },

});

export default SpeedTracker;
