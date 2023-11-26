import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { UserService } from 'src/userservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User, PagedUserData } from '../interfaces/user.interface';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  dataSource = new MatTableDataSource<User>();
  @ViewChild('paginator') paginator: MatPaginator;

  pageSizes = [3, 5, 7];
  totalData: number = 7;
  isLoading = false;

  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'email',
    'avatar',
  ];
  UserData: User[];

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) { }

  getUserListTableData$(pageNumber: number, pageSize: number): Observable<PagedUserData> {
    return this.userService.getUserList(pageNumber, pageSize);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.getUserListTableData$(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((userTableData) => {
          if (userTableData == null) return [];
          this.totalData = userTableData.total;
          this.isLoading = false;
          return userTableData.data;
        })
      )
      .subscribe((userData) => {
        this.UserData = userData;
        this.dataSource = new MatTableDataSource(this.UserData);
        this.cdr.detectChanges();
      });
  }

}
