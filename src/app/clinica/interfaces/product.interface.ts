export interface Producto {
  id:               number;
  nombreProducto:   string;
  nombreGenerico:   string;
  categoria:        string;
  fechaManufactura: Date;
  fechaExpiracion:  Date;
  codigoBarra:      string;
  cantidad:         number;
  precioCompra:     number;
  precioVenta:      number;
}
