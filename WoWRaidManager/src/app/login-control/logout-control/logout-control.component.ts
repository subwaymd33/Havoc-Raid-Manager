import { Component, OnInit } from '@angular/core';
import { faUserCircle} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/userAuth.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-logout-control',
  templateUrl: './logout-control.component.html',
  styleUrls: ['./logout-control.component.css']
})
export class LogoutControlComponent implements OnInit {
  userGylph = faUserCircle;
  username = ""
  constructor(private route:Router, private userAuthService:UserAuthService,private cookieService: CookieService) { }

  ngOnInit(): void {
    this.username = this.cookieService.get("username")!
  }

  logoff(){
    this.cookieService.set("isLogon","false")
    this.userAuthService.SetAdmin(false)
    this.userAuthService.SetLogon(false)
    if (this.route.url !="/roster" && this.route.url != "/masterLootSheet"){
      this.route.navigate(['/roster'])
    }
    
  }

  displayUserPage(){
    this.route.navigate(['/userPage'])
  }
}
