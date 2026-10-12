Tarea5 - POO y Separación de Responsabilidades
1. ¿Por qué es conveniente separar la lógica de los libros de App.tsx?
Porque así mantengo el código ordenado y limpio. Si metiera toda la lógica de agregar o eliminar libros directamente en App.tsx el archivo se llenaría de líneas y sería re difícil de entender o arreglar después. Al separarlo, la pantalla solo se encarga del diseño y la lógica se maneja aparte.

2. ¿Qué responsabilidad tiene LibroService?
Se encarga de toda la lógica de negocio es como la herramienta que gestiona la lista de libros, sabe cómo guardarlos, eliminarlos de la lista y enviárselos a la pantalla cuando los necesita sin meterse con la parte del diseño.

3. ¿Qué responsabilidad tiene la clase Libro?
Representa la plantilla de cada libro, su trabajo es definir la estructura que tiene un libro (id, título, autor y año) y proteger esos datos usando variables privadas para que solo se puedan consultar mediante sus métodos getter.

Tarea6 - Modificaciones - Repository y Singleton

- LibroRepository: Creé la clase LibroRepository en src/repositories/ para que sea la única encargada de guardar y manejar la lista de libros (verlos, agregarlos y eliminarlos), quitándole esa carga a la pantalla.

- Patrón Singleton: Le apliqué el patrón Singleton a LibroRepository usando getInstance() para asegurar que toda la aplicación use siempre una sola instancia de los datos y no se dupliquen.

- Estructura final: La aplicación quedó organizada en este orden: App.tsx -> LibroService -> LibroRepository -> Datos Mock.
 
Tarea7 — Supabase y Autenticación

1. Configuración de Supabase
Conecté la app con Supabase para guardar la información en la nube en lugar de datos de prueba. Creé la tabla libros con los campos de id, titulo, autor, anio y user_id, y le activé las políticas de RLS para proteger los datos.

2. ¿Cómo se relaciona la autenticación con el acceso a los datos?
La autenticación es básicamente para que la app sepa quién se está conectando cuando mete su correo y contraseña. Esto se relaciona con los datos porque, al saber quién entró, la base de datos solo le deja ver, agregar o eliminar sus propios libros, así cada persona tiene su información guardada aparte y nadie puede ponerse a ver o borrar los libros de otros.
