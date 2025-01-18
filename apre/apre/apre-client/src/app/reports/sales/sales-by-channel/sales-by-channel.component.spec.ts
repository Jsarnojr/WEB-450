import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesByChannelComponent } from './sales-by-channel.component';
import { CommonModule } from '@angular/common';

describe('SalesByChannelComponent', () => {
  let component: SalesByChannelComponent;
  let fixture: ComponentFixture<SalesByChannelComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByChannelComponent, HttpClientTestingModule, CommonModule],  // Import necessary modules
    }).compileComponents();

    fixture = TestBed.createComponent(SalesByChannelComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Ensure there are no pending HTTP requests after each test
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // Trigger any HTTP request (the component fetches data in ngOnInit)
    const req = httpMock.expectOne('/api/sales/channel');
    expect(req.request.method).toBe('GET');
    req.flush([]);  // Simulate an empty response to avoid an unhandled promise rejection

    // Now that the request is flushed, trigger change detection again
    fixture.detectChanges();

    // There should be no pending requests now
    httpMock.verify();  // Verifies that no requests are pending at the end of the test
  });

  it('should fetch and display sales data', () => {
    const mockData = [
      { channel: 'Online', totalSales: 5000 },
      { channel: 'Retail', totalSales: 3000 }
    ];

    const req = httpMock.expectOne('/api/sales/channel');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);  // Simulate the response with mock data

    fixture.detectChanges();  // Trigger change detection to update the DOM

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(2);
    expect(tableRows[0].textContent).toContain('Online');
    expect(tableRows[0].textContent).toContain('$5,000.00');

    // Ensure there are no open requests left
    httpMock.verify();  // Ensure all HTTP requests are completed
  });

  it('should handle HTTP errors gracefully', () => {
    const req = httpMock.expectOne('/api/sales/channel');
    expect(req.request.method).toBe('GET');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });  // Simulate HTTP error response

    fixture.detectChanges();  // Trigger change detection

    const errorMessage = fixture.nativeElement.querySelector('p').textContent;
    expect(errorMessage).toBe('Error fetching sales data by channel');  // Check if error message is displayed

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(0);  // No rows should be displayed on error

    // Ensure there are no open requests left
    httpMock.verify();  // Ensure all HTTP requests are completed
  });

  it('should handle no sales data gracefully', () => {
    const req = httpMock.expectOne('/api/sales/channel');
    expect(req.request.method).toBe('GET');
    req.flush([]);  // Return an empty array (no data)

    fixture.detectChanges();  // Trigger change detection

    const noDataMessage = fixture.nativeElement.querySelector('p').textContent;
    expect(noDataMessage).toBe('No sales data available.');  // Ensure no data message is shown

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(0);  // No rows should be displayed if no data

    // Ensure there are no open requests left
    httpMock.verify();  // Ensure all HTTP requests are completed
  });
});
