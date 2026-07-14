import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { HttpClient } from '@angular/common/http';


declare var bootstrap: any;
@Component({
  selector: 'app-show-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './show-inventory.component.html',
  styleUrl: './show-inventory.component.scss'
})
export class ShowInventoryComponent implements OnInit {

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
    this.GatCategories()
    this.GatSizesWithSelected();
  }

  GitItemsInventory() {
    this.http1.get<any>('api/AinAlfhdInventory').subscribe(res => {
      this.allItemsInventory = res;
      this.ItemsInventory = res
      console.log(`this.ItemsInventory: `, this.ItemsInventory);
      this.countOfItems = this.ItemsInventory.length;
    })
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


  openModalToEdit(item: any) {

    this.seletedItem['id'] = item.inventory_id;
    this.seletedItem['qty'] = item.qty;
    this.seletedItem['price'] = item.sellingprice;

    this.categoryId = item.item?.category?.categoryId;
    console.log("this.categoryId: ", this.categoryId);
    this.onCategoryChange(null);

    this.SizeId = item.size?.id;
    console.log("this.SizeId: ", this.SizeId);

    const modalEl = document.getElementById('editModal');
    if (modalEl) {
      this.editModalInstance = new bootstrap.Modal(modalEl);
      this.editModalInstance.show();
    }
  }

  closeModal() {
    if (this.editModalInstance) {
      this.editModalInstance.hide();
    }
  }

  getDistinctBySize() {
    const map = new Map();
    this.allItemsInventory.forEach(item => {
      map.set(item.size?.description, item);
    });
    return Array.from(map.values());
  }


  editInvItem() {

    var payLoad = {
      'price': this.seletedItem.price,
      'qty': this.seletedItem.qty,
      'sizeId': this.SizeId,
      'cateId': this.categoryId,
    }
    console.log("payLoad: ", payLoad);

    if (this.seletedItem) {
      this.http.putData(`api/AinAlfhdInventory/${this.seletedItem.id}`, payLoad).subscribe(res => {
        alert('تم التعديل بنجاح');
        this.GitItemsInventory()
      })
    }

  }

  openSwalToDelete(id: number) {
    Swal.fire({
      title: 'هل أنت متأكد من حذف هذا العنصر؟',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteInvItem(id);
      }
    });
  }


  deleteInvItem(id: number) {
    this.http.deleteData('api/AinAlfhdInventory/' + id).subscribe(res => {
      Swal.fire('', 'تم الحذف بنجاح', 'success');
      this.GitItemsInventory()
    })
  }


  GatCategories(): void {
    this.http.getData("api/CategoriesAPI").subscribe((result) => {
      this.AllCategories = result
      this.Categories = this.AllCategories
      console.log("Categories: ", this.Categories)
    })
  }


  onCategoryChange(event: any) {
    const selectedCategoryId = event ? event.target.value : this.categoryId;
    this.categoryId = Number.parseInt(selectedCategoryId);


  }

  GatSizesWithSelected(): void {
    this.http.getData(`api/SizesAPI`).subscribe((result) => {
      this.size = result;
    });
  }

  onSizeChange(event: any): void {
    this.SizeId = event.target.value;
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
