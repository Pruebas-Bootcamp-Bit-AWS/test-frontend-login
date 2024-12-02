import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

//inicio el test
describe('LoginComponent Test', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Variables para los test
  const userEmail = 'test@test.com';
  const userPassword = '#Clave1234';
  const token = 'test-token';
  const successMessage = 'Bienvenido al sistema';
  const errorMessage = 'Error al autenticar';
  const errorResponse = { error: { msg: errorMessage } };
  const mockTokenResponse = { token, msg: successMessage };

  // Configuracion de jasmine
  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('Debería crear un componente', ()=>{
    expect(component).toBeTruthy();
})

  it('Tendría que manejarme los errores ', () => {
    // Arrange
    authService.login.and.returnValue(throwError(errorResponse));

    component.email = userEmail;
    component.password = userPassword;
    
    // Act
    component.login();

    // Assert
    expect(authService.login).toHaveBeenCalledWith(userEmail, userPassword);
    expect(Swal.fire).toHaveBeenCalledWith(errorMessage);
  });


  it('Debería llamar a login de AuthService y redirigir en caso de éxito', () => {
    // Arrange
    component.email = userEmail;
    component.password = userPassword;
    authService.login.and.returnValue(of(mockTokenResponse));

    // Act
    component.login();

    // Assert
    expect(authService.login).toHaveBeenCalledWith(userEmail, userPassword);
    expect(sessionStorage.getItem('token')).toBe(token);
    expect(Swal.fire).toHaveBeenCalledWith(successMessage);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/csv-home']);
  });


});