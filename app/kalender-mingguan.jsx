import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchEvents } from './services/api';

const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const getCurrentWeek = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Minggu

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, '0');
    const dd = String(day.getDate()).padStart(2, '0');
    return {
      label: days[day.getDay()],
      date: `${yyyy}-${mm}-${dd}`,
      isToday: day.toDateString() === today.toDateString(),
    };
  });
};

export default function WeeklyCalendarScreen() {
  const [week, setWeek] = useState(getCurrentWeek());
  const [events, setEvents] = useState({});
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const result = await fetchEvents();
      const mapped = {};
      result.forEach(ev => {
        mapped[ev.date] = ev.title;
      });
      setEvents(mapped);
    };
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kalender Mingguan</Text>
      {week.map((day, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dayBox,
            day.isToday && styles.todayBox,
          ]}
          onPress={() =>
            router.push({
              pathname: '/tambah-event',
              params: { date: day.date },
            })
          }
        >
          <Text style={styles.dayLabel}>{day.label}</Text>
          <Text style={styles.dateText}>{day.date}</Text>
          {events[day.date] && (
            <Text style={styles.eventText}>📌 {events[day.date]}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dayBox: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
  },
  todayBox: {
    borderLeftColor: '#00adf5',
    backgroundColor: '#e3f2fd',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#555',
  },
  eventText: {
    marginTop: 6,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#2e7d32',
  },
});
