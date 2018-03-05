angular.module('hdrApp')
    .controller('SearchController', function ($scope, $rootScope, $ionicScrollDelegate, $window, $filter, $state) {


        $scope.$on('$ionicView.enter', function () {
            $rootScope.classrooms_view = $rootScope.classrooms_view ? $rootScope.classrooms_view : 
            $window.localStorage['hdr.classrooms_view']? angular.fromJson($window.localStorage['hdr.classrooms_view']):[];
        })

        $scope.textToSearch = "";

        $scope.clearText = function () {
            document.getElementById('hdr-search-text').value = '';
            $scope.textToSearch = "";
        }

        $scope.$watch('textToSearch', function (newvalue, oldvalue) {
            $ionicScrollDelegate.scrollTop();
        });

        $scope.goToStudentView = function (student) {
            $state.go('tab.student', { 'student': student, 'classroom': $scope.classroom });
        }


    });