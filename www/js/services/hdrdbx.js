angular.module('hdrApp')
    .factory('hdrdbx', function ($q, $window, $filter) {
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
            "birth_date TEXT(255), queuing_number INTEGER,observation TEXT(1020) , id_classroom INTEGER," +
            "foreign key (id_classroom) references classroom(id));";

        var teacher_table_query = "CREATE TABLE IF NOT EXISTS teacher(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "full_name TEXT(255), subject TEXT(255),id_school INTEGER," +
            "foreign key (id_school) references school(id));";

        var session_table_query = "CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "id_classroom INTEGER,classroom_title TEXT(255),id_teacher INTEGER,unix_time TEXT(255),title TEXT(255)," +
            "students_count INTEGER, parity TEXT(10),isExamSession INTEGER,observation TEXT(1020)," +
            "foreign key (id_classroom) references classroom(id)," +
            "foreign key (id_teacher) references teacher(id));";

        var absenceline_table_query = "CREATE TABLE IF NOT EXISTS absenceline(id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "id_student INTEGER,id_session INTEGER,massar_number TEXT(255),full_name TEXT(255),queuing_number INTEGER,birth_date TEXT(255),is_student_fix_problem INTEGER," +
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
                classroom_title: "", //not use :: for establish the link between session and classroom tables after DB wippinge, wd can't satisfed with only id, because not necessery we will have the same id after new db populting.
                id_teacher: "", // we can satisfed only with id teacher, because we hava on teacher by application.
                unix_time: "",
                title: "10-12",
                students_count: 0,
                parity: "all", // session parity is  all classroom attend or just by group: all,odd or even .
                isExamSession: 0, // is a isExamSession session : 0 non, 1 yes.
                observation: ""
            }
            vm.student = {
                id: null,
                full_name: "",
                registration_number: "",
                massar_number: "",
                birth_date: "",
                queuing_number: "",
                observation: "",
                id_classroom: ""
            };
            vm.absenceline = {
                id: null,
                id_student: "",
                id_session: "",
                massar_number: "", // for establish the link between absenceline and session and student tables after DB wippinge, wd can't satisfed with only id, because not necessery we will have the same id after new db populting.
                full_name: "", // for keep it as history in case the student registrated in other classroom (for the same teacher or other teacher)
                queuing_number: "", //the same case like full_name attribut
                birth_date: "", //the same case like full_name attribut
                is_student_fix_problem: ""
            };

            vm.openDB = function () {
                vm.db = $window.sqlitePlugin.openDatabase({ name: 'hdrdb1986.db', location: 'default' },
                    function (db) {
                        console.log("DB opend..");
                    },
                    function (error) {
                        console.log("Error while opening DB" + JSON.stringify(error));
                    });
            };
            vm.initDB = function () {
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
                else if (table == "session") {
                    attributToCheck = "unix_time";
                    valueToCheckBy = obj.unix_time;
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
             * @return the last row of table
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
                            else if (table == "session") {
                                attributToCheck = "unix_time";
                                valueToCheckBy = obj.unix_time;
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
                            var items_arr = [];
                            for (var i = 0, len = res.rows.length; i < len; i++) {
                                items_arr.push(res.rows.item(i));
                            }
                            q.resolve(items_arr);
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
             * return array of classrooms view (id, title, level)
             */
            vm.selectClassrooms = function () {
                var q = $q.defer();
                var classrooms = [];
                //var query = "select c.id, c.title, c.level from classroom c order by c.title ASC";
                var query = "select c.id as id,c.title as title,c.level as level from classroom c order by c.title asc";
                //vm.db.transaction(function(tx){},function(error){},function(){});
                vm.db.transaction(function (tx) {
                    tx.executeSql(query, [],
                        function (tx, res) {

                            for (var i = 0, len = res.rows.length; i < len; i++) {
                                classrooms.push(res.rows.item(i));
                            }

                        }, function (err) {
                            console.log(err);
                            q.reject(err);
                        });
                }, function (error) {
                    console.log(error);

                }, function () {
                    q.resolve(classrooms);
                });

                return q.promise;
            };

            vm.classrooms_view = [];
            vm.addStudentsToClassrooms = function (classrooms, index, callBack) {
                if (index < classrooms.length) {
                    vm.selectRows('student', "id_classroom=" + classrooms[index].id)
                        .then(function (students) {
                            classrooms[index].students = students;
                            vm.classrooms_view.push(classrooms[index]);
                            vm.addStudentsToClassrooms(classrooms, index + 1, callBack);
                        }, function (err) {
                            console.log('Error while selecting students' + JSON.stringify(err));
                        })
                }
                else {
                    callBack();
                }
            }


            vm.insertStudentRows = function (students, id_classroom) {
                var q = $q.defer();
                var sql = "";
                var iterator = 1;
                students.forEach(function (student) {
                    sql = sql + "insert into student values(null,'" + student.issmKamel + "','" + student.ra9mTasjiil + "','" + student.ra9mMasar + "','" +
                        student.tari5Izdiad + "','" + iterator + "', '', '" + id_classroom + "');";
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
                var q = $q.defer();
                vm.insertRow('session', session)
                    .then(function (session) {
                        if (absentStudents.length > 0) {

                            var query_absentStudents = "";

                            absentStudents.forEach(function (absentStudent) {
                                query_absentStudents = query_absentStudents + "insert into absenceline values(null, " + absentStudent.id + "," + session.id + ",'" + absentStudent.massar_number + "','" + absentStudent.full_name + "'," + absentStudent.queuing_number + ",'" + absentStudent.birth_date + "',0);";
                            }, this);

                            cordova.plugins.sqlitePorter.importSqlToDb(vm.db, query_absentStudents, {
                                successFn: function (count) {
                                    q.resolve(count);
                                },
                                errorFn: function (err) {
                                    q.reject(err);
                                },
                                progressFn: function () { }
                            })
                        } else {
                            q.resolve(0);
                        }

                    }, function (err) {
                        q.reject(err);
                    })

                return q.promise;
            };

            vm.selectSessionsView = function () {
                var q = $q.defer();
                var sessions_view_obj = {
                    session: {},
                    classroom: {},
                    students: []
                }
                var sessions_view_obj_arr = [];

                /*                 var sql = "select st.id as studentId, st.full_name as full_name, st.queuing_number as queuing_number," +
                                    "s.id as sessionId, s.unix_time as unix_time, s.title as sessionTitle, s.parity as parity," +
                                    "c.id as classroomId, c.title as classroomTitle " +
                                    "from " +
                                    "student st inner join absenceline a on a.massar_number=st.massar_number " +
                                    "inner join session s on s.id=a.id_session " +
                                    "inner join classroom c on c.id=s.id_classroom " +
                                    "order by s.unix_time desc"; */
                var sql = "select a.full_name as full_name, a.queuing_number as queuing_number,a.massar_number as massar_number," +
                    "s.id as sessionId, s.unix_time as unix_time, s.title as sessionTitle, s.parity as parity," +
                    "c.id as classroomId, c.title as classroomTitle " +
                    "from " +
                    "session s inner join absenceline a on s.id=a.id_session " +
                    "inner join classroom c on c.id=s.id_classroom " +
                    "order by s.unix_time desc";
                vm.db.transaction(function (tx) {
                    tx.executeSql(sql, [],
                        function (tx, res) {
                            console.log(res);

                            var i = 0, len = res.rows.length;
                            while (i < len) {
                                var curr_item = res.rows.item(i);
                                var curr_unix_time = curr_item.unix_time;

                                sessions_view_obj
                                    .session = {
                                        id: curr_item.sessionId,
                                        unix_time: curr_item.unix_time,
                                        title: curr_item.sessionTitle,
                                        parity: curr_item.parity
                                    };

                                sessions_view_obj
                                    .classroom = {
                                        id: curr_item.classroomId,
                                        title: curr_item.classroomTitle

                                    };

                                sessions_view_obj
                                    .students = [];


                                var sflag = true;
                                while (i < len && sflag) {

                                    if (curr_unix_time == res.rows.item(i).unix_time) {

                                        var student = {};
                                        //student.id = res.rows.item(i).studentId;
                                        student.full_name = res.rows.item(i).full_name;
                                        student.queuing_number = res.rows.item(i).queuing_number;
                                        student.massar_number = res.rows.item(i).massar_number;
                                        student.birth_date = res.rows.item(i).birth_date;
                                        sessions_view_obj.students.push(student);

                                    }
                                    else {

                                        sflag = false;
                                    }
                                    i += 1;
                                }


                                sessions_view_obj_arr.push(sessions_view_obj);

                            }




                        }, function (err) {
                            console.log(err);
                            q.reject(err);
                        });
                }, function (error) {
                    console.log(error);

                }, function () {
                    q.resolve(sessions_view_obj_arr);
                });

                return q.promise;
            };

            vm.selectSessionView = function (session) {
                var q = $q.defer();
                var session_view_obj = {
                    session: {},
                    classroom: {},
                    students: []
                }

                /*                 var sql = "select st.id as studentId, st.full_name as full_name, st.queuing_number as queuing_number, st.massar_number as massar_number, st.birth_date as birth_date," +
                                    "s.id as sessionId, s.unix_time as unix_time, s.title as sessionTitle, s.students_count as students_count,s.parity as parity, s.isExamSession as isExamSession, s.observation as observation," +
                                    "c.id as classroomId, c.title as classroomTitle, a.is_student_fix_problem as is_student_fix_problem " +
                                    "from " +
                                    "((session s inner join classroom c on s.id_classroom=c.id) " +
                                    "left join " +
                                    "(student st left join absenceline a on a.massar_number=st.massar_number) " +
                                    "on a.id_session = s.id) " +
                                    "where s.id=?"; */
                var sql = "select a.full_name as full_name, a.queuing_number as queuing_number, a.massar_number as massar_number, a.birth_date as birth_date," +
                    "s.id as sessionId, s.unix_time as unix_time, s.title as sessionTitle, s.students_count as students_count,s.parity as parity, s.isExamSession as isExamSession, s.observation as observation," +
                    "c.id as classroomId, c.title as classroomTitle, a.is_student_fix_problem as is_student_fix_problem " +
                    "from " +
                    "(session s inner join classroom c on s.id_classroom=c.id)" +
                    "left join " +
                    "absenceline a on a.id_session = s.id " +
                    "where s.id=?";
                vm.db.transaction(function (tx) {
                    tx.executeSql(sql, [session.id],
                        function (tx, res) {
                            console.log(res.rows);
                            if (res.rows.length > 0) {

                                console.log("session view :");
                                console.log(res.rows);
                                session_view_obj.session.id = res.rows.item(0).sessionId;
                                session_view_obj.session.title = res.rows.item(0).sessionTitle;
                                session_view_obj.session.unix_time = res.rows.item(0).unix_time;
                                session_view_obj.session.students_count = res.rows.item(0).students_count;
                                session_view_obj.session.parity = res.rows.item(0).parity;
                                session_view_obj.session.isExamSession = res.rows.item(0).isExamSession;
                                session_view_obj.session.observation = res.rows.item(0).observation.replace(/\n/g, "<br>");

                                session_view_obj.classroom.id = res.rows.item(0).classroomId;
                                session_view_obj.classroom.title = res.rows.item(0).classroomTitle;

                                for (var i = 0; i < res.rows.length; i++) {
                                    var student = {}
                                    if (res.rows.item(0).massar_number == null) {
                                        break;
                                    }
                                    else {
                                        student.massar_number = res.rows.item(i).massar_number;
                                        student.full_name = res.rows.item(i).full_name;
                                        student.queuing_number = res.rows.item(i).queuing_number;
                                        student.birth_date = res.rows.item(i).birth_date;
                                        if (res.rows.item(i).is_student_fix_problem == 0)
                                            student.is_student_fix_problem = false;
                                        else
                                            student.is_student_fix_problem = true;

                                        session_view_obj.students.push(student);
                                    }
                                }

                            }

                        }, function (err) {
                            console.log(err);
                            q.reject(err);
                        });
                }, function (error) {
                    console.log(error);

                }, function () {
                    q.resolve(session_view_obj);
                });

                return q.promise;
            };

            vm.daies_arr = [];
            // count is the number of session to dispaly, the max value of end_index is sessions_arr.length
            vm.selectSessionsView2 = function (sessions_arr, start_index, count, callBack) {

                vm.selectSessionView(sessions_arr[start_index])
                    .then(function (session_view_obj) {
                        var dayObj = {
                            date: '',
                            sessions_view: []
                        }

                        if (vm.daies_arr.length == 0) {
                            dayObj.date = session_view_obj.session.unix_time;
                            dayObj.sessions_view.push(session_view_obj);
                            vm.daies_arr.push(dayObj);
                        }
                        else {
                            var day = $filter('date')(session_view_obj.session.unix_time, 'fullDate');
                            var pday = $filter('date')(vm.daies_arr[vm.daies_arr.length - 1].date, 'fullDate');
                            if (day == pday) {
                                vm.daies_arr[vm.daies_arr.length - 1].sessions_view.push(session_view_obj);
                            } else {
                                dayObj.date = session_view_obj.session.unix_time;
                                dayObj.sessions_view.push(session_view_obj);
                                vm.daies_arr.push(dayObj);
                            }
                        }

                        if (start_index + 1 < count)
                            vm.selectSessionsView2(sessions_arr, start_index + 1, count, callBack);
                        else
                            callBack();

                    }, function (error) {
                        console.log(error);
                    });
            }

            vm.selectDaies = function () {
                var q = $q.defer();
                var daies = [];
                //var query = "select c.id, c.title, c.level from classroom c order by c.title ASC";
                var query = "select date(substr(unix_time,1,length(unix_time)-3), 'unixepoch') as sdate,unix_time, count(id) as count from session group by sdate order by sdate desc;";
                //vm.db.transaction(function(tx){},function(error){},function(){});
                vm.db.transaction(function (tx) {
                    tx.executeSql(query, [],
                        function (tx, res) {

                            for (var i = 0, len = res.rows.length; i < len; i++) {
                                daies.push(res.rows.item(i));
                            }

                        }, function (err) {
                            console.log(err);
                            q.reject(err);
                        });
                }, function (error) {
                    console.log(error);

                }, function () {
                    q.resolve(daies);
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



            vm.selectStudentAbsences = function (massar_number) {
                var q = $q.defer();
                var query = "select al.id as id,al.massar_number as massar_number, ss.unix_time as unix_time,ss.title as title,al.is_student_fix_problem as is_student_fix_problem from " +
                    "absenceline al inner join session ss on al.id_session=ss.id where al.massar_number=?";


                vm.db.transaction(function (tx) {
                    tx.executeSql(query, [massar_number],
                        function (tx, res) {
                            var items_arr = [];
                            for (var i = 0, len = res.rows.length; i < len; i++) {
                                items_arr.push(res.rows.item(i));
                            }
                            q.resolve(items_arr);
                        }, function (err) {
                            q.reject(err);
                        });

                }, function (error) {
                    q.reject(error);
                }, function () {

                });

                return q.promise;
            }

            vm.selectStudentAbsencesIn = function (arrayOfStudentds) {
                var inString = "";
                arrayOfStudentds.forEach(function (student) {
                    inString += "'" + student.massar_number + "',";
                }, this);

                inString = inString.substring(0, inString.length - 1);
                inString = "(" + inString + ")";

                var q = $q.defer();

                /*                 var query = "select al.id as id,al.massar_number as massar_number, ss.unix_time as unix_time,ss.title as title, count(al.id) as absences_count from absenceline al inner join student s on al.massar_number=s.massar_number " +
                                    "inner join session ss on al.id_session=ss.id  group by s.massar_number HAVING s.massar_number in " + inString; */
                var query = "select al.id as id,al.massar_number as massar_number, ss.unix_time as unix_time,ss.title as title, count(al.id) as absences_count from " +
                    "absenceline al inner join session ss on al.id_session=ss.id  group by al.massar_number HAVING al.massar_number in " + inString;
                console.log(query);

                vm.db.transaction(function (tx) {
                    tx.executeSql(query, [],
                        function (tx, res) {
                            var items_arr = [];
                            for (var i = 0, len = res.rows.length; i < len; i++) {
                                items_arr.push(res.rows.item(i));
                            }
                            console.log(items_arr);
                            q.resolve(items_arr);
                        }, function (err) {
                            q.reject(err);
                        });

                }, function (error) {
                    q.reject(error);
                }, function () {

                });

                return q.promise;
            }

            vm.getStudentsAbsencesCount = function (classroom_title) {

                var query = "";
                var arrayy = [];
                if (classroom_title != "") {
                    query = "select c.title as title, s.birth_date as birth_date, s.queuing_number as queuing_number, count(al.id) as absences_count, s.full_name as full_name from absenceline al inner join student s on al.massar_number=s.massar_number " +
                        "inner join classroom c on s.id_classroom =c.id group by s.massar_number HAVING c.title=?";
                    arrayy.push(classroom_title);
                }
                else {
                    query = "select c.title as title, s.birth_date as birth_date, s.queuing_number as queuing_number, count(al.id) as absences_count, s.full_name as full_name, s.massar_number as massar_number, al.is_student_fix_problem as is_student_fix_problem from student s left join absenceline al on al.massar_number=s.massar_number " +
                        "inner join classroom c on s.id_classroom =c.id group by s.massar_number order by full_name";
                }

                var q = $q.defer();



                vm.db.transaction(function (tx) {
                    tx.executeSql(query, arrayy,
                        function (tx, res) {
                            var items_arr = [];
                            for (var i = 0, len = res.rows.length; i < len; i++) {
                                items_arr.push(res.rows.item(i));
                            }
                            q.resolve(items_arr);
                        }, function (err) {
                            q.reject(err);
                        });

                }, function (error) {
                    q.reject(error);
                }, function () {

                });

                return q.promise;

            }


            vm.removeSession = function (session_id) {

                var q = $q.defer();

                var query1 = "delete from absenceline where id_session='" + session_id + "'";
                var query2 = "delete from session where id='" + session_id + "'";

                cordova.plugins.sqlitePorter.importSqlToDb(vm.db, query1 + ";" + query2, {
                    successFn: function (count) {
                        console.log("Successfully delete lines frome " + count + " tables");
                        q.resolve(count);
                    },
                    errorFn: function (err) {
                        console.log("***Error while deleting lines from absenceline and session tables ;" + err.message);
                        console.log(err);
                        q.reject(err);
                    }
                });

                return q.promise;

            }
            vm.removeSeveralSessions = function (array_of_session_view) {

                var q = $q.defer();

                var inString = "";
                array_of_session_view.forEach(function (session_view) {
                    inString += "'" + session_view.session.id + "',";
                }, this);

                inString = inString.substring(0, inString.length - 1);
                inString = "(" + inString + ")";

                var query1 = "delete from absenceline where id_session in " + inString;
                var query2 = "delete from session where id in " + inString;

                cordova.plugins.sqlitePorter.importSqlToDb(vm.db, query1 + ";" + query2, {
                    successFn: function (count) {
                        console.log("Successfully delete lines frome " + count + " tables");
                        q.resolve(count);
                    },
                    errorFn: function (err) {
                        console.log("***Error while deleting lines from absenceline and session tables ;" + err.message);
                        console.log(err);
                        q.reject(err);
                    }
                });

                return q.promise;

            }

            vm.saveObservations = function (session_id, observation) {
                var q = $q.defer();

                var query = "update session set observation='" + observation + "' where id='" + session_id + "'";

                cordova.plugins.sqlitePorter.importSqlToDb(vm.db, query, {
                    successFn: function (count) {
                        console.log("Successfully uptade lines from " + count + " tables");
                        q.resolve(count);
                    },
                    errorFn: function (err) {
                        console.log("***Error while updating lines from session table ;" + err.message);
                        console.log(err);
                        q.reject(err);
                    }
                });

                return q.promise;
            }

            vm.removeStudentFromAbsenceLine = function (massar_number, session_id) {
                var q = $q.defer();

                var query = "delete from absenceline where id_session='" + session_id + "' and massar_number='" + massar_number + "'";

                cordova.plugins.sqlitePorter.importSqlToDb(vm.db, query, {
                    successFn: function (count) {
                        console.log("Successfully delete line from absenceline ");
                        q.resolve(count);
                    },
                    errorFn: function (err) {
                        console.log("***Error while deleting line from absenceline table ;" + err.message);
                        console.log(err);
                        q.reject(err);
                    }
                });

                return q.promise;
            }


            vm.changeStudentFixProblem = function (student, session_id) {

                var q = $q.defer();
                var val = 0;
                if (student.is_student_fix_problem == false)
                    val = 0;
                else
                    val = 1;

                var query = "update absenceline set is_student_fix_problem='" + val + "' where id_session='" + session_id + "' and massar_number='" + student.massar_number + "'";

                cordova.plugins.sqlitePorter.importSqlToDb(vm.db, query, {
                    successFn: function (count) {
                        console.log("Successfully update line from absenceline ");
                        q.resolve(count);
                    },
                    errorFn: function (err) {
                        console.log("***Error while updating line from absenceline table ;" + err.message);
                        console.log(err);
                        q.reject(err);
                    }
                });

                return q.promise;

            }

            vm.removedata = function (removAllFalg) {


                if (removAllFalg) {
                    vm.wipeDB();
                } else {

                    var q = $q.defer();

                    /**
                     * remove all tables 
                     * execption:
                     * classroom table
                     * session table
                     * student table
                     * 
                     */


                    var query = "";
                    query += "drop table if exists student;";
                    query += "drop table if exists teacher;";
                    query += "drop table if exists school;";
                    query += "drop table if exists rd;";
                    query += "drop table if exists academy;";

                    cordova.plugins.sqlitePorter.importSqlToDb(vm.db, query, {
                        successFn: function (count) {
                            console.log("Successfully drop tables");
                            q.resolve(count);
                        },
                        errorFn: function (err) {
                            console.log("***Error while droping tables " + err.message);
                            console.log(err);
                            q.reject(err);
                        }
                    });

                    return q.promise;
                }


            }



            return vm;
        };



        return hdrdbx();
    });