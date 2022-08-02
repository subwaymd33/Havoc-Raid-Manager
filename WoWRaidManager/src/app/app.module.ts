import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMaterialModule } from './angular-material.module';
import { RosterComponent } from './roster/roster.component';
import { RosterCardComponent } from './roster/roster-card/roster-card.component';
import { FilterTextboxComponent } from './shared/filter-textbox/filter-textbox.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterService } from './services/filter.service';
import { TrackByService } from './services/trackby.service';
import { RosterGridComponent } from './roster/roster-grid/roster-grid.component';
import { SorterService } from './services/sorter.service';
import { ModalComponent } from './roster/modal/modal/modal.component';
import { RaidGeneratorComponent } from './raid-generator/raid-generator.component';
import {MatNativeDateModule} from '@angular/material/core';
import { OptimizedRaidDisplayComponent } from './raid-generator/optimized-raid-display/optimized-raid-display.component';
import { ProgressSpinnerComponent } from './raid-generator/progress-spinner/progress-spinner.component';
import { LoginControlComponent } from './login-control/login-control.component';
import { LogoutControlComponent } from './login-control/logout-control/logout-control.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UserRosterGridComponent } from './user-page/user_character_grid/user-roster-grid.component';
import { LootConfigComponent } from './loot-manager/loot-config/loot-config.component';
import { LootManagerComponent } from './loot-manager/loot-manager.component';
import { PhaseManagerComponent } from './loot-manager/phase-manager/phase-manager.component';
import { LootSheetComponent } from './loot-sheet/loot-sheet.component';
import { MasterLootSheetComponent } from './master-loot-sheet/master-loot-sheet.component';
import { RaidManagerComponent } from './raid-manager/raid-manager.component';
import { AddonImportModalComponent } from './raid-manager/modals/addon-import-modal/addon-import-modal.component';
import { AddAttendanceModalComponent } from './raid-manager/modals/add-attendance-modal/add-attendance-modal.component';
import { RaidManagerControllerComponent } from './raid-manager/raid-manager-controller/raid-manager-controller.component';
import { RaidWeekManagerComponent } from './raid-manager/raid-week-manager/raid-week-manager.component';
import { OfficerGuardService } from './shared/guards/officer-guard';
import { LogonGuardService } from './shared/guards/logon-guard';
import { SnackbarService } from './services/snackbar.service';



@NgModule({
  declarations: [
    AppComponent,
    RosterCardComponent,
    RosterComponent,
    FilterTextboxComponent,
    RosterGridComponent,
    ModalComponent,
    RaidGeneratorComponent,
    OptimizedRaidDisplayComponent,
    ProgressSpinnerComponent,
    LoginControlComponent,
    LogoutControlComponent,
    UserPageComponent,
    UserRosterGridComponent,
    LootConfigComponent,
    LootManagerComponent,
    PhaseManagerComponent,
    LootSheetComponent,
    MasterLootSheetComponent,
    RaidManagerComponent,
    AddonImportModalComponent,
    AddAttendanceModalComponent,
    RaidManagerControllerComponent,
    RaidWeekManagerComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    NgbModule,
    AngularMaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatNativeDateModule
   
  ],
  entryComponents: [],
  providers: [FilterService, TrackByService, SorterService, OfficerGuardService,LogonGuardService, SnackbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
