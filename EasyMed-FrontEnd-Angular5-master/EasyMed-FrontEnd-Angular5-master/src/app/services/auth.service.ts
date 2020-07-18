import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  constructor(private myHttp: HttpClient) { }
  // Sign Up Post Function To Backend
  

  login(loginInfo) {
    if(loginInfo.role==="Lab Assistant" || loginInfo.role==="Admin"){
      return this.myHttp.post("http://localhost:3000/labAssistant/login", loginInfo);
    }
    else if(loginInfo.role==="Patient"){
      return this.myHttp.post("http://localhost:3000/patient/login", loginInfo);
    }
  }

  checklogin() {
    return this.myHttp
      .get(
        `${environment.apiBase}/api/checklogin`,
        { withCredentials: true }
      )
      .toPromise()
      .then();
  }


  logout() {
    return this.myHttp
      .post(
        `${environment.apiBase}/api/logout`,
        {},
        { withCredentials: true }
      )
      .toPromise()
      .then();
  }


  getPatients(){
    return this.myHttp.get('http://localhost:3000/patient/list');
  }
  getSpecificPatient(email){
    console.log(email);
    return this.myHttp.post('http://localhost:3000/patient/detail',
    {email}
    )
  }
  signup(signupInfo) {
    
    return this.myHttp.post('http://localhost:3000/patient/signup',
      signupInfo
    ).subscribe(data => {
      console.log("Patient sign up successfull")
  })
  }
  editPatient(patientInfo){
    return this.myHttp.post('http://localhost:3000/patient/detail/edit',
      patientInfo
      ).subscribe(data => {
        alert("Record Edited Successfully")
    })
  }

  addLabAssistant(LabAssistantInfo){
    return this.myHttp.post('http://localhost:3000/admin/labAssistant/signup',
      LabAssistantInfo
    ).subscribe(data => {
      alert("Lab Assistant Added Successfully")
  })
  }
  getLabAssistants(){
    return this.myHttp.get('http://localhost:3000/admin/labAssistant/list');
  }
  getSpecificLabAssistant(email){
    console.log(email)
    return this.myHttp.post('http://localhost:3000/admin/labAssistant/detail',
    {email}
    )
  }
  editLabAssistant(LabAssistantInfo){
    return this.myHttp.post('http://localhost:3000/admin/labAssistant/update',
    LabAssistantInfo
      ).subscribe(data => {
        alert("Lab assistant record updated successfull")
    })
  }
  deleteLabAssistant(email){
    return this.myHttp.post('http://localhost:3000/admin/labAssistant/delete',
    {email}
      ).subscribe(data => {
        alert("Lab assistant record deleted successfully")
    })
  }


  addTest(TestInfo){
    return this.myHttp.post('http://localhost:3000/admin/test/add',
      TestInfo
    ).subscribe(data => {
      alert("Test Added Successfully")
  })
  }
  getTests(){
    return this.myHttp.get('http://localhost:3000/admin/test/list');
  }
  getSpecificTest(test_name){
    return this.myHttp.post('http://localhost:3000/admin/test/detail',
    {test_name}
    )
  }
  editTest(TestInfo){
    return this.myHttp.post('http://localhost:3000/admin/test/edit',
    TestInfo[0]
      ).subscribe(
        error=>{
          alert("Error")
      },
        data => {
        alert("Test Record Edited Successfull")
    })
  }
  deleteTest(test_name){
    return this.myHttp.post('http://localhost:3000/admin/test/delete',
    {test_name}
      ).subscribe(data => {
        alert("Test Deleted Successfull")
    })
  }
  performEndoscopy(filename){
    alert("Performing Endoscopy")
    return this.myHttp.post('http://localhost:3000/labAssistant/test/performEndoscopy',{email:filename})
  }

  getEndoscopyResult(email){
    return this.myHttp.post('http://localhost:3000/patient/test/getEndoscopyResult',{email:email})
  }

  bookAppointment(appointmentInfo) {
    return this.myHttp.post('http://localhost:3000/patient/appointment/bookAppointment',
    appointmentInfo
    ).subscribe(data => {
      alert("Appointment has been booked")
    })
  }
  getMyAppointments(email){
    return this.myHttp.post('http://localhost:3000/patient/appointment/viewAppointment', {email})
  }
  getAppointments(){
    return this.myHttp.get('http://localhost:3000/patient/appointment/viewAppointmentList');
  }
  editAppointment(appointmentInfo){
    console.log(appointmentInfo)
    return this.myHttp.post('http://localhost:3000/patient/appointment/editAppointment',
    appointmentInfo
      ).subscribe(data => {
        alert("Appointment Edited Successfully")
    })
  }
  deleteAppointment(appointmentInfo){
    console.log(appointmentInfo)
    return this.myHttp.post('http://localhost:3000/patient/appointment/deleteAppointment', appointmentInfo
      ).subscribe(data => {
        alert("Appointment Deleted Successfully")
    })
  }

  addPatientLog(patientLogDetail){
    return this.myHttp.post('http://localhost:3000/patient/addLog',
    patientLogDetail
    ).subscribe(data => {
      alert("Appointment confirmed")
    })
  }
  viewPatientLog(patientLogDetail){
    return this.myHttp.post('http://localhost:3000/patient/viewLog', {email:patientLogDetail} )
  }

  forgotPassword(loginInfo){
    if(loginInfo.email==="" || loginInfo.email==="Email"){
      alert("Enter Email")
    }
    else{
      if(loginInfo.role==="Admin"){

      }
      else if(loginInfo.role==="Lab Assistant"){
        this.getSpecificLabAssistant(loginInfo.email).subscribe(
          data => { 
            return this.myHttp.post('http://localhost:3000/labAssistant/forgotPassword',
            loginInfo
              ).subscribe(data => {
                alert("Password has been sent to your mail")
            })
          },
          err => console.error(err),
          () => console.log('Done Sending password ')
        );
      }
      else if(loginInfo.role==="Patient"){
        
        this.getSpecificPatient(loginInfo.email).subscribe(
          data => { 
            return this.myHttp.post('http://localhost:3000/patient/forgotPassword',
            loginInfo
              ).subscribe(data => {
                console.log("Password has been sent to your mail")
            })
          },
          err => console.error(err),
          () => console.log('Done sending password')
        );
      }
    }
  }

  changePassword(Info){
    
      if(Info.role==="Admin"){

      }
      else if(Info.role==="Lab Assistant"){
        return this.myHttp.post('http://localhost:3000/labAssistant/changePassword',
        Info
          ).subscribe(data => {
            alert("Password Changed Successfully")
        })
      }

      else if(Info.role==="Patient"){
        return this.myHttp.post('http://localhost:3000/patient/changePassword',
        Info
          ).subscribe(data => {
            alert("Password has been edited")
        })
      }
    }
  
}
