import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from '../../Services/shared-data.service';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss'
})
export class PackagesComponent {

  constructor(private httpp: HttpClient, private http: ApiService, private shd: SharedDataService,
    private route: ActivatedRoute, private toastr: ToastrService,
    private router: Router) { }
  ShippType?: Number
  Packages: any = []
  allPackages: any = []
  totalWeight: number = 0
  totalCost: number = 0
  totalPurcheas: number = 0
  totalSellDollar: number = 0
  totalSellIQ: number = 0
  totalProfitIQ: number = 0
  totalProfitDollar: number = 0
  ExchangeRate: number = 0
  purcheasCurrency?: string
  saleCurrency?: string
  allPackagesNumber = 0
  startSearchDate: string = new Date().toISOString().split('T')[0];
  endSearchDate: string = new Date().toISOString().split('T')[0];
  packagesToPrint: any[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = +params['shippType']
      if (id != null) {
        this.ShippType = id
        this.GetPackagesByShippingType(id)
      }
    })
    this.http.getData('api/AinAlfhdEnviroment/GetExChg').subscribe(res => {
      console.log(res)
      this.ExchangeRate = res.exchange_rate
    })
  }

  GetPackagesByShippingType(id: number) {
    this.http.getData(`api/AinAlfhdPackages/${id}`).subscribe(res => {
      this.shd.clearData();
      this.shd.setData(res);
      this.Packages = res
      this.allPackages = this.Packages
      console.log(this.Packages)
      this.Packages.map((el: any) => {
        this.allPackagesNumber++;
        this.totalWeight += el.actualWeight
        this.totalCost += el.purcheasCost
        this.totalSellDollar += Math.ceil(el.sallingPrice)
        this.totalSellIQ += Math.ceil(el.sallingPriceIQ)
      })
      if (this.ShippType == 2) {

        this.totalProfitDollar = this.totalSellDollar - (this.totalCost)
        this.totalProfitIQ = Math.ceil(this.totalSellIQ - (this.totalCost * this.ExchangeRate))

      } else if (this.ShippType == 19) {
        this.totalProfitDollar = this.totalSellDollar - (this.totalCost / this.ExchangeRate)
        this.totalProfitIQ = Math.ceil(this.totalSellIQ - this.totalCost)

      }
      this.purcheasCurrency = this.Packages[0].purchaseCurrency?.currency_name
      this.saleCurrency = this.Packages[0].saleCurrency.currency_name
    })
  }

  DeletePackage(id: number) {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من التراجع بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'حذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.deleteData(`api/AinAlfhdPackages/${id}`).subscribe(
          res => {
            this.toastr.success('تم الحذف بنجاح');
            this.Packages = this.Packages.filter((el: any) => el.packageId !== id);
          },
          error => {
            this.toastr.error('فشل الحذف، يرجى المحاولة مجددًا');
          }
        );
      }
    });
  }

  EditPackage(id: number) {
    this.router.navigate([`LangingPage/AddPackages/${id}`], { queryParams: { shippType: this.Packages[0].shippingTypeId } })
  }

  FilterPackages() {
    this.Packages = this.allPackages
    this.Packages = this.Packages.filter((el: any) => {
      return el.packageDt >= this.startSearchDate && el.packageDt <= this.endSearchDate
    })
    this.allPackagesNumber = 0
    this.totalWeight = 0
    this.totalCost = 0
    this.totalSellDollar = 0
    this.totalSellIQ = 0
    this.totalProfitDollar = 0
    this.totalProfitIQ = 0
    this.purcheasCurrency = ''
    this.saleCurrency = ''

    this.Packages.map((el: any) => {
      this.allPackagesNumber++;
      this.totalWeight += el.actualWeight
      this.totalCost += el.purcheasCost
      this.totalSellDollar += Math.ceil(el.sallingPrice)
      this.totalSellIQ += Math.ceil(el.sallingPriceIQ)
    })
    if (this.ShippType == 2) {

      this.totalProfitDollar = Math.ceil(this.totalSellDollar - (this.totalCost))
      this.totalProfitIQ = Math.ceil(this.totalSellIQ - (this.totalCost * this.ExchangeRate))

    } else if (this.ShippType == 19) {
      this.totalProfitDollar = Math.ceil(this.totalSellDollar - (this.totalCost / this.ExchangeRate))
      this.totalProfitIQ = Math.ceil(this.totalSellIQ - this.totalCost)

    }
    this.purcheasCurrency = this.Packages[0].purchaseCurrency?.currency_name
    this.saleCurrency = this.Packages[0].saleCurrency.currency_name
  }


  AllPackages() {
    this.Packages = this.allPackages
    this.allPackagesNumber = 0
    this.totalWeight = 0
    this.totalCost = 0
    this.totalSellDollar = 0
    this.totalSellIQ = 0
    this.totalProfitDollar = 0
    this.totalProfitIQ = 0
    this.purcheasCurrency = ''
    this.saleCurrency = ''

    this.Packages.map((el: any) => {
      this.allPackagesNumber++;
      this.totalWeight += el.actualWeight
      this.totalCost += el.purcheasCost
      this.totalSellDollar += Math.ceil(el.sallingPrice)
      this.totalSellIQ += Math.ceil(el.sallingPriceIQ)
    })
    if (this.ShippType == 2) {

      this.totalProfitDollar = this.totalSellDollar - (this.totalCost)
      this.totalProfitIQ = Math.ceil(this.totalSellIQ - (this.totalCost * this.ExchangeRate))

    } else if (this.ShippType == 19) {
      this.totalProfitDollar = this.totalSellDollar - (this.totalCost / this.ExchangeRate)
      this.totalProfitIQ = Math.ceil(this.totalSellIQ - this.totalCost)

    }
    this.purcheasCurrency = this.Packages[0].purchaseCurrency?.currency_name
    this.saleCurrency = this.Packages[0].saleCurrency.currency_name
  }

  PrintPDF() {

    let url = `https://dutyapi.somee.com/api/AinAlfhdPackages/GeneratePdf/${this.ShippType}/${this.startSearchDate}/${this.endSearchDate}`;

    this.httpp.get(url, { responseType: 'blob' }).subscribe(
      (response) => {
        if (response) {
          const blob = new Blob([response], { type: 'application/pdf' });

          if (blob.type === 'application/pdf') {
            const urlBlob = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = urlBlob;
            link.download = 'file.pdf';

            link.click();
          } else {
            console.error('الاستجابة ليست مستند PDF.');
          }
        } else {
          console.error('لم يتم استلام البيانات من الخادم.');
        }
      },
      (error) => {
        console.error('حدث خطأ أثناء تحميل الـ PDF:', error);
      }
    );
  }

  PushOrPupPackageTolIST(pcg: any) {
    const index = this.packagesToPrint.findIndex((el: any) => el.packageId == pcg.packageId);
    if (index > -1) {
      this.packagesToPrint.splice(index, 1);
    } else {
      this.packagesToPrint.push(pcg);
    }

    this.packagesToPrint.forEach(element => {
      console.log(element)
    });
  }

  get groupedPackages(): any[] {
    const grouped: { [key: string]: any } = {};

    this.packagesToPrint.forEach((pkg: any) => {
      const name = pkg.customer?.custName ?? '-';

      if (!grouped[name]) {
        grouped[name] = {
          customerName: name,
          city: pkg.customer?.city?.description ?? '-',
          area: pkg.customer?.area?.description ?? '-',
          custMob: pkg.customer?.custMob ?? '-',
          totalSale: 0,
          totalCost: 0,
          count: 0
        };
      }

      grouped[name].totalSale += pkg.sallingPrice ?? 0;
      grouped[name].totalCost += pkg.cost ?? 0;
      grouped[name].count += 1;
    });

    return Object.values(grouped) as any[];
  }



  PrintShorcat() {
    if (this.packagesToPrint.length === 0) {
      alert("ما في طرود مختارة");
      return;
    }

    let cost = 0;
    let costCurr = this.packagesToPrint[0].purchaseCurrency?.currency_name ?? "";
    let sale = 0;
    let saleCurr = this.packagesToPrint[0].saleCurrency?.currency_name ?? "";

    let msg = "📦 *تفاصيل الطرود المختارة*\n\n";

    this.packagesToPrint.forEach((p: any, i: number) => {
      console.log()
      msg += `#${i + 1}\n`;
      msg += `👤 العميل: ${p.customer?.custName ?? "-"}\n`;
      msg += `⚖️ الوزن: ${p.actualWeight} كغ\n`;
      msg += `💰 سعر الشراء: ${p.purcheasCost} ${p.purchaseCurrency?.currency_name ?? ""}\n`;
      msg += `💵 سعر البيع: ${p.sallingPrice} ${p.saleCurrency?.currency_name ?? ""}\n`;
      msg += `📅 التاريخ: ${p.packageDt}\n`;
      msg += "----------------------------------\n";

      cost += p.purcheasCost;
      sale += p.sallingPrice;
    });

    msg += `\n📊 *الملخص النهائي*\n`;
    msg += `💰 اجمالي التكلفة: ${cost.toFixed(2)} ${costCurr}\n`;
    msg += `💵 اجمالي المبيع: ${sale.toFixed(2)} ${saleCurr}\n`;
    let net = sale - Number((cost / this.ExchangeRate).toFixed(2));
    msg += `📈 صافي الحساب: ${net} ${saleCurr}\n`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/?text=${encodedMsg}`, "_blank");
  }


  ttotalCost = 0;
  totalSale = 0;
  currencyName = '';
  calcTotals() {
    this.ttotalCost = this.packagesToPrint.reduce((acc, p) => acc + (Number(p.purcheasCost) || 0), 0);
    this.ttotalCost = this.packagesToPrint[0].purchaseCurrency.currency_name.includes('IQ') ? this.ttotalCost : this.ttotalCost;
    this.totalSale = this.packagesToPrint.reduce((acc, p) => acc + (Number(p.sallingPrice) || 0), 0);
    this.currencyName = this.packagesToPrint[0]?.saleCurrency?.currency_name ?? '';
  }

  cielNumber(num: number): number {
    var number = num * this.ExchangeRate;
    return Math.ceil(number / 1000) * 1000;
  }



}
