import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  password: string = '';
  email: string = '';
  uploadPercent: number = 0;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase
  ) {}
  uid: any;
  picture: string =
    'https://media.istockphoto.com/vectors/user-avatar-profile-icon-black-vector-illustration-vector-id1209654046?k=20&m=1209654046&s=170667a&w=0&h=BBXhuO36-UfqMS5aYkYvqjAuz3bO1GW-wiXGqRD1Sng=';
  ngOnInit(): void {}

  signUp(f: NgForm) {
    const { email, password, name, username, country, bio } = f.form.value;
    this.auth
      .signUp(email, password)
      .then((res) => {
        console.log(res);
        this.router.navigateByUrl('/signin');
        this.uid = res.user?.uid;

        this.db.object(`/users/${this.uid}`).set({
          id: this.uid,
          name: name,
          email: email,
          instausername: username,
          country: country,
          bio: bio,
          picture: this.picture,
        });
      })
      .then(() => {
        this.router.navigateByUrl('/');
        this.toastr.success('Sign Up success');
      })
      .catch((err) => {
        this.toastr.error('Sign Up Failed!!!');
      });
  }
  async uploadFile(event: any) {
    const file = event?.target.files[0];
    const filepath = file.name;
    const fileref = this.storage.ref(filepath);
    const task = this.storage.upload(filepath, file);

    task.percentageChanges().subscribe({
      next: (percent: any) => {
        this.uploadPercent = percent;
      },
    });
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileref.getDownloadURL().subscribe((url) => {
            this.picture = url;
            this.toastr.success('Image Uploaded successfully!!');
          });
        })
      )
      .subscribe();
  }
}
