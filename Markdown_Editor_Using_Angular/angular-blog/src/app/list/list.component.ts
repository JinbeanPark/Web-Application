import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() posts: Post[];
  @Output() openPost = new EventEmitter<Post>();
  @Output() newPost = new EventEmitter<Post>();


  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
  }

}
