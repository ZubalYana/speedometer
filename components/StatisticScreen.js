import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
export default function StatisticScreen({ speedHistory }) {
    useEffect(() => {
        console.log('App speedHistory:', speedHistory);
    }, [speedHistory]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>📊 Statistic Screen</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0fff', width: '100%' },
    text: { color: '#f1f1f1ff', fontSize: 22 },
});
