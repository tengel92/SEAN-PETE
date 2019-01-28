import express from 'express'; // import express.js
import sql from 'mssql'; // import MS Sql Server client
import cors from 'cors'; // import Cross Origin Resoure Sharing (currently not using this)
import bodyParser from 'body-parser'; // import bodyParser this will be used to parse JSON on put and post requests

const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

// Start server and listen on http://localhost:4000/
const server = app.listen(4000, function () {
    var port = server.address().port;
    console.log(`Example app listening on port ${port}!`);
});

// MS SQL connection configuration parameters.
const config = {
    user: 'SA',
    password: 'Pariveda2',
    server: 'localhost',
    database: 'PETE'
};

// Initialize connection to MS SQL database
let request;
sql.connect(config,function(err){
    if(err) console.log(err);
    request = new sql.Request();
});

// Functions to get results
const getOMProjectStatus = function(results){
    request.query`select * from pete.dbo.omprojectstatus`
        .then(records => {
            results(records);
        }).catch(err => {
            results(err);
        });         
};

const getOMProjectTypes = function(results){
    //ProjectCategoryId=13 is the ProjectCategoryId
    request.query`select * from pete.dbo.projectcategoryprojecttype where ProjectCategoryId=13`
        .then(records => {
            results(records);
        }).catch(err => {
            results(err);
        });         
};

const getProjectTypes = function(results){
    request.query`select * from pete.dbo.projecttype`
        .then(records => {
            results(records);
        }).catch(err => {
            results(err);
        });         
};

const getWorkCenters = function(results){
    request.query`select * from pete.dbo.workcenter`
        .then(records => {
            results(records);
        }).catch(err => {
            results(err);
        });         
};

const getOMProjects = function(results){
    request.query`select * from pete.dbo.omproject`
        .then(records => {
            results(records);
        }).catch(err => {
            results(err);
        });         
};

// Function for error handling
const errorHandling = function(results, res, errorDescription){ 
    res.statusCode = 500;
    if(results.originalError){
        let errorDetail = results.originalError.info.name + '! ' + results.originalError.info.message;
        console.log(errorDetail);
        res.json({
            errorMessage: 'Could not retrieve all ' + errorDescription,
            errorMessageDetails: errorDetail
        });
    } else{
        res.json({
            errorMessage: 'Could not retrieve all ' + errorDescription,
        });
    }
};

// API routes
router.route('/om-project-status').get((req, res) => {
    getOMProjectStatus(function(results) {
        if(results.recordset){
            let omProjectStatuses = results.recordset;
            res.json(omProjectStatuses);
        } else{
            let errorDescription = 'O&M project statuses.';
            errorHandling(results, res, errorDescription);
        }
    });
});

router.route('/om-project-type').get((req, res) => {
    getOMProjectTypes(function(results) {
        if(results.recordset){
            let omProjectTypes = results.recordset;
            res.json(omProjectTypes);
        } else{
            let errorDescription = 'O&M project types.';
            errorHandling(results, res, errorDescription);
        }
    });
});

router.route('/project-type').get((req, res) => {
    getProjectTypes(function(results) {
        if(results.recordset){
            let projectTypes = results.recordset;
            res.json(projectTypes);
        } else{
            let errorDescription = 'project types.';
            errorHandling(results, res, errorDescription);
        }
    });
});

router.route('/work-center').get((req, res) => {
    getWorkCenters(function(results) {
        if(results.recordset){
            let workCenters = results.recordset;
            res.json(workCenters);
        } else{
            let errorDescription = 'work centers.';
            errorHandling(results, res, errorDescription);
        }
    });
});

router.route('/om-project').get((req, res) => {
    let omProjectStatuses;
    let omProjectTypes;
    let projectTypes;
    let workCenters;
    let error = [];
    
    getOMProjectStatus(function(results) {
        if(results.recordset){
            omProjectStatuses = results.recordset;
        } else{
            error.push('O&M project statuses');
        }
    });

    getOMProjectTypes(function(results) {
        if(results.recordset){
            omProjectTypes = results.recordset;
        } else{
            error.push('O&M project types');
        }
    });

    getProjectTypes(function(results) {
        if(results.recordset){
            projectTypes = results.recordset;
        } else{
            error.push('project types');
        }
    });

    getWorkCenters(function(results) {
        if(results.recordset){
            workCenters = results.recordset;
        } else{
            error.push('work centers');
        }
    });

    getOMProjects(function(results) {
        let omProjects = results.recordsets;
        if(omProjects){
            var displayedResult = [];
            omProjects.forEach(function(result){
                result.forEach(function(record){
                    // Match Work Center
                    let workCenterName;
                    workCenters.forEach(function(workCenter){
                        if(workCenter.WorkCenterId === record.WorkCenterId){
                            workCenterName = workCenter.WorkCenterName;
                        } 
                    });
                    // if none of the workCenterIds match against the workCenterId on the inidividual record
                    // then se the workCenterName to null to populate on the API JSON response
                    if(!workCenterName){
                        workCenterName = null;
                    }
                    
                    // Match statusIds to statusDescriptions
                    let statusDescription
                    omProjectStatuses.forEach(function(omProjectStatus){
                        if(omProjectStatus.Id === record.StatusId){
                            statusDescription = omProjectStatus.Description;
                        } 
                    });
                    if(!statusDescription){
                        statusDescription = null;
                    }

                    // Project Types
                    //ideally should be using omProjectTypes for additional validation
                    let projectTypeDescription;
                    projectTypes.forEach(function(projectType){
                        if(projectType.ProjectTypeId === record.ProjectTypeId){
                            projectTypeDescription = projectType.Description;
                        }
                    });
                    if(!projectTypeDescription){
                        projectTypeDescription = null;
                    }

                    displayedResult.push({
                        id: record.Id,
                        number: record.Number,
                        projectName: record.ProjectName,
                        projectDescription: record.ProjectDescription,
                        statusId: record.StatusId,
                        statusDescription: statusDescription,
                        projectTypeId: record.ProjectTypeId,
                        projectTypeDescription: projectTypeDescription,
                        workCenterId: record.WorkCenterId,
                        workCenterName: workCenterName,
                        districtId: record.DistrictId,
                        regionId: record.RegionId,
                        fiscalYear: record.FiscalYear,
                    });
                });  
            });
            res.json(displayedResult);
        } else{
            error.push('O&M projects');
        }
        if(error.length){
            console.log(error.length, error);
            errorHandling(results, res, error);
        }
    });
});
    


/********* Server operations *******************/
// app.get('/work-center', function(req,res) {
//     getWorkCenters(function(workCenters, error) {
//         if(error){
//             console.log(error);
//             res.statusCode = 500;
//             res.json({ errors: ['Could not retrieve all work centers']});
//         } else {
//             res.end(JSON.stringify(workCenters.recordset)); // Result in JSON format    
//         }
//     });
// });


// var getWorkCenters = app.get('/work-center', function (req, res) {
//     sql.connect(config, function() { 
//         var request = new sql.Request();
//         request.query('select * from pete.dbo.workcenter', function(err, results) {
//             if(err){
//                 console.log(err);
//                 res.statusCode = 500;
//                 res.json({ errors: ['Could not retrieve all work centers']});
//             } else {
//                 var workCenters = results.recordset;
//                 res.end(JSON.stringify(workCenters)); // Result in JSON format
//             }
//             sql.close();
//         });
//     });
// });



// app.get('/work-center', function (req, res) {
//     sql.query(config, `SELECT * FROM pete.dbo.workcenter`)
//         .then(rows => {
//             res = rows;
//         }).then( rows => 
//             database.close()
//         );
// });


// app.get('/work-center', function (req, res) {
//     sql.connect(config, function() { 
//         var request = new sql.Request();
//         request.query('select * from pete.dbo.workcenter', function(err, results) {
//             if(err){
//                 console.log(err);
//                 res.statusCode = 500;
//                 res.json({ errors: ['Could not retrieve all work centers']});
//             } else {
//                 var workCenters = results.recordset;
//                 res.end(JSON.stringify(workCenters)); // Result in JSON format
//             }
//             sql.close();
//         });
//     });
// });

// app.get('/om-project', function (req, res) {
//     getWorkCenters(workCenters);
//     console.log(workCenters);
//     sql.connect(config, function() { 
//         var request = new sql.Request();
//         request.query('select * from pete.dbo.omproject', function(err, results) {
//             if(err){
//                 console.log(err);
//                 res.statusCode = 500;
//                 res.json({ errors: ['Could not retrieve all O&M projects']});
//             } else {
//                 var displayedResult = [];
//                 results.recordsets.forEach(function(result){
//                     result.forEach(function(record){
//                         //Statuses
//                         var statusDescription;
//                         if(record.StatusId === 1) {
//                             statusDescription = 'Active';
//                         } else if (record.StatusId === 2) {
//                             statusDescription = 'Closed';  
//                         } else if (record.StatusId === 3) {
//                             statusDescription = 'Cancelled';
//                         } else {
//                             statusDescription = '';
//                         }

//                         //Project Types
//                         var projectTypeDescription;
//                         if(record.ProjectTypeId === 1) {
//                             projectTypeDescription = 'Line';
//                         } else if (record.ProjectTypeId === 2) {
//                             projectTypeDescription = 'Station';  
//                         } else if (record.ProjectTypeId === 3) {
//                             projectTypeDescription = 'ROW';
//                         } else if (record.ProjectTypeId === 4) {
//                             projectTypeDescription = 'N/A';
//                         } else {
//                             projectTypeDescription = '';
//                         }

//                         // var workCenterName;
//                         // if(record.WorkCenterId === workCenters.WorkCenterId){
//                         //     workCenterName = workCenters.workCenterName;
//                         // }

//                         displayedResult.push({
//                             id: record.Id,
//                             number: record.Number,
//                             projectName: record.ProjectName,
//                             projectDescription: record.ProjectDescription,
//                             statusId: record.StatusId,
//                             statusDescription: statusDescription,
//                             projectTypeId: record.ProjectTypeId,
//                             projectTypeDescription: projectTypeDescription,
//                             workCenterId: record.WorkCenterId,
//                             districtId: record.DistrictId,
//                             regionId: record.RegionId,
//                             fiscalYear: record.FiscalYear,
//                             // workCenterName: workCenterName,
                            
//                             // statusDescription: record.StatusDescription,
//                             // projectTypeDescription: record.ProjectTypeDescription,
//                             // workCenterName: record.WorkCenterName,
//                             // districtName: record.DistrictName,
//                             // regionName: record.RegionName,
//                             // fiscalYear: record.FiscalYear,
//                             // omProjectTagNames: record.OMProjectTagNames,
//                             // omProjectFollowerDisplayNames: record.OMProjectFollowerDisplayNames
//                         });
//                     });  
//                 });
//                 res.end(JSON.stringify(displayedResult)); // Result in JSON format
//             }
//             sql.close();
//         });
//     });
// });



// app.get('/project-status/:projectStatusId', function (req, res) {
//     sql.connect(config, function() {
//         var request = new sql.Request();
//         var stringRequest = 'select * from pete.dbo.omprojectsearchview where projectStatusId = ' + req.params.projectStatusId;
//         request.query(stringRequest, function(err, result) {
//             if (err) {
//                 console.error(err);
//                 res.statusCode = 500;
//                 res.json({ errors: ['Could not retrieve the project status id: ' + req.params.projectStatusId]});
//             } else {
//                 res.end(JSON.stringify(result.recordset)); // Result in JSON format
//             }
//             sql.close();
//         });
//     });
// });


// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';

// import Issue from './models/Issue';

// const app = express();
// const router = express.Router();
// app.use(cors());
// app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/issues');
// const connection = mongoose.connection;

// connection.once('open', () => {
//     console.log('MongoDB database connection established successfully!');
// });

// // get all issues
// router.route('/issues').get((req, res) => {
//     Issue.find((err, issues) => {
//         if (err)
//             console.log(err);
//         else
//             res.json(issues);
//     });
// });

// router.route('/issues').post(function(req, res) {

//     let issue = new Issue(req.body);      // create a new instance of the Bear model
//     // bear.name = req.body.name;  // set the bears name (comes from the request)

//     // save the bear and check for errors
//     issue.save()
//         .then(issue => {
//         res.status(200).json({'issue': 'Added successfully'});
//     })
//     .catch(err => {
//         res.status(400).send('Failed to create new record');
//     });
// });

// // get issue by id
// router.route('/issues/:id').get((req, res) => {
//     Issue.findById(req.params.id, (err, issue) => {
//         if (err)
//             console.log(err);
//         else
//             res.json(issue);
//     });
// });

// // update existing issue by id
// router.route('/issues/:id').put((req, res) => {
//     Issue.findById(req.params.id, (err, issue) => {
//         if (!issue)
//             return next(new Error('Could not load Document'));
//         else {
//             issue.title = req.body.title;
//             issue.responsible = req.body.responsible;
//             issue.description = req.body.description;
//             issue.severity = req.body.severity;
//             issue.status = req.body.status;
//             issue.save().then(issue => {
//                 res.json('Update done');
//             }).catch(err => {
//                 res.status(400).send('Update failed');
//             });
//         }
//     });
// });

// //delete issue by id
// router.route('/issues/:id').delete((req, res) => {
//     Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
//         if (err)
//             res.json(err);
//         else
//             res.json('Removed successfully');
//     });
// });

// app.use('/', router);

// app.listen(4000, () => console.log(`Express server running on port 4000`));