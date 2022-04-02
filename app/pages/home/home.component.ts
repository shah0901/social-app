import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  posts: any = [];
  users: any = [];
  loading = false;
  like = false;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private toastr: ToastrService
  ) {
    this.loading = true;
    db.object('/users')
      .valueChanges()
      .subscribe({
        next: (obj: any) => {
          if (obj) {
            this.users = Object.values(obj);
            this.loading = false;
          } else {
            this.users = [];
            this.loading = false;
            this.toastr.error('No Users found');
          }
        },
      });
    db.object('/posts')
      .valueChanges()
      .subscribe({
        next: (obj: any) => {
          if (obj) {
            this.posts = Object.values(obj);
            this.toastr.success('loading postfeed');
          } else {
            this.posts = [];
            this.toastr.error('No Posts found');
          }
        },
      });
  }

  ngOnInit(): void {}
}
