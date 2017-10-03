angular.module('hdrApp')
    .factory('hdrdbx', function ($q, $cordovaSQLite) {
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
            "birth_date TEXT(255), queuing_number INTEGER, id_classroom INTEGER)," +
            "foreign key (id_classroom) references classroom(id));";

        var teacher_table_query = "CREATE TABLE IF NOT EXISTS teacher(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "full_name TEXT(255), subject TEXT(255),id_school INTEGER," +
            "foreign key (id_school) references school(id));";

        var session_table_query = "CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "id_classroom INTEGER,id_teacher INTEGER,unix_time TEXT(255),title TEXT(255)," +
            "foreign key (id_classroom) references classroom(id)," +
            "foreign key (id_teacher) references teacher(id));";

        var absenceline_table_query = "CREATE TABLE IF NOT EXISTS absenceline(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "id_student INTEGER,id_session INTEGER,is_student_fix_problem INTEGER," +
            "foreign key id_session references session(id)," +
            "foreign key id_student references student(id));";

        var create_tables_query = academy_table_query + rd_table_query + school_table_query + classroom_table_query +
            student_table_query + teacher_table_query + session_table_query + absenceline_table_query;

        var drop_tables_query = "drop table if exists absenceline;drop table if exists session;" +
            "drop table if exists student;drop table if exists teacher;" +
            "drop table if exists classroom;drop table if exists school;" +
            "drop table if exists rd;drop table if exists academy;";



        var hdrdbx = function () {
            var vm = {}
            vm.db = $cordovaSQLite.openDB("hdrx.db", 1);

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
                is_student_fix_problem: ""
            };


            vm.createTables = function () {
                var q = $q.defer();
                $cordovaSQLite.execute(vm.db, create_tables_query, [])
                    .then(function (res) {
                        q.resolve("Creating tables is done");
                    }, function (err) {
                        q.reject("Error while creating tables " + err)
                    });

                return q.promise;
            };

            vm.cleardb = function () {
                var q = $q.defer();
                $cordovaSQLite.execute(db, drop_tables_query, [])
                    .then(function (res) {
                        q.resolve("Clear database is done");
                    }, function (err) {
                        q.reject("Error while clearing database " + err)
                    });

                return q.promise;
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
                else {
                    attributToCheck = "title";
                    valueToCheckBy = obj.title;
                }

                var query = "SELECT " + attributToCheck + " from " + table + " where " + attributToCheck + "= ?";
                $cordovaSQLite.execute(vm.db, query, [valueToCheckBy])
                    .then(function (res) {
                        if (res.rows.length > 0) {
                            q.resolve(true);
                        }
                        else {
                            q.resolve(false);
                        }
                    }, function (err) {
                        q.reject("Error while checking row existance " + err);
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
                var q = $q.defer();

                vm.ifRowExist(table, obj)
                    .then(function (boolean) {
                        if (boolean == true) {
                            var values = [];
                            var interoSymbol = "";
                            angular.forEach(obj, function (value, key) {
                                this.push(value);
                                interoSymbol = interoSymbol + ",?";
                            }, values);

                            var query = "insert into " + table + " values (" + interoSymbol.slice(1) + ")";
                            $cordovaSQLite.execute(vm.db, query, values)
                                .then(function (res) {
                                    console.log("Insert row in " + table + " table is done");
                                    vm.selectRows(table)
                                        .then(function (arrayObj) {
                                            q.resolve(arrayObj[arrayObj.length - 1]);
                                        }, function (err) {
                                            console.log(err);
                                        });
                                }, function (err) {
                                    q.reject("Error while insert in " + table + " table " + err);
                                    console.log("Error while insert in " + table + " table " + err);
                                });
                        }
                        else {

                        }
                    }, function (err) {

                    });

                return q.promise;
            };

            vm.selectRowsAsObj = function (table) {
                var q = $q.defer();
                $cordovaSQLite.execute(vm.db, "select * from " + table + "", [])
                    .then(function (res) {
                        var jsontexte = "";
                        var objarray = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            angular.forEach(res.rows.item(i), function (value, key) {
                                jsontexte = jsontexte + key + ":" + value + ",";
                            });
                            jsontexte = jsontexte.slice(0, jsontexte.lastIndexOf(","));
                            objarray.push(JSON.parse("{" + jsontexte + "}"));
                        }
                        q.resolve(objarray);
                    }, function (err) {
                        q.reject(err);
                        console.log(err);
                    });

                return q.promise;
            };
            vm.insertStudentRows = function (students, id_classroom) {
                var q = $q.defer();
                var query = "";
                for (var i = 0; i < students.length; i++) {
                    var query = query + "insert into student values (null," + student[i].issmKamel + "," + student[i].ra9mTasjiil + "," + student[i].ra9mMasar + "," + student[i].tari5Izdiad + "," + i + 1 + "," + id_classroom + ");";
                }
                $cordovaSQLite.execute(vm.db, query, [])
                    .then(function (res) {
                        q.resolve("Insertion of students is done");
                    }, function (err) {
                        q.reject("Error while inserting students" + err);
                    });

                return q.promise;
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
                var academyObj = {
                    id: null,
                    academy: kissm.academy
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
                                                        vm.insertStudentRows(kissm.talaamiid, classroom.id)
                                                            .then(function (res) {
                                                                console.log(res);
                                                                q.resolve(index);
                                                            }, function (err) {
                                                                console.log(err);
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
            vm.fillDB = function (aksaam, index,callBack) {                
                vm.fillOne(aksaam, index)
                    .then(function (promiseindex) {
                        if (promiseindex == aksaam.length-1) {
                            console.log("fill database is done");
                            //execut callBack
                            callBack()
                        }
                        // verify is the next index is available
                        else if (promiseindex + 1 < aksaam.length) {
                            vm.fillDB(aksaam, promiseindex + 1,callBack);
                        }
                    }, function (err) {
                        console.log(err);
                    });
            };

            

            return vm;
        }

        return hdrdbx;
    });