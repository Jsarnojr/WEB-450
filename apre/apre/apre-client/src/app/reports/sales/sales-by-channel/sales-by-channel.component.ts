import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-sales-by-channel',
  standalone: true,  // Mark this as a standalone component
  imports: [CommonModule], // Import CommonModule to support *ngIf, *ngFor, etc.
  template: `
    <div *ngIf="salesData.length; else noData">
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of salesData">
            <td>{{ data.channel }}</td>
            <td>{{ data.totalSales | currency }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <ng-template #noData>
      <p>{{ errorMessage || 'No sales data available.' }}</p>
    </ng-template>
  `,
  styles: [
    `
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      th {
        background-color: #f4f4f4;
      }
    `
  ]
})
export class SalesByChannelComponent implements OnInit {
  salesData: { channel: string; totalSales: number }[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSalesData();
  }

  fetchSalesData(): void {
    this.http.get<{ channel: string; totalSales: number }[]>('/api/sales/channel')
      .subscribe(
        (data) => {
          this.salesData = data;
          this.errorMessage = null;  // Reset error message on successful data fetch
        },
        (error) => {
          this.salesData = [];
          this.errorMessage = 'Error fetching sales data by channel';  // Set error message on failure
        }
      );
  }
}