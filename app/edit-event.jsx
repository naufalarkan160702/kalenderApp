import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditEvent = () => {
  const { date, title } = useLocalSearchParams();
  const [newTitle, setNewTitle] = useState(title);
  const router = useRouter();

  const handleSave = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Judul tidak boleh kosong');
      return;
    }

    const stored = await AsyncStorage.getItem('events');
    let events = stored ? JSON.parse(stored) : [];

    const updated = events.map(e => {
      if (e.date === date) return { ...e, title: newTitle };
      return e;
    });

    await AsyncStorage.setItem('events', JSON.stringify(updated));
    Alert.alert('Berhasil', 'Event berhasil diperbarui');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Event - {date}</Text>
      <TextInput
        style={styles.input}
        value={newTitle}
        onChangeText={setNewTitle}
        placeholder="Judul baru"
      />
      <Button title="💾 Simpan Perubahan" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});

export default EditEvent;
