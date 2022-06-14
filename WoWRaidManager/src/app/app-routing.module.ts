import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCallbackComponent } from './login-control/auth-callback/auth-callback.component';
import { RaidGeneratorComponent } from './raid-generator/raid-generator.component';
import { RosterComponent } from './roster/roster.component';

const routes: Routes = [
  {
    path: 'roster', component: RosterComponent
  },
  {
    path: 'raidGenerator', component: RaidGeneratorComponent
  },
  {
    path: 'callback', component: AuthCallbackComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static components = [RosterComponent, RaidGeneratorComponent, ];
}
