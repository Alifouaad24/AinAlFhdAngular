import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../Models/Product';
import { Offer } from '../../Models/Offer';

@Component({
  selector: 'app-add-home-depot-product',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './add-home-depot-product.component.html',
  styleUrl: './add-home-depot-product.component.scss'
})
export class AddHomeDepotProductComponent implements OnInit {

  upc?: string
  imgUrl?: string
  price?: number
  isLoading: boolean = false
  model?: string
  Brand?: string
  storeSku?: string
  internet?: string
  Notes?: string
  CondId?: number
  CategoryId?: number
  allCondetions: any = []
  Categories: any = []
  CondetionId?: number
  showPublic: boolean = false
  showHome: boolean = false
  showError: boolean = false
  ///////////////////////////////////////
  UPCPublic: string = ''
  title?: string
  description?: string
  description2?: string
  brand?: string
  modelPublic?: string
  color?: string
  category?: string
  lowest_recorded_price?: number
  highest_recorded_price?: number
  images?: []
  source?: string
  isLoadingPublic: boolean = false
  products: Product [] = []
  Images: string [] = []
  Offers: Offer [] = []
  /////////////////////////////////////////
  constructor(private http: ApiService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.showHome = false

    this.GetAllConditions()
    this.GetCategories()
  }

  GetPriceAndPhoto(upc: string | undefined): void{
    console.log(upc)

    if(upc !== null && upc !== ""){
      this.showError = false
      this.isLoading = !this.isLoading
      this.http.postData(`api/HomeDepot/${upc}`, null).subscribe((response: any) =>{
        console.log(response)

        this.imgUrl = response.images[0] ?? "";
        this.price = response.price,
        this.Brand = response.brand,
        this.model = response.model,
        this.storeSku = response.sku,
        this.internet = response.internet
        this.source = response.source
        this.title = response.title
        this.description2 = response.desc

        this.isLoading = !this.isLoading
        console.log(response)

        this.showHome = true
        this.showError = false

      }
      ,(error) =>{
        this.isLoading = !this.isLoading
        this.showError = true
        this.showHome = false

      }
    )
    }
  }

  onSearchChange(value: string) {

    if(value == "Home"){
      this.showPublic = false
      this.showHome = true
    }
    else if(value == "Public"){
      this.showPublic = true
      this.showHome = false
    }
  }
  

  GetAllConditions(): void{
    this.http.getData('api/ItemCondetions').subscribe((result: any) =>{
      this.allCondetions = result
    })
  }

  GetCategories(): void {
    this.http.getData("api/CategoriesAPI").subscribe((result) => {
      this.Categories = result;
      this.Categories = this.Categories.filter((category: any) => category.platform_id === null);
    });
  }
  

onCategoryChange(event: any): void{
    this.CategoryId = parseInt(event.target!.value!);
 }

 onCondetionChange(event: any): void{
  this.CondetionId = parseInt(event.target!.value!);
}

SaveItemInDB(): void{

  var payLoad = {
    "brand": this.Brand,
    "sku": this.storeSku,
    "model": this.model,
    "price": this.price,
    "imgUrl": this.imgUrl,
    "internet": this.internet,
    "notes": this.Notes,
    "categoryId": this.CategoryId,
    "itemCondetionId": this.CondetionId,
    "engName": this.title
  }

    console.log(payLoad)


  this.http.postData(`api/HomeDepot`, payLoad).subscribe(res =>{
    console.log(res)
    this.toastr.success('تم حفظ المنتج بنجاح')
    window.location.reload
  },(er) => {
     this.toastr.error('حدث خطأ اثناء ادخال المنتج يرجى المحاولة مجددا')
  })

}

SearchAboutUPC(upc: string): void {
  if (!upc) {
    this.toastr.error('الرجاء إدخال UPC صالح');
    return;
  }

  this.isLoadingPublic = true;

  this.http.getData(`api/HomeDepot/lookup?upc=${upc}`).subscribe({
    next: (Response: any) => {
      if (!Response.items || !Array.isArray(Response.items) || Response.items.length === 0) {
        this.toastr.warning('لم يتم العثور على منتجات لهذا UPC');
        this.isLoadingPublic = false;
        return;
      }
      this.products = Response.items.map((el: any) => Product.fromJson(el));
      if (this.products.length > 0) {
        const firstProduct = this.products[0];

        this.brand = firstProduct.brand;
        this.category = firstProduct.category;
        this.lowest_recorded_price = firstProduct.lowest_recorded_price;
        this.highest_recorded_price = firstProduct.highest_recorded_price;
        this.color = firstProduct.color;
        this.modelPublic = firstProduct.model;
        this.description = firstProduct.description;
        this.title = firstProduct.title;
        this.Images = firstProduct.images;
        this.Offers = firstProduct.offers;
      }

      this.isLoadingPublic = false;
    },
    error: (error) => {
      this.isLoadingPublic = false;
      this.toastr.error('حدث خطأ أثناء البحث عن المنتج');
      console.error('Error fetching product data:', error);
    }
  });
}



}
