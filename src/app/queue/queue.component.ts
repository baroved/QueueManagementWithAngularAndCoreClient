import { Component, OnInit } from '@angular/core';
import { User } from 'src/User';
import { QueueService } from 'src/app/queue.service';
import { parse } from 'querystring';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {
  QueueNum = 1; //Count of QueueNum ,to know who's next
  Users: User[] = []; //array of Users for HTML binding
  QueueService: QueueService; //Prop of my service for connect to server
  localStorgeObj; //object to upload to localstorge
  //for show the current user in UI
  CurrentUser = {
    name: '',
    queueNum: null,
    currentTime: ''
  };
  
  constructor(queueService: QueueService) {
    this.QueueService = queueService;
  }
  //get object from localstorge and set my props if needed
  ngOnInit() {
    //get item from local storge
    const ObjFromLS = localStorage.getItem('ObjToLocalStorge');
    //convert to object
    const ObjParseFromLC = JSON.parse(ObjFromLS);
    //validation if object != null
    if (ObjParseFromLC != null) {
      if (ObjParseFromLC.Array.length !== 0) {// update array if needed
        this.Users = ObjParseFromLC.Array;
      }
      if (ObjParseFromLC.CurrentUser !== null) { //update current user if needed
        this.CurrentUser = ObjParseFromLC.CurrentUser;
      }
      this.QueueNum = ObjParseFromLC.QueueNum; //update queueNum if needed
    }
  }
  //function to push user to queue
  ToQueue(name: string) {
    if (name !== '') {
      const date = new Date();
      let getMintues = (date.getMinutes()).toString();
      //for check if mintues less than 10,in case of this ,i need to add 0 before
      if (Number(getMintues) < 10) {
        getMintues = '0' + getMintues;
      }
      const currentTime = (date.getHours() + ':' + getMintues).toString();
      //create new user for send to server
      const user = new User(name, this.QueueNum, currentTime);
      //send to server request Http Post
      const addUser = this.QueueService.AddUserToQueue(user);
      const subscribeUser = addUser.subscribe((res) => {
        
        this.Users = res; //update array for binding
        this.QueueNum++; // update next queueNum
        this.SetLocalStorge(); // upload to localstorge
      });
    }
  }

  //function for call next for update current user and update array
  CallNext() {
    //set current user if array is empty
    this.CurrentUser = {
      name: '',
      queueNum: null,
      currentTime: ''
    };

    // while array is not empty
    if (this.Users.length !== 0) {
      const date = new Date();
      let getMintues = (date.getMinutes()).toString();
      // for check if mintues less than 10,in case of this ,i need to add 0 before
      if (Number(getMintues) < 10) {
        getMintues = '0' + getMintues;
      }
      const Time = (date.getHours() + ':' + getMintues).toString();
      //send request to server for delete a first user in array
      const deleteUser = this.QueueService.DeletFirstUserInArray();
      //update a current user
      this.CurrentUser = {
        name: this.Users[0].name,
        queueNum: this.Users[0].queueNum,
        currentTime: Time
      };
      const subscribeUser = deleteUser.subscribe((res) => {
        //update array and upload to local storge
        this.Users = res;
        this.SetLocalStorge();
      });
    }
    else { //
      this.SetLocalStorge();
    }

  }

  SetLocalStorge() {
    //fill data to localstorgeobj for upload to local storge
    this.localStorgeObj = {
      QueueNum: this.QueueNum,
      Array: this.Users,
      CurrentUser: this.CurrentUser
    };
    //convert object to string
    const ObjToLS = JSON.stringify(this.localStorgeObj);
    localStorage.setItem('ObjToLocalStorge', ObjToLS);
  }
}

