import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PostsComponent } from './pages/posts/posts.component';
import { authGuard } from './guards/auth.guard';
import { CreatePostFormComponent } from './components/create-post-form/create-post-form.component';
export const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'posts',
        component: PostsComponent,
        children: [
            {
                //path: 'create',
                //component: CreatePostFormComponent,
            }
        ],
        //canActivate: [authGuard]
    },
    {
        
            path: 'posts/create',
            component: CreatePostFormComponent,
        
    },
    {
        path: '**',
        redirectTo: '/posts',
        pathMatch: 'full'
    },

];
