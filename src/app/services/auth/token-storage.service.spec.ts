import { TestBed } from '@angular/core/testing';

import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and retrieve token', () =>{
    const token = 'mock-token';

    service.saveToken(token);
    const retrieveToken = service.getToken();

    expect(retrieveToken).toEqual(token);

  });

  it('should save and retrieve user', () =>{
    const user = { id: 1, name: 'Eduardo'};

    service.saveUser(user);

    const retrievedUser = service.getUser();
    expect(retrievedUser).toEqual(user);
  }); 

  it('should clear session storage on sign out', () => {
    jest.spyOn(window.sessionStorage, 'clear');

    service.signOut();

    expect(window.sessionStorage.clear).toHaveBeenCalled();
  });
});
