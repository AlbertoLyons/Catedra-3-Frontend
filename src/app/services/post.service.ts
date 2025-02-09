import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Post } from '../interfaces/post';
import { firstValueFrom } from 'rxjs';
import { CreatePost } from '../interfaces/create-post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + "/posts";
  public errors: string[] = [];

  async getPosts(): Promise<Post[]> {
    try{
      const response = await firstValueFrom(this.http.get<Post[]>(`${this.baseUrl}`));
      return Promise.resolve(response);
    }catch(error){
      console.log("Error on getPosts",error)
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
  async createPost(post: CreatePost): Promise<void> {
    try{
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('postDate', post.postDate);
      formData.append('image', post.image[0]);
      formData.append('userId', post.userId);

      await firstValueFrom(this.http.post(`${this.baseUrl}`, formData));
      return Promise.resolve();
    }catch(error){
      console.log("Error on createPost",error)
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
}
