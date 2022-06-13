import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../user-page/services/userAuth.service';

@Component({
  selector: 'app-login-control',
  templateUrl: './login-control.component.html',
  styleUrls: ['./login-control.component.css']
})
export class LoginControlComponent implements OnInit {
  data = "";


  constructor(public authService: UserAuthService) { }

  ngOnInit(): void {
  }



  logon(){
    console.log("Going to Auth User")
    this.authService.authenticateUser()
    .subscribe((response: string) => {
      this.data = response;
    },
      (err: any) => console.log(err),
      () => {
        console.log('authenticateUser() retrieved userToken')
      });
  }

}
