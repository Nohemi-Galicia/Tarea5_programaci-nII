import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LibroService } from './src/services/LibroService';
import { Libro } from './src/models/Libro';

const servicioLibros = new LibroService();

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anio, setAnio] = useState('');

  const handleAgregar = () => {
    if (!titulo.trim() || !autor.trim() || !anio.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const anioNum = parseInt(anio, 10);
    if (isNaN(anioNum)) {
      Alert.alert('Error', 'El año debe ser un número válido.');
      return;
    }

    servicioLibros.agregarLibro(titulo, autor, anioNum);
    setLibros(servicioLibros.obtenerLibros());

    setTitulo('');
    setAutor('');
    setAnio('');
  };

  const handleEliminar = (id: string) => {
    servicioLibros.eliminarLibro(id);
    setLibros(servicioLibros.obtenerLibros());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Mis Libros</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={autor}
          onChangeText={setAutor}
        />
        <TextInput
          style={styles.input}
          placeholder="Año"
          keyboardType="numeric"
          value={anio}
          onChangeText={setAnio}
        />
        <TouchableOpacity style={styles.btnAgregar} onPress={handleAgregar}>
          <Text style={styles.btnText}>Agregar Libro</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={libros}
        keyExtractor={(item) => item.getId()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>{item.getTitulo()}</Text>
              <Text style={styles.cardSub}>{item.getDescripcion()}</Text>
            </View>
            <TouchableOpacity
              style={styles.btnEliminar}
              onPress={() => handleEliminar(item.getId())}
            >
              <Text style={styles.btnEliminarText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay libros registrados.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6', paddingHorizontal: 20, paddingTop: 40 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 20 },
  form: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#e5e5ea', borderRadius: 8, padding: 10, marginBottom: 10 },
  btnAgregar: { backgroundColor: '#007aff', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  info: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: '#8e8e93', marginTop: 4 },
  btnEliminar: { backgroundColor: '#ff3b30', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnEliminarText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  empty: { textAlign: 'center', color: '#8e8e93', marginTop: 40 },
});