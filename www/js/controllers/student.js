angular.module('hdrApp')
    .controller('StudentController', function ($scope, $stateParams) {
        $scope.student = $stateParams.student;
        $scope.classroom = $stateParams.classroom;
        
        if (ionic.Platform.isWebView()) {

        }
        else {
            
        }
    });