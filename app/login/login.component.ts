import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email : any;
  password : any;
  result: any;

  constructor(private loginSer:LoginService , private router : Router,private toastr: ToastrService) { }

  ngOnInit() {
  }
  LogIn(){
    let obj : any={
      email:this.email,
      password:this.password
    }
    this.loginSer.Login(obj).subscribe(data=>{
      console.log(data['code'] , "data");
      if(data['code'] == '200'){
        this.toastr.success('successfully logedIn');
        this.router.navigate(['/','signup']);
      }else{
        this.toastr.error("Invalid Login details");
      }
    })
  }
}
