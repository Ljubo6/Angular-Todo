import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CategoryComponent} from "./category/category.component";
import {TodoComponent} from "./todo/todo.component";
import {LoginComponent} from "./auth/login/login.component";
import {AuthGuard} from "./service/auth.guard";
import {RegisterComponent} from "./auth/register/register.component";

const routes: Routes = [
  {path: '', redirectTo: '/login',pathMatch: 'full'},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'category',component:CategoryComponent,canActivate:[AuthGuard]},

  {path:'todo/:id',component:TodoComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
