import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';

export default function StatisticScreen({ speedHistory }) {
    useEffect(() => {
        console.log('App speedHistory:', speedHistory);
    }, [speedHistory]);
    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                <MaterialIcons
                    name='bar-chart'
                    size={40}
                    color='#f1f1f1ff'
                />
                <Text style={styles.text}>
                    Live statistics & history
                </Text>
            </View>
            {speedHistory.length ?
                <LineChart
                    data={{
                        labels: Array(speedHistory.length).fill(''),
                        datasets: [{ data: speedHistory }],
                    }}
                    width={screenWidth - 40}
                    height={220}
                    yAxisSuffix=" m/s"
                    chartConfig={{
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 14, 14, ${opacity})`,
                        labelColor: () => '#fff',
                    }}
                    style={styles.chart}
                />
                :
                <Text style={{ color: '#f1f1f1ff', paddingHorizontal: 40, textAlign: 'center' }}>No data available for the chart so far. Start measuring your speed and take a look!</Text>
            }

        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0fff', width: '100%' },
    text: { color: '#f1f1f1ff', fontSize: 22, fontWeight: 700, marginTop: 5 },
    chart: { marginTop: 50 }
});
