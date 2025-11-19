import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-package',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './add-package.component.html',
  styleUrl: './add-package.component.scss'
})
export class AddPackageComponent implements OnInit {

  constructor(private http: ApiService, private route: ActivatedRoute, private toastr: ToastrService, private router: Router) { }
  filteredSuggestions: string[] = [];
  res: any[] = [];
  res1: any[] = [];
  custId?: number
  nameCust: String = ''
  searchTerm = '';
  weight: number = 0
  dimemweight: number = 0
  CostSaifComp?: number
  weightForCustomer?: number
  custName: String = ''
  purcheasCost?: number
  saleingPrice: number = 0
  purcheasCurrency?: String
  saleingCurrency?: String
  KiloCostForCust?: number
  ShippingType?: String
  ShippingPriceRoles: any
  shippingId?: number
  purcheasCurrencyId?: number
  saleingCurrencyId?: number
  saleingPriceIq?: number
  isAdding: boolean = false
  PackageDate: string = this.formatDate(new Date());
  showDatePicker: boolean = false;
  ExchangeRate: number = 0
  isUpdate: boolean = false
  packageId = 0
  idToUpdate?: number
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']
      if (id) {
        this.idToUpdate = id;
        this.GetPacgageById(id)
        this.isUpdate = true
        this.packageId = id
      }
    })

    this.route.queryParams.subscribe(params => {
      const id = +params['shippType']
      if (id != null) {
        this.shippingId = id
        this.GetPriceRolesForShipp(id);
      }
    })

    this.http.getData('api/Enviroment/GetExChg').subscribe(res => {
      this.ExchangeRate = res.exchangeRate
    })
  }

  GetPacgageById(id: number) {
    this.http.getData(`api/Packages/GetById/${id}`).subscribe(res => {
      this.weight = res.actualWeight
      this.dimemweight = res.dimentioalWeight
      this.purcheasCost = res.purcheasCost
      this.purcheasCurrency = res.purchaseCurrency.currency_name
      this.custName = res.customer.custName
      this.custId = res.customer.id
      this.weightForCustomer = res.actualWeightForCustomer
      this.PackageDate = res.packageDt
      this.saleingPrice = res.sallingPrice
      this.saleingPriceIq = res.sallingPriceIQ
      this.saleingCurrency = res.saleCurrency.currency_name
      this.saleingCurrencyId = res.currencySaleId
      this.purcheasCurrencyId = res.currencyCostId
    })
  }


  formatDate(date: Date): string {
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  GetPriceRolesForShipp(shippId: number) {
    this.http.getData(`api/PriceingRoles/${shippId}`).subscribe(res => {
      this.ShippingPriceRoles = res
      console.log("ShippingPriceRoles: ", this.ShippingPriceRoles)
      this.ShippingType = res[0].shippingTypes.description

    })
  }


  GetCorrectValues() {
    var weight = this.weight
    if (this.shippingId == 19 || this.shippingId == 1) {
      if (weight < 10) {
        this.dimemweight = weight
        var purcheasCostFor1KG = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 1 && s.shipping_type_id == this.shippingId).price;

        this.purcheasCost = this.shippingId == 19 ?  Math.ceil(weight * purcheasCostFor1KG / 1000) * 1000 : weight * purcheasCostFor1KG
        this.purcheasCurrency = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 1 && s.shipping_type_id == this.shippingId).currency.currency_name;
        this.purcheasCurrencyId = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 1 && s.shipping_type_id == this.shippingId).currency.currency_id;;


      } else {
        this.dimemweight = weight
        this.purcheasCost = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 3 && s.trade_type_id == 1 && s.shipping_type_id == this.shippingId).price;
        this.purcheasCurrency = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 3 && s.trade_type_id == 1 && s.shipping_type_id == this.shippingId).currency.currency_name;
        this.purcheasCurrencyId = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 3 && s.trade_type_id == 1 && s.shipping_type_id == this.shippingId).currency.currency_id;
      }

    }

    else if (this.shippingId == 2) {
      this.dimemweight = weight
      var purcheasCostFor1KG = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 1).price;
      this.purcheasCost = Math.ceil(weight * purcheasCostFor1KG)
      this.purcheasCurrency = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 1).currency.currency_name;
      this.purcheasCurrencyId = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 1).currency.currency_id;;

    }

    this.GetCorrectValuesForDimentioal()
  }

  GetCorrectValuesForDimentioal() {
    var weight = this.RoundTheCustWeight(this.dimemweight)
    this.weightForCustomer = weight

    if (this.shippingId == 19 || this.shippingId == 1) {
      if (weight < 10) {
        var sellFor1KG = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 2 && s.shipping_type_id == this.shippingId).price;
        this.saleingPrice = weight * sellFor1KG
        this.saleingCurrency = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 2 && s.shipping_type_id == this.shippingId).currency.currency_name;
        this.saleingCurrencyId = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 2 && s.shipping_type_id == this.shippingId).currency.currency_id;;
        this.saleingPriceIq = this.RoundToCloseThouthend(this.saleingPrice)

      } else {
        this.saleingPrice = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 3 && s.trade_type_id == 2 && s.shipping_type_id == this.shippingId).price;
        this.saleingCurrency = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 3 && s.trade_type_id == 2 && s.shipping_type_id == this.shippingId).currency.currency_name;
        this.saleingCurrencyId = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 3 && s.trade_type_id == 2 && s.shipping_type_id == this.shippingId).currency.currency_id;;
        this.saleingPriceIq = this.RoundToCloseThouthend(this.saleingPrice)

      }
    }

    else if (this.shippingId == 2) {
      var sellFor1KG = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 2).price;
      this.saleingPrice = weight * sellFor1KG
      this.saleingCurrency = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 2).currency.currency_name;
      this.saleingCurrencyId = this.ShippingPriceRoles.find((s: any) => s.shipping_cat_id == 1 && s.trade_type_id == 2).currency.currency_id;;
      this.saleingPriceIq = this.RoundToCloseThouthend(this.saleingPrice)
    }


  }

  RoundToCloseThouthend(price: number): number {
    var num = price * this.ExchangeRate;
    return Math.ceil(num / 1000) * 1000;
  }



  RepairDollar() {
    this.saleingPrice = parseFloat(((this.saleingPriceIq ?? 0) / this.ExchangeRate).toFixed(2))
  }

  RepairIq() {
    this.saleingPriceIq = parseFloat(((this.saleingPrice ?? 0) * this.ExchangeRate).toFixed(2))
  }

  RoundTheCustWeight(weight: number): number {
    const decimalPart = weight - Math.floor(weight);

    if (decimalPart > 0 && decimalPart < 0.1) {
      return Math.floor(weight);
    }

    const rounded = Math.ceil(weight);
    return rounded
  }


  AddPackageToDBAndMovie() {

    var payLoad = {
      'actualWeight': this.weight,
      'dimentioalWeight': this.dimemweight,
      'shippingTypeId': this.shippingId,
      'purcheasCost': this.purcheasCost,
      'currencyCostId': this.purcheasCurrencyId,
      'currencySaleId': this.saleingCurrencyId,
      'customerId': this.custId,
      'actualWeightForCustomer': this.weightForCustomer,
      'sallingPrice': this.saleingPrice,
      'packageDt': this.PackageDate,
      'sallingPriceIQ': this.saleingPriceIq
    }
    console.log(payLoad)
    console.log(this.isUpdate)


    if (payLoad != null) {

      if (this.isUpdate == false) {
        this.isAdding = true
        this.http.postData(`api/Packages`, payLoad).subscribe(res => {
          console.log(res)
          this.toastr.success('تم ادخال الطرد بنجاح')
          this.isAdding = false
          this.router.navigate(['/LangingPage/Packages'], { queryParams: { shippType: this.shippingId } });

        }, (error) => {
          this.toastr.error('حدث خطأ أثناء ادخال الطرد, يرجى المحاولة مجددا')
          this.isAdding = false
        })
      } else {
        this.isAdding = true
        this.http.putData(`api/Packages/${this.packageId}`, payLoad).subscribe(res => {
          console.log(res)
          this.toastr.success('تم تعديل الطرد بنجاح')
          this.isAdding = false
          this.router.navigate(['/LangingPage/Packages'], { queryParams: { shippType: this.shippingId } });

        }, (error) => {
          this.toastr.error('حدث خطأ أثناء تعديل الطرد, يرجى المحاولة مجددا')
          console.log(error)

          this.isAdding = false
        })
      }


    } else {

    }
  }

  AddPackageToDB() {

    var payLoad = {
      'actualWeight': this.weight,
      'dimentioalWeight': this.dimemweight,
      'shippingTypeId': this.shippingId,
      'purcheasCost': this.purcheasCost,
      'currencyCostId': this.purcheasCurrencyId,
      'currencySaleId': this.saleingCurrencyId,
      'customerId': this.custId,
      'actualWeightForCustomer': this.weightForCustomer,
      'sallingPrice': this.saleingPrice,
      'packageDt': this.PackageDate,
      'sallingPriceIQ': this.saleingPriceIq
    }
    console.log(payLoad)
    console.log(this.isUpdate)


    if (payLoad != null) {

      if (this.isUpdate == false) {
        this.isAdding = true
        this.http.postData(`api/Packages`, payLoad).subscribe(res => {
          console.log(res)
          this.toastr.success('تم ادخال الطرد بنجاح')
          this.isAdding = false

        }, (error) => {
          this.toastr.error('حدث خطأ أثناء ادخال الطرد, يرجى المحاولة مجددا')
          this.isAdding = false
        })
      } else {
        this.isAdding = true
        this.http.putData(`api/Packages/${this.packageId}`, payLoad).subscribe(res => {
          console.log(res)
          this.toastr.success('تم تعديل الطرد بنجاح')
          this.isAdding = false
          //this.router.navigate(['/LangingPage/Packages'], { queryParams: { shippType: this.shippingId } });

        }, (error) => {
          this.toastr.error('حدث خطأ أثناء تعديل الطرد, يرجى المحاولة مجددا')
          console.log(error)

          this.isAdding = false
        })
      }


    } else {

    }
  }




  filterSuggestions(value: string): void {
    if (value.length >= 3) {
      if (/^\d/.test(value)) {
        this.filteredSuggestions.pop();
        this.http.getData(`api/Customers/SearchAboutDetectedCustomerApi/${value}`).subscribe((result) => {
          this.res = result;
          this.filteredSuggestions.push(result.custName);
        })

      } else {
        this.http.getData(`api/Customers/SearchAboutCustomerApi/${value}`).subscribe((result) => {
          this.filteredSuggestions = result.map((el: any) => {
            return el.custName;
          });
        })
      }

    } else {
      this.filteredSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string): void {
    this.res1 = [];
    this.searchTerm = suggestion;
    this.filteredSuggestions = [];
    const search = encodeURIComponent(suggestion);


    this.http.getData(`api/Customers/SearchAboutCustomerApi/${search}`).subscribe((result1: any) => {
      this.res1 = result1
      console.log("this.res1: ", this.res1)
    })

  }

  Notes: any[] = []
  GiveId(customer: any): void {

    this.custName = customer.custName
    this.custId = customer.id
    this.filteredSuggestions = [];
    this.http.getData(`api/RequestNotes/${this.custId}`).subscribe(res => {
      console.log(res)
      this.Notes = res
    })
  }

  ConvertToSeen(id: number) {
    this.http.putData(`api/RequestNotes/${id}`, {}).subscribe(res => {
      this.Notes = this.Notes.filter(el => {
        return el.id != id
      })
      this.toastr.success('تم التحويل الى تمت الاتجابة بنجاح')
    }, (error) => {
      this.toastr.error('يرجى المحاولة مجددا')
    })
  }

  isReadonly: boolean = true;

  @ViewChild('actWeight') actWeight!: ElementRef<HTMLInputElement>;

  AddFreePcg() {
    const el = this.actWeight.nativeElement as HTMLInputElement;
    el.value = "0";
    el.dispatchEvent(new Event('change'));
    this.isReadonly = false
  }
}


