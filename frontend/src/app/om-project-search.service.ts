import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OMProjectSearchService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {
  }

  getOMProjects() {
    return this.http.get(`${this.uri}/om-project`);
  }
  getOMProjectById(id) {
    return this.http.get(`${this.uri}/om-project/${id}`);
  }

  createOMProject(number, projectName, projectDescription, projectTypeDescription, statusDescription,) {
    const omProject = {
      number: number,
      projectName: projectName,
      projectDescription: projectDescription,
      projectTypeDescription: projectTypeDescription,
      statusDescription: statusDescription
    };
    return this.http.post(`${this.uri}/om-project`, omProject);
  }

  updateOMProject(id, number, projectName, projectDescription, statusDescription, projectTypeDescription) {
    const omProject = {
      number: number,
      projectName: projectName,
      projectDescription: projectDescription,
      statusDescription: statusDescription,
      projectTypeDescription: projectTypeDescription
    };
    return this.http.put(`${this.uri}/om-project/${id}`, omProject);
  }

  deleteOMProject(id) {
    return this.http.delete(`${this.uri}//om-project/${id}`);
  }
}
