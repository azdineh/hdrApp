angular.module('hdrApp')
    .factory('hdrdbx', function ($q, $window) {
        //this service must called only when ionicPlatfom is ready

        var academy_table_query = "CREATE TABLE IF NOT EXISTS academy(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "title TEXT(255));";

        //rd means regional directorate
        var rd_table_query = "CREATE TABLE IF NOT EXISTS rd(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "title TEXT(255), id_academy INTEGER," +
            "foreign key (id_academy) references academy(id));";

        var school_table_query = "CREATE TABLE IF NOT EXISTS school(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "title TEXT(255), id_rd INTEGER," +
            "foreign key (id_rd) references rd(id));";

        var classroom_table_query = "CREATE TABLE IF NOT EXISTS classroom(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "title TEXT(255), level TEXT(255),id_school INTEGER," +
            "foreign key (id_school) references school(id));";

        var student_table_query = "CREATE TABLE IF NOT EXISTS student(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "full_name TEXT(255), registration_number TEXT(255), massar_number TEXT(255)," +
            "birth_date TEXT(255), queuing_number INTEGER, id_classroom INTEGER," +
            "foreign key (id_classroom) references classroom(id));";

        var teacher_table_query = "CREATE TABLE IF NOT EXISTS teacher(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "full_name TEXT(255), subject TEXT(255),id_school INTEGER," +
            "foreign key (id_school) references school(id));";

        var session_table_query = "CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "id_classroom INTEGER,id_teacher INTEGER,unix_time TEXT(255),title TEXT(255)," +
            "foreign key (id_classroom) references classroom(id)," +
            "foreign key (id_teacher) references teacher(id));";

        var absenceline_table_query = "CREATE TABLE IF NOT EXISTS absenceline(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "id_student INTEGER,id_session INTEGER,massar_number TEXT(255),is_student_fix_problem INTEGER," +
            "foreign key (id_session) references session(id)," +
            "foreign key (id_student) references student(id));";

        var create_tables_query_sql = academy_table_query + rd_table_query + school_table_query + classroom_table_query +
            student_table_query + teacher_table_query + session_table_query + absenceline_table_query;

        /* var drop_tables_query = "drop table if exists absenceline;drop table if exists session;" +
             "drop table if exists student;drop table if exists teacher;" +
             "drop table if exists classroom;drop table if exists school;" +
             "drop table if exists rd;drop table if exists academy;"; */


        var hdrdbx = function () {
            var vm = {};
            vm.db = null;

            vm.academy = {
                id: null,
                title: "oriental"
            };
            vm.rd = {
                id: null,
                title: "Guercif",
                id_academy: ""
            };
            vm.school = {
                id: null,
                title: "HD",
                id_rd: ""
            };
            vm.classroom = {
                id: null,
                title: "TCS3",
                level: "Tronc commun scientifique",
                id_school: ""
            };
            vm.teacher = {
                id: null,
                full_name: "Samir zayou",
                subject: "Math",
                id_school: ""
            };
            vm.session = {
                id: null,
                id_classroom: "",
                id_teacher: "",
                unix_time: "",
                title: "10-12"
            }
            vm.student = {
                id: null,
                full_name: "",
                registration_number: "",
                massar_number: "",
                birth_date: "",
                queuing_number: "",
                id_classroom: ""
            };
            vm.absenceline = {
                id: null,
                id_student: "",
                id_session: "",
                massar_number: "",
                is_student_fix_problem: ""
            };

            vm.openAndInit = function () {
                vm.db = $window.sqlitePlugin.openDatabase({ name: 'hdrdb1986.db', location: 'default' }, function (db) {

                    vm.db = db;

                    cordova.plugins.sqlitePorter.importSqlToDb(vm.db, create_tables_query_sql, {
                        successFn: function (count) {
                            console.log("Successfully create " + count + " tables");
                        },
                        errorFn: function (err) {
                            console.log("***Error while creating  tables ;" + err.message);
                            console.log(err);
                        },
                        progressFn: function (current, total) {
                            console.log(current + "/" + total);
                        }
                    });


                }, function (error) {
                    console.log('Open database ERROR: ' + JSON.stringify(error));
                });
            };

            /**
             * @param flag a boolean param, if true, drop absenceline table also.
             */
/*             vm.cleardb = function (flag) {

                vm.db.executeSql("drop table if exists session", [], function () { console.log("drop table") }, function (err) { console.log("error while drop table" + err) });
                vm.db.executeSql("drop table if exists student", [], function () { console.log("drop table") }, function (err) { console.log("error while drop table" + err) });
                vm.db.executeSql("drop table if exists teacher", [], function () { console.log("drop table") }, function (err) { console.log("error while drop table" + err) });
                vm.db.executeSql("drop table if exists classroom", [], function () { console.log("drop table") }, function (err) { console.log("error while drop table" + err) });
                vm.db.executeSql("drop table if exists school", [], function () { console.log("drop table") }, function (err) { console.log("error while drop table" + err) });
                vm.db.executeSql("drop table if exists rd", [], function () { console.log("drop table") }, function (err) { console.log("error while drop table" + err) });
                vm.db.executeSql("drop table if exists academy", [], function () { console.log("drop table") }, function (err) { console.log("error while drop table" + err) });
                if (flag == true) {
                    vm.db.executeSql("drop table if exists absenceline", [], function () { console.log("drop table") }, function (err) { console.log("error while drop table" + err) });
                }


            }; */
            /**
             * remove all tables
             */
            vm.wipeDB = function () {
                cordova.plugins.sqlitePorter.wipeDb(vm.db, {
                    successFn: function (count) {
                        console.log("Successfully wiped " + count + " tables");
                    },
                    errorFn: function (error) {
                        alert("The following error occurred: " + error.message);
                    }
                });


            };


            /*
            ** verify if a row exist by checking the attribut by the value given in obj param
            ** return a promise boolean
            */
            vm.ifRowExist = function (table, obj) {
                var q = $q.defer();
                var valueToCheckBy = "";
                var attributToCheck = "";

                if (table == "teacher") {
                    attributToCheck = "full_name";
                    valueToCheckBy = obj.full_name;
                }
                else if (table == "student") {
                    attributToCheck = "massar_number";
                    valueToCheckBy = obj.massar_number;
                }
                else {
                    attributToCheck = "title";
                    valueToCheckBy = obj.title;
                }

                var isthere = false;
                vm.db.transaction(function (tx) {
                    var query = "SELECT " + attributToCheck + " from " + table + " where " + attributToCheck + "='" + valueToCheckBy + "'";
                    tx.executeSql(query, [],
                        function (tx, res) {
                            if (res.rows.length > 0) {
                                isthere = true;
                            }
                            else {
                                isthere = false;
                            }
                        }, function (err) {
                            q.reject("Error while checking row existance");
                            console.log(err);
                        });
                }, function (tx, err) {
                    q.reject("Error transactio  while checking row existance");
                    console.log(err);
                }, function () {
                    console.log("transaction ifRowExist ok");
                    q.resolve(isthere);
                });


                return q.promise;


            };

            /**
             * insert a row in table given by its name in param
             * if success, return the last row as a json object
             * @param table string, the table name
             * @param obj json object to insert
             */
            vm.insertRow = function (table, obj) {
                console.log("Insert Row " + table);
                var q = $q.defer();

                vm.ifRowExist(table, obj)
                    .then(function (boolean) {
                        console.log("IfRowExist : " + table + " -> " + boolean);
                        if (boolean == false) {
                            var values = [];
                            var interoSymbol = "";
                            angular.forEach(obj, function (value, key) {
                                this.push(value);
                                interoSymbol = interoSymbol + ",?";
                            }, values);

                            var tmpobj = {};
                            vm.db.transaction(function (tx) {

                                var query = "insert into " + table + " values (" + interoSymbol.slice(1) + ")";
                                //console.log('Insert :' + query);
                                tx.executeSql(query, values, function (tx, rowInserted) {
                                    //console.log("Inserted row :" + rowInserted.insertId + " in " + table + " table is done");
                                    tx.executeSql("select * from " + table + " where id=?", [rowInserted.insertId],
                                        function (tx, res) {
                                            tmpobj = res.rows.item(0);
                                        }, function (err) {
                                            q.reject("error while return the inserted obj " + err);
                                        });

                                }, function (err) {
                                    q.reject("Error while insert in " + table + " table " + err);
                                    //console.log("Error while insert in " + table + " table " + err);
                                });

                            }, function (error) {
                                console.log("Error in transaction in insertRow ok");
                            }, function () {
                                console.log("transaction in insertRow ok" + table);
                                console.log(tmpobj);
                                q.resolve(tmpobj);
                            });

                        }
                        else {

                            var valueToCheckBy = "";
                            var attributToCheck = "";

                            if (table == "teacher") {
                                attributToCheck = "full_name";
                                valueToCheckBy = obj.full_name;
                            }
                            else if (table == "student") {
                                attributToCheck = "massar_number";
                                valueToCheckBy = obj.massar_number;
                            }
                            else {
                                attributToCheck = "title";
                                valueToCheckBy = obj.title;
                            }

                            var tmpobj = {};
                            vm.db.transaction(function (tx) {

                                tx.executeSql("select * from " + table + " where " + attributToCheck + "=?", [valueToCheckBy],
                                    function (tx, res) {
                                        tmpobj = res.rows.item(0);
                                    }, function (err) {
                                        console.log(err);
                                        q.reject("error while return the inserted obj ");

                                    });
                            },
                                function (err) {
                                    q.reject(err)
                                },
                                function () {
                                    q.resolve(tmpobj);
                                });

                        }
                    }, function (err) {
                        console.log(err);
                    });


                return q.promise;
            };

            /**
             * @return promise array of row objects 
             * @param table stringname of table
             * @param critere string 
             */
            vm.selectRows = function (table, critere) {
                var q = $q.defer();
                var query = "";
                if (critere != "") {
                    query = "select * from " + table + " where " + critere + ";";
                }
                else {
                    query = "select * from " + table + ";";
                }
                vm.db.transaction(function (tx) {
                    tx.executeSql(query, [],
                        function (tx, res) {
                            var students = [];
                            for (var i = 0, len = res.rows.length; i < len; i++) {
                                students.push(res.rows.item(i));
                            }
                            q.resolve(students);
                        }, function (err) {
                            q.reject(err);
                        });

                }, function (error) {
                    q.reject(error);
                }, function () {

                });


                return q.promise;
            };

            /**
             * return array of classrooms view (id, title, level, count)
             */
            vm.selectClassroomsView = function () {
                var q = $q.defer();
                var classrooms_view = [];
                //var query = "select c.id, c.title, c.level from classroom c order by c.title ASC";
                var query = "select c.id as id,c.title as title,c.level as level, count(s.id) as students_count from (student s inner join classroom c on s.id_classroom=c.id ) group by c.id order by c.title Desc";
                //vm.db.transaction(function(tx){},function(error){},function(){});
                vm.db.transaction(function (tx) {
                    tx.executeSql(query, [],
                        function (tx, res) {

                            for (var i = 0, len = res.rows.length; i < len; i++) {
                                classrooms_view.push(res.rows.item(i));
                            }

                        }, function (err) {
                            console.log(err);
                            q.reject(err);
                        });
                }, function (error) {
                    console.log(error);

                }, function () {
                    q.resolve(classrooms_view);
                });

                return q.promise;
            };

            vm.insertStudentRows = function (students, id_classroom) {
                var q = $q.defer();
                var sql = "";
                var iterator = 1;
                students.forEach(function (student) {
                    sql = sql + "insert into student values(null,'" + student.issmKamel + "','" + student.ra9mTasjiil + "','" + student.ra9mMasar + "','" +
                        student.tari5Izdiad + "','" + iterator + "','" + id_classroom + "');";
                    iterator++;
                }, this);
                //console.log(sql);
                cordova.plugins.sqlitePorter.importSqlToDb(vm.db, sql, {
                    successFn: function (count) {
                        /*                         vm.selectRows("student", "id_classroom=" + id_classroom)
                                                    .then(function (students) {
                                                        console.log(students);
                                                        console.log("***Students inserted..");
                                                        sql = "";
                                                        q.resolve("Students Ok")
                                                    }, function (err) {
                                                        console.log(err);
                                                    }); */
                        q.resolve(count);
                    },
                    errorFn: function (err) { console.log("***Error whiile inserted all students: " + err.message); console.log(err); q.reject(err) }
                    //progressFn: function (current, total) { console.log(current + "/" + total) }
                });

                return q.promise;
            };



            vm.saveAbsentStudents = function (session, absentStudents) {
                vm.insertRow('session', session)
                    .then(function (session) {
                        var query_absentStudents = "insert into studentsessionlines";

                    }, function (err) {

                    })
            }
            /**
             * kissm represent one Excel file sheet
             * insert one kissm in db
             * @param aksaam array of kissms
             * @param index index of kissm to start by
             * @return index a promise number of a kissm inserted
             */
            vm.fillOne = function (aksaam, index) {
                var kissm = aksaam[index];
                var q = $q.defer();
                //fill academy table
                console.log("start fill index : " + index);
                var academyObj = {
                    id: null,
                    title: kissm.academy
                };
                vm.insertRow("academy", academyObj)
                    .then(function (academy) {
                        var rdObj = {
                            id: null,
                            title: kissm.rd,
                            id_academy: academy.id
                        };
                        vm.insertRow('rd', rdObj)
                            .then(function (rd) {
                                var schoolObj = {
                                    id: null,
                                    title: kissm.school,
                                    id_rd: rd.id
                                };
                                vm.insertRow('school', schoolObj)
                                    .then(function (school) {
                                        var teacherObj = {
                                            id: null,
                                            full_name: kissm.teachername,
                                            subject: kissm.teachersubject,
                                            id_school: school.id
                                        };
                                        vm.insertRow('teacher', teacherObj)
                                            .then(function (teacher) {
                                                var classroomObj = {
                                                    id: null,
                                                    title: kissm.issm,
                                                    level: kissm.mostawa,
                                                    id_school: school.id
                                                };
                                                vm.insertRow('classroom', classroomObj)
                                                    .then(function (classroom) {
                                                        console.log("Start insert students..");
                                                        vm.insertStudentRows(kissm.talaamiid, classroom.id)
                                                            .then(function (count) {
                                                                console.log("Insert " + count + " students");
                                                                q.resolve(index + 1);
                                                            });
                                                    }, function (err) {
                                                        q.reject(err);
                                                    });
                                            }, function (err) {
                                                q.reject(err);
                                            });

                                    }, function (err) {
                                        q.reject(err);
                                    });
                            }, function (err) {
                                q.reject(err);
                            });
                    }, function (err) {
                        q.reject(err);
                    });

                return q.promise;
            };


            /**
             * fill database by all kisssms
             * @param aksaam array of kissm
             * @param index index to start by.
             * @param callBack a callback function called when last kissm inserted in db is done 
             */
            vm.fillDB = function (aksaam, index, callBack) {
                vm.fillOne(aksaam, index)
                    .then(function (promiseindex) {

                        if (index + 1 < aksaam.length) {
                            vm.fillDB(aksaam, index + 1, callBack);

                        }
                        else {
                            console.log("fill database is done");
                            //execut callBack
                            callBack();
                        }
                    }, function (err) {
                        console.log(err);
                    });
            };



            return vm;
        };



        return hdrdbx();
    });