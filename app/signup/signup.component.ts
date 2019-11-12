import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  first_name : any;
  last_name : any;
  email : any;
  password : any;
  obj:any={}

  constructor(private loginSer : LoginService,private toastr: ToastrService,private router : Router) { }

  ngOnInit() {
  }
  
  signUp(){
    this.obj={
      first_name:this.first_name,
      last_name:this.last_name,
      email:this.email,
      password : this.password
    }
    this.loginSer.SignUp(this.obj).subscribe(data=>{
      this.toastr.success('successfully registerd');
      this.router.navigate(['/','login']);
      console.log('data' , data);
    })
    this.first_name = '',
    this.last_name = '',
    this.email = '',
    this.password = ''
  }
}
