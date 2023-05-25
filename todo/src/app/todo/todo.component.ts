import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {TodoService} from "../service/todo.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit{
  todoValue:string = ''
  catId: string | null = ''
  todoId:string = ''
  todos!: Array<any>
  dataStatus:string = 'Add'
  constructor(private todoService:TodoService,private activatedRoute:ActivatedRoute) {
  }
  onSubmit(f: NgForm) {

    if(this.dataStatus == 'Add'){
      let todo = {
        todo:f.value.todoText,
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
    this.todoService.loadTodos(this.catId!).subscribe(val => {
      this.todos = val
      console.log(this.todos)
      console.log(this.catId)
    })
  }

  onEdit(todo:string, id:string) {
    this.todoId = id
    this.todoValue = todo
    this.dataStatus = 'Edit'
    console.log(this.todoValue)
    console.log(this.todoId)
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
