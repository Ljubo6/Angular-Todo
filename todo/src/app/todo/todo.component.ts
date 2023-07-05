import { Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {TodoService} from "../service/todo.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit{
  todoValue:string = ''
  catId: string | null = ''
  categoryId!:string | null
  todoId:string = ''
  todos!: Array<any>
  dataStatus:string = 'Add'
  userId = JSON.parse(localStorage.getItem('user')!).uid
  constructor(private todoService:TodoService,private activatedRoute:ActivatedRoute,
              private router:Router) {
  }
  onSubmit(f: NgForm) {
    if(this.dataStatus == 'Add'){
      let todo = {
        todo:f.value.todoText,
        authorId : this.userId,
        isCompleted:false
      }
      this.todoService.saveTodo(this.catId!,todo)
      f.resetForm()
    }else if(this.dataStatus == 'Edit'){
      this.todoService.updateTodo(this.catId!,this.todoId,f.value.todoText)
      f.resetForm()
      this.dataStatus = 'Add'
    }
  }
  ngOnInit(): void {
    this.catId = this.activatedRoute.snapshot.paramMap.get('id')
    this.categoryId = localStorage.getItem('originalId')
    if(this.catId === this.categoryId){
      this.todoService.loadTodos(this.catId!).subscribe(val => {
        this.todos = val
      })
    }else{
      this.router.navigate(['/error'])
    }

  }

  onEdit(todo:string, id:string) {
    this.todoId = id
    this.todoValue = todo
    this.dataStatus = 'Edit'
  }

  onDelete(id: string) {
    this.todoService.deleteTodo(this.catId!,id)
  }

  completeTodo(todoId:string) {
    this.todoService.markCompleted(this.catId!,todoId)
  }

  uncompletedTodo(todoId:string) {
    this.todoService.markUncompleted(this.catId!,todoId)
  }
}
