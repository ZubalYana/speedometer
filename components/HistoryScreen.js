import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
    const [history, setHistory] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeFilter, setActiveFilter] = useState('day');

    useEffect(() => {
        const loadData = async () => {
            const stored = await AsyncStorage.getItem('speedHistory');
            if (stored) {
                const parsed = JSON.parse(stored);
                setHistory(parsed.sort((a, b) => b.timestamp - a.timestamp));
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        filterHistory(activeFilter);
    }, [history, activeFilter]);

    const filterHistory = (period) => {
        const now = Date.now();
        let limit;
        if (period === 'hour') limit = 60 * 60 * 1000;
        if (period === 'day') limit = 24 * 60 * 60 * 1000;
        if (period === 'week') limit = 7 * 24 * 60 * 60 * 1000;

        setFiltered(history.filter((item) => now - item.timestamp <= limit));
    };

    const formatTime = (timestamp) => {
        const d = new Date(timestamp);
        return d.toLocaleString();
    };

    useEffect(() => {
        const addMockData = async () => {
            const now = Date.now();
            const mock = [
                { speed: 2.5, timestamp: now - 30 * 60 * 1000 },
                { speed: 3.1, timestamp: now - 3 * 60 * 60 * 1000 },
                { speed: 4.2, timestamp: now - 12 * 60 * 60 * 1000 },
                { speed: 5.3, timestamp: now - 2 * 24 * 60 * 60 * 1000 },
                { speed: 6.1, timestamp: now - 6 * 24 * 60 * 60 * 1000 },
                { speed: 7.0, timestamp: now - 10 * 24 * 60 * 60 * 1000 },
            ];
            await AsyncStorage.setItem('speedHistory', JSON.stringify(mock));
            setHistory(mock);
        };

        addMockData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="history" size={35} color="#f1f1f1" />
                <Text style={styles.title}>History</Text>
            </View>

            <View style={styles.filterContainer}>
                {['hour', 'day', 'week'].map((p) => (
                    <TouchableOpacity
                        key={p}
                        style={[
                            styles.filterBtn,
                            activeFilter === p && styles.filterBtnActive,
                        ]}
                        onPress={() => setActiveFilter(p)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === p && styles.filterTextActive,
                            ]}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {filtered.length === 0 ? (
                <Text style={styles.noData}>No data for this period</Text>
            ) : (
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
                    {filtered.map((item, index) => (
                        <View key={index} style={styles.item}>
                            <Text style={styles.speedText}>
                                {item.speed < 1000
                                    ? item.speed.toFixed(2) + ' m/s'
                                    : (item.speed / 1000).toFixed(2) + ' km/h'}
                            </Text>
                            <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0fff',
        paddingTop: 90,
        alignItems: 'center',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: '#f1f1f1ff',
        fontSize: 26,
        marginLeft: 8,
        fontWeight: '700',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    filterBtn: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f1f1f1ff',
        marginHorizontal: 5,
    },
    filterBtnActive: {
        backgroundColor: '#ff0e0eff',
        borderColor: '#ff0e0eff',
    },
    filterText: {
        color: '#f1f1f1ff',
        fontSize: 16,
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#0f0f0fff',
    },
    item: {
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 10,
        marginVertical: 6,
        width: '90%',
    },
    speedText: {
        color: '#ff0e0eff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    timestamp: {
        color: '#bbb',
        fontSize: 14,
        marginTop: 4,
    },
    noData: {
        color: '#aaa',
        fontSize: 16,
        marginTop: 40,
    },
});
