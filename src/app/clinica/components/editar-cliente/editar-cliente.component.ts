import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../interfaces/cliente';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ClientesService } from '../../services/clientes.service';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrl: './editar-cliente.component.css',
  providers: [MessageService]
})
export class EditarClienteComponent {

  @Input()
  cliente?: Cliente;

  clienteForm: FormGroup;

  generos: any;  // Opcional, si quieres tener una lista de géneros

  constructor(
    private fb: FormBuilder,
    @Inject(DynamicDialogRef) public ref: DynamicDialogRef,
    @Inject(DynamicDialogConfig) public config: DynamicDialogConfig,
    private service: ClientesService,
    private clienteComunicacionService: ClienteComunicacionService,
    private messageService: MessageService,) {

    this.cliente = this.config.data;
    console.log(this.cliente);

    this.clienteForm = this.fb.group({
      id: [this.cliente?.id],
      nombre: [this.cliente?.nombre, [Validators.required, Validators.pattern(/^[a-zA-Z]{3,}$/)]],
      edad: [this.cliente?.edad, [Validators.required, Validators.min(0)]],
      genero: [this.cliente?.genero, Validators.required],
      email: [this.cliente?.email, Validators.email],
      telefono: [this.cliente?.telefono],
      contacto: [this.cliente?.contacto],
      telefono2: [this.cliente?.telefono2],
      fechaRegistro: [new Date(), Validators.required]
    });
    console.log("cliente")
    console.log(this.cliente)
    console.log("cliente")
  }
  ngOnInit(): void {
    this.generos = [
      { name: 'Femenino', code: 'Femenino' },
      { name: 'Masculino', code: 'Masculino' },
    ];

    console.log("cliente2")
    console.log(this.cliente)
    console.log("cliente2")
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value;
      // Llama a tu servicio para guardar el cliente

      console.log("Llamada al metodo");
      console.log(cliente);

      console.log(cliente.id);

      this.service.actualizarCliente(cliente.id, cliente).subscribe(
        response => {
          this.clienteComunicacionService.emitClienteEditado(cliente);  // Emitir el evento
          console.log('Cliente agregado:');
          this.ref.close();
        },
        error => {
          console.error('Error al agregar el cliente:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'A ocurrido un error.' });
        }
      );
      console.log(cliente);
    }
  }
}
