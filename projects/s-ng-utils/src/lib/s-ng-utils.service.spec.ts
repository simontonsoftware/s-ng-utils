import { TestBed, inject } from '@angular/core/testing';

import { SNgUtilsService } from './s-ng-utils.service';

describe('SNgUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SNgUtilsService]
    });
  });

  it('should be created', inject([SNgUtilsService], (service: SNgUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
