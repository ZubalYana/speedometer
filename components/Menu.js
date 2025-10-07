import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Menu({ currentPage, onChangePage }) {
    const menuItems = [
        { key: 'speed', label: 'Speed', icon: 'speed' },
        { key: 'statistic', label: 'Statistic', icon: 'bar-chart' },
        { key: 'history', label: 'History', icon: 'history' },
        { key: 'settings', label: 'Settings', icon: 'settings' },
    ];

    return (
        <View style={styles.menu}>
            {menuItems.map((item) => {
                const isActive = currentPage === item.key;
                return (
                    <TouchableOpacity
                        key={item.key}
                        onPress={() => onChangePage(item.key)}
                        style={styles.menuOption}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons
                            name={item.icon}
                            size={38}
                            color={isActive ? '#ff0e0eff' : '#f1f1f1ff'}
                        />
                        <Text
                            style={[
                                styles.menuText,
                                { color: isActive ? '#ff0e0eff' : '#f1f1f1ff' },
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    menuOption: {
        alignItems: 'center',
        gap: 5,
    },
    menuText: {
        fontSize: 12,
    },
});
