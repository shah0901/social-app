import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email=null;

  constructor(private auth:AuthService,private toastr:ToastrService,private router:Router) {
    auth.getUser().subscribe({
      next:(user:any)=>{
        console.log("User is: "+user);
        this.email = user?.email;
      },
      error:(err)=>{
         
      }
    })
   }

  ngOnInit(): void {
  }
  async signOut(){
    try{
      await this.auth.signOut();
      this.email=null;
      this.router.navigateByUrl('/signin');
      this.toastr.info("Logged Out Successfully!!!")
    }catch(err){
      this.toastr.error("Having Problem in Logging out!!")
    }
  }

}
