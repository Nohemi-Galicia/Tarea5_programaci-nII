import { Libro } from '../models/Libro';
import { LibroRepository } from '../repositories/LibroRepository';

export class LibroService {
  private repository: LibroRepository;

  constructor() {
    this.repository = LibroRepository.getInstance();

    const instanciaA = LibroRepository.getInstance();
    const instanciaB = LibroRepository.getInstance();
    console.log('Prueba Singleton:', instanciaA === instanciaB);
  }

  public obtenerLibros(): Libro[] {
    return this.repository.obtenerLibros();
  }

  public agregarLibro(libro: Libro): void {
    this.repository.agregarLibro(libro);
  }

  public eliminarLibro(id: string): void {
    this.repository.eliminarLibro(id);
  }
}