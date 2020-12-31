import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {environment} from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;  // "BACKTICS" = SPECIAL JAVASCRIPT FEATURE WHICH ALOWS US TO DYNAMICALY ADD VALUES TO A STRING
    //return [...this.posts];   /* da bismo vratili kopiju podataka a ne pokazivac na taj niz */ /* zapravo prosledjujemo PAYLOAD umesto pokazivaca samo */
    this.http
      .get<{ message: string, posts: any, maxPosts: number }>(
        BACKEND_URL + queryParams
        )
        .pipe(
          map(postData => {
            return {
              posts: postData.posts.map(post => {
                return {
                  title: post.title,
                  content: post.content,
                  id: post._id,
                  imagePath: post.imagePath,
                  creator: post.creator
                };
              }),
              maxPosts: postData.maxPosts,
              /* message: postData.message */
            }
          })
        )
        .subscribe((transformedPostData) => {
          console.log(transformedPostData)
          this.posts = transformedPostData.posts;
          this.postsUpdated.next({
            posts:[...this.posts],
            postCount: transformedPostData.maxPosts
          })
        });
  };

  getPost(id: string) {
    return this.http
      .get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(
        BACKEND_URL + id
      ); // this returns an observable
  }

  addPost(title: string, content: string, image: File) {
    //const newPost: Post = {id: post.id || null, title: post.title, content: post.content};        // object is constant. Objects are reference values
    // instead of sending JSON we will send form data
    const postData = new FormData();  // !!! this let us combine text data and BLOB -which is image
    postData.append("title", title)
    postData.append("content", content);
    postData.append("image", image, /* file name: */ title)  // !!! this is the propert we are trying to access in the backend
    this.http.post<{ message: string, post: Post }>(
      BACKEND_URL,
      postData)
      .subscribe(responseData => {
        console.log(responseData)
        /* console.log(responseData);
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        }
        const id = responseData.post.id;                                                                         // we can access the properties of const Objects - we are not changing the reference but the referenced field
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])  // emmiting whenever we add a post
        console.log("service create", image) */
        this.router.navigate(["/"])   // "/" navigates to home page
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    //const post: Post = { id: id, title: title, content: content, imagePath: null }
    let postData
    console.log("service update", image);
    if (typeof(image) == 'object') {
      postData = new FormData();
      postData.append("id", id)
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }

  this.http.put(
    BACKEND_URL + id,
    postData)
    .subscribe(response => {
  /*           const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: "response.imagePath"
        }
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
        //console.log(response) */
      this.router.navigate(["/"])   // "/" navigates to home page
    })
  }


  deletePost(postId: string) {
    return this.http.delete(
      BACKEND_URL + postId
      )
/*       .subscribe(() => {
        console.log('Deleted!');
        const updatedPosts = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      }) */
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }
}

/* servis ce na baratati informacijama na FRONTENDU */
