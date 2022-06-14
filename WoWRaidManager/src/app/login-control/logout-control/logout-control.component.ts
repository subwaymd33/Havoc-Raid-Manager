import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout-control',
  templateUrl: './logout-control.component.html',
  styleUrls: ['./logout-control.component.css']
})
export class LogoutControlComponent implements OnInit {

  username = ""
  constructor() { }

  ngOnInit(): void {
    this.username = localStorage.getItem("username")!
  }

  logoff(){
    sessionStorage.setItem("isLogon","false")
  }
}
