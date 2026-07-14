import { Component, OnInit } from '@angular/core';
import JSZip from 'jszip';
import { ApiService } from '../../Services/api.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import saveAs from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-direct-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './direct-inventory.component.html',
  styleUrl: './direct-inventory.component.scss'
})
export class DirectInventoryComponent implements OnInit {
constructor(private http: ApiService, private http1: HttpClient, private toaster: ToastrService) { }
  ItemsInventory: any[] = []
  allItemsInventory: any[] = []
  selectedImage: string = ' ';
  seletedItem: any = {
    id: 0,
    qty: 0,
    price: 0,
  }
  Categories?: any[] = []
  AllCategories?: any[] = []
  subCategory?: any = []
  size?: any = []
  categoryId?: number;
  SizeId?: number;
  editModalInstance: any;
  countOfItems: number = 0;
  imgName: string = '';


  ngOnInit(): void {
    this.GitItemsInventory()
  }


GitItemsInventory() {
  this.http1.get<any[]>('https://dutyapi.somee.com/api/AinAlfhdInventory')
    .subscribe(res => {
      this.allItemsInventory = res;
      this.ItemsInventory = res;
      this.countOfItems = res.length;
    }, err => {
      console.error('HTTP error:', err);
    });
}



  openImage(imgUrl?: string, sku: string = '') {
    if (!imgUrl) return;
    this.selectedImage = imgUrl;
    this.imgName = sku;
    const modalEl = document.getElementById('imageModal');
    if (modalEl) {
      this.imageModalInstance = new bootstrap.Modal(modalEl);
      this.imageModalInstance.show();
    }
  }
  imageModalInstance: any;
  closeModalImage() {
    if (this.imageModalInstance) {
      this.imageModalInstance.hide();
    }
  }

  filterBySize(anyEvent: any) {
    const selectedSizeId = anyEvent.target.value;
    if (!selectedSizeId && selectedSizeId === '') {
      this.ItemsInventory = this.allItemsInventory;
      this.countOfItems = this.ItemsInventory.length;

      return;
    }
    this.ItemsInventory = this.allItemsInventory.filter(item => {
      return item.size?.id == selectedSizeId;
    });
    this.countOfItems = this.ItemsInventory.length;
  }



  getDistinctBySize() {
    const map = new Map();
    this.allItemsInventory.forEach(item => {
      map.set(item.size?.description, item);
    });
    return Array.from(map.values());
  }

  downloadImage() {
    const imageUrl = this.selectedImage;

    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = blobUrl;
        link.download = `${this.imgName}.jpg`;
        link.click();

        URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.error('Error downloading image:', err));
  }

  

  async downloadAllImagesAsZip() {
    const zip = new JSZip();
    const folder = zip.folder("InventoryImages");

    for (const item of this.ItemsInventory) {
      const imgUrl = item.item_notes;
      const sku = item.item?.pCode || 'image';

      if (!imgUrl) continue;

      const response = await fetch(imgUrl);
      const blob = await response.blob();

      folder?.file(`${sku}.jpg`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "InventoryImages.zip");

    this.toaster.success("تم تحميل جميع الصور في ملف ZIP");
  }
}
