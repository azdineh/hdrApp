angular.module('hdrApp').controller('ClassroomsController',
    function ($scope, $rootScope, hdrFileSystem, $filter, $window, $state, $ionicLoading, hdrdbx, $ionicActionSheet) {

        $scope.page = "Classrooms";
        $scope.classrooms_view = $window.localStorage['hdr.classrooms_view'] ? angular.fromJson($window.localStorage['hdr.classrooms_view']) : [];
        $rootScope.students_count_global = 0;

        /**
         * go to the appel page with the classroom and choice index of rappid call
         */
        $scope.startAttendanceCall = function (classroom, index) {
            $state.go("tab.appeal", { 'classroom': classroom, 'index': index }, { reload: true });
        }

        $scope.show = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines"></ion-spinner><br/><span dir="rtl">استخراج البيانات...</span>'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };
        $scope.clear = function () {
            if ($scope.classrooms_view > 0) {
                $window.localStorage.removeItem("hdr.classrooms_view");
                $state.go("tab.classrooms", {}, { reload: true });
                //$window.location.reload(true)
            }
        };

        $scope.goToStudentsView = function (classroom) {
            $state.go('tab.classroom', { 'classroom': classroom });
        }
        $scope.importSimulatedClassrooms = function () {
            $scope.clear();
            ionic.Platform.ready(function () {
                $scope.show();
                var hfs = new hdrFileSystem();
                window.resolveLocalFileSystemURL("file:///android_asset/www/hodoor-classrooms-simulation", function (directoryentry) {
                    hfs.readHdrFiles(directoryentry).then(function (akssam) {
                        hdrdbx.fillDB(akssam, 0, function () {

                            hdrdbx.selectClassroomsView()
                                .then(function (classrooms_view) {
                                    $scope.classrooms_view = classrooms_view;
                                    $window.localStorage['hdr.classrooms_view'] = $scope.classrooms_view;
                                }, function (err) {
                                    console.log(err);
                                })

                            $scope.hide();
                        });

                    }, function (error) {
                        alert(error);
                        $scope.hide();
                    });
                }, function (error) {
                    alert("problem with resolve local files system");
                });

            });
        };
        $scope.importClassrooms = function () {
            $scope.clear();
            if (ionic.Platform.isWebView()) {
                ionic.Platform.ready(function () {
                    var hfs = new hdrFileSystem();
                    hfs.getFileSystem('0').then(function (fs) {
                        hfs.isHdrDirectoryExist(fs).then(function (directory) {
                            //alert(" The " + directory.name + " is found in internal storage , now checking out the Masar files..");
                            $scope.show();
                            hfs.readHdrFiles(directory).then(function (akssam) {
                                hdrdbx.fillDB(akssam, 0, function () {

                                    hdrdbx.selectClassroomsView()
                                        .then(function (classrooms_view) {
                                            $scope.classrooms_view = classrooms_view;
                                            $scope.classrooms_view.forEach(function (classroom) {
                                                $rootScope.students_count_global += classroom.students_count;
                                            }, this);
                                            $window.localStorage['hdr.classrooms_view'] = angular.toJson($scope.classrooms_view);
                                        }, function (err) {
                                            console.log(err);
                                        })

                                    $scope.hide();
                                });
                            }, function (error) {
                                alert(error);
                                $scope.hide();
                            });
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
                $scope.classrooms_view.push({ id: "1", title: "TCS4", level: "جذع مشترك علمي", students_count: 37 });
                $scope.classrooms_view.push({ id: "2", title: "TCLSH2", level: "جذع مشترك أداب و علوم إنسانية", students_count: 45 });
                $scope.classrooms_view.push({ id: "3", title: "1BacSM4", level: "أولى باك علوم رياضية", students_count: 25 });
                $scope.classrooms_view.push({ id: "4", title: "2BacSP3", level: "ثانية علوم فيزيائية", students_count: 30 });
                $scope.classrooms_view.push({ id: "5", title: "TCPS1", level: "جذع مشترك خدماتي", students_count: 40 });
                $scope.classrooms_view.push({ id: "6", title: "TCSH7", level: "جذع مشترك خدماتي", students_count: 45 });

                $scope.classrooms_view.forEach(function (classroom) {
                    $rootScope.students_count_global += classroom.students_count;
                }, this);

                $window.localStorage['hdr.classrooms_view'] =angular.toJson($scope.classrooms_view);
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