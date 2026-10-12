import { supabase } from '../supabase';

export class AuthService {
  async registrarse(email: string, pass: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  }

  async iniciarSesion(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  }

  async cerrarSesion() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async obtenerUsuario() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
}