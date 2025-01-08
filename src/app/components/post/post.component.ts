import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  @Input() url = '';
  @Input() title = 'Post';
  @Input() postDate = '2020-01-01';
  @Input() userId = '';
}
