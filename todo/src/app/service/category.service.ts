import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ToastrService} from "ngx-toastr";
import {map} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  userId!:string
  constructor(
    private afs:AngularFirestore,
    private firebaseService: AuthService,
    private toastr:ToastrService) {
    this.firebaseService.isLoggedIn$.subscribe((isLoggedIn:boolean) => {
      if (isLoggedIn){
        this.userId = JSON.parse(localStorage.getItem('user')!).uid
      }
    })
  }

  saveCategory(data:any){
    this.afs.collection('categories').add(data).then(ref => {
      this.toastr.success('New Category Saved Successfully')
    })
  }
  loadCategories(){
  return  this.afs.collection('categories',ref => ref.where('authorId','==',this.userId))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id
          return{id,data}
        })
      })
    )
  }
  updateCategory(id:string,updatedData:any){
    this.afs.doc(`categories/${id}`).update({category:updatedData}).then(() => {
      this.toastr.success('Update Successfully')
    })
  }

  deleteCategory(id:string){
    this.afs.doc(`categories/${id}`).delete().then(() => {
      this.toastr.error('Category Deleted Successfully')
    })
  }
}
