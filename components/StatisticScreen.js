import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useEffect, useContext, useMemo } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '../App';

export default function StatisticScreen({ speedHistory }) {
    useEffect(() => {
        console.log('App speedHistory:', speedHistory);
    }, [speedHistory]);

    const screenWidth = Dimensions.get('window').width;
    const { darkMode } = useContext(ThemeContext);

    const colors = useMemo(
        () => ({
            bg: darkMode ? '#0f0f0f' : '#f9f9f9',
            card: darkMode ? '#1a1a1a' : '#ffffff',
            text: darkMode ? '#f1f1f1' : '#111111',
            subText: darkMode ? '#bbb' : '#555',
            border: darkMode ? '#f1f1f1' : '#222',
            accent: '#ff0e0e',
        }),
        [darkMode]
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <View style={styles.header}>
                <MaterialIcons
                    name="bar-chart"
                    size={40}
                    color={colors.text}
                    style={styles.icon}
                />
                <Text style={[styles.text, { color: colors.text }]}>Live statistics</Text>
            </View>

            {speedHistory.length ? (
                <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <LineChart
                        data={{
                            labels: Array(speedHistory.length).fill(''),
                            datasets: [{ data: speedHistory }],
                        }}
                        width={screenWidth - 60}
                        height={230}
                        yAxisSuffix=" m/s"
                        chartConfig={{
                            backgroundColor: colors.card,
                            backgroundGradientFrom: colors.card,
                            backgroundGradientTo: colors.card,
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(255, 14, 14, ${opacity})`,
                            labelColor: () => colors.text,
                        }}
                        style={styles.chart}
                    />
                </View>
            ) : (
                <Text style={[styles.noDataText, { color: colors.subText }]}>
                    No data available for the chart so far. Start measuring your speed and take a look!
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    text: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 8,
    },
    icon: {
        marginRight: 2,
    },
    chartCard: {
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    chart: {
        borderRadius: 16,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        lineHeight: 22,
    },
});
