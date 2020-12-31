import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model'
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: 'post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [] ;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;


  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {} //    private authService: AuthService -- kad bi bio public moglo bi se pristutpiti direktno iz HTML-a ovako mora iz typescripta



  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postsData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postsData.postCount;
        this.posts = postsData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.
      getAuthStatusListener()
      .subscribe(isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage)
      }, () => {
        this.isLoading = false;
      })
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1; // PAGE INDEX I OSTALI PARAMETRI SU FIKSNI I DOLAZE OD PAGINATORA - CONSOLE.LOG(pageData) - tu se vide info koje moze da salje
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

/*   posts = [
    {
      title: 'First Post', content: "thi is the first post contentt"
    },
    {
      title: 'Second Post', content: "thi is the qwe post contentt"
    },
    {
      title: 'Third Post', content: "thi is the 12122 post contentt"
    }
  ] */

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
