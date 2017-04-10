angular.module('hdrApp')
    .factory('hdrdb', function ($q, $cordovaSQLite, $ionicPlatform) {

        var db = {};

        var tablescreatedflag = false;

        $ionicPlatform.ready(function () {
            db = $cordovaSQLite.openDB("hdr1.db", 1);
        });

        var initDB = function () {
            dropTables();
            createTables();
        };

        var student = function () {
            var that = {};
            that.id = null;
            that.registration_number = '12345678';
            that.massar_number = 'M98765435';
            that.full_name = "Vivi alvivaoui";
            that.date_birth = 12354;
            /**
             * fill student data with xml student data
             */
            that.fromXmlStudent = function (xmlStudent) {
                that.registration_number = xmlStudent.ra9mTasjiil;
                that.massar_number = xmlStudent.ra9mMasar;
                that.full_name = xmlStudent.issmKamel;
                that.date_birth = xmlStudent.tari5Izdiad;
            };

            that.getValuesOnlyArray = function () {
                return [that.id, that.registration_number, that.massar_number, that.full_name, that.date_birth];
            };
            return that;
        };

        var session = function () {
            var that = {};
            that.id = null;
            that.title = "8-10";
            that.unix_time = 0;
            that.getValuesOnlyArray = function () {
                return [that.id, that.title, that.unix_time];
            };

            return that;
        };
        var absence = function () {
            var that = {};
            that.id = null;
            that.id_student = null;
            that.id_session = null;
            that.unix_time = 1213;
            //that.student_ordered_number = 0;
            that.getValuesOnlyArray = function () {
                return [that.id, that.id_student, that.id_session];
            };

            return that;
        };

        /**
         * @description an asynchronoused function, create all tables if are not exist.
         */
        var createTables = function () {

            //  var query_create_hdrclassroom = "CREATE TABLE IF NOT EXISTS hdrclassroom(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            //    "name TEXT(255), level TEXT(255);";

            var q = $q.defer();


            var query_create_hdrstudent = "CREATE TABLE IF NOT EXISTS hdrstudent(id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "registration_number TEXT(255), massar_number TEXT(255), full_name TEXT(255)," +
                "date_birth TEXT(255)) ";

            var query_create_hdrsession = "CREATE TABLE IF NOT EXISTS hdrsession(id INTEGER PRIMARY KEY AUTOINCREMENT," +
                " title TEXT(255), unix_time TEXT(255)) ";

            var query_create_hdrabsence = "CREATE TABLE IF NOT EXISTS hdrabsence(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "id_student INTEGER NOT NULL,id_session INTEGER NOT NULL," +
                "foreign key (id_student) references hdrstudent(id)," +
                "foreign key (id_session) references hdrsession (id));";
            
            var query_create_hdrclassroom = "CREATE TABLE IF NOT EXISTS hdrclassroom(id INTEGER PRIMARY KEY AUTOINCREMENT," +
                " name TEXT(255), level TEXT(255)),"+
                " foreign key (id_classroom) references hdrclassroom(id)";

            $cordovaSQLite.execute(db, query_create_hdrstudent, [])
                .then(function (res) {
                    $cordovaSQLite.execute(db, query_create_hdrsession, [])
                        .then(function (res) {
                            $cordovaSQLite.execute(db, query_create_hdrabsence, [])
                                .then(function (res) {
                                    console.log("Tables are created successfully..");

                                    q.resolve(true);
                                    /*                                    $cordovaSQLite.execute(db, "SELECT * FROM sqlite_master", [])
                                                                            .then(function (res) {
                                                                                for (var i = 0; i < res.rows.length; i++) {
                                                                                    console.log("Table " + (i + 1) + " : " + res.rows.item(i).name);
                                                                                }
                                                                            });*/
                                }, function (err) {
                                    q.reject();
                                });
                        }, function (err) {
                            q.reject();
                        });
                }, function (err) {
                    console.log("Error while creating tables for hdrApp");
                    q.reject();
                });
            return q.promise;
        };

        var dropTables = function () {
            $cordovaSQLite.execute(db, "drop table if exists hdrclassroom")
                .then(function (res) {
                    console.log("Tables removed successfuly..");
                }, function (err) {
                    console.log("Error while droping tables " + err.message);
                })
            $cordovaSQLite.execute(db, "drop table if exists hdrstudent")
                .then(function (res) {
                    console.log("Tables removed successfuly..");
                }, function (err) {
                    console.log("Error while droping tables " + err.message);
                })
            $cordovaSQLite.execute(db, "drop table if exists hdrabsence")
                .then(function (res) {
                    console.log("Tables removed successfuly..");
                }, function (err) {
                    console.log("Error while droping tables " + err.message);
                })
            $cordovaSQLite.execute(db, "drop table if exists hdrsession")
                .then(function (res) {
                    console.log("Tables removed successfuly..");
                }, function (err) {
                    console.log("Error while droping tables " + err.message);
                })
        };

        /**
         * @description a asynchronoused function, add a student line in db.
         * @param xmlstudent is an object built from XML Massar File
         * @returns promise student object
         */
        var addStudentLine = function (student) {
            var q = $q.defer();
            ifStudentExists(student)
                .then(function (boolean) {
                    if (boolean === false) {
                        var query = "insert into hdrstudent values (?,?,?,?,?)";
                        $cordovaSQLite.execute(db, query, student.getValuesOnlyArray())
                            .then(function (res) {
                                console.log("Add student line terminated successfully");

                                $cordovaSQLite.execute(db, "select * from hdrstudent", [])
                                    .then(function (res) {
                                        console.log("Student table");
                                        console.log("---------------------------------------------------------------");
                                        console.log("id             registration_number             massar_number               full_name               date_birth");
                                        for (var i = 0; i < res.rows.length; i++) {
                                            console.log(res.rows.item(i).id + "          " + res.rows.item(i).registration_number + "          " + res.rows.item(i).massar_number + "          " + res.rows.item(i).full_name + "          " + res.rows.item(i).date_birth);
                                        }
                                    }, function (err) {
                                        console.log("Error while selecting " + err.message);
                                    });

                                $cordovaSQLite.execute(db, "select * from hdrstudent where massar_number = ?", [student.massar_number])
                                    .then(function (res) {
                                        student.id = res.rows.item(res.rows.length - 1).id;
                                        student.registration_number = res.rows.item(res.rows.length - 1).registration_number;
                                        student.massar_number = res.rows.item(res.rows.length - 1).massar_number;
                                        student.full_name = res.rows.item(res.rows.length - 1).full_name;
                                        student.date_birth = res.rows.item(res.rows.length - 1).date_birth;
                                        q.resolve(student);
                                    }, function (err) {
                                        q.reject(err);
                                    });
                            }, function (err) {
                                console.log("Error while Adding student line");
                                q.reject(err);
                            });
                    } else {
                        //student exist
                        console.log("Add student line function : student exist " + student.full_name + " Massar number " + student.massar_number);
                        $cordovaSQLite.execute(db, "select * from hdrstudent where massar_number = ?", [student.massar_number])
                            .then(function (res) {
                                student.id = res.rows.item(0).id;
                                student.registration_number = res.rows.item(0).registration_number;
                                student.massar_number = res.rows.item(0).massar_number;
                                student.full_name = res.rows.item(0).full_name;
                                student.date_birth = res.rows.item(0).date_birth;
                                q.resolve(student);
                            }, function (err) {
                                q.reject(err);
                            });
                    }
                }, function (err) {

                });
            return q.promise;
        };


        /**
        * @description a asynchronoused function, add a session line in db.
        * @param session object
        * @returns a promise session object 
        */
        var addSessionLine = function (session) {
            var q = $q.defer();

            var query = "insert into hdrsession values (?,?,?)";
            $cordovaSQLite.execute(db, query, session.getValuesOnlyArray())
                .then(function (res) {
                    console.log("Add session line terminated successfully");

                    $cordovaSQLite.execute(db, "select * from hdrsession", [])
                        .then(function (res) {
                            console.log("Session table");
                            console.log("---------------------------------------------------------------");
                            console.log("id             title               unix_time");
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log(res.rows.item(i).id + "             " + res.rows.item(i).title + "              " + res.rows.item(i).unix_time);
                            }
                        }, function (err) {
                            console.log("Error while selecting " + err.message);
                        });

                    $cordovaSQLite.execute(db, "select * from hdrsession where title = ?", [session.title])
                        .then(function (res) {
                            session.id = res.rows.item(res.rows.length - 1).id;
                            q.resolve(session);
                        }, function (err) {
                            q.reject(err);
                        });
                }, function (err) {
                    q.reject(err);
                    for (var x in err) {
                        console.log("Error while Adding session line " + x + " --> " + err[x]);
                    }
                    console.log("Error while Adding session line");

                });

            return q.promise;
        };

        /**
        * @description a asynchronoused function, add a absence line in db.
        * @param absence object
        */
        var addAbsenceLine = function (absence) {
            var q = $q.defer();
            var query = "insert into hdrabsence values (?,?,?)";
            $cordovaSQLite.execute(db, query, absence.getValuesOnlyArray())
                .then(function (res) {
                    console.log("Add absence line terminated successfully");
                    $cordovaSQLite.execute(db, "select * from hdrabsence", [])
                        .then(function (res) {
                            console.log("Absence table");
                            console.log("---------------------------------------------------------------");
                            console.log("id             id_student              id_session");
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log(res.rows.item(i).id + "             " + res.rows.item(i).id_student + "             " + res.rows.item(i).id_session);
                            }

                        }, function (err) {
                            console.log("Error while selecting " + err.message);
                        });
                    q.resolve(res);
                }, function (err) {
                    console.log("Error while Adding absence line " + err.message);
                    q.reject("Error while Adding absence line " + err);
                });

            return q.promise;
        };

        /**
         * @description a asynchronoused function checks if student is already exists in db.
         * @param {student} student json object
         * @returns boolean 
         */
        var ifStudentExists = function (student) {
            var q = $q.defer();
            var query = "SELECT * from hdrstudent where massar_number= ?";
            $cordovaSQLite.execute(db, query, [student.massar_number])
                .then(function (res) {
                    if (res.rows.length > 0) {
                        console.log("student " + student.full_name + " already exists");
                        q.resolve(true);
                    }
                    else {
                        console.log("student " + student.full_name + " dons t exist");
                        q.resolve(false);
                    }
                }, function (err) {
                    console.log("Error while checking student existance " + err);
                    q.reject("Error while checking student existanc " + err);
                });

            return q.promise;
        };

        var selectAbsences = function () {
            var q = $q.defer();
            var shistories = [];
            var query = "select * from hdrstudent st inner join (hdrabsence a inner join hdrsession s on a.id_session=s.id) on a.id_student=st.id order by a.id_session desc";
            $cordovaSQLite.execute(db, query, [])
                .then(function (res) {

                    /*console.log("Full Absence table");
                    console.log(res.rows);
                    console.log("------------------------------------------------------------------------------------------------------------------------");
                    console.log("id             id_session                  title                   id_student                  full_name               unix_time");
                    for (var i = 0; i < res.rows.length; i++) {
                        console.log(
                            res.rows.item(i).id + "                 " +
                            res.rows.item(i).id_session + "             " +
                            res.rows.item(i).title + "                    " +
                            res.rows.item(i).id_student + "                   " +
                            res.rows.item(i).full_name + "                    " +
                            res.rows.item(i).unix_time);
                    }*/

                    $cordovaSQLite.execute(db, "select id_session,count(id_student) as student_count from hdrabsence group by id_session order by id_session desc", [])
                        .then(function (res2) {
                            var startIndex = 0;
                            for (var k = 0; k < res2.rows.length; k++) {
                                var shistory = {};
                                shistory.session = {};
                                shistory.students = [];

                                var numberOfLines = res2.rows.item(k).student_count;

                                if (k > 0) {
                                    startIndex = startIndex + shistories[k - 1].students.length;
                                };

                                for (var j = startIndex; j < numberOfLines + startIndex; j++) {

                                    if (j === startIndex) {
                                        shistory.session.id = res.rows.item(j).id_session;
                                        shistory.session.title = res.rows.item(j).title;
                                        shistory.session.unix_time = res.rows.item(j).unix_time;
                                    }

                                    var student = {};
                                    student.id = res.rows.item(j).id_student;
                                    student.registration_number = res.rows.item(j).registration_number;
                                    student.massar_number = res.rows.item(j).massar_number;
                                    student.full_name = res.rows.item(j).full_name;
                                    student.date_birth = res.rows.item(j).date_birth;

                                    shistory.students.push(student);
                                }
                                shistories.push(shistory);
                            }

                            console.log("sessions histories : ");
                            console.log(shistories);
                            q.resolve(shistories);
                        }, function (err) {
                            console.log("Error Count " + err.message);
                            q.reject(err);
                        });


                    q.resolve(shistories);
                }, function (err) {
                    console.log("Error while selecting " + err.message);
                    q.reject(err);
                });

            return q.promise;
        };

        var isNoSessions = function () {
            var q = $q.defer();
            $cordovaSQLite.execute(db, "select * from hdrsession", [])
                .then(function (res) {
                    if (res.rows.length > 0)
                        q.resolve(true);
                    else
                        q.resolve(false);
                }, function (err) {
                    q.reject(err);
                });
            return q.promise;
        };



        /**
         * @description shows table data
         */


        return {
            initDB: initDB,
            initTables: createTables,
            dropTables: dropTables,
            createStudent: student,
            createSession: session,
            isNoSessions: isNoSessions,
            createAbsence: absence,
            insertStudent: addStudentLine,
            insertSession: addSessionLine,
            insertAbsence: addAbsenceLine,
            selectSessionsHistories: selectAbsences
        };
    });