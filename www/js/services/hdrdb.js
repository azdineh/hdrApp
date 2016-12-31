angular.module('hdrApp')
    .factory('hdrdb', function ($q, $cordovaSQLite,$ionicPlatform) {

        var db = {},
            absentStudents = [],
            sessions = [],
            absences = [];

        var initdb = {
            absentStudents: ['student 1', 'student 2', 'student 3'],
            sessions: ['8-9', '10-12']
        };

        var student=function(){
            var that={};
                that.id=null;
                that.registration_number='12345678';
                that.massar_number='M98765435';
                that.full_name="Vivi alvivaoui";
                that.date_birth=12354;
                that.getValuesOnlyArray=function(){
                    return [that.id,that.registration_number,that.massar_number,that.full_name,that.date_birth];
                }
            return taht;
        };

        var session=function(){
            var that={};
            that.id=null;
            that.title="8-10";
            that.getValuesOnlyArray=function(){
                return [that.id,that.title];
            };
            
            return that;
        };
    var absence = function(){
        var that={};
        that.id=null;
        that.id_student=null;
        that.id_session=null;
        that.unix_time= 1213;
        that.student_ordered_number= 0;
        that.getValuesOnlyArray=function(){
            return [that.id,that.id_student,that.id_session,that.unix_time,that.student_ordered_number];
        };

        return that;
    };

        /**
         * @description an asynchronoused function, create all tables if are not exist.
         */
        var createTables =function(){
            var query_create_hdrstudent="CREATE TABLE IF NOT EXISTS hdrstudent(id INTEGER PRIMARY KEY AUTOINCREMENT,"+
                                        "registration_number TEXT(255), massar_number TEXT(255), full_name TEXT(255),"+
                                        "date_birth INTEGER);"

            var query_create_hdrsession ="CREATE TABLE IF NOT EXISTS hdrsession(id INTEGER PRIMARY KEY AUTOINCREMENT,"+
                                        " title TEXT(255));"

            var query_create_hdrabsence ="CREATE TABLE IF NOT EXISTS hdrabsence(id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                                         "id_student INTEGER NOT NULL,id_session INTEGER NOT NULL, unix_time INTEGER NOT NULL,"+
                                         "student_ordered_number INTEGER,"+
                                         "foreign key (id_student) references hdrstudent(id),"+
                                         "foreign key (id_session) references hdrsession (id));";

            $cordovaSQLite.execute(db,query_create_hdrstudent+query_create_hdrsession+query_create_hdrabsence)
            .then(function(res){
                console.log("Tables are created successfully..");
            },function(err){
                console.log("Error while creating tables for hdrApp");
            });
        };

       /**
        * @description a asynchronoused function, add a student line in db.
        * @param student object
        */
        var addStudentLine = function(student){
            var query="insert into hdrstudent values (?,?,?,?,?)";
            $cordovaSQLite.execute(db,query,student.getValuesOnlyArray)
            .then(function(res){
                console.log("Add student line terminated successfully");
            },function(err){
                console.log("Error while Adding student line");
            });
        };

        /**
        * @description a asynchronoused function, add a session line in db.
        * @param session object
        */
        var addSessionLine = function(session){
            var query="insert into hdrsession values (?,?)";
            $cordovaSQLite.execute(db,query,session.getValuesOnlyArray)
            .then(function(res){
                console.log("Add session line terminated successfully");
            },function(err){
                console.log("Error while Adding session line");
            });
        };
        
        /**
        * @description a asynchronoused function, add a absence line in db.
        * @param absence object
        */
        var addAbsenceLine = function(absence){
            var query="insert into hdrabsence values (?,?,?,?,?)";
            $cordovaSQLite.execute(db,query,absence.getValuesOnlyArray)
            .then(function(res){
                console.log("Add absence line terminated successfully");
            },function(err){
                console.log("Error while Adding absence line");
            });
        };

        /**
         * @description a asynchronoused function checks if student is already exists in db.
         * @param {student} student json object
         * @returns boolean 
         */
        var ifStudentExists =function(student){
            var q=$q.defer();
            var query="SELECT * from hdrstudent where massar_number= ?";
            $cordovaSQLite.execute(db,query,[student.massar_number])
            .then(function(res){
                if(res.rows.length >0){
                    console.log("student "+student.name+" already exists");
                    q.resolve(true);
                }
                else{
                    console.log("student "+student.name+" dons t exist");
                    q.resolve(false);   
                }
            },function(err){
                console.log("Error while checking student existance "+err);
                q.reject("Error while checking student existanc "+err);
            });

            return q.promise;
        };

        var createStudents = function () {
            $cordovaSQLite.nestedExecute(db,
                'CREATE TABLE IF NOT EXISTS student (id integer primary key, name text)',
                'INSERT INTO student (name) VALUES (?),(?),(?)',
                [],
                initdb.absentStudents)
                .then(function(res){
                    $cordovaSQLite.execute(db, 'SELECT * FROM student')
                    .then(function(res){
                        for (var i = 0; i < res.rows.length; i++) {
                            absentStudents.push(res.rows.item(i));
                        console.log("Selected student # "+i+1+" "+absentStudents[i].name);
                        } 
                    },function(err){
                        console.log("Error while selecting students from db :"+err);
                    });
                },function(err){
                    console.log("Error while creating student table :"+err);
                });
        };

        var createSessions = function () {
            $cordovaSQLite.nestedExecute(db,
                'CREATE TABLE IF NOT EXISTS session (id integer primary key, title text)',
                'INSERT INTO session (title) VALUES (?),(?)',
                [],
                initdb.sessions)
                .then(function(res){
                    $cordovaSQLite.execute(db, 'SELECT * FROM session')
                    .then(function(res){
                        for (var i = 0; i < res.rows.length; i++) {
                            sessions.push(res.rows.item(i));
                            console.log("Selected student # "+i+1+" "+sessions[i].title)
                        } 
                    },function(err){
                        console.log("Error while selecting sessions from db "+err);
                    });
                },function(err){
                    console.log("Error while creating session table :"+err);
                });
        };


        $ionicPlatform.ready(function() {
            db = $cordovaSQLite.openDB("hdr.db", 1); 
            //createStudents();
            //createSessions();  
        });


        return {

            initTables: createTables
            
        };
    });