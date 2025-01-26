// agent-performance.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Ensure HttpClient is properly imported

@Component({
  selector: 'app-agent-performance',
  templateUrl: './agent-performance.component.html',
  styleUrls: ['./agent-performance.component.css'],
})
export class AgentPerformanceComponent implements OnInit {
  agentPerformance: any[] = []; // Store the fetched performance data
  displayedColumns: string[] = ['agent', 'month', 'resolutionTime']; // Columns to display in the table
  errorMessage: string | null = null; // Error message, if any

  // Sample static data (for fallback if API fetch fails or when testing)
  sampleData = [
    { agent: 'Agent 1', month: 'January', resolutionTime: '2 hours' },
    { agent: 'Agent 2', month: 'January', resolutionTime: '3 hours' },
  ];

  dataSource = this.sampleData; // Default to sample data first

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPerformanceData('January'); // Fetch data when component is initialized
  }

  fetchPerformanceData(month: string): void {
    this.http
      .get<any[]>(`/api/agent-performance?month=${month}`) // Replace with your actual API endpoint
      .subscribe({
        next: (data) => {
          this.agentPerformance = data; // Store the fetched data in agentPerformance
          this.dataSource = data; // Update the dataSource to the fetched data
        },
        error: (err) => {
          this.errorMessage = 'Error fetching data'; // Handle any errors during fetch
          this.dataSource = this.sampleData; // Fallback to sample data on error
        },
      });
  }
}
