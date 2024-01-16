import { TestBed } from '@angular/core/testing';

import { ProteccionService } from './proteccion.service';

describe('ProteccionService', () => {
  let service: ProteccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProteccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
