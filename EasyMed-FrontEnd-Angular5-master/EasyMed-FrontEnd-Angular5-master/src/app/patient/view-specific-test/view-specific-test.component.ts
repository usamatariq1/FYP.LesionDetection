import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-specific-test',
  templateUrl: './view-specific-test.component.html',
  styleUrls: ['./view-specific-test.component.css']
})
export class ViewSpecificTestComponent implements OnInit {

  tests;
  test_name;
  
  TestInfo:any= [{
    _id:'',
    test_name:'',
    test_description:'',
    bill:'',
    test_time:'',
    test_frequency:''
  }];

  public errorMessage;

  constructor(private myAuth: AuthService, private myRouter: Router) { }

  ngOnInit(): void {
    let token= localStorage.getItem('token')
    if(token){
      let tokenDetail=JSON.parse(token)
      if(!(tokenDetail.role==="Patient")){
        this.myRouter.navigate(['/login'])
      }
    }else{
      this.myRouter.navigate(['/login'])
    }

    this.getTests();
  }
  getTests(){
    this.myAuth.getTests().subscribe(
      data => { this.tests = data
      },
      err => console.error(err),
      () => console.log('done loading tests')
  );
  }
  getSpecificTest(){
    if(this.test_name===''){
      alert("Select test to view detail");
    }
    else{
      this.myAuth.getSpecificTest(this.test_name).subscribe(
      data => { this.TestInfo = data },
      err => console.error(err),
      () => console.log('done loading specific test record')
    );
    }
  }
}
