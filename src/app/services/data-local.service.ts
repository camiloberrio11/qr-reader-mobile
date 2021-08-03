import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class DataLocalService {
  guardados: Registro[] = [];

  constructor(private storage: Storage) {
    this.createStorage();
    this.cargarStorage();
  }

  guardarRegistro(format: string, text: string) {
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    console.log(this.guardados);
    this.storage.set('registros', this.guardados);
  }

  async cargarStorage() {
    this.guardados = (await this.storage.get('registros')) || [];
  }

  async createStorage(): Promise<void> {
    await this.storage.create();
  }
}
