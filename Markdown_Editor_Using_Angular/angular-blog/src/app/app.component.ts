import { Component } from '@angular/core';
import { Post } from './post';
import { BlogService } from './blog.service';
import { Parser, HtmlRenderer } from 'commonmark';
import { Output, EventEmitter } from '@angular/core';
import * as cookie from 'cookie';

const enum AppState { List, Edit, Preview };


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  posts: Post[];
  currentPost: Post;
  appState: AppState;
  
  postToEdit: Post = null;
  postToDisplay: Post = null;
  username: string = null;
  
  
  postsToDisplay = [
    { "postid": 1, "username": "cs144", "created": 1518669344517, "modified": 1518669344517, "title": "## Title 1", "body": "Hello, world!" },
    { "postid": 2, "username": "cs144", "created": 1518669658420, "modified": 1518669658420, "title": "## Title 2", "body": "I am here." },
    { "postid": 1, "username": "user2", "created": 1518669758320, "modified": 1518669758320, "title": "## Title 3", "body": "today's a nice day" },
    { "postid": 2, "username": "user2", "created": 1518669758330, "modified": 1518669758340, "title": "## Title 4", "body": "today's a nice day" },
    { "postid": 3, "username": "user2", "created": 1518669758350, "modified": 1518669758350, "title": "## Title 5", "body": "today's a nice day" },
    { "postid": 4, "username": "user2", "created": 1518669758360, "modified": 1518669758360, "title": "## Title 6", "body": "today's a nice day" },
    { "postid": 5, "username": "user2", "created": 1518669758370, "modified": 1518669758370, "title": "## Title 7", "body": "gotta do my homework" },
    { "postid": 6, "username": "user2", "created": 1518669758380, "modified": 1518669758380, "title": "## Title 8", "body": "today's a nice day" }
  ];

  fetchPosts(username: string): void {

    //@@@
    console.log("username");

    this.blogService.fetchPosts(username)
    .then(res => this.posts = res);
  }

  getPostWithBlog(username: string, postid: number): void {
    this.blogService.getPost(username, postid)
    .then(res => this.currentPost = res);
  }

  setPostWithBlog(username: string, post: Post): void {

    if (post.postid == 0) {
      this.blogService.setPost(username, post)
      .then(res => {
        post.postid = res.postid;
        post.created = res.created;
        post.modified = res.modified;
        this.posts.push(post);
        this.openPost(post);
      })
    }
    else {
      this.blogService.setPost(username, post)
      .then(res => {
        let len = this.posts.length;
        for (let i = 0; i < len; i++) {
          if (this.posts[i].postid == post.postid) {
            this.posts[i].modified = res.modified
            this.posts[i].title = res.title
            this.posts[i].body = res.body
            this.openPost(this.posts[i]);
            break;
          }
        }
      })
    }
  }

  deletePostWithBlog(username: string, postid: number): void {
    this.blogService.deletePost(username, postid)
    .then(res => {
      let len = this.posts.length;
      for (let i = 0; i < len; i++) {
        if (this.posts[i].postid == postid) {
          this.posts.splice(i, 1);
          break;
        }
      }
    });
  }
  
  constructor (private blogService: BlogService) {
    
    this.appState = AppState.List;
    console.log("Document.cookie: " + document.cookie);
    
    let jwtVal = this.getCookieVal(document.cookie);
    console.log("jwtVal: " + jwtVal);

    this.parseJWT(jwtVal);
    window.addEventListener("hashchange", () => this.onHashChange());

    if (window.location.hash.includes('preview')) {
      let splitted = window.location.hash.split("/");
      this.appState = 2;
      this.getPostWithBlog(this.username, parseInt(splitted[2]));
    }
  }

  onHashChange() {
    if (window.location.hash.includes('edit')) {
      let splitted = window.location.hash.split("/");
      this.appState = 1;
      if (parseInt(splitted[2]) != 0)
        this.getPostWithBlog(this.username, parseInt(splitted[2]));
      else
        this.currentPost = new Post();
    }
    else if (window.location.hash.includes('preview')) {
      let splitted = window.location.hash.split("/");
      this.appState = 2;
      this.getPostWithBlog(this.username, parseInt(splitted[2]));
    }
    else {
      this.appState = 0;
    }
  }

  getCookieVal(allCookies: string): string {

    const cookieValue = allCookies
    .split('; ')
    .find(row => row.startsWith('jwt='))
    .split('=')[1];
    return cookieValue;
  }

  parseJWT(token: string): void {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let user = JSON.parse(atob(base64));
    this.username = user.usr;
    this.fetchPosts(this.username);
  }


  // event handlers for list component events
  openPost(post: Post) {
    this.getPostWithBlog(this.username, post.postid);
    this.appState = AppState.Edit;
    
    console.log(window.location.hash);
    window.location.hash = "#/edit/" + post.postid;
  }

  newPost() {
    this.currentPost = new Post();
    this.appState = AppState.Edit;
    window.location.hash = "#/edit/" + this.currentPost.postid;
  }

  // event handlers for edit component events
  previewPost(post: Post) {
    this.appState = AppState.Preview;
    window.location.hash = "#/preview/" + post.postid;
  }
  
  savePost(post: Post) {
    this.setPostWithBlog(this.username, post);
  }
  
  deletePost(post: Post) {
    this.deletePostWithBlog(this.username, post.postid);
    this.appState = AppState.List;
    window.location.hash = "#/";
  }
  
  // event handlers for preview component events
  editPost(post: Post) {
    this.openPost(post);
    this.appState = AppState.Edit;
    window.location.hash = "#/edit/" + post.postid;
  }
}
