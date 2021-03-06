import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppointmentType } from '../model/AppointmentType';
import { AppTypeService } from '../service/appType.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-appointment-types',
  templateUrl: './appointment-types.component.html',
  styleUrls: ['./appointment-types.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppointmentTypesComponent implements OnInit {
  searchText;
  types: AppointmentType[] = [];
  newType: AppointmentType = new AppointmentType();
  changeType: AppointmentType = new AppointmentType();
  isButtonVisible = false;
  dataSource = new MatTableDataSource(this.types);
  columnsToDisplay = ['name'];

  constructor(private service: AppTypeService) { }

  ngOnInit(): void {
    this.getTypes();
  }

  getTypes() {
    this.service.getAllTypes().subscribe(
      data => {
        this.types = data;
        this.dataSource = new MatTableDataSource(this.types);
      }, error => {
        console.log(error);
      }
    )
  }

  addType() {

    this.service.addType(this.newType).subscribe(
      data => {
        alert("Dodat tip!");
        location.reload();
      }, error => {
        console.log(error);
      }
    );
  }

  modifyType(type: AppointmentType) {
    console.log(type.name);
    console.log(this.changeType.name)
    this.service.modifyType(this.changeType, type.name).subscribe(
      data => {
        location.reload();
      }, error => {
        console.log(error);
      }
    )
  }

  deleteType(type: AppointmentType) {
    this.service.deleteType(type).subscribe(
      data => {
        location.reload();
      }, error => {
        console.log(error);
      }
    )
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  change() {
    if (this.isButtonVisible == false)
      this.isButtonVisible = true;
    else this.isButtonVisible = false;
  }
}
