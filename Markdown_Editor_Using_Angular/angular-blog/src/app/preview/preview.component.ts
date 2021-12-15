import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Post } from '../post';
import { Output, EventEmitter } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  @Input() post: Post;
  @Output() editPost = new EventEmitter<Post>();

  reader = new Parser();
  writer = new HtmlRenderer();

  constructor() { }

  ngOnInit(): void {
  }

}
