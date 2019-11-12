import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn : 'root'
})
export class LoginService{
  constructor(private httpClient:HttpClient){}
 
  SignUp(obj:any){
    return this.httpClient.post("http://localhost:5000/register",obj)
  }

  Login(obj:any){
    return this.httpClient.post("http://localhost:5000/login",obj)
  }
}
