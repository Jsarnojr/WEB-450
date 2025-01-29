import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Added CommonModule import for *ngIf
import { environment } from '../../environments/environment';
import { ChartComponent } from '../shared/chart/chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartComponent], // Included CommonModule to resolve *ngIf issue
  template: `
    <h2>Dashboard</h2>
    <div class="dashboard">
      <div class="charts-container">
        <div class="card">
          <!-- Added spinner for Sales Data -->
          <div *ngIf="loadingSalesData" class="spinner"></div>
          <app-chart *ngIf="!loadingSalesData" [type]="'bar'" [label]="'Sales Data'" [data]="salesData" [labels]="salesRegions"></app-chart>
        </div>
        <div class="card">
          <!-- Added spinner for Agent Performance Data -->
          <div *ngIf="loadingAgentPerformanceData" class="spinner"></div>
          <app-chart *ngIf="!loadingAgentPerformanceData" [type]="'line'" [label]="'Agent Performance'" [data]="agentPerformanceData" [labels]="agentNames"></app-chart>
        </div>
      </div>
      <div class="charts-container">
        <div class="card">
          <!-- Added spinner for Customer Feedback Data -->
          <div *ngIf="loadingCustomerFeedbackData" class="spinner"></div>
          <app-chart *ngIf="!loadingCustomerFeedbackData" [type]="'pie'" [label]="'Customer Feedback'" [data]="customerFeedbackData" [labels]="feedbackTypes"></app-chart>
        </div>
        <div class="card">
          <!-- Added spinner for Report Types Data -->
          <div *ngIf="loadingReportTypesData" class="spinner"></div>
          <app-chart *ngIf="!loadingReportTypesData" [type]="'doughnut'" [label]="'Report Types'" [data]="reportCounts" [labels]="reportTypes"></app-chart>
        </div>
      </div>
    </div>
  `,
  styles: `
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #000;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: spin 1s linear infinite;
    margin: auto;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  `
})
export class DashboardComponent implements OnInit {
  // Added loading indicators for each report
  loadingSalesData = true;
  loadingAgentPerformanceData = true;
  loadingCustomerFeedbackData = true;
  loadingReportTypesData = true;

  salesData: number[] = [];
  salesRegions: string[] = [];
  agentPerformanceData: any[] = [];
  agentNames: string[] = [];
  customerFeedbackData: any[] = [];
  feedbackTypes: string[] = [];
  reportCounts: number[] = [];
  reportTypes: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loadSalesData();
    this.loadAgentPerformanceData();
    this.loadCustomerFeedbackData();
    this.loadReportTypesData();
  }

  loadSalesData() {
    this.http.get(`${environment.apiBaseUrl}/dashboard/sales-data`).subscribe({
      next: (data: any) => {
        this.salesData = data.map((d: any) => d.totalAmount);
        this.salesRegions = data.map((d: any) => d.region);
        this.loadingSalesData = false; // Hides spinner when data is loaded
      }
    });
  }

  loadAgentPerformanceData() {
    this.http.get(`${environment.apiBaseUrl}/dashboard/agent-performance`).subscribe({
      next: (data: any) => {
        this.agentPerformanceData = data.map((d: any) => d.averagePerformance);
        this.agentNames = data.map((d: any) => d.name);
        this.loadingAgentPerformanceData = false; // Hides spinner when data is loaded
      }
    });
  }

  loadCustomerFeedbackData() {
    this.http.get(`${environment.apiBaseUrl}/dashboard/customer-feedback`).subscribe({
      next: (data: any) => {
        this.feedbackTypes = data.map((d: any) => d.feedbackType);
        this.customerFeedbackData = data.map((d: any) => d.averagePerformance);
        this.loadingCustomerFeedbackData = false; // Hides spinner when data is loaded
      }
    });
  }

  loadReportTypesData() {
    this.http.get(`${environment.apiBaseUrl}/dashboard/report-types`).subscribe({
      next: (data: any) => {
        this.reportTypes = data.reportTypes;
        this.reportCounts = data.reportCounts;
        this.loadingReportTypesData = false; // Hides spinner when data is loaded
      }
    });
  }
}