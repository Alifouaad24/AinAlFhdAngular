import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-add-recipt',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './add-recipt.component.html',
  styleUrl: './add-recipt.component.scss'
})
export class AddReciptComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: ApiService, private cd: ChangeDetectorRef,
    private router: Router, private route: ActivatedRoute
  ) {
    this.receiptForm = this.fb.group({
      RecieptId:[0],
      weight: [0, Validators.required],
      cost: 0,
      discount: [0],
      sellingPrice: [0],
      totalPriceFromCust: [0, Validators.required],
      customerId: [this.id],
      recieptDate: [new Date().toISOString().split('T')[0], Validators.required],
      costIQ: [0],
      sellingUSD: [0],
      sellingDiscount: [0],
      isFinanced: [false],
      currentState: [true],
      notes: ['.'],
      shippingBatchId: [0, Validators.required],
    });
  }

  costIIQ?: number
  isAdded: boolean = false
  recId: number | null = null;
  ssId!: number
  receiptForm!: FormGroup;
  shippingBatchs: any[] = [];
  customers: any[] = [];
  searchTerm = '';
  id?: number;
  unitCost = [5, 6, 7, 8, 9, 10]
  unitCostSaif = [8, 9, 10, 11, 12, 13, 14]
  cost = 0
  filteredSuggestions: string[] = [];
  filteredSuggestion: string = '';
  suggestions: string[] = [];
  res: any[] = [];
  res1: any[] = [];
  nameCust: String=''
  currency = 'USD'
  selectedCostSaif: number = this.unitCost[0];
  costSelectOfSaif: number = this.unitCostSaif[0];
  exchangeRate: number = 0; 
  sellingCurrency= 'IQ'
  isAdd: boolean = false
  sellingPriceInDoular?: number
  weightUp?: number


  ngOnInit(): void {

    this.loadShippingBatches();
    this.getBatches()
    this.onFormChanges();
    this.getExChg();

    this.recId = +this.route.snapshot.paramMap.get('id')!;
    if (this.recId) {
      this.GetRecipt(this.recId);
      this.isAdd = this.recId !== null;
    }


  }

  GetRecipt(id: number): void{
    this.http.getData(`api/Reciept/${id}`).subscribe(res => {
       console.log("Reciept id ",res)
       
       this.receiptForm.patchValue({
        RecieptId: res.recieptId || 0,
        weight: res.weight || 0,
        cost: res.cost || 0,
        discount: res.discount || 0,
        sellingPrice: res.sellingPrice || 0,
        totalPriceFromCust: res.totalPriceFromCust || 0,
        customerId: res.customerId || this.id,
        recieptDate: new Date(res.recieptDate).toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        sellingDiscount: res.sellingDisCount || 0,
        isFinanced: res.isFinanced || false,
        currentState: res.currentState || true,
        notes: res.notes || '',
        costIQ: res.costIQ,
        sellingUSD: res.sellingUSD,
        shippingBatchId: res.shippingBatchId || 0,
      }, { emitEvent: false });
     });
   }

  getBatches(): void {
    this.http.getData("api/ShippingBatch").subscribe(res => {
      this.shippingBatchs = res;
      this.ssId = this.shippingBatchs[0]!.shippingBatchId

      this.route.queryParams.subscribe((params) => {
        if(params['ShippId']){
          this.receiptForm.patchValue({
            shippingBatchId: +params['ShippId']
          },{ emitEvent: false }) 
        }
       
      });

      console.log("this.receiptForm:  ",this.receiptForm.value)
  
      //this.receiptForm.patchValue({shippingBatchId: this.shippingBatchs[0]!.shippingBatchId})
    })
  }

  getExChg(): void {
    this.http.getData("api/Enviroment/GetExChg").subscribe(res => {
      this.exchangeRate = res.exchangeRate;
      console.log(res)
    })
  }

  onFormChanges(): void {
    this.receiptForm.valueChanges.subscribe((formValues) => {
      const weight = formValues.weight || 0;
      const costPerUnit = this.selectedCostSaif || 0;
      const discountToSaif = formValues.discount
      const total = weight * costPerUnit - discountToSaif;
      const exchangeRate = this.exchangeRate
      const totalInIQ = weight * costPerUnit * exchangeRate - discountToSaif;
      const costSelectOfSaif = this.costSelectOfSaif
      const PriceForSell = costSelectOfSaif * Math.ceil(weight) * exchangeRate;
      const formattedPrice = PriceForSell.toLocaleString('en-US', { maximumFractionDigits: 3 });

      this.weightUp =  Math.ceil(weight)
      this.costIIQ = totalInIQ
      this.sellingPriceInDoular = costSelectOfSaif * Math.ceil(weight)

      if (this.receiptForm.get('cost')?.value !== total) {
        this.receiptForm.patchValue(
          { cost: total, 
            sellingPrice: this.roundWithSmallStep(PriceForSell) || 0,//.toLocaleString(),
            totalPriceFromCust: this.roundWithSmallStep(PriceForSell) || 0,//.toLocaleString(),
            costIQ: totalInIQ,
            sellingUSD: costSelectOfSaif * Math.ceil(weight),
            sellingDiscount: this.receiptForm.get('totalPriceFromCust')?.value - this.receiptForm.get('sellingPrice')?.value
           },
          { emitEvent: false }
        );
      }

      if (this.receiptForm.get('totalPriceFromCust')?.value !== PriceForSell) {
        this.receiptForm.patchValue(
          { sellingDiscount: this.receiptForm.get('totalPriceFromCust')?.value - 
              this.receiptForm.get('sellingPrice')?.value
           },
          { emitEvent: false }
        );
      }

      if (this.receiptForm.get('sellingDiscount')?.value !== 
        this.receiptForm.get('totalPriceFromCust')?.value - 
        this.receiptForm.get('sellingPrice')?.value) {
        this.receiptForm.patchValue(
          { 
            sellingDiscount: this.receiptForm.get('totalPriceFromCust')?.value - 
              this.receiptForm.get('sellingPrice')?.value
           },
          { emitEvent: false }
        );
      }
    });
  }
  
  onCostChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.receiptForm.patchValue({
      costSelectOfSaif: +selectedValue
    });
  }


  roundWithSmallStep(value: number): number {
    const magnitude = Math.pow(10, Math.floor(Math.log10(value) - 1));
    return Math.ceil(value / magnitude) * magnitude;
}


  onCostSaifChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const weight = this.receiptForm.get('weight')?.value;

    const final = +selectedValue * weight * this.exchangeRate
    this.receiptForm.patchValue({
      sellingPrice: final,
      totalPriceFromCust: final,
      sellingDiscount: 0

    });
  }
  
  loadShippingBatches() {
    this.http.getData('/api/shipping-batches').subscribe((data: any) => {
      this.shippingBatchs = data;
    });
  }

  onSubmit() {

    if(this.recId){
      if (this.receiptForm.valid) {
        this.http.putData(`api/Reciept/${this.recId}`, this.receiptForm.value).subscribe(
          (response: any) => {
            if (response) {
              this.router.navigate(['/LangingPage/Recipts'], { queryParams: { updated: 'true' } });
            } else {
              alert('حدث خطأ أثناء تحديث السجل.');
            }
          },
          (error) => {
            console.error('خطأ في الاتصال بالخادم:', error);
            alert('حدث خطأ أثناء الاتصال بالخادم.');
          }
        );
        
      }else {
        alert('يرجى التحقق من الحقول المطلوبة.');
      }
    }else{
      if (this.receiptForm.valid) {
        this.http.postData('api/Reciept', this.receiptForm.value).subscribe(
          (response: any) => {
            if (response) {
              this.isAdded = !this.isAdded
              setTimeout(() => {
                this.isAdded = false; 
              }, 3000);
            } else {
              alert('حدث خطأ أثناء الحفظ.');
            }
          },
          (error) => {
            console.error('خطأ في الاتصال بالخادم:', error);
            alert('حدث خطأ أثناء الاتصال بالخادم.');
          }
        );
      } else {
        alert('يرجى التحقق من الحقول المطلوبة.');
      }
    }
    
  }
  
  
  filterSuggestions(value: string): void {
    if (value.length >= 3) {
      if (/^\d/.test(value)){
        this.filteredSuggestions.pop();
        this.http.getData(`api/Customers/SearchAboutDetectedCustomerApi/${value}`).subscribe((result) => {
          this.res = result;
          this.filteredSuggestions.push(result.custName);
        })

      }else{
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

    this.http.getData(`api/Customers/SearchAboutDetectedCustomerApi/${suggestion}`).subscribe((result1) => {
      this.res1.push(result1)
      console.log(result1)
    })
  }

  GiveId(customer: any): void{
    this.receiptForm.patchValue({ customerId: customer.id});
    this.nameCust = customer.custName
    this.filteredSuggestions = [];
  }
}