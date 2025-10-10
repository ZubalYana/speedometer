import { useState, createContext, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import SpeedTracker from './components/SpeedTracker';
import StatisticScreen from './components/StatisticScreen';
import HistoryScreen from './components/HistoryScreen';
import SettingsScreen from './components/SettingsScreen';
import Menu from './components/Menu';
import { SpeedProvider } from './contexts/SpeedContext';
export const ThemeContext = createContext();
export default function App() {
  const [currentPage, setCurrentPage] = useState('speed');
  const [speedHistory, setSpeedHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'speed':
        return <SpeedTracker setSpeedHistory={setSpeedHistory} />;
      case 'statistic':
        return <StatisticScreen speedHistory={speedHistory} />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <SpeedTracker />;
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <SpeedProvider onNewSpeed={(newSpeed) => setSpeedHistory(prev => [...prev.slice(-59), newSpeed])}>
        <View style={styles.container}>
          {renderPage()}
          <Menu currentPage={currentPage} onChangePage={setCurrentPage} />
        </View>
      </SpeedProvider>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
