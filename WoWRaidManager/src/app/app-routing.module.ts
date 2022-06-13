import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RaidGeneratorComponent } from './raid-generator/raid-generator.component';
import { RosterComponent } from './roster/roster.component';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = [
  {
    path: 'roster', component: RosterComponent
  },
  {
    path: 'raidGenerator', component: RaidGeneratorComponent
  },
  {
    path: 'user', component: UserPageComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static components = [RosterComponent, RaidGeneratorComponent, UserPageComponent];
}
