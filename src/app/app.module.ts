import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
// Tools 
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';




import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

// Components
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { BookListComponent } from './components/books/book-list/book-list.component';
import { BookRegisterComponent } from './components/books/book-register/book-register.component';
import { BookViewComponent } from './components/books/book-view/book-view.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { CategoriesComponent } from './components/shared/categories/categories.component';


//Interceptors


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    BookListComponent,
    BookRegisterComponent,
    BookViewComponent,
    NavbarComponent,
    AlertComponent,
    CategoriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
