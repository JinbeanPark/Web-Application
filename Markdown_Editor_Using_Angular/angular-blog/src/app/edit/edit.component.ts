import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { Post } from '../post';
import { Output, EventEmitter } from '@angular/core';
import { BlogService } from '../blog.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @Input() post: Post;
  @Output() savePost = new EventEmitter<Post>();
  @Output() deletePost = new EventEmitter<Post>();
  @Output() previewPost = new EventEmitter<Post>();
  
  constructor(private blogService: BlogService) { 
    
  }

  ngOnInit(): void {
  }

  setCurrentTitleBody() {
    
  }
}