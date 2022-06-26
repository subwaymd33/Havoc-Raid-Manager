import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserAuthService } from './login-control/services/userAuth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  isAdmin:boolean;
  isLogon:boolean;
  title = 'WoWRaidManager';

  constructor(private userAuthService:UserAuthService){
    this.userAuthService.adminSubject.subscribe(data=>{

      this.isAdmin=data
    })
    this.userAuthService.logonSubject.subscribe(data=>{
      this.isLogon=data
    })
  }



  ///tommorow fix this to call the logon calls 
  // hideLogoff(){
  //   if (sessionStorage.getItem("isLogon")=="false"||sessionStorage.getItem("isLogon")==null){
  //     return true
  //   }else{
  //     return false
  //   }
  // }
  // hideLogon(){
  //   if (sessionStorage.getItem("isLogon")=="true"){
  //     return true
  //   }else{
  //     return false
  //   }
  // }

  

}
