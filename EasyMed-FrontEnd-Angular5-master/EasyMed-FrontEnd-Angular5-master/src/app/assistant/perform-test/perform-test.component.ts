import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perform-test',
  templateUrl: './perform-test.component.html',
  styleUrls: ['./perform-test.component.css']
})
export class PerformTestComponent implements OnInit {
  
  public email;
  tokenDetail;
  public errorMessage;

  constructor(private myAuth: AuthService, private myRouter: Router) { }

  ngOnInit(): void {
    let token= localStorage.getItem('token')
    if(token){
      this.tokenDetail=JSON.parse(token)
      if(!(this.tokenDetail.role==="Lab Assistant")){
        this.myRouter.navigate(['/login'])
      }
    }
    else{
      this.myRouter.navigate(['/login'])
    }
  }

  performEndoscopy(){
    if(this.email==""||this.email=="Email"){
      alert("Enter Email");
      this.ngOnInit();
    }
    this.myAuth.performEndoscopy(this.email).subscribe(
      data => {
        alert("Endoscopy Result Sent To"+this.email)
      },
      err => console.error(err),
      () => console.log("Result will be shared with "+this.email+" after completion")
    );
  }

}
