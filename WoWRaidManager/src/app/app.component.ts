import { Component } from '@angular/core';
import { RosterService } from './service/roster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'WoWRaidManager';



  hideLogoff(){
    if (sessionStorage.getItem("isLogon")=="false"||sessionStorage.getItem("isLogon")==null){
      return true
    }else{
      return false
    }
  }
  hideLogon(){
    if (sessionStorage.getItem("isLogon")=="true"){
      return true
    }else{
      return false
    }
  }

}
