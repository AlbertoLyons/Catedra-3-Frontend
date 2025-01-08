import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login.component').then(
              (m) => m.LoginComponent
            ),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./pages/register/register.component').then(
              (m) => m.RegisterComponent
            ),
    },
    {
        path: 'posts',
        loadComponent: () =>
            import('./pages/posts/posts.component').then(
              (m) => m.PostsComponent
            ),
        
        children: [
            {
                path: 'create',
                loadComponent: () =>
                    import('./components/create-post-form/create-post-form.component').then(
                      (m) => m.CreatePostFormComponent
                ),
            }
        ],
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/posts',
        pathMatch: 'full'
    },

];
