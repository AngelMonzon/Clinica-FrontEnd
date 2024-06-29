import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../interfaces/cliente';
import { ClientesService } from '../../services/clientes.service';
import { HistorialService } from '../../services/HistorialService.service';
import { Historial } from '../../interfaces/historial.interface';
import { Producto } from '../../interfaces/product.interface';
import { ProductoService } from '../../services/product.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PagarComponent } from '../../components/pagar/pagar.component';
import { Footer, MessageService } from 'primeng/api';
import { BillItem } from '../../interfaces/billItems';
import { VentaComunicationService } from '../../services/ventasComunication.service';
import { Subscription } from 'rxjs';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-punto-venta',
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.css'],
  providers: [MessageService, DialogService]
})
export class PuntoVentaComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table!: Table;

  [x: string]: any;
  // Formularios
  patientForm: FormGroup;
  nuevoTratamientoForm: FormGroup;
  nuevoProductoForm: FormGroup;

  // Items Agregados
  billItems: BillItem[] = [];
  tratamientosAgregados: Historial[] = [];
  productosAgregados: Producto[] = [];

  treatments: string[] = ['Limpieza Dental', 'Extracción de Muelas', 'Implante Dental', 'Ortodoncia'];
  total: number = 0;

  clientes: Cliente[] = [];
  clienteSeleccionado!: Cliente;

  historialClientes: Historial[] = [];
  historialSeleccionado!: Historial;

  productos: Producto[] = [];
  productoSeleccionado!: Producto;

  // Productos y tratamientos que se van agregando al carrito
  productosCarrito: Producto[] = [];
  tratamientosCarrito: Historial[] = [];

  ref: DynamicDialogRef | undefined;
  private ventaRealizadaSubscription!: Subscription;
  private dialogClosedSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private historialService: HistorialService,
    private productoService: ProductoService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private ventaService: VentaComunicationService) {

    this.patientForm = this.fb.group({
      patientName: ['', Validators.required],
      patientId: ['', Validators.required ]
    });

    this.nuevoTratamientoForm = this.fb.group({
      descripcion: ['', Validators.required],
      precio: [0],
      total: [0],
      abonar: [0],
      idTrabajo: [0],
    });

    this.nuevoProductoForm = this.fb.group({
      nombreProducto: [''],
      precioVenta: [0],
      cantidad: [1, Validators.required],
      codigoBarra: [0],
    });
  }

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe(
      clientes => {
        this.clientes = clientes;
      }
    );

    this.productoService.obtenerProductos().subscribe(
      productos => {
        this.productos = productos;
      }
    )

    // Suscribirse al evento de venta realizada
    this.ventaRealizadaSubscription = this.ventaService.ventaRealizada$.subscribe(() => {

      this.messageService.add({ severity: 'success', summary: 'Venta Realizada', detail: 'La venta se ha completado exitosamente', life: 3000 });

      this.reiniciarVenta();
    });

    // Suscribirse a la notificación de cierre del diálogo
    this.dialogClosedSubscription = this.ventaService.dialogClosed$.subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Ningun metodo de pago seleccionado', life: 3000 });
    });

  }

  // Actualizar arreglos
  actualizarHistorial(id: number) {
    this.historialService.getHistorialPorId(id).subscribe(
      historial => {
        this.historialClientes = historial;
        this.historialSeleccionado = historial[0];
      }, error => {
        console.log('error');
        this.historialClientes = [];
      }
    );
  }

  // Funciones que se ejecutaran al seleccionar un elemento en los select
  onClientSelect(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const nombre = String(selectElement.value);
    this.clienteSeleccionado = this.clientes.find(cliente => cliente.nombre === nombre)!;
    this.patientForm.patchValue({
      patientId: this.clienteSeleccionado.id
    });

    this.actualizarHistorial(this.clienteSeleccionado.id);


  }

  onClientSelectById(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const id = Number(selectElement.value);
    this.clienteSeleccionado = this.clientes.find(cliente => cliente.id === id)!;
    this.patientForm.patchValue({
      patientName: this.clienteSeleccionado.nombre
    });
    console.log(this.clienteSeleccionado);

    this.actualizarHistorial(this.clienteSeleccionado.id);
  }

  onTreatmentChange(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const id = Number(selectElement.value);

    this.historialSeleccionado = this.historialClientes.find(historial => historial.idTrabajo === id)!;

    this.nuevoTratamientoForm.patchValue({
      abonar: this.historialSeleccionado.debe
    });
  }

  onProductChange(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const id = Number(selectElement.value);

    this.productoSeleccionado = this.productos.find(producto => producto.id === id)!;
  }

  // Agregar productos o tratamientos a la tabla
  addTreatment(): void {
    if (this.nuevoTratamientoForm.value.descripcion =! '' && this.nuevoTratamientoForm.value.abonar > 0 && this.historialSeleccionado) {
      const treatment = this.historialSeleccionado.descripcion;
      const price = this.nuevoTratamientoForm.value.abonar;
      const cantidad = 1;
      const articulo = 1;
      const id: any = this.historialSeleccionado.idTrabajo;
      this.billItems.push({ treatment, price, cantidad, articulo, id});
      this.tratamientosCarrito.push({...this.historialSeleccionado, debe: this.historialSeleccionado.debe! - this.nuevoTratamientoForm.value.abonar});
      console.log(this.tratamientosCarrito);

      this.calculateTotal();
      this.nuevoTratamientoForm.reset();
      console.log(this.tratamientosCarrito);
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Elija un articulo', life: 3000 });
    }
  }

  addProduct(): void {
    if (this.nuevoProductoForm.value.nombreProducto =! '' && this.nuevoProductoForm.value.cantidad > 0 && this.productoSeleccionado) {
      const treatment = this.productoSeleccionado.nombreProducto;
      const price = this.productoSeleccionado.precioVenta;
      const cantidad = this.nuevoProductoForm.value.cantidad;
      const articulo = 2;
      const id: any = this.productoSeleccionado.id;
      this.billItems.push({ treatment, price, cantidad, articulo, id });
      this.productosCarrito.push({...this.productoSeleccionado, cantidad: cantidad});
      this.calculateTotal();
      this.nuevoProductoForm.reset();
      console.log(this.billItems);

      this.nuevoProductoForm.patchValue({
        cantidad: 1
      })
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Elija un articulo', life: 3000 });
    }
  }

  removeTreatment(item: BillItem): void {
    const index = this.billItems.indexOf(item);
    if (index > -1) {
      this.billItems.splice(index, 1);
      this.calculateTotal();
    }

    if(item.articulo = 1) {
      let borrar = this.tratamientosCarrito.find(tratamiento => tratamiento.id === item.id)!;
      this.tratamientosCarrito.splice(this.tratamientosCarrito.indexOf(borrar), 1);
    } else if(item.articulo = 2) {
      let borrar = this.productosCarrito.find(producto => producto.id === item.id)!;
      this.productosCarrito.splice(this.productosCarrito.indexOf(borrar), 1);
    }

    console.log(this.productosCarrito);
  }

  calculateTotal(): void {
    this.total = this.billItems.reduce((sum, item) => sum + item.price * item.cantidad, 0);
  }

  finalizeSale(): void {
    this.mostrarPagar();
    //this.resetForm();
  }

  reiniciarVenta(): void {
    // Reiniciar formularios
    this.patientForm.reset();
    this.nuevoTratamientoForm.reset();
    this.nuevoProductoForm.reset();

    // Reiniciar items agregados
    this.billItems = [];
    this.tratamientosAgregados = [];
    this.productosAgregados = [];

    // Reiniciar total
    this.total = 0;

    // Reiniciar cliente y historial
    this.clienteSeleccionado = {} as Cliente;
    this.historialClientes = [];
    this.historialSeleccionado = {} as Historial;

    // Reiniciar productos y tratamientos
    this.productoSeleccionado = {} as Producto;
    this.productosCarrito = [];
    this.tratamientosCarrito = [];

    this.nuevoProductoForm.patchValue({
      cantidad: 1
    })
  }


  mostrarPagar() {
    if (this.billItems.length > 0) {
      this.ref = this.dialogService.open(PagarComponent, {
        header: 'Selecciona un metodo de pago',
        width: '50vw',
        contentStyle: { overflow: 'auto' },
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
        templates: {
            footer: Footer
        },
        data: {
          tratamientos: this.tratamientosCarrito,
          productos: this.productosCarrito,
          venta: this.billItems,
          idPaciente: this.patientForm.value.patientId || 0,
          nombrePaciente: this.patientForm.value.patientName || ""
        }
    });
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No se a agregado ningun articulo', life: 3000 });
    }
  }


  ngOnDestroy() {
      if (this.ref) {
          this.ref.close();
      }
  }
}
