import { TestBed } from '@angular/core/testing';

import { DevolucionService } from './devolucion.service';

describe('ClienteService', () => {
  let service: DevolucionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevolucionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});