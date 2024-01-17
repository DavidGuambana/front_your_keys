import { TestBed } from '@angular/core/testing';

import { UsuarioRolService } from './usuario-rol.service';

describe('UsuarioRolService', () => {
  let service: UsuarioRolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioRolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
