import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { OMProjectSearchService } from '../../om-project-search.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {
  
  createForm: FormGroup;
  
  constructor(private omProjectSearchService: OMProjectSearchService, private fb: FormBuilder, private router: Router) {
    this.createForm = this.fb.group({
      number: ['', Validators.required], 
      projectName: '',
      projectDescription: '',
      projectTypeDescription: '',
      statusDescription: ''
    });
  }
  
  createOMProject(number, projectName, projectDescription, projectTypeDescription, statusDescription) {
    this.omProjectSearchService.createOMProject(number, projectName, projectDescription, projectTypeDescription, statusDescription).subscribe(() => {
      this.router.navigate(['/list']);
    });
  }
  
  ngOnInit() {

  }
}