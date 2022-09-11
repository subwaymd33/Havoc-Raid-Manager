import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCallbackComponent } from './login-control/auth-callback/auth-callback.component';
import { LootConfigComponent } from './loot-manager/loot-config/loot-config.component';
import { LootManagerComponent } from './loot-manager/loot-manager.component';
import { LootSheetApprovalComponent } from './loot-sheet-approval/loot-sheet-approval.component';
import { MasterLootSheetComponent } from './master-loot-sheet/master-loot-sheet.component';
import { RaidGeneratorComponent } from './raid-generator/raid-generator.component';
import { RaidManagerControllerComponent } from './raid-manager/raid-manager-controller/raid-manager-controller.component';
import { RosterComponent } from './roster/roster.component';
import { LogonGuardService } from './shared/guards/logon-guard';
import { OfficerGuardService } from './shared/guards/officer-guard';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = [
  {
    path: 'roster', component: RosterComponent
  },
  {
    path: 'raidGenerator', component: RaidGeneratorComponent,canActivate: [OfficerGuardService]
  },
  {
    path: 'callback', component: AuthCallbackComponent
  },
  {
    path: 'userPage', component: UserPageComponent,canActivate: [LogonGuardService]
  },
  {
    path: 'lootManager', component: LootManagerComponent,canActivate: [OfficerGuardService]
  },
  {
    path: 'masterLootSheet', component: MasterLootSheetComponent,
  },
  {
    path: 'raidManager', component:RaidManagerControllerComponent,canActivate: [OfficerGuardService]
  },
  {
    path: 'sheetApproval', component:LootSheetApprovalComponent,canActivate: [OfficerGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static components = [RosterComponent, RaidGeneratorComponent,UserPageComponent,LootConfigComponent, LootManagerComponent, MasterLootSheetComponent ];
}
