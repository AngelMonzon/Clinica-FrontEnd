import { Paciente } from "./paciente";

export interface Cliente {
  id:            number;
  nombre:        string;
  edad:          number;
  genero:        Genero;
  email:         null | string;
  telefono:      null | string;
  contacto:      null | string;
  telefono2:     null | string;
  fechaRegistro: Date;
  paciente:      Paciente;
}

export enum Genero {
  Femenino = "FEMENINO",
  Masculino = "MASCULINO",
}

export enum BajoTratamiento {
  Ninguno = "Ninguno",
  Dental = "Dental",
  Medico = "Medico"
}

export enum HigieneBucal {
  Buena = "Buena",
}
