import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { supabase } from './src/supabase';
import { LibroService } from './src/services/LibroService';
import { AuthService } from './src/services/AuthService';
import { Libro } from './src/repositories/LibroRepository';

const libroService = new LibroService();
const authService = new AuthService();

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [sesionCerrada, setSesionCerrada] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'exito'; texto: string } | null>(null);

  // Estados de Libros
  const [libros, setLibros] = useState<Libro[]>([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anio, setAnio] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      cargarLibros();
    }
  }, [session]);

  const cargarLibros = async () => {
    const datos = await libroService.obtenerLibros();
    setLibros(datos);
  };

  const handleAuth = async () => {
    setMensaje(null);
    if (!email || !password) {
      setMensaje({ tipo: 'error', texto: 'Por favor ingresa correo y contraseña' });
      return;
    }
    if (password.length < 6) {
      setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    try {
      if (esRegistro) {
        await authService.registrarse(email, password);
        setMensaje({ tipo: 'exito', texto: '¡Registro exitoso! Ya puedes iniciar sesión.' });
        setEsRegistro(false);
      } else {
        await authService.iniciarSesion(email, password);
      }
    } catch (error: any) {
      // Capturamos el error específico de "User already registered" de Supabase
      if (esRegistro && error.message.includes("User already registered")) {
        // Establecemos el mensaje de éxito (verde) con el texto en español
        setMensaje({ tipo: 'exito', texto: 'El usuario ya está registrado' });
      } else {
        // Para otros errores, mostramos la alerta de error (rosa) con el mensaje de error
        setMensaje({ tipo: 'error', texto: error.message || 'Error al autenticar' });
      }
    }
  };

  const handleCerrarSesion = async () => {
    await authService.cerrarSesion();
    setLibros([]);
    setMensaje(null);
    setSesionCerrada(true); // <--- Muestra la pantalla de sesión cerrada
  };

  const handleAgregar = async () => {
    if (!titulo || !autor || !anio) {
      setMensaje({ tipo: 'error', texto: 'Completa todos los campos del libro' });
      return;
    }

    const anioNumero = parseInt(anio, 10);
    if (isNaN(anioNumero)) {
      setMensaje({ tipo: 'error', texto: 'El año debe ser un número válido' });
      return;
    }

    const nuevoLibro = await libroService.agregarLibro(titulo, autor, anioNumero);
    if (nuevoLibro) {
      setTitulo('');
      setAutor('');
      setAnio('');
      setMensaje(null);
      cargarLibros();
    } else {
      setMensaje({ tipo: 'error', texto: 'No se pudo agregar el libro' });
    }
  };

  const handleEliminar = async (id?: number) => {
    if (id === undefined) return;
    const exito = await libroService.eliminarLibro(id);
    if (exito) {
      cargarLibros();
    } else {
      setMensaje({ tipo: 'error', texto: 'No se pudo eliminar el libro' });
    }
  };

  // VISTA 1: Pantalla de Sesión Cerrada
  if (sesionCerrada) {
    return (
      <View style={styles.container}>
        <View style={[styles.content, { alignItems: 'center', marginTop: 40 }]}>
          <Text style={styles.headerTitle}>Sesión Cerrada</Text>
          
          <View style={[styles.alertBox, styles.alertExito, { width: '100%', marginVertical: 20 }]}>
            <Text style={styles.alertText}>Has cerrado sesión exitosamente.</Text>
          </View>

          <TouchableOpacity
            style={[styles.addButton, { width: '100%' }]}
            onPress={() => setSesionCerrada(false)}
          >
            <Text style={styles.addButtonText}>Volver a Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // VISTA 2: Login / Registro
  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.headerTitle}>
            {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </Text>

          {mensaje && (
            <View style={[styles.alertBox, mensaje.tipo === 'error' ? styles.alertError : styles.alertExito]}>
              <Text style={styles.alertText}>{mensaje.texto}</Text>
            </View>
          )}

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#888"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAuth}>
              <Text style={styles.addButtonText}>
                {esRegistro ? 'Registrarse' : 'Ingresar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 15, alignItems: 'center' }}
              onPress={() => {
                setMensaje(null);
                setEsRegistro(!esRegistro);
              }}
            >
              <Text style={{ color: '#007bff', fontWeight: 'bold' }}>
                {esRegistro
                  ? '¿Ya tienes cuenta? Inicia sesión'
                  : '¿No tienes cuenta? Regístrate aquí'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // VISTA 3: Home (Libros)
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Mis Libros</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
            <Text style={styles.logoutButtonText}>Salir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.userInfoText}>Usuario: {session.user.email}</Text>

        {mensaje && (
          <View style={[styles.alertBox, mensaje.tipo === 'error' ? styles.alertError : styles.alertExito]}>
            <Text style={styles.alertText}>{mensaje.texto}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Título"
            placeholderTextColor="#888"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={styles.input}
            placeholder="Autor"
            placeholderTextColor="#888"
            value={autor}
            onChangeText={setAutor}
          />
          <TextInput
            style={styles.input}
            placeholder="Año"
            placeholderTextColor="#888"
            value={anio}
            keyboardType="numeric"
            onChangeText={setAnio}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAgregar}>
            <Text style={styles.addButtonText}>Agregar Libro</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={libros}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.cardItem}>
              <View style={styles.cardInfo}>
                <Text style={styles.bookTitle}>{item.titulo}</Text>
                <Text style={styles.bookSubtitle}>
                  "{item.titulo}" por {item.autor} ({item.anio})
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleEliminar(item.id)}
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  userInfoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  alertBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  alertError: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  alertExito: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  alertText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#6c757d',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cardItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  bookSubtitle: {
    fontSize: 14,
    color: '#999999',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});