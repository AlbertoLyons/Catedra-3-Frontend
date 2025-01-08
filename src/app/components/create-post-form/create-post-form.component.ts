import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreatePost } from '../../interfaces/create-post';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-create-post-form',
  standalone: true,
  imports: [NgxDropzoneModule,ReactiveFormsModule,CommonModule],
  providers: [PostService, LocalStorageService],
  templateUrl: './create-post-form.component.html',
  styleUrl: './create-post-form.component.css'
})
export class CreatePostFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  private readonly LLS = inject(LocalStorageService);
  protected noImageSelected = false;
  protected loading = false;
  protected invalidSubmit = false;
  protected showSuccessModal = false;
  protected errorMessage = '';
  protected readonly createForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    });
  files: File[] = [];
    onSubmit() {
    if (this.files.length === 0) {
      this.noImageSelected = true;
      return;
    }
    if (this.files.length > 1) {
      this.errorMessage = 'Solo se permite una imagen por post';
      this.invalidSubmit = true;
      this.files = [];
      return;
    }
    if (this.createForm.invalid) {
      this.files = [];
      return;
    }
    this.loading = true;
    const post: CreatePost = {
      title: this.createForm.get('title')?.value,
      postDate: new Date().toISOString(),
      image: this.files,
      userId: this.LLS.getVariable('user').id,
    };
    console.log("post",post)
    this.createPost(post);

  }
  createPost(postData: CreatePost) {
    this.postService.createPost(postData).then(() => {
      this.showSuccessModal = true;
      setTimeout(() => {
        this.router.navigate(['posts']);
      }, 2000);
    }).catch((error) => {
      this.loading = false;
      this.invalidSubmit = true;
      this.files = [];
      if (error.error.message === 'Image must be a PNG or JPG') {
        this.errorMessage = 'La imagen debe ser PNG o JPG';
      }
      else if (error.error.message === 'Image size cannot exceed 5 MB') {
        this.errorMessage = 'La imagen debe ser menor a 5 MB';
      }
      else if (error.error.message === 'Failed to fetch') {
        this.errorMessage = 'Ocurrio un error con el servidor';
      }
      else {
        this.errorMessage = error.error.message;
      }
      console.log("Error",error);
    });
  }
  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
    this.noImageSelected = false;
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
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
    };
    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }
}
