import { TestBed } from '@angular/core/testing';

import { MemeService } from './meme.service';

describe('MemeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemeService = TestBed.get(MemeService);
    expect(service).toBeTruthy();
  });
});
