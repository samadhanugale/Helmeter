import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent {

  API_URI = "http://localhost:8080";
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private snackBar: MatSnackBar
  ) { }

  onDelete(imageId: any): void {
    // Perform the action when delete button is clicked
    console.log('Delete Button Clicked');

    this.http.delete(this.API_URI + `/helmet/${imageId}`)
      .subscribe(
        (res) => {
          // Display success feedback using Angular Material Snackbar
          this.showSnackBar('Image Deleted', 'The image has been successfully deleted.', 'success');

          this.dialogRef.close();
        },
        (error) => {
          // Display error feedback using Angular Material Snackbar
          const errorMessage = 'An error occurred while deleting the image.';

          this.showSnackBar('Delete Error', errorMessage, 'error');
        }
      );
  }

  showSnackBar(title: string, message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: panelClass
    });
  }
  isFieldEmpty(): boolean {
    return this.data.textInput.trim() === '';
  }
  isFieldInvalid(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !emailRegex.test(this.data.textInput);
  }

  sendEmail(imageId: String) {
console.log("delete called : "+imageId);

    if (!this.isFieldEmpty()) {
      // Perform the action when send button is clicked and the field is not empty
      console.log('Send Button Clicked : ' + this.data.textInput);

      const url = this.API_URI + '/emailer/send';
      const requestBody = {
        email: this.data.textInput,
        number: 'MH15DA8768',
        image: imageId
      };

      this.http.post(url, requestBody).subscribe(
        (response: any) => {
          // Show success snackbar
          this.showSnackBar('Success', 'Email sent successfully', 'success');
          this.dialogRef.close();
        },
        (error: any) => {
          // Show error snackbar
          this.showSnackBar('Error', 'Failed to send email', 'error');
          this.dialogRef.close();
        }
      );
    }
  }
}
