import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen() {
    const [darkMode, setDarkMode] = useState(true);
    const [language, setLanguage] = useState('en');
    const [unit, setUnit] = useState('km/h');

    const languages = [
        { label: 'EN', value: 'en' },
        { label: 'UA', value: 'ua' },
    ];

    const units = [
        { label: 'km/h', value: 'km/h' },
        { label: 'm/s', value: 'm/s' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="settings" size={35} color="#f1f1f1" />
                <Text style={styles.title}>Settings</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                <View style={styles.placeholderUserImg}>
                    <Text style={{ color: '#f1f1f1ff', fontSize: 32, fontWeight: '700' }}>U</Text>
                </View>
                <View style={{ justifyContent: 'center', marginLeft: 15 }}>
                    <Text style={{ color: '#f1f1f1ff', fontSize: 24, fontWeight: '700' }}>User Name</Text>
                    <Text style={{ color: '#f1f1f1cd', fontSize: 14, fontWeight: '400', marginTop: 5 }}>
                        speedometer123@gmail.com
                    </Text>
                </View>
            </View>
            <View style={styles.settingContainer}>
                <MaterialIcons name="nightlight" size={30} color="#f1f1f1" />
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    thumbColor={darkMode ? '#ff0e0e' : '#f1f1f1'}
                    trackColor={{ true: '#ff0e0e88', false: '#888' }}
                    style={{ marginLeft: 'auto' }}
                />
            </View>
            <View style={styles.settingContainer}>
                <MaterialIcons name="language" size={30} color="#f1f1f1" />
                <Text style={styles.settingLabel}>Language</Text>
                <View style={styles.optionGroup}>
                    {languages.map((lang) => (
                        <TouchableOpacity
                            key={lang.value}
                            style={[
                                styles.optionBtn,
                                language === lang.value && styles.optionBtnActive,
                            ]}
                            onPress={() => setLanguage(lang.value)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    language === lang.value && styles.optionTextActive,
                                ]}
                            >
                                {lang.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.settingContainer}>
                <MaterialIcons name="speed" size={30} color="#f1f1f1" />
                <Text style={styles.settingLabel}>Units</Text>
                <View style={styles.optionGroup}>
                    {units.map((u) => (
                        <TouchableOpacity
                            key={u.value}
                            style={[styles.optionBtn, unit === u.value && styles.optionBtnActive]}
                            onPress={() => setUnit(u.value)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    unit === u.value && styles.optionTextActive,
                                ]}
                            >
                                {u.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0fff',
        width: '100%',
        paddingTop: 90,
        paddingHorizontal: 20
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
    placeholderUserImg: {
        width: 70,
        height: 70,
        borderRadius: 75,
        backgroundColor: '#ff0e0eff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    settingContainer: {
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    settingLabel: {
        color: '#f1f1f1ff',
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 7,
        marginRight: 10,
    },
    optionGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 'auto',
        gap: 8,
    },
    optionBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f1f1f1ff',
        backgroundColor: 'transparent',
    },
    optionBtnActive: {
        backgroundColor: '#ff0e0eff',
        borderColor: '#ff0e0eff',
    },
    optionText: {
        color: '#f1f1f1ff',
        fontSize: 16,
        fontWeight: '600',
    },
    optionTextActive: {
        color: '#0f0f0fff',
    },
});
