import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, GajrajOne_400Regular } from '@expo-google-fonts/gajraj-one';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '../App';
import { SpeedContext } from '../contexts/SpeedContext';
SplashScreen.preventAutoHideAsync();


const SpeedTracker = ({ setSpeedHistory }) => {
    const [fontsLoaded] = useFonts({ GajrajOne_400Regular });
    const [errorMsg, setErrorMsg] = useState(null);
    const [averageSpeed, setAverageSpeed] = useState(0);
    const { startTracking, stopTracking } = useContext(SpeedContext);

    const { speed, highestSpeed, distance, timePassed, started, setStarted } = useContext(SpeedContext);
    const { speedBreak } = useContext(SpeedContext);

    const { darkMode } = useContext(ThemeContext);
    const colors = useMemo(() => ({
        bg: darkMode ? '#0f0f0f' : '#f9f9f9',
        card: darkMode ? '#1a1a1a' : '#ffffff',
        text: darkMode ? '#f1f1f1' : '#111111',
        subText: darkMode ? '#bbb' : '#555',
        border: darkMode ? '#f1f1f1' : '#222',
        accent: '#ff0e0e',
    }), [darkMode]);

    useEffect(() => {
        if (started) startTracking();
        else stopTracking();

        return () => stopTracking();
    }, [started]);


    useEffect(() => {
        setAverageSpeed(timePassed > 0 ? distance / timePassed : 0);
    }, [distance, timePassed]);


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
