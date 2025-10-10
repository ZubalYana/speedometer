import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '../App';
import { useContext, useMemo } from 'react';

export default function Menu({ currentPage, onChangePage }) {
    const menuItems = [
        { key: 'speed', label: 'Speed', icon: 'speed' },
        { key: 'statistic', label: 'Statistic', icon: 'bar-chart' },
        { key: 'history', label: 'History', icon: 'history' },
        { key: 'settings', label: 'Settings', icon: 'settings' },
    ];

    const { darkMode } = useContext(ThemeContext);

    const colors = useMemo(() => ({
        bg: darkMode ? '#101010' : '#f1f1f1',
        card: darkMode ? '#1a1a1a' : '#ffffff',
        text: darkMode ? '#eaeaea' : '#111111',
        inactive: darkMode ? '#8b8b8b' : '#555555',
        accent: '#ff0e0e',
        shadow: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)',
    }), [darkMode]);

    return (
        <View style={[styles.menu, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
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
                            size={32}
                            color={isActive ? colors.accent : colors.inactive}
                        />
                        <Text
                            style={[
                                styles.menuText,
                                { color: isActive ? colors.accent : colors.text },
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
        height: 95,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
        paddingHorizontal: 15,
        borderTopWidth: 0.5,
        borderColor: '#444',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
    },
    menuOption: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    menuText: {
        fontSize: 11,
        fontWeight: '500',
    },
});
