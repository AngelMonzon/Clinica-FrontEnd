import { ChangeDetectorRef, Component, Input, OnInit, input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { RayosXService } from '../../services/royosX.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-rayos-x',
  templateUrl: './rayos-x.component.html',
  styleUrl: './rayos-x.component.css',
  providers: [MessageService]
})
export class RayosXComponent implements OnInit {

  @Input()
  idPaciente: any;

  //Direccion del archivo pdf de Rayos X
  pdfSrc: string[] = [
    'http://localhost:8050/uploads/AmeliaJudith.pdf',
    'http://localhost:8050/uploads/AmeliaJudith.pdf',
    'http://localhost:8050/uploads/AmeliaJudith.pdf'
  ];

  nombreArchivos: string[] = [];

  pdfSeleccionado!: string;

  //Variable para abir radiografias
  visible: boolean = false;

  uploadedFiles: any[] = [];

  selectedPdf: any;

  borrarVisible: boolean = false;

  constructor(
    private messageService: MessageService,
    private rayosXService: RayosXService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    public config: DynamicDialogConfig) {
      this.idPaciente = this.config.data.idPaciente;
      console.log(this.idPaciente);

    }


  ngOnInit(): void {
    this.cargarPdfs();
  }

  onUpload(event:FileUploadEvent) {
      for(let file of event.files) {
          this.nombreArchivos.push('http://localhost:8050/uploads/rayosx/' + file.name);

      }

      this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  mostrarRayosX(pdf: string) {
    const url = 'http://localhost:8050/uploads/rayosx/'+ this.idPaciente + '/' + pdf;
    window.open(url, '_blank');
  }


  handleSelect(event: any): void {
    // Verifica si se seleccionó un archivo
    if (event && event.files && event.files.length > 0) {
      const selectedFile = event.files[0];
      if (selectedFile.objectURL) {
        // Si el archivo tiene un URL de objeto, asignalo a la propiedad selectedImage
        this.selectedPdf = selectedFile.objectURL;
      }
    }
  }


  handleUpload(event: any) {
    // Manejar la respuesta del servidor después de cargar el archivo
    console.log('Archivo subido');
    console.log(event.files);


    if (event && event.files && event.files.length > 0) {
      const uploadedFile = event.files[0];

      setTimeout(() => {
        this.cargarPdfs();
        this.cdr.detectChanges();

      }, 2000);

      this.messageService.add({ severity: 'info', summary: 'Archivo subido', detail: uploadedFile.name });

    }
  }

  borrarPdf(nombreArchivo: string, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Se borrara permanentemente este archivo',
      header: 'Borrar',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.rayosXService.deleteFile(nombreArchivo, this.idPaciente).subscribe(
          borrar => {
            let index = this.nombreArchivos.findIndex(item => item === nombreArchivo);

            if (index !== -1) {
              this.nombreArchivos.splice(index, 1);
            }
            this.cdr.detectChanges();

            this.messageService.add({ severity: 'info', summary: 'Borrado', detail: 'Archivo Borrado' });
          }
        );
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Operacion Cancelada' });
      }
  });
  }

  cargarPdfs(){
    this.rayosXService.listFiles(this.idPaciente).subscribe(
      nombreArchivos => {
        this.nombreArchivos = nombreArchivos;
        console.log(this.nombreArchivos);
        console.log("Ejecutado");

      }
    )
  }

}
