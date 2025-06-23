import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const HomeScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventsByDate, setEventsByDate] = useState({});
  const router = useRouter();

  const loadEvents = async () => {
    try {
      const stored = await AsyncStorage.getItem('events');
      const events = stored ? JSON.parse(stored) : [];

      const marks = {};
      const eventsMap = {};

      events.forEach(event => {
        marks[event.date] = {
          marked: true,
          dotColor: 'red',
        };
        eventsMap[event.date] = event.title;
      });

      setMarkedDates(marks);
      setEventsByDate(eventsMap);
    } catch (e) {
      console.error('Gagal load event', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEvents(); // reload setiap kali kembali dari tambah/edit
    }, [])
  );

  const handleDelete = async () => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Yakin ingin menghapus event ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem('events');
              let events = stored ? JSON.parse(stored) : [];
              events = events.filter(e => e.date !== selectedDate);
              await AsyncStorage.setItem('events', JSON.stringify(events));

              // Perbarui tampilan
              const updatedEventsByDate = { ...eventsByDate };
              const updatedMarks = { ...markedDates };
              delete updatedEventsByDate[selectedDate];
              delete updatedMarks[selectedDate];
              setEventsByDate(updatedEventsByDate);
              setMarkedDates(updatedMarks);
            } catch (err) {
              console.error('Gagal hapus event', err);
            }
          }
        }
      ]
    );
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={styles.container}>
      <Calendar
        markingType="simple"
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: '#00adf5',
            },
          }),
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: 'orange',
        }}
      />

      {selectedDate && eventsByDate[selectedDate] && (
        <View style={styles.eventBox}>
          <Text style={styles.eventText}>📌 {eventsByDate[selectedDate]}</Text>

          <View style={styles.buttonRow}>
            <Button
              title="✏️ Edit"
              onPress={() =>
                router.push({
                  pathname: '/edit-event',
                  params: {
                    date: selectedDate,
                    title: eventsByDate[selectedDate],
                  },
                })
              }
            />
            <View style={{ width: 10 }} />
            <Button
              title="🗑️ Hapus"
              color="red"
              onPress={handleDelete}
            />
          </View>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title="➕ Tambah Event"
          onPress={() =>
            router.push({
              pathname: '/tambah-event',
              params: { date: selectedDate || new Date().toISOString().slice(0, 10) },
            })
          }
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button 
          title="📆 Lihat Kalender Mingguan"
          onPress={() => router.push('/kalender-mingguan')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 50, flex: 1 },
  eventBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
  },
  eventText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default HomeScreen;
