import { View, Text, StyleSheet } from 'react-native';
export default function HistoryScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>📜 History Screen</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0fff', width: '100%' },
    text: { color: '#f1f1f1ff', fontSize: 22 },
});
