export interface Gasto {
  id: number;
  concepto: string;
  costo: number;
  fecha: string; // usar string en lugar de Date para simplificar la serialización/deserialización JSON
  recurrente: number;
  recurrencia: string;
}
