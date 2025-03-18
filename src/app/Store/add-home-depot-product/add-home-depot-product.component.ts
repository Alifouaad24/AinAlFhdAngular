import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  
  constructor(private http: ApiService) {}

  ngOnInit(): void {
    this.GetAllConditions()
    this.GetCategories()
  }

  GetPriceAndPhoto(upc: string | undefined): void{
    console.log(upc)

    if(upc !== null && upc !== ""){
      this.isLoading = !this.isLoading
      this.http.postData(`api/HomeDepot/${upc}`, null).subscribe((response: any) =>{
        this.imgUrl = response.images[0];
        this.price = response.price,
        this.Brand = response.brand,
        this.model = response.model,
        this.storeSku = response.sKU,
        this.internet = response.internet

        this.isLoading = !this.isLoading
        console.log(response)
      })
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
    this.CategoryId = (event.target!.value!);
 }

 onCondetionChange(event: any): void{
  this.CondetionId = (event.target!.value!);
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
    "itemCondetionId": this.CondetionId
  }

  this.http.postData(`api/HomeDepot`, payLoad).subscribe(res =>{
    console.log(res)
  })

}

}
