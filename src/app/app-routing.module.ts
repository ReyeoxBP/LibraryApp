import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { BookListComponent } from './components/books/book-list/book-list.component';
import { BookRegisterComponent } from './components/books/book-register/book-register.component';
import { BookViewComponent } from './components/books/book-view/book-view.component';
import { PublicListComponent } from './components/books/public-list/public-list.component';
import { BookEditComponent } from './components/books/book-edit/book-edit.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'signin', component: LoginComponent},
  {path: 'book/private', component: BookListComponent},
  {path: 'book/create', component: BookRegisterComponent},
  {path: 'book/view/:id', component: BookViewComponent},
  {path: 'book/edit/:id' , component: BookEditComponent},
  {path: '', component: PublicListComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
