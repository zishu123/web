import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainDashboardComponent } from './main-dashboard.component';
import { MainDashBoardRoutingModule } from './main-dashboard-routing.module';
import { ChartModule } from 'primeng/chart';
import { NgxPowerBiModule } from 'ngx-powerbi';

@NgModule({
  imports: [
    CommonModule,
    MainDashBoardRoutingModule,
    ChartModule,
    NgxPowerBiModule
  ],
  declarations: [MainDashboardComponent]
})
export class MainDashboardModule { }
