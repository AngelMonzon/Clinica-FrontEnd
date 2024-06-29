import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { EditarProductoComponent } from '../editar-producto/editar-producto.component';
import { Producto } from '../../interfaces/product.interface';
import { ProductoService } from '../../services/product.service';
import { ProductoComunicacionService } from '../../services/productComunication.service';

@Component({
  selector: 'app-tabla-producto',
  templateUrl: './tabla-productos.component.html',
  styleUrls: ['./tabla-productos.component.css'],
  providers: [MessageService, DialogService]
})
export class TablaProductoComponent {
  ref: DynamicDialogRef | undefined;

  @ViewChild('dt1') dt1?: Table;

  searchValue: string = '';

  productos!: Producto[];

  loading: boolean = true;

  sizes!: any[];

  selectedSize: any = '';

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private productoComunicacionService: ProductoComunicacionService
  ) { }

  ngOnInit() {
    this.productoService.obtenerProductos().subscribe((productos) => {
      this.productos = productos;
      this.loading = false;
    });

    this.sizes = [
      { name: 'Small', class: 'p-datatable-sm' },
      { name: 'Normal', class: '' },
      { name: 'Large', class: 'p-datatable-lg' }
    ];

    this.productoComunicacionService.productoAgregado$.subscribe(() => {
      this.loading = true;
      this.messageService.add({ severity: 'info', summary: 'Agregado', detail: 'Producto Agregado' });
      this.productoService.obtenerProductos().subscribe((productos) => {
        this.productos = productos;
        this.loading = false;
      });
    });
  }

  clear(table: any) {
    table.clear();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  borrarConfirm(event: Event, producto: Producto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Se borrará permanentemente este producto',
      header: 'Borrar',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.productoService.eliminarProducto(producto.id).subscribe(() => {
          this.productoService.obtenerProductos().subscribe((productos) => {
            this.productos = productos;
          });
          this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: 'Producto Eliminado' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Operación Cancelada' });
      }
    });
  }

  showEdit(producto: Producto) {
    this.ref = this.dialogService.open(EditarProductoComponent, {
      header: 'Editar Producto',
      width: '30%',
      modal: true,
      baseZIndex: 10000,
      data: producto
    });

    this.ref.onClose.subscribe(() => {
      this.productoService.obtenerProductos().subscribe((productos) => {
        this.productos = productos;
      });
    });
  }
}
