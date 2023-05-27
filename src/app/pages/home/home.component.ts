import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent} from '../image-dialog/image-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  API_URL = "http://localhost:8080/helmet";
  images: any[];
  currentPage: number = 1;
  pageSize: number = 12;
  totalItems: number;
  isLoading: boolean = false;

  constructor(private http: HttpClient,private dialog: MatDialog,private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.getImages(this.currentPage, this.pageSize);
  }

getImages(pageNo: number, pageSize: number) {
  this.isLoading = true;
  const url = this.API_URL + `/${pageNo}/${pageSize}`;

  this.http.get(url).subscribe(
    (response: any) => {
      this.images = response.content.map((image: any) => {
        return {
          id: image.id,
          fullImage: image.fullImage,
          timeStamp: image.timestamp
        };
      });

      console.log(this.images);
      this.isLoading = false;
    },
    (error: any) => {
      if (error.status === 0) {
        this.showSnackBar('Server is offline', 'error');
      } else {
        this.showSnackBar('An error occurred', 'error');
      }
      this.isLoading = false;
    }
  );
}

showSnackBar(message: string, panelClass: string) {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    panelClass: panelClass
  });
}
  
  decodeBase64(base64String: string): string {
    return atob(base64String);
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getImages(this.currentPage, this.pageSize);
    }
  }

  nextPage() {
    this.currentPage++;
    this.getImages(this.currentPage, this.pageSize);
  }

  openDialog(image: any): void {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '400px',
      data: { image: image, textInput: '' } // Pass the image data along with the initial data
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onDelete(imageId: any): void {
    // Perform the action when delete button is clicked
    console.log(imageId);
    
    console.log('Delete Button Clicked');
  
    this.http.delete(`http://localhost:8080/helmet/${imageId}`)
      .subscribe(
        (res) => {
          // Display success feedback using Angular Material Snackbar
          this.showSnackBar('The image has been successfully deleted.', 'success');
  
        },
        (error) => {
          // Display error feedback using Angular Material Snackbar
          const errorMessage = 'An error occurred while deleting the image.';
  
          this.showSnackBar('An error occurred while deleting the image', 'error');
        }
      );
      this.getImages(this.currentPage, this.pageSize);
  }
  
}
