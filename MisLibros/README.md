1. ¿Por qué es conveniente separar la lógica de los libros de App.tsx?
Porque así mantengo el código ordenado y limpio. Si metiera toda la lógica de agregar o eliminar libros directamente en App.tsx el archivo se llenaría de líneas y sería re difícil de entender o arreglar después. Al separarlo, la pantalla solo se encarga del diseño y la lógica se maneja aparte.

2. ¿Qué responsabilidad tiene LibroService?
Se encarga de toda la lógica de negocio es como la herramienta que gestiona la lista de libros, sabe cómo guardarlos, eliminarlos de la lista y enviárselos a la pantalla cuando los necesita sin meterse con la parte del diseño.

3. ¿Qué responsabilidad tiene la clase Libro?
Representa la plantilla de cada libro, su trabajo es definir la estructura que tiene un libro (id, título, autor y año) y proteger esos datos usando variables privadas para que solo se puedan consultar mediante sus métodos getter.