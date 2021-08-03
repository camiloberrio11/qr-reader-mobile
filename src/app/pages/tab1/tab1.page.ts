import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  opts = {
    allowSlidePrev: false,
    allowSlideNext: false,
  };
  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataLocalService: DataLocalService
  ) {}

  // Ciclo de vida
  ionViewWillEnter() {
    this.scan();
  }

  scan(): void {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        console.log('Barcode data', barcodeData);
        if (!barcodeData.cancelled) {
          this.dataLocalService.guardarRegistro(
            barcodeData.format,
            barcodeData.text
          );
        }
      })
      .catch((err) => {
        console.log('Error', err);
        this.dataLocalService.guardarRegistro(
          'QRcode',
          'geo:40.73151796986687,-74.06087294062502'
        );
      });
  }
}
