import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-endoscopy-result',
  templateUrl: './view-endoscopy-result.component.html',
  styleUrls: ['./view-endoscopy-result.component.css'],
})
export class ViewEndoscopyResultComponent implements OnInit {

  email = '';
  images=[];
  testResult:any;

  constructor(private myAuth: AuthService, private myRouter: Router) { }

  ngOnInit(): void {
    let tokenDetail;
    let token = localStorage.getItem('token')
    if (token) {
      tokenDetail = JSON.parse(token)
      if (!(tokenDetail.role === "Patient")) {
        this.myRouter.navigate(['/login'])
      }
      this.email = tokenDetail.username;
    }
    else {
      this.myRouter.navigate(['/login'])
    }

    this.myAuth.getEndoscopyResult(this.email).subscribe(
      data=>{ 
        this.images=data["images"];
        this.testResult=data["result"];
        this.testResult=this.testResult[0]["lesionPercentage"]
    },
      error=>{},
      ()=>{}
    )
    
  }


}
