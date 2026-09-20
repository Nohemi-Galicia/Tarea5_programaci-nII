import { Libro } from '../models/Libro';

export class LibroRepository {
  private static instancia: LibroRepository;
  private libros: Libro[] = [];

  private constructor() {
    
    this.libros = [
      new Libro('1', 'El Principito', 'Antoine', 1943),
      new Libro('2', 'Barbuchín', 'Daniel Armas', 1941),
      new Libro('3', 'El Sembrador Escolar', 'Silvia', 2000)
    ];
  }

  public static getInstance(): LibroRepository {
    if (!LibroRepository.instancia) {
      LibroRepository.instancia = new LibroRepository();
    }
    return LibroRepository.instancia;
  }

  public obtenerLibros(): Libro[] {
    return [...this.libros];
  }

  public agregarLibro(libro: Libro): void {
    this.libros.push(libro);
  }

  public eliminarLibro(id: string): void {
    
    this.libros = this.libros.filter((l) => l.getId() !== id);
  }
}