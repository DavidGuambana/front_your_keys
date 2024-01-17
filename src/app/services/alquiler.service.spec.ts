import { TestBed } from '@angular/core/testing';

import { AlquilerService } from './alquiler.service';

describe('AlquilerService', () => {
  let service: AlquilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlquilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
