angular.module('hdrApp').controller('ClassroomsController',
    function ($scope, $rootScope, hdrFileSystem, $filter, $window, $state, $ionicLoading, hdrdbx, $ionicActionSheet, $interval) {

        $scope.page = "Classrooms";
        $rootScope.classrooms_view = $window.localStorage['hdr.classrooms_view'] ? angular.fromJson($window.localStorage['hdr.classrooms_view']) : [];
        $rootScope.students_count_global = $window.localStorage['hdr.students_count_global'] ? angular.fromJson($window.localStorage['hdr.students_count_global']) : 0;

        //$scope.tapped = false;

        /**
         * go to the appel page with the classroom and choice index of rappid call
         */
        $scope.startAttendanceCall = function (classroom, index) {

            if (index == '-1') {
                var elm = document.getElementById(classroom.id);
                elm.className += ' hdr-btn';
            }

            //$scope.tapped = true;
            if (ionic.Platform.isWebView()) {
                $state.go("tab.appeal", { 'classroom_title': classroom.title, 'index': index });
            }
            else {
                $state.go("tab.appeal", { 'classroom_title': classroom.title, 'index': index });
            }

        }


        $scope.show = function () {
            //template: '<ion-spinner icon="lines"></ion-spinner><br/><span dir="rtl">' + crntmsg + '</span>'
            $ionicLoading.show({

            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };


        $scope.goToStudentsView = function (classroom) {
            $state.go('tab.classroom', { 'classroom_title': classroom.title });
        }

        $scope.importSimulatedClassrooms = function () {

            ionic.Platform.ready(function () {
                hdrdbx.initDB();
                $scope.show();
                window.resolveLocalFileSystemURL("file:///android_asset/www/hodoor-classrooms-simulation", function (directoryentry) {


                    hdrFileSystem.readHdrFiles(directoryentry,
                        function () {
                            console.log("call back success..");
                            console.log(hdrFileSystem.classrooms);

                            hdrdbx.fillDB(hdrFileSystem.classrooms, 0, function () {

                                hdrdbx.selectClassrooms()
                                    .then(function (classrooms) {
                                        hdrdbx.addStudentsToClassrooms(classrooms, 0, function () {


                                            //$rootScope.classrooms_view = hdrdbx.classrooms_view;
                                            $interval(function () {
                                                var shifted = hdrdbx.classrooms_view.shift();
                                                $rootScope.classrooms_view.push(shifted);
                                                $rootScope.students_count_global += shifted.students.length;

                                                if (hdrdbx.classrooms_view.length == 0) {

                                                    $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                                                    $window.localStorage['hdr.students_count_global'] = angular.toJson($rootScope.students_count_global);
                                                }
                                            }, 450, hdrdbx.classrooms_view.length);

                                            //hdrdbx.classrooms_view = [];


                                        });



                                        hdrdbx.selectRows('academy')
                                            .then(function (res) {

                                                $rootScope.academy = res.rows.item(0);
                                                $window.localStorage['hdr.academy'] = angular.toJson($rootScope.academy);
                                            }, function (err) {
                                                console.log(err);
                                            });
                                        hdrdbx.selectRows('rd')
                                            .then(function (res) {
                                                $rootScope.rd = res.rows.item(0);
                                                $window.localStorage['hdr.rd'] = angular.toJson($rootScope.rd);
                                            }, function (err) {
                                                console.log(err);
                                            });
                                        hdrdbx.selectRows('school')
                                            .then(function (res) {
                                                $rootScope.school = res.rows.item(0);
                                                $window.localStorage['hdr.school'] = angular.toJson($rootScope.school);
                                            }, function (err) {
                                                console.log(err);
                                            });
                                        hdrdbx.selectRows('teacher')
                                            .then(function (res) {
                                                $rootScope.teacher = res.rows.item(0);
                                                $window.localStorage['hdr.teacher'] = angular.toJson($rootScope.teacher);
                                            }, function (err) {
                                                console.log(err);
                                            });

                                        $scope.hide();
                                        hdrFileSystem.classrooms = [];
                                    }, function (err) {
                                        console.log(err);
                                    });


                            });



                        })



                }, function (error) {
                    alert("problem with resolve local files system");
                });

            });
        };

        $scope.importClassrooms = function () {

            if (ionic.Platform.isWebView()) {
                ionic.Platform.ready(function () {
                    //var hfs = new hdrFileSystem();
                    hdrdbx.initDB();
                    $scope.show();
                    hdrFileSystem.getFileSystem('0').then(function (fs) {
                        hdrFileSystem.isHdrDirectoryExist(fs).then(function (directory) {
                            //alert(" The " + directory.name + " is found in internal storage , now checking out the Masar files..");
                            hdrFileSystem.readHdrFiles(directory,
                                function () {
                                    console.log("call back success..");
                                    console.log(hdrFileSystem.classrooms);

                                    hdrdbx.fillDB(hdrFileSystem.classrooms, 0, function () {

                                        hdrdbx.selectClassrooms()
                                            .then(function (classrooms) {
                                                hdrdbx.addStudentsToClassrooms(classrooms, 0, function () {


                                                    //$rootScope.classrooms_view = hdrdbx.classrooms_view;
                                                    $interval(function () {
                                                        var shifted = hdrdbx.classrooms_view.shift();
                                                        $rootScope.classrooms_view.push(shifted);
                                                        $rootScope.students_count_global += shifted.students.length;

                                                        if (hdrdbx.classrooms_view.length == 0) {

                                                            $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                                                            $window.localStorage['hdr.students_count_global'] = angular.toJson($rootScope.students_count_global);
                                                        }
                                                    }, 450, hdrdbx.classrooms_view.length);

                                                    //hdrdbx.classrooms_view = [];



                                                });

                                                hdrdbx.selectRows('academy')
                                                    .then(function (res) {

                                                        $rootScope.academy = res.rows.item(0);
                                                        $window.localStorage['hdr.academy'] = angular.toJson($rootScope.academy);
                                                    }, function (err) {
                                                        console.log(err);
                                                    });
                                                hdrdbx.selectRows('rd')
                                                    .then(function (res) {
                                                        $rootScope.rd = res.rows.item(0);
                                                        $window.localStorage['hdr.rd'] = angular.toJson($rootScope.rd);
                                                    }, function (err) {
                                                        console.log(err);
                                                    });
                                                hdrdbx.selectRows('school')
                                                    .then(function (res) {
                                                        $rootScope.school = res.rows.item(0);
                                                        $window.localStorage['hdr.school'] = angular.toJson($rootScope.school);
                                                    }, function (err) {
                                                        console.log(err);
                                                    });
                                                hdrdbx.selectRows('teacher')
                                                    .then(function (res) {
                                                        $rootScope.teacher = res.rows.item(0);
                                                        $window.localStorage['hdr.teacher'] = angular.toJson($rootScope.teacher);
                                                    }, function (err) {
                                                        console.log(err);
                                                    });

                                                $scope.hide();
                                                hdrFileSystem.classrooms = [];
                                            }, function (err) {
                                                console.log(err);
                                            });


                                    });



                                })



                        }, function (error) {
                            //alert("The hodoor-classrooms Directory doesn't exist..");
                            alert("الملف hodoor-classrooms غير موجود");
                        });
                    }, function (error) {
                        // error with FileSystem
                    });
                });
            } else {
                // actions for computer platforms
                console.log("classrooms page");
                $rootScope.classrooms_view.push({ id: "1", title: "TCS4", level: "جذع مشترك علمي", 'students': [] });
                $rootScope.classrooms_view.push({ id: "2", title: "TCLSH2", level: "جذع مشترك أداب و علوم إنسانية", 'students': [] });
                $rootScope.classrooms_view.push({ id: "3", title: "1BacSM4", level: "أولى باك علوم رياضية", 'students': [] });
                $rootScope.classrooms_view.push({ id: "4", title: "2BacSP3", level: "ثانية علوم فيزيائية", 'students': [] });
                $rootScope.classrooms_view.push({ id: "5", title: "TCPS1", level: "جذع مشترك خدماتي", 'students': [] });
                $rootScope.classrooms_view.push({ id: "6", title: "TCSH7", level: "جذع مشترك خدماتي", 'students': [] });

                $rootScope.classrooms_view.forEach(function (classroom) {
                    $rootScope.students_count_global += classroom.students.length;
                }, this);

                $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                $window.localStorage['hdr.students_count_global'] = angular.toJson($rootScope.students_count_global);
            }
        };


        $scope.showActionSheet = function (classroom) {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: '<div class="list"><a class="item hdr-to-right" href="#">حضر الجميع</a></div>' },/* 
                    { text: '<div class="list"><a class="item hdr-to-right" href="#">حضر الجميع إلا</a></div>' },
 */                    { text: '<div class="list"><a class="item hdr-to-right" href="#">تغيب الجميع</a></div>' },
                    /*                     { text: '<div class="list"><a class="item hdr-to-right" href="#">تغيب الجميع إلا</a></div>' }, */
                ],
                titleText: '<div><div class="hdr-to-right positive hdr-main-text">' + classroom.title + ' : القسم </div><div class="hdr-to-right hdr-sub-text">: تحديد المتغيبين بطريقة مختصرة حسب الحالات التالية </div></div>',
                buttonClicked: function (index) {
                    $scope.startAttendanceCall(classroom, index);
                    return true;
                }
            });


        };
    });