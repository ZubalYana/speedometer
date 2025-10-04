import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const SpeedTracker = () => {
    const [speed, setSpeed] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);

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
                    setSpeed(speedInMetersPerSecond * 3.6);
                },
                (error) => {
                    setErrorMsg(error.message);
                }
            );
        };

        getLocationPermission();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Швидкість руху</Text>
            {errorMsg ? (
                <Text style={styles.error}>{errorMsg}</Text>
            ) : (
                <Text style={styles.speed}>{speed.toFixed(2)} км/год</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    speed: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        fontSize: 18,
    },
});

export default SpeedTracker;
