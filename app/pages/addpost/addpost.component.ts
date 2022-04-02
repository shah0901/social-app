import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { v4 as uuidv4, v4 } from 'uuid';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css'],
})
export class AddpostComponent implements OnInit {
  locationName!: string;
  description!: string;
  uploadPercent: number = 0;
  picture = null;
  user: any = null;

  constructor(
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    private auth: AuthService,
    private db: AngularFireDatabase,
    private router: Router
  ) {
    auth.getUser().subscribe({
      next: (user) => {
        this.db
          .object(`/users/${user?.uid}`)
          .valueChanges()
          .subscribe({
            next: (user: any) => {
              this.user = user;
            },
          });
      },
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    const uid = uuidv4();
    this.db
      .object(`/posts/${uid}`)
      .set({
        id: uid,
        picture: this.picture,
        description: this.description,
        location: this.locationName,
        by: this.user.name,
        date: Date.now(),
        like: false,
        instaId: this.user.instausername,
      })
      .then(() => {
        this.toastr.success('Post Uploaded successfully!!');
        this.router.navigateByUrl('/');
      })
      .catch(() => {
        this.toastr.error('Error in post!! Try again');
      });
  }

  async uploadFile(event: any) {
    const file = event?.target.files[0];
    const filepath = file.name;
    const fileref = this.storage.ref(filepath);
    const task = this.storage.upload(filepath, file);
    console.log('filepath:' + filepath);

    task.percentageChanges().subscribe({
      next: (percent: any) => {
        this.uploadPercent = percent;
      },
    });
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileref.getDownloadURL().subscribe({
            next: (url) => {
              this.picture = url;
              console.log(this.picture);

              this.toastr.success('Post image uploaded successfully');
            },
          });
        })
      )
      .subscribe();
  }
}
