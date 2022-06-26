import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loot-manager',
  templateUrl: './loot-manager.component.html',
  styleUrls: ['./loot-manager.component.css']
})
export class LootManagerComponent implements OnInit {
  constructor(private route:ActivatedRoute) { }


  ngOnInit(): void {

  }

}
