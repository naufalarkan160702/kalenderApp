import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TambahEventScreen = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const [title, setTitle] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Judul tidak boleh kosong');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem('events');
      const existing = stored ? JSON.parse(stored) : [];

      existing.push({ date, title });

      await AsyncStorage.setItem('events', JSON.stringify(existing));
      Alert.alert('Berhasil', 'Event ditambahkan!');
      router.back();
    } catch (e) {
      console.error('Gagal simpan event', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tanggal: {date}</Text>
      <TextInput
        placeholder="Judul Event"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Simpan Event" onPress={handleSave} />
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

export default TambahEventScreen;
