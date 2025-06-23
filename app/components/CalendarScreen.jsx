import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { fetchEvents } from '../services/api';

const CalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventsByDate, setEventsByDate] = useState({});

  useEffect(() => {
    const loadEvents = async () => {
      const events = await fetchEvents();
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
      setLoading(false);
    };

    loadEvents();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={styles.container}>
      <View style={{ overflow: 'hidden' }}>
        <Calendar
          markingType={'simple'}
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
          hideExtraDays={false}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            calendarBackground: '#ffffff',
            selectedDayBackgroundColor: '#00adf5',
            todayTextColor: '#00adf5',
            arrowColor: 'orange',
            monthTextColor: 'black',
          }}
        />
      </View>

      {selectedDate && eventsByDate[selectedDate] && (
        <View style={styles.eventBox}>
          <Text style={styles.eventTitle}>📌 {eventsByDate[selectedDate]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 10,
    flex: 1,
  },
  eventBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00796b',
  },
});

export default CalendarScreen;
