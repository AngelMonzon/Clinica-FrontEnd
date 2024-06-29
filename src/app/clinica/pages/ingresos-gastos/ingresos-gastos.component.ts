import { Component } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../interfaces/venta.interface';

@Component({
  selector: 'app-ingresos-gastos',
  templateUrl: './ingresos-gastos.component.html',
  styleUrl: './ingresos-gastos.component.css'
})
export class IngresosGastosComponent {
  basicData: any;

  basicOptions: any;

  ventas: Venta[] = [];

  // ventaDiaria0 es del dia actual, 1 significa 1 dia antes y asi sucesivamente
  ventaDiaria0: number = 0;
  ventaDiaria1: number = 0;
  ventaDiaria2: number = 0;
  ventaDiaria3: number = 0;

  constructor(private ventaService: VentaService) {

  }

  ngOnInit() {
    let today = new Date();

    console.log('Hola');

    console.log(today.toDateString());


    this.ventaService.getVentasByDateRange(this.formatDateToYYYYMMDD(this.subtractDay(today, 3)), this.formatDateToYYYYMMDD(today)).subscribe(
      ventas => {
        console.log(ventas);

        this.ventas = ventas;
        this.obtenerVentaDiaria(today, ventas);
        this.inicializarGrafica(today)
      }
    )
  }


  getDayName(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return date.toLocaleDateString('es-ES', options);
  }

  subtractDay(date: Date, restar: number): Date {
    const newDate = new Date(date); // Crear una nueva instancia para no modificar la original
    newDate.setDate(date.getDate() - restar);
    return newDate;
  }

  obtenerVentaDiaria(day: Date, ventas: Venta[]) {
    console.log(2);

    console.log(day);

    ventas.forEach(venta => {
      console.log('dia');

      console.log(this.formatDateToYYYYMMDD(day));
      console.log('fecha');

      console.log(venta);



      if (venta.fecha === this.formatDateToYYYYMMDD(day)) {
        this.ventaDiaria0 += venta.venta;
      }
      else if (venta.fecha === this.formatDateToYYYYMMDD(this.subtractDay(day, 1))) {
        this.ventaDiaria1 += venta.venta
      }
      else if (venta.fecha === this.formatDateToYYYYMMDD(this.subtractDay(day, 2))) {
        this.ventaDiaria2 += venta.venta
      }
      else if (venta.fecha === this.formatDateToYYYYMMDD(this.subtractDay(day, 3))) {
        this.ventaDiaria3 += venta.venta
      }
    });

  }

  formatDateToYYYYMMDD(date: any): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  inicializarGrafica(today: Date) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: [this.getDayName(this.subtractDay(today, 3)), this.getDayName(this.subtractDay(today, 2)), this.getDayName(this.subtractDay(today, 1)), this.getDayName(today) + ' (Hoy)'],
      datasets: [
        {
          label: 'Ventas',
          data: [this.ventaDiaria3, this.ventaDiaria2, this.ventaDiaria1, this.ventaDiaria0],
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }

    };
    console.log(0);

    console.log(this.ventaDiaria0);
    console.log(1);

    console.log(this.ventaDiaria1);
    console.log(2);

    console.log(this.ventaDiaria2);
    console.log(3);

    console.log(this.ventaDiaria3);

  }
}
