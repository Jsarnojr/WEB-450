// agent-performance.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AgentPerformanceComponent } from './agent-performance.component';
import { MatTableModule } from '@angular/material/table';

describe('AgentPerformanceComponent', () => {
  let component: AgentPerformanceComponent;
  let fixture: ComponentFixture<AgentPerformanceComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentPerformanceComponent],
      imports: [HttpClientTestingModule, MatTableModule],
    });

    fixture = TestBed.createComponent(AgentPerformanceComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch performance data on init', () => {
    const mockData = [
      { agent: 'Agent A', month: 'January', resolutionTime: 30 },
    ];

    component.ngOnInit();
    const req = httpMock.expectOne('/api/agent-performance?month=January');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(component.agentPerformance).toEqual(mockData);
  });

  it('should handle API errors gracefully', () => {
    component.ngOnInit();
    const req = httpMock.expectOne('/api/agent-performance?month=January');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(component.errorMessage).toBe('Error fetching data');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
