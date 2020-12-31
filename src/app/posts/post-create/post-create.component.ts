import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator'


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  isLoading = false;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;
  post: Post = {id: "", title: "", content: "", imagePath: null, creator: null};


  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(
        authStatus => {
          this.isLoading = false;
        }
      )
    this.form = new FormGroup({
      // 1st argument - null je "begin form state" , 2nd argument - attach validators or formControl options, 3rd argument - updateOn - cekira validnost na svaki unos
      'title': new FormControl(null, {validators:[Validators.required, Validators.minLength(3)]}),      // required is a method but we shouldnt execute it - nema () na kraju metode
      'content': new FormControl(null, {validators:[Validators.required]}),
      'image': new FormControl(null,
        {validators: [Validators.required],
        asyncValidators: [mimeType]}
      )
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          }
          // setuijemo formu
          this.form.setValue({
            title :this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          })
        });
        //console.log(this.post);
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post.title = "";
        this.post.content = "";
      }
    });
  }

  // postCreated = new EventEmitter<Post>()  // defubuse se genericka data eventa

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]   // HTMLInputElement je tu zbog konverzije da bi Angular znao da ima fajl kao sto je slika
    //console.log("event", event, "eventTarget", event.target)
    this.form.patchValue({image: file})    // patchValue allows us to target a single control || setValue setuje za vise kontrola
    this.form.get('image')//.updateValueAndValidity();

    const reader = new FileReader();
    const reader1 = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      //console.log(reader.result); ovo je base64 slika
      console.log(reader.result)
    }

    //console.log("!!", file)
    reader.readAsDataURL(file);

    reader1.readAsArrayBuffer(file)
    reader1.onload = () => {
      //this.imagePreview = reader.result;
      console.log("reader1.result",reader1.result)
      return

      // RAZLIKA IZMEDJU : readAsArrayBuffer(file) || readAsDataURL(file);          !!!!

      //this.imagePreview = reader.result;
      //console.log(reader.result); ovo je base64 slika
      console.log("!!!!!",reader1.result)
      const arr = new Uint8Array(reader1.result as ArrayBuffer).subarray(0, 4);
      console.log("arara",arr)
      for(let i = 0;i < 4; i++) {
        console.log(arr[i].toString(16))
      }
    }

  }

  onSavePost() {   /* definisali smo formu  u HTML-u kao NgFormu pa je ovde tako i ucitavamo */
/*     if (this.form.invalid) {
      return;
    } */


    if (this.mode == 'create') {
    /* this.postCreated.emit(post); */
    this.postsService.addPost(
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
      );
    } else {
      //console.log("create save", this.post.id, post.title, post.content)
      this.postsService.updatePost(
        this.post.id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      )
    }
    this.form.reset()
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
