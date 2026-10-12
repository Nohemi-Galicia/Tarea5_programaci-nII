import { LibroRepository, Libro } from '../repositories/LibroRepository';

export class LibroService {
  private repository = LibroRepository.getInstance();

  async obtenerLibros(): Promise<Libro[]> {
    return await this.repository.obtenerLibros();
  }

  async agregarLibro(titulo: string, autor: string, anio: number): Promise<Libro | null> {
    return await this.repository.agregarLibro({ titulo, autor, anio });
  }

  async eliminarLibro(id: number): Promise<boolean> {
    return await this.repository.eliminarLibro(id);
  }
}