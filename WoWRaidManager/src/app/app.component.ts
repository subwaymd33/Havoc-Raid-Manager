import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './services/config.service';
import { LootService } from './services/loot.service';
import { raidService } from './services/raid.service';
import { UserAuthService } from './services/userAuth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CookieService]
})


export class AppComponent {
  isAdmin: boolean;
  isLogon: boolean;
  title = 'WoWRaidManager';

  constructor(private userAuthService: UserAuthService, private lootService: LootService, private configService: ConfigService, private raidService: raidService, private cookieService: CookieService) {
    
    
    this.userAuthService.logonSubject.subscribe(data => {
      this.isLogon = data
    });

    this.userAuthService.adminSubject.subscribe(data => {
      this.isAdmin = data
    });


    this.lootService.getItemsFromDB().subscribe()
    this.lootService.getSpecDataFromDB().subscribe()
    this.configService.getConfigsFromDB().subscribe()
    this.raidService.getRaidWeeksFromDB().subscribe()
    this.lootService.getMasterLootsheetFromDB().subscribe()
  }
  ngOnDestroy() {
    this.userAuthService.adminSubject.unsubscribe();
    this.userAuthService.logonSubject.unsubscribe();

  }

}
