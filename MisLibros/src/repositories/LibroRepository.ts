import { supabase } from '../supabase';

export interface Libro {
  id?: number;
  titulo: string;
  autor: string;
  anio: number;
  user_id?: string;
}

export class LibroRepository {
  private static instance: LibroRepository;

  private constructor() {}

  public static getInstance(): LibroRepository {
    if (!LibroRepository.instance) {
      LibroRepository.instance = new LibroRepository();
    }
    return LibroRepository.instance;
  }

  async obtenerLibros(): Promise<Libro[]> {
    const { data, error } = await supabase
      .from('libros')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error al obtener libros:', error.message);
      return [];
    }
    return data || [];
  }

  async agregarLibro(libro: Omit<Libro, 'id' | 'user_id'>): Promise<Libro | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No hay usuario autenticado');
      return null;
    }

    const { data, error } = await supabase
      .from('libros')
      .insert([{ ...libro, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error al agregar libro:', error.message);
      return null;
    }
    return data;
  }

  async eliminarLibro(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('libros')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar libro:', error.message);
      return false;
    }
    return true;
  }
}