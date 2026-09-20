import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { LibroService } from './src/services/LibroService';
import { Libro } from './src/models/Libro';

const libroService = new LibroService();

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anio, setAnio] = useState('');

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = () => {
    setLibros(libroService.obtenerLibros());
  };

  const handleAgregar = () => {
    if (!titulo || !autor || !anio) return;
    const nuevoLibro = new Libro(Date.now().toString(), titulo, autor, parseInt(anio));
    libroService.agregarLibro(nuevoLibro);
    setTitulo('');
    setAutor('');
    setAnio('');
    cargarLibros();
  };

  const handleEliminar = (id: string) => {
    libroService.eliminarLibro(id);
    cargarLibros();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.tituloHeader}>Mis Libros</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
        <TextInput style={styles.input} placeholder="Autor" value={autor} onChangeText={setAutor} />
        <TextInput style={styles.input} placeholder="Año" value={anio} onChangeText={setAnio} keyboardType="numeric" />
        <TouchableOpacity style={styles.btnAgregar} onPress={handleAgregar}>
          <Text style={styles.btnTexto}>Agregar Libro</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={libros}
        keyExtractor={(item) => item.getId()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.libroTitulo}>{item.getTitulo()}</Text>
              <Text style={styles.libroSub}>"{item.getTitulo()}" por {item.getAutor()} ({item.getAnio()})</Text>
            </View>
            <TouchableOpacity style={styles.btnEliminar} onPress={() => handleEliminar(item.getId())}>
              <Text style={styles.btnTexto}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 30,
    paddingTop: 40,
    width: '100%',
  },
  tituloHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  form: {
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
  },
  btnAgregar: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnEliminar: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  libroTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  libroSub: {
    color: '#666666',
    fontSize: 13,
  },
});