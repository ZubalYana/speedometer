import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SpeedTracker from './components/SpeedTracker';
import StatisticScreen from './components/StatisticScreen';
import HistoryScreen from './components/HistoryScreen';
import SettingsScreen from './components/SettingsScreen';
import Menu from './components/Menu';
export default function App() {
  const [currentPage, setCurrentPage] = useState('speed');
  const [speedHistory, setSpeedHistory] = useState([])

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
    <View style={styles.container}>
      {renderPage()}
      <Menu currentPage={currentPage} onChangePage={setCurrentPage} />
    </View>
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
