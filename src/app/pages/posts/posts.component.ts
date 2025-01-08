import { Component, inject } from '@angular/core';
import { Post } from '../../interfaces/post';
import { PostComponent } from '../../components/post/post.component';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [PostComponent,CommonModule],
  providers: [PostService],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  private readonly postService = inject(PostService);
  posts: Post[] = [];

  ngOnInit() {
    this.getPosts();
  }
  getPosts() {
    this.postService.getPosts().then((posts) => {
      this.posts = posts;
      for (let post of this.posts) {
        post.postDate = this.formatDate(post.postDate);
      }
      console.log("posts", this.posts);
    }).catch((error) => {
      console.log("Error on getPosts",error)
    });
  }
  formatDate(date: string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
