import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ToastrService} from "ngx-toastr";
import {map} from "rxjs";
import firebase from "firebase/compat/app";
import firestore = firebase.firestore;
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  userId!:string
  constructor(private afs:AngularFirestore,
              private firebaseService: AuthService,
              private toastr:ToastrService) {
    this.firebaseService.isLoggedIn$.subscribe((isLoggedIn:boolean) => {
      if (isLoggedIn){
        this.userId = JSON.parse(localStorage.getItem('user')!).uid
      }
    })
  }
  saveTodo(id:string,data:any){
    this.afs.collection('categories').doc(id).collection('todos').add(data).then(ref => {
      this.afs.doc(`categories/${id}`).update({
        todoCount:firestore.FieldValue.increment(1)
      })
      this.toastr.success('New Todo Saved Successfully')
    })
  }
  loadTodos(id:string){
    return  this.afs.collection('categories').doc(id).collection('todos',ref => ref.where('authorId','==',this.userId)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id
          return{id,data}
        })
      })
    )
  }
  updateTodo(catId:string,todoId:string,updatedData:string){
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({
      todo:updatedData
    }).then(() => {
      this.toastr.success('Todo Updated Successfully')
    })
  }
  deleteTodo(catId:string,todoId:string){
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).delete().then(() => {
      this.afs.doc(`categories/${catId}`).update({
        todoCount:firestore.FieldValue.increment(-1)
      })
      this.toastr.error('Todo Deleted Successfully')
    })
  }
  markCompleted(catId:string,todoId:string){
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({
      isCompleted:true
    }).then(() => {
      this.toastr.info('Todo Marked Completed')
    })
  }
  markUncompleted(catId:string,todoId:string){
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({
      isCompleted:false
    }).then(() => {
      this.toastr.warning('Todo Marked Uncompleted')
    })
  }
}
