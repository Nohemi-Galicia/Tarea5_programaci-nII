export class Libro {
  private id: string;
  private titulo: string;
  private autor: string;
  private anio: number;

  constructor(id: string, titulo: string, autor: string, anio: number) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.anio = anio;
  }

  public getId(): string {
    return this.id;
  }

  public getTitulo(): string {
    return this.titulo;
  }

  public getAutor(): string {
    return this.autor;
  }

  public getAnio(): number {
    return this.anio;
  }

  public getDescripcion(): string {
    return `"${this.titulo}" por ${this.autor} (${this.anio})`;
  }
}