import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {CategoryService} from "../service/category.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{
  color: Array<any> = [
    '#e7845e', '#fc0184', '#f6b93f',
    '#9224a7', '#20c898', '#f03734',
    '#aad450', '#026467', '#fefe45',
    '#928779', '#D4D2A5', "#FCDEBE",
    '#90A583', '#B26E63', '#C6CAED'
  ]
  categories:Array<any> = []
  categoryName:string = ''
  dataStatus:string = 'Add'
  catId:string = ''
  userId = JSON.parse(localStorage.getItem('user')!).uid
  constructor(private categoryService:CategoryService) {
  }




  ngOnInit(): void {
    this.categoryService.loadCategories().subscribe(val => {
      this.categories = val
    })
    console.log(this.userId)
  }
  onSubmit(f:NgForm) {
    if(this.dataStatus === 'Add'){
      let randomNumber = Math.floor(Math.random() * this.color.length)
      let todoCategory = {
        category: f.value.categoryName,
        colorCode: this.color[randomNumber],
        todoCount:0,
        authorId : this.userId
      }
      this.categoryService.saveCategory(todoCategory)
      f.resetForm()
    }else if(this.dataStatus === 'Edit'){
      this.categoryService.updateCategory(this.catId,f.value.categoryName)
      f.resetForm()
      this.dataStatus = 'Add'
    }

  }

  onEdit(category:string,id:string) {
    this.catId = id
    this.categoryName = category
    this.dataStatus = 'Edit'
  }

  onDelete(id:string) {
    this.categoryService.deleteCategory(id)
  }
}
