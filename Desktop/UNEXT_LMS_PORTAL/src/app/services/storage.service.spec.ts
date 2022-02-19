import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

// eslint-disable-next-line max-lines-per-function
describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set and get value', () => {
    service.set('key1', 'value1');
    expect(service.get('key1')).toEqual('value1');
  });
  it('should set, broadcast value and listen', () => {
    service.set('key1', 'value1');
    service.broadcastValue('key1');
    service.listen('key1').subscribe(data => {
      expect(data).toEqual('value1');
    });
  });
  it('should set and listen to many', () => {
    service.set('key1', 'value1');
    service.set('key2', 'value2');
    service.listenMany(['key1', 'key2']).subscribe(data => {
      if (data.key === 'key1') {
        expect(data.value).toEqual('value1');
      }
      if (data.key === 'key2') {
        expect(data.value).toEqual('value2');
      }
    }).unsubscribe();
  });

  it('should  broadcast non existent value and get error', () => {
    expect(function () {
      service.get('key1');
    }).toThrow(Error("Value doesn't exist"));
  });

  it('should  broadcast non existent value and get error', () => {
    expect(function () {
      service.broadcastValue('key1');
    }).toThrow(Error("Cannot broadcast a non-existent value"));
  });
  it('should unsubscribe', () => {
    service.set('key1', 'value1');
    const obs = service.listen('key1').subscribe(data => {
      expect(data).toEqual('value1');
    });
    expect(obs.closed).toBeFalse();
    service.unsubscribe();
    expect(obs.closed).toBeTrue();
  });
});