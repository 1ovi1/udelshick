import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { CandidateVacanciesPage } from './candidate-vacancies.page';
import { CandidateDataService } from '../../services/candidate.service';
import { CandidateVacancyItem } from '../../models/candidate/candidate-vacancy-item.interface';
import { PaginatedResult } from '../../models/candidate/paginated-result.interface';

class CandidateDataServiceMock {
  getVacancies = vi.fn();
  applyToVacancy = vi.fn();
}

function paginated(items: CandidateVacancyItem[]): PaginatedResult<CandidateVacancyItem> {
  return {
    items,
    meta: {
      page: 1,
      limit: 8,
      total: items.length,
      totalPages: 1,
    },
  };
}

describe('CandidateVacanciesPage states', () => {
  let serviceMock: CandidateDataServiceMock;

  beforeEach(async () => {
    serviceMock = new CandidateDataServiceMock();

    await TestBed.configureTestingModule({
      imports: [CandidateVacanciesPage],
      providers: [
        provideRouter([]),
        {
          provide: CandidateDataService,
          useValue: serviceMock,
        },
      ],
    }).compileComponents();
  });

  it('shows loading state while vacancies request is pending', () => {
    const stream = new Subject<PaginatedResult<CandidateVacancyItem>>();
    serviceMock.getVacancies.mockReturnValue(stream.asObservable());

    const fixture = TestBed.createComponent(CandidateVacanciesPage);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Загрузка вакансий...');
  });

  it('shows empty state for empty vacancies result', () => {
    serviceMock.getVacancies.mockReturnValue(of(paginated([])));

    const fixture = TestBed.createComponent(CandidateVacanciesPage);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('По вашему запросу вакансии не найдены.');
  });

  it('shows error state when vacancies request fails', () => {
    serviceMock.getVacancies.mockReturnValue(throwError(() => new Error('Network')));

    const fixture = TestBed.createComponent(CandidateVacanciesPage);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Не удалось загрузить вакансии. Попробуйте позже.');
  });
});
