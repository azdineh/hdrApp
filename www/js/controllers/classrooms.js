angular.module('hdrApp').controller('ClassroomsController', function ($scope, $rootScope, hdrFileSystem, $filter, $window, $state, $ionicLoading, hdrdbx) {

    $scope.page = "Classrooms";
    $rootScope.classrooms = $window.localStorage['hdr.classrooms'] ? angular.fromJson($window.localStorage['hdr.classrooms']) : [];
    $scope.levels = $window.localStorage['hdr.levels'] ? angular.fromJson($window.localStorage['hdr.levels']) : [];
    $scope.show = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner><br/><span dir="rtl">استخراج البيانات...</span>'
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };
    $scope.clear = function () {
        if ($rootScope.classrooms.length > 0) {
            $window.localStorage.removeItem("hdr.classrooms");
            $window.localStorage.removeItem("hdr.levels");
            $rootScope.classrooms = [];
            $scope.levels = [];
            $state.go("tab.classrooms", {}, { reload: true });
            //$window.location.reload(true)
        }
    };
    $scope.importSimulatedClassrooms = function () {
        $scope.clear();
        ionic.Platform.ready(function () {
            $scope.show();
            var hfs = new hdrFileSystem();
            window.resolveLocalFileSystemURL("file:///android_asset/www/hodoor-classrooms-simulation", function (directoryentry) {
                hfs.readHdrFiles(directoryentry).then(function (arrayofclassrooms) {
                    $rootScope.classrooms = arrayofclassrooms;
                    var arrlevel = [];
                    var i = 0;
                    angular.forEach($rootScope.classrooms, function (classroom) {
                        var level = classroom.mostawa;
                        if (arrlevel.indexOf(level) === -1) {
                            arrlevel.push(level);
                        }
                        i++;
                        if (i === ($rootScope.classrooms.length - 1)) {
                            for (var j = 0; j < arrlevel.length; j++) {
                                $scope.levels.push({
                                    name: arrlevel[j]
                                });
                            };
                            $window.localStorage['hdr.classrooms'] = angular.toJson($rootScope.classrooms);
                            $window.localStorage['hdr.levels'] = angular.toJson($scope.levels);
                        }
                    });
                    $scope.hide();
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
                                $scope.hide();
                            });


                            /*                             $rootScope.classrooms = arrayofclassrooms;
                                                        var arrlevel = [];
                                                        var i = 0;
                                                        angular.forEach($rootScope.classrooms, function (classroom) {
                                                            var level = classroom.mostawa;
                                                            if (arrlevel.indexOf(level) === -1) {
                                                                arrlevel.push(level);
                                                            }
                                                            i++;
                                                            if (i === ($rootScope.classrooms.length - 1)) {
                                                                for (var j = 0; j < arrlevel.length; j++) {
                                                                    $scope.levels.push({
                                                                        name: arrlevel[j]
                                                                    });
                                                                };
                                                                $window.localStorage['hdr.classrooms'] = angular.toJson($rootScope.classrooms);
                                                                $window.localStorage['hdr.levels'] = angular.toJson($scope.levels);
                                                            }
                                                        }); */

                            //$scope.hide();
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
            $rootScope.classrooms = [{
                "issm": 'TCS1',
                mostawa: 'sciences eco 2',
                talaamiid: [{
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'Omar'
                }, {
                    issmKamel: 'Omar'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zakaria'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'Zakaria'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }]
            }, {
                "issm": 'TCS2',
                mostawa: 'Tronc communs littéraire',
                talaamiid: [{
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'Omar'
                }, {
                    issmKamel: 'Omar'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zakaria'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'Zakaria'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }]
            }, {
                "issm": 'TCLSH7',
                mostawa: 'Tronc communs littéraire',
                talaamiid: [{
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'Omar'
                }, {
                    issmKamel: 'Omar'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zakaria'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'Zakaria'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }]
            }, {
                "issm": 'TCS3',
                mostawa: 'Tronc communs scientifiques',
                talaamiid: [{
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'Omar'
                }, {
                    issmKamel: 'Omar'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zakaria'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'Latifa'
                }, {
                    issmKamel: 'Zakaria'
                }, {
                    issmKamel: 'Zindine'
                }, {
                    issmKamel: 'kamal'
                }, {
                    issmKamel: 'Zindine'
                }]
            },];
            angular.forEach($rootScope.classrooms, function (classroom) {
                var level = {};
                level.name = classroom.mostawa;
                if ($scope.levels.indexOf(level) === -1) {
                    $scope.levels.push(level);
                }
            });
            $window.localStorage['hdr.classrooms'] = angular.toJson($rootScope.classrooms);
            $window.localStorage['hdr.levels'] = angular.toJson($scope.levels);
        }
    };
});