import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../service/clinic.service';
import { Router } from '@angular/router';
import { Clinic } from '../model/clinic';
import { Sort } from '@angular/material/sort';
import { Appointment } from '../model/Appointment';
import { DatePipe } from '@angular/common';
import { AppointmentType } from '../model/AppointmentType';

@Component({
  selector: 'app-clinics-list',
  templateUrl: './clinics-list.component.html',
  styleUrls: ['./clinics-list.component.css'],
  providers: [DatePipe]
})
export class ClinicsListComponent implements OnInit {

  clinic: Clinic = new Clinic();
  clinic1: Clinic = new Clinic();
  appointment: Appointment = new Appointment();
  clinics: Clinic[] = [];
  clinics1: Clinic[] = [];
  flagForSearch: boolean;
  flagForSearchTable: boolean;
  myDate = new Date().toJSON("yyyy/MM/dd HH:mm");
  now: string;
  kliknutaKlinika: string;
  usernameUlogovanog: string;
  appointmentTypes: AppointmentType[] = [];
  selektovanTip: string = "";

  constructor(private clinicService: ClinicService,
    private router: Router, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getClinics();
    this.getAppTypes();
    this.flagForSearch = false;
    this.flagForSearchTable = false;
    console.log(this.myDate.split("T")[0]);
    this.now = this.myDate.split("T")[0];
    this.appointment.date = this.myDate.split("T")[0];
    this.usernameUlogovanog = sessionStorage.getItem("authenticatedUser");
    console.log(this.usernameUlogovanog);
    this.appointment.type = "-1";
  }

  klinika(clinic: Clinic) {
    this.clinicService.clinic = clinic;
    this.clinicService.imeKlinike1 = clinic.name;
    this.clinicService.datumZakazivanja1 = this.appointment.date;
    this.clinicService.tipPregleda = this.appointment.type;
  }
  onSubmit() {
    if (this.appointment.date == "") {
      this.flagForSearch = true;
      this.flagForSearchTable = false;
    }
    else {
      this.flagForSearch = false;
      this.flagForSearchTable = true;
      this.getSearchClinics();
    }
  }

  ChangeValue(event: any) {
    this.appointment.type = event.target.value;
  }

  getAppTypes() {
    this.clinicService.getAppTypes().subscribe(
      data => {
        this.appointmentTypes = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getClinics() {
    this.clinicService.getClinics().subscribe(
      data => {
        this.clinics = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getSearchClinics() {
    console.log(this.appointment.type);
    this.clinicService.getSearchClinics(this.appointment.date, this.appointment.type).subscribe(
      data => {
        this.clinics1 = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  sortData(sort: Sort) {
    const data = this.clinics.slice();
    if (!sort.active || sort.direction === '') {
      this.clinics = data;
      return;
    }

    this.clinics = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'address': return compare(a.address, b.address, isAsc);
        case 'description': return compare(a.description, b.description, isAsc);
        case 'pricelist': return compare(a.pricelist, b.pricelist, isAsc);
        case 'profit': return compare(a.profit, b.profit, isAsc);
        case 'id': return compare(a.id, b.id, isAsc);
        default: return 0;
      }
    });
  }

  sortData1(sort: Sort) {
    const data = this.clinics1.slice();
    if (!sort.active || sort.direction === '') {
      this.clinics1 = data;
      return;
    }

    this.clinics1 = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'address': return compare(a.address, b.address, isAsc);
        case 'description': return compare(a.description, b.description, isAsc);
        case 'pricelist': return compare(a.pricelist, b.pricelist, isAsc);
        case 'profit': return compare(a.profit, b.profit, isAsc);
        case 'id': return compare(a.id, b.id, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
