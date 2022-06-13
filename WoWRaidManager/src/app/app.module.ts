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
import { FilterService } from './service/filter.service';
import { TrackByService } from './service/trackby.service';
import { RosterGridComponent } from './roster/roster-grid/roster-grid.component';
import { SorterService } from './service/sorter.service';
import { ModalComponent } from './roster/modal/modal/modal.component';
import { RaidGeneratorComponent } from './raid-generator/raid-generator.component';
import {MatNativeDateModule} from '@angular/material/core';
import { OptimizedRaidDisplayComponent } from './raid-generator/optimized-raid-display/optimized-raid-display.component';
import { ProgressSpinnerComponent } from './raid-generator/progress-spinner/progress-spinner.component';
import { LoginControlComponent } from './login-control/login-control.component';



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
    LoginControlComponent
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
    MatNativeDateModule,
   
  ],
  entryComponents: [],
  providers: [FilterService, TrackByService, SorterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
