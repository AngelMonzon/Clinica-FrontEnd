import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../interfaces/product.interface';
import { Historial } from '../../interfaces/historial.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BillItem } from '../../interfaces/billItems';
import { VentaComunicationService } from '../../services/ventasComunication.service';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../interfaces/venta.interface';
import { HistorialService } from '../../services/HistorialService.service';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css'],
  providers: []
})
export class PagarComponent implements OnInit {

  // Variables recibidas del objeto PuntoVenta
  idPaciente!: number;
  nombrePaciente!: string;
  tratamientos: Historial[] = [];
  productos: Producto[] = [];
  venta: BillItem[] = [];
  total: number = 0;
  totalAbsoluto: number = 0;

  pagarForm: FormGroup;
  tiposPago: string[] = ['Efectivo', 'Tarjeta De Debito', 'Tarjeta De Credito'];

  // Boton editar
  stateOptions: any[] = [{ label: 'No', value: false }, { label: 'Si', value: true }];
  imprimir: boolean = true;

  pagado: boolean = false;
  cambio: number = 0;

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public dynamicDialogRef: DynamicDialogRef,
    private ventaComunicationService: VentaComunicationService,
    private ventaService: VentaService,
    private historialService: HistorialService) {

    this.pagarForm = this.fb.group({
      cantidad: ['', Validators.required],
      metodoPago: ['Efectivo', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log(this.config.data);

    if (this.config.data) {
      this.idPaciente = this.config.data.idPaciente;
      this.nombrePaciente = this.config.data.nombrePaciente;
      this.tratamientos = this.config.data.tratamientos;
      this.productos = this.config.data.productos;
      this.venta = this.config.data.venta;

      this.total = this.venta.reduce((sum, item) => sum + item.price * item.cantidad, 0);
      this.totalAbsoluto = this.venta.reduce((sum, item) => sum + item.price * item.cantidad, 0);
      console.log(this.total);
    }
  }

  pagar(pago: any): void {
    if (pago >= this.total) {
      let articulos: string[] = [];
      let precios: string[] = [];
      this.venta.forEach(articulo => {
        if (articulo.cantidad > 1) {
          articulos.push(articulo.treatment + " x " + articulo.cantidad);
        } else {
          articulos.push(articulo.treatment);
        }
        precios.push(articulo.price.toString())
      });
      let venta: Venta = {
        id: null,
        idPaciente: this.idPaciente,
        articulos: articulos,
        fecha: this.formatDateToYYYYMMDD(new Date),
        venta: this.totalAbsoluto,
        pago: pago,
        metodoPago: this.pagarForm.value.metodoPago,
        nombrePaciente: this.nombrePaciente,
        costoProductos: precios,
      }


      this.ventaService.addVenta(venta).subscribe(
        venta => {
          this.cambio = pago - this.total;
          this.pagado = true;
          this.ventaComunicationService.notificarVentaRealizada();

          this.tratamientos.forEach(tratamiento => {
            this.historialService.actualizarHistorial(tratamiento).subscribe();
          });

          this.downloadPdf(venta);
        }, error => {

        }
      )
    } else if (pago < this.total) {
      this.total = this.total - pago;
    }
  }

  cerrarVentana():void {
    this.dynamicDialogRef.close();
  }

  downloadPdf(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ticket.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnDestroy() {
    if (this.pagado === false) {
      this.ventaComunicationService.notificarDialogoCerrado();
    }
}
}
