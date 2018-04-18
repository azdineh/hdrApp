angular.module('hdrApp')
    .controller('SearchController', function ($scope, $rootScope, hdrdbx, $ionicScrollDelegate, $window, $filter) {


        $scope.$on('$ionicView.enter', function () {

            /*           $rootScope.classrooms_view = $rootScope.classrooms_view ? $rootScope.classrooms_view :
                      $window.localStorage['hdr.classrooms_view'] ? angular.fromJson($window.localStorage['hdr.classrooms_view']) : []; */



            hdrdbx.getStudentsAbsencesCount("")
                .then(function (arr) {
                    $scope.students_view = arr;
                    for (var i = 0; i < arr.length; i++) {
                        $scope.students_view = arr;
                    }
                }, function (err) {
                    console.log(err)
                })

        })

        $scope.foundStudents = [];
        $scope.searchIt = function (textToSearch) {
            if (textToSearch.length > 2)
                $scope.foundStudents = $filter('filter')($scope.students_view, { full_name: textToSearch });
            else
                $scope.foundStudents = [];
        }

        $scope.students_view = [];
        /*  $scope.students_view = [{ 'title': 'TCS88', 'full_name': 'Ahmed Ezzat', 'queuing_number': '17 ' }]; */

        $scope.textToSearch = "";

        $scope.clearText = function () {
            document.getElementById('hdr-search-text').value = '';
            $scope.textToSearch = "";
        }

        $scope.$watch('textToSearch', function (newvalue, oldvalue) {
            $ionicScrollDelegate.scrollTop();
        });


    });