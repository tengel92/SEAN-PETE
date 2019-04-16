import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';
import { OMProjectSearchService } from '../../om-project-search.service';
import { OMProjectSearch } from '../../om-project-search';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
  id: Number;
  omProject: any = {};
  updateForm: FormGroup;
  constructor(private omProjectSearchService: OMProjectSearchService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
      this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.omProjectSearchService.getOMProjectById(this.id).subscribe(res => {
        this.omProject = res;
        this.updateForm.get('number').setValue(this.omProject.number);
        this.updateForm.get('projectName').setValue(this.omProject.projectName);
        this.updateForm.get('projectDescription').setValue(this.omProject.projectDescription);
        this.updateForm.get('projectTypeDescription').setValue(this.omProject.projectTypeDescription);
        this.updateForm.get('statusDescription').setValue(this.omProject.statusDescription);
      });
    });
  }
  createForm() {
    this.updateForm = this.fb.group({
      number: ['', Validators.required ],
      projectName: '',
      projectDescription: '',
      projectTypeDescription: '',
      statusDescription: ''
    });
  }

  updateOMProject(id, number, projectName, projectDescription, statusDescription, projectTypeDescription) {
    this.omProjectSearchService.updateOMProject(this.id, number, projectName, projectDescription, statusDescription, projectTypeDescription)
      .subscribe(() => {
        this.snackBar.open('OM Project updated successfully', 'OK', {
          duration: 3000,
        });
      });
  }
}
