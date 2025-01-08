import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-post-form',
  standalone: true,
  imports: [NgxDropzoneModule,ReactiveFormsModule,CommonModule],
  providers: [PostService],
  templateUrl: './create-post-form.component.html',
  styleUrl: './create-post-form.component.css'
})
export class CreatePostFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  protected loading = false;
  protected readonly createForm: FormGroup = this.fb.group({
    title: ['', [Validators.required,]],
    postDate: ['', [Validators.required,]],
    });
  files: File[] = [];
    onSubmit() {
    }
  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  cancel() {
  this.router.navigate(['posts']);
  }
  protected getFieldError(fieldName: string): string {
    const control = this.createForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
    };
    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }
}
