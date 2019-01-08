angular.module('hdrApp')
    .controller('StudentController', function ($scope, $stateParams, $timeout, $filter, hdrdbx) {

        $scope.student = $stateParams.student;
        $scope.classroom = $stateParams.classroom;
        $scope.student_absences = [];

        $scope.$on('$ionicView.enter', function () {
            if (ionic.Platform.isWebView()) {

                hdrdbx.selectStudentAbsences($scope.student.massar_number)
                    .then(function (arr) {
                        $timeout(function () {
                            $scope.student_absences = arr;
                        }, 100)
                    }, function (err) {
                        console.log('Error while getting student absences');
                        console.log(err);
                    });
            }
            else {
                $timeout(function(){
                    $scope.student.massar_number="S9865452151";
                    $scope.student.birth_date="04/06/2003";
                    $scope.student.full_name="فاطمة الزهراء العمراوي";
                    $scope.classroom.title="TCLSH-1";

                    $scope.student_absences = [
                        { id: '1', unix_time: '1520027361941', title: "10-11" },
                        { id: '1', unix_time: '1520027361941', title: "10-11" },
                        { id: '1', unix_time: '1520027361941', title: "10-11" }
                    ];
                },100)
            }
        })



    });