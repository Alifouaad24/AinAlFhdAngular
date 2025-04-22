import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-item-to-store',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule ],
  templateUrl: './add-item-to-store.component.html',
  styleUrl: './add-item-to-store.component.scss'
})
export class AddItemToStoreComponent implements OnInit {

  constructor(private http: ApiService, private route: ActivatedRoute, private router: Router) {}

  api = inject(ApiService)
  Id?: number
  ngOnInit(): void {
    this.GatCategories()
    this.GetAllMerchants()
    this.Id = +this.route.snapshot.paramMap.get('id')!;
    if (this.Id) {
      this.GetOrderDetailsById(this.Id);
    }
  }

  GetOrderDetailsById(id: number): void{
    this.http.getData(`api/OrderDetails/${id}`).subscribe((response: any) => {
      console.log(response)
      this.GatSizesAll();
      if(response.item.categoryId != null){
        if(response.item.category.mainCategoryId != null){
          this.subCategoryId = response.item.categoryId;
        }else{
          this.categoryId = response.item.categoryId;
        }
      }
      
      this.imgUrl = response.item.imgUrl;
      this.SizeId = response.size;
      this.WebsitePrice = response.websitePrice;
      this.sku = response.item.pCode;

    })
  }

  Categories?: any [] = []
  Merchants?: any [] = []
  subCategory?: any = []
  size?: any = []
  imgUrl?: string
  sku?: string
  finalUrl?: string
  MerchantId?: Number | null;
  WebsitePrice?: Number
  categoryId?:  | undefined | null;
  subCategoryId?:  | undefined | null;
  SizeId?:  | undefined | null;
  isLoading: boolean = false;
  showDropDowns: boolean = true
  validSku: boolean = true
  ErrorGit: boolean = false
  validfinalUrl: boolean = false
  FieldFirstGet: boolean = false
  html?: string
  SearchInFinalUrl(): void {
    if(this.finalUrl == null || this.finalUrl == ""){
      this.validfinalUrl = !this.validfinalUrl
      setTimeout(() =>{
        this.validSku = !this.validSku
      }, 2000)
    }
    else{
      this.imgUrl = "";
      if (this.sku?.length !== 0) {
        this.isLoading = true;
        this.api.getData(`api/ItemAPI/GetByFinalUrl/${this.sku}`).subscribe(
          (response) => {
            this.imgUrl = response.image;
            this.WebsitePrice = response.price
            this.isLoading = false;
          },
          (error) => {
            const errorText = error.error?.text || error.error;
            console.log("Error text:", errorText);
            this.imgUrl = errorText;
            this.WebsitePrice = 0
            this.isLoading = false;
            
            this.ErrorGit = !this.ErrorGit
            setTimeout(() =>{
          this.ErrorGit = !this.ErrorGit
        }, 3000)
          }
        );
      }
    }
  }

  GatCategories(): void{
    this.api.getData("api/CategoriesAPI").subscribe((result) => {
      this.Categories = result
      console.log("Categories: ", this.Categories)
    })
  }

  GatSubCategories(id: number): void{
    this.subCategory = this.Categories?.filter((category: any) => category.mainCategoryId == id)
    console.log("subCategory: ", this.subCategory)
  }

  GatSizes(id: number): void{
    console.log("id: ", id)
    if(id > 0){
      this.api.getData(`api/SizesAPI/${id}`).subscribe((result) => {
        this.size = result
      })
    }else{
      this.size = []
    }

  }

  GatSizesAll(): void{
      this.api.getData(`api/SizesAPI`).subscribe((result) => {
        this.size = result
      })
  }

  ShowDropss(event: Event): void {
    this.showDropDowns = !(event.target as HTMLInputElement).checked;

    if(this.showDropDowns == false){
      this.categoryId = null
      this.SizeId = null
      this.subCategoryId = null
      this.MerchantId = null
    }
  }
  
  goToExternalLink() {
    if (this.sku != null) {

      window.open(`https://ar.shein.com/pdsearch/${this.sku}`, '_blank');
    }
  }

  GetAllMerchants(): void{
    this.api.getData(`api/MerchantAPI`).subscribe((response: any) => {
      this.Merchants = response
    })
  }

  onMerchantChange(event: any): void{
     this.MerchantId = (event.target!.value!);
  }
  

  onCategoryChange(event: any) {
    const selectedCategoryId = event.target.value;
    this.categoryId = event.target.value;

    this.GatSubCategories(selectedCategoryId);
    this.GatSizes(selectedCategoryId);
  }

  searchAboutItem(): void {
    if(this.sku == null || this.sku == ""){
      this.validSku = !this.validSku
      setTimeout(() =>{
        this.validSku = !this.validSku
      }, 2000)
    }
    else{
      this.imgUrl = "";
      if (this.sku?.length !== 0) {
        //this.isLoading = true;
        // this.api.getData(`api/ItemAPI/${this.sku}`).subscribe(
        //   (response) => {
        //     this.imgUrl = response.image;
        //     this.WebsitePrice = response.price
        //     this.isLoading = false;
        //   },
        //   (error) => {
        //     const errorText = error.error?.text || error.error;
        //     console.log("Error text:", errorText);
        //     this.imgUrl = errorText;
        //     this.WebsitePrice = 0
        //     this.isLoading = false;
        //     this.ErrorGit = !this.ErrorGit
        //     setTimeout(() =>{
        //   this.ErrorGit = !this.ErrorGit
        //   this.FieldFirstGet = true;
        // }, 3000)


        //   }
        // );


      }
    }
  }

  GetInfoLocaly(): void {
    if (this.html != null && this.html !== "") {
      const blob = new Blob([this.html], { type: 'text/plain' });
      const file = new File([blob], 'content.txt', { type: 'text/plain' });
  
      const formData = new FormData();
      formData.append('htmlFile', file);
  
      this.http.postData('api/SheIn', formData)
        .subscribe({
          next: res => {
            console.log('تم الإرسال بنجاح!', res);
            this.imgUrl = res.img,
            this.WebsitePrice = res.price,
            this.sku = res.sku
          },
          error: err => {
            console.error('فشل الإرسال', err);
          }
        });
    }
  }
  
  
  onSizeChange(event: any): void{
    this.SizeId = event.target.value;
  }

  SaveItemInStore(): void{

    var CategoryId = this.subCategory !=null ? this.subCategory : this.categoryId
    var PayLoad = {
      'sku': this.sku,
      'imgUrl': this.imgUrl,
      'makeId': 1,
      'categoryId': CategoryId,
      'size': this.SizeId,
      'websitePrice': this.WebsitePrice,
      'merchantId': this.MerchantId
    }

    if(this.route.snapshot.paramMap.get('id') != null){
      this.api.putData(`api/OrderDetails/${this.route.snapshot.paramMap.get('id')}`, PayLoad).subscribe(result =>{
        console.log(result)
        this.router.navigate(['LangingPage/ShowItemsInStore'], { queryParams: { updated: 'true' }})
      })
    }
    else{
      this.api.postData("api/OrderDetails", PayLoad).subscribe(result =>{
        console.log(result)
      })
    }
  }
}
