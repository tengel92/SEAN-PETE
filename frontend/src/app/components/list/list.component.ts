import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { OMProjectSearchService } from '../../om-project-search.service';
import { OMProjectSearch } from '../../om-project-search';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {

  omProjects: OMProjectSearch[];

  displayedColumns = ['id', 'number', 'projectName', 'projectDescription', 'statusDescription', 'projectTypeDescription', 'actions'];

  dataSource: MatTableDataSource<OMProjectSearch>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private omProjectSearchService: OMProjectSearchService, private router: Router) {
    // this.dataSource = new MatTableDataSource(this.omProjects);
   }

  ngOnInit() {
    this.getOMProjects();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getOMProjects() {
    this.omProjectSearchService
    .getOMProjects()
    .subscribe((data: OMProjectSearch[]) => {
      this.omProjects = data;
      console.log('Data requested ... ');
      console.log(this.omProjects);
      this.dataSource = new MatTableDataSource(this.omProjects);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  editOMProject(id) {
    this.router.navigate([`/edit/${id}`]);
  }

  deleteOMProject(id) {
    this.omProjectSearchService.deleteOMProject(id).subscribe(() => {
      this.getOMProjects();
    });
  }
}
