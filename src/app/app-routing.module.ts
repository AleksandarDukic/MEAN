import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";

import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from "./posts/post-list/post-list.component"


const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('src/app/auth/auth.module').then(m => m.AuthModule) }      /* ALL ROUTES REGISTERED HERE WILL BE ADDED LAZILY !!!! */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],    // this informs the angular Router about our routes - Imports routing module into Angular Module
  exports: [RouterModule],                     // this is to export it to main app module
  providers: [AuthGuard]
})
export class AppRoutingModule {}
