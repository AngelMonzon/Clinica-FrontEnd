import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LogoService } from '../../services/logo.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-logotipo',
  templateUrl: './logotipo.component.html',
  styleUrl: './logotipo.component.css',
  providers: [MessageService]
})
export class LogotipoComponent implements OnInit {
  uploadedFiles: any[] = [];

  selectedImage: string = 'http://localhost:8050/uploads/logo.jpg';

  constructor(private messageService: MessageService, private logoService: LogoService) {}


  ngOnInit() {
  }

  handleSelect(event: any): void {
    // Verifica si se seleccionó un archivo
    if (event && event.files && event.files.length > 0) {
      const selectedFile = event.files[0];
      if (selectedFile.objectURL) {
        // Si el archivo tiene un URL de objeto, asignalo a la propiedad selectedImage
        this.selectedImage = selectedFile.objectURL;
      }
    }
  }


  handleUpload(event: any) {
    // Manejar la respuesta del servidor después de cargar el archivo
    console.log('Archivo subido');
    console.log(event.files);


    if (event && event.files && event.files.length > 0) {
      const uploadedFile = event.files[0];
      console.log(uploadedFile.name);

      this.messageService.add({ severity: 'info', summary: 'Archivo subido', detail: uploadedFile.name });
    }
  }
}
