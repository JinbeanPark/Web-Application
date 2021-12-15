/* Copyright: Junghoo Cho (cho@cs.ucla.edu) */
/* This file was created for CS144 class at UCLA */
import { Injectable } from '@angular/core';
import { Post } from './post';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
  providedIn: 'root'
})
export class BlogService {


    curEditPost = null;

    maxid: number = 0;

    constructor(private http: HttpClient) { 
        
    }

    fetchPosts(username: string): Promise<Post[]> {
        let configUrl = `/api/posts/?username=${username}`;
        
        // @@@@@
        console.log(configUrl);

        return new Promise<Post[]>((resolve, reject) => {
            this.http.get<Post[]>(configUrl)
            .subscribe( data => { resolve(data)},
            (error) => {
                reject(Error(error.status));
            })
        })
    }

    getPost(username: string, postid: number): Promise<Post> {
        let configUrl = `/api/posts/?username=${username}\&postid=${postid}`;

        console.log(configUrl);

        return new Promise<Post>((resolve, reject) => {
            this.http.get<Post>(configUrl)
            .subscribe( data => { resolve(data)},
            (error) => {
                reject(Error(error.status));
            })
        })
    }

    setPost(username: string, post: Post): Promise<Post> {
        let configUrl = `/api/posts`;
        post["username"] = username;
        console.log(post[username]);
        console.log(post);
        return new Promise<Post>((resolve, reject) => {
            this.http.post<Post>(configUrl, post, httpOptions)
            .subscribe( data => { resolve(data)},
            (error) => {
                reject(Error(error.status));
            })
        })
    }

    deletePost(username: string, postid: number): Promise<void> {
        let configUrl = `/api/posts/?username=${username}\&postid=${postid}`;

        console.log(configUrl);

        return new Promise<void>((resolve, reject) => {
            this.http.delete<void>(configUrl, httpOptions)
            .subscribe( data => { resolve(data)},
            (error) => {
                reject(Error(error.status));
            })
        })
    }
}
