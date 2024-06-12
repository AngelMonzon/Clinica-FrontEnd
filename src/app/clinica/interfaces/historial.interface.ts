export interface Historial {
  id:            number;
  fecha:         Date;
  descripcion:   string;
  precio:        number;
  cantidad:      number;
  total:         number;
  tipoDePago:    number;
  observaciones: null;
  idTrabajo:     number | null;
  debe: number | null;
}
