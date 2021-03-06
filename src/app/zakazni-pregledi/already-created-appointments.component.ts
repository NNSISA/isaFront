import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../service/appointment.service';
import { Appointment } from '../model/Appointment';
import { Observable, timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-already-created-appointments',
  templateUrl: './already-created-appointments.component.html',
  styleUrls: ['./already-created-appointments.component.css']
})
export class AlreadyCreatedAppointmentsComponent implements OnInit {

  appointments: Appointment[] = [];
  usernameUlogovanog: string;

  everySecond: Observable<number> = timer(0, 1000);
  private subscription: Subscription;

  constructor(private router: Router, private appService: AppointmentService) { }

  ngOnInit() {
    this.subscription = this.everySecond.subscribe((seconds) => {
      this.getAlreadyCreatedAppointments();
    })
  }

  getAlreadyCreatedAppointments() {
    this.appService.getAlreadyCreatedAppointments().subscribe(
      data => {
        this.appointments = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  scheduleApp(app: Appointment) {
    this.usernameUlogovanog = sessionStorage.getItem("authenticatedUser");
    app.patient = this.usernameUlogovanog;
    this.appService.scheduleApp(app).subscribe(
      data => {
        alert("Uspešno zakazan pregled.");
        this.router.navigateByUrl("/patient-home-page");
      }, error => {
        console.log(error);
        alert('Pregled je već neko zakazao');
        this.router.navigateByUrl("/patient-home-page");
      }
    );
  }
}
