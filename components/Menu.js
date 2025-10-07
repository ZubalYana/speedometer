import { useRef } from "react";
import { View, Text, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

export default function Menu() {
    return (
        <View style={styles.menu}>
            <View style={styles.menuOption}>
                <MaterialIcons name="speed" size={38} color="#f1f1f1ff" />
                <Text style={{ color: '#f1f1f1ff', fontSize: 12 }}>Speed</Text>
            </View>
            <View style={styles.menuOption}>
                <MaterialIcons name="bar-chart" size={38} color="#f1f1f1ff" />
                <Text style={{ color: '#f1f1f1ff', fontSize: 12 }}>Statistic</Text>
            </View>
            <View style={styles.menuOption}>
                <MaterialIcons name="history" size={38} color="#f1f1f1ff" />
                <Text style={{ color: '#f1f1f1ff', fontSize: 12 }}>History</Text>
            </View>
            <View style={styles.menuOption}>
                <MaterialIcons name="settings" size={38} color="#f1f1f1ff" />
                <Text style={{ color: '#f1f1f1ff', fontSize: 12 }}>Settings</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    menu: {
        width: '100%',
        height: 110,
        backgroundColor: '#1c1c1cff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingTop: 10,
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 40,
        justifyContent: 'space-between'
    },
    menuOption: {
        alignItems: 'center',
        gap: 5
    }
})