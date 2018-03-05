angular.module('hdrApp')
    .controller('TeacherController', function ($scope, $rootScope, $ionicViewService, $window, hdrdbx) {

        $scope.clearDb = function () {
            if (ionic.Platform.isWebView()) {
                hdrdbx.wipeDB();
                $scope.clearStorage();

            }
            else {
                $scope.clearStorage();
            }

        }

        $scope.clearStorage = function () {
            //hdrdbx.hdrdbtest();
            $window.localStorage.removeItem("hdr.classrooms_view");
            $window.localStorage.removeItem("hdr.students_count_global");
            $window.localStorage.removeItem("hdr.academy");
            $window.localStorage.removeItem("hdr.rd");
            $window.localStorage.removeItem("hdr.school");
            $window.localStorage.removeItem("hdr.teacher");
            $window.localStorage.removeItem("hdr.helpPopupShown");
            $rootScope.classrooms_view = [];
            $ionicViewService.clearHistory();

        }

    });