export interface Venta {
  id: number | null;
  idPaciente: number;
  articulos: string[];
  fecha: Date | string;
  venta: number;
  pago: number;
  metodoPago: string;
  nombrePaciente: string;
  costoProductos: string[];
}
