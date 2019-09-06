import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostModel } from '@app/models/material-management/masters/material-master/material-master.model';
import { MaterialService } from '../material-management/mm-masters/material-master/services';

@Component({
  selector: 'ems-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  providers: [MaterialService]
})
export class MainDashboardComponent implements OnInit {

  lineChartDataViews: any;
  lineChartDataLogins: any;
  lineChartDataSales: any;
  barChartData: any;
  doughnutData: any;
  polarAreaChartData: any;
  pieChartData: any;

  salesMarginChartOptions: any;
  seriesData: any[];
  ChartTypes: any[];
  years: any[];
  selectedYr: number;
  chartType: string = 'bar';


  reportServer: string = 'http://desktop-lp3ue2i/Reports/report/Report%20Project2/Report1';
  reportUrl: string = 'http://desktop-lp3ue2i/Reports/report/Report%20Project2/Report1';
  showParameters: string = 'false'; //true, false, collapsed
  parameters: any = {
    'SampleStringParameter': 'String',
    'SampleBooleanParameter': false,
    'SampleDateTimeParameter': '10/1/2017',
    'SampleIntParameter': 12345,
    'SampleFloatParameter': '123.1234',
    'SampleMultipleStringParameter': ['Parameter1', 'Parameter2']
  };
  language: string = 'en-us';
  width: number = 100;
  height: number = 500;
  toolbar: string = 'true';
  kpis: any = [];
  dashboard_data: any = [];
  porders: number = 0;
  pinvoices: number = 0;
  items: number = 0;
  vinvoices: number = 0;
  postModel: PostModel;
  constructor(private materialService: MaterialService, private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.staticData();
    // this.getKPI(1);
    this.getTiles();
    // this.dashboard_data = [
    //   { FYEAR: 2008, TTYPE: 'ORDERS', TCOUNT: 3322.00},
    //   { FYEAR: 2008, TTYPE: 'ITEMS', TCOUNT: 56468.00 },
    //   { FYEAR: 2008, TTYPE: 'PInvoice', TCOUNT: 3322.00 },
    //   { FYEAR: 2008, TTYPE: 'VInvoice', TCOUNT: 56468.00 }
    // ];
    // this.porders = this.dashboard_data.find(m => m.TTYPE === 'ORDERS').TCOUNT;
    // this.items = this.dashboard_data.find(m => m.TTYPE === 'ITEMS').TCOUNT;
    // this.pinvoices = this.dashboard_data.find(m => m.TTYPE === 'PInvoice').TCOUNT;
    // this.vinvoices = this.dashboard_data.find(m => m.TTYPE === 'VInvoice').TCOUNT;
  }
  onEmbedded(event) {

  }
  getTiles() {
    this.postModel = new PostModel();
    this.postModel.PlantCode = '';
    this.postModel.Sort = '';
    this.postModel.SearchId = 'KPI0001';
    this.postModel.Condition = '2018';
    this.materialService.shared(this.postModel).subscribe(data => {
      console.log(data);
      if (data.IsSuccess) {
        this.dashboard_data = data['Data'];
        this.porders = this.dashboard_data.find(m => m.TTYPE === 'ORDERS').TCOUNT;
        this.items = this.dashboard_data.find(m => m.TTYPE === 'ITEMS').TCOUNT;
        // this.pinvoices = this.dashboard_data.find(m => m.TTYPE === 'PInvoice').TCOUNT;
        // this.vinvoices = this.dashboard_data.find(m => m.TTYPE === 'VInvoice').TCOUNT;
      }
    });
  }
  staticData() {
    this.lineChartDataViews = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Views',
          data: [65, 59, 56, 55, 60, 70, 75],
          fill: false,
          borderColor: '#4bc0c0'
        }
      ]
    };
    this.lineChartDataLogins = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Sales',
          data: [30, 55, 59, 70, 56, 71, 80],
          fill: false,
          borderColor: '#4bc0c0'
        }
      ]
    };
    this.lineChartDataSales = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Sales',
          data: [65, 67, 70, 66, 68, 78, 81],
          fill: false,
          borderColor: '#4bc0c0'
        }
      ]
    };
    this.doughnutData = {
      labels: ['Views', 'Registered', 'OnDemand'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
    };
    this.barChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Purchases',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'Sales',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };
  }
  getKPI(id) {
    this.kpis = [];
    return this.http
      .get('../assets/JsonData/kpi/kpis.json')
      .subscribe(data => {
        let result;
        result = data;
        result.forEach(element => {
          this.kpis.push({
            'code': element.code, 'name': element.name, 'description': element.description,
            'url': this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
          });
        });
      });
  }
}
