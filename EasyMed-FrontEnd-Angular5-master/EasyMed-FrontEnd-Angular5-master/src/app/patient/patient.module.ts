import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { SignupComponent } from './sign-up/sign-up.component';
import { ViewSpecificPatientComponent } from './view-specific-patient/view-specific-patient.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { FormsModule } from '@angular/forms';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';
import { ViewSpecificAppointmentComponent } from './view-specific-appointment/view-specific-appointment.component';
import { ViewTestsComponent } from './view-tests/view-tests.component';
import { ViewSpecificTestComponent } from './view-specific-test/view-specific-test.component';

import { IgxTimePickerModule } from "igniteui-angular";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { BasicComponent } from './basic/basic.component';
import { PatientLogComponent } from './patient-log/patient-log.component';
import { ViewEndoscopyResultComponent } from './view-endoscopy-result/view-endoscopy-result.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SignupComponent, ViewSpecificPatientComponent, EditPatientComponent, PatientHomeComponent, BookAppointmentComponent, EditAppointmentComponent, ViewSpecificAppointmentComponent, ViewTestsComponent, ViewSpecificTestComponent, ChangePasswordComponent, BasicComponent, PatientLogComponent, ViewEndoscopyResultComponent],
  imports: [
    CommonModule,
    PatientRoutingModule,
    FormsModule,
    IgxTimePickerModule,
    NgbCarouselModule
  ]
})
export class PatientModule { }
