import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnChanges {
  @Input()
  post: any;
  likecounts: number = 0;
  user: any;
  users=[];
  like: boolean = false;

  constructor(private db: AngularFireDatabase, private auth: AuthService) {
    this.auth.getUser().subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }
  ngOnChanges(): void {
    // if (this.post.votes) {
    //   Object.values(this.post.votes).map((val: any) => {
    //     if (val === this.user?.uid && val.likecount) {
    //       this.like = true;
    //     } else if (val === this.user?.uid && val.dislikecount) {
    //       this.like = false;
    //     }
    //   });
    // }
    if (this.post.votes) {
      Object.values(this.post.votes).map((val: any) => {
        if (val.likecount) this.likecounts += 1;
      });
    }
  }

  ngOnInit(): void {
    // Object.values(this.post).map((val))
    console.log(this.post);
    if (this.post.votes) {
      Object.values(this.post).map((val: any) => {
        
        console.log('val.value: ' + val.likecount);
      });
    }
  }
  onLike() {
    this.db.object(`/posts/${this.post.id}/votes/${this.user.uid}`).set({
      likecount: 1,
    });
    this.like = !this.like;
  }
  ondislike() {
    this.db.object(`/posts/${this.post.id}/votes/${this.user.uid}`).set({
      dislikecount: 1,
    });
    this.like = !this.like;
  }
}
