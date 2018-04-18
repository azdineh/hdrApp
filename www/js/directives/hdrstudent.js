angular.module('hdrApp')
	.directive('hdrStudent', function (hdrdbx, $timeout, $state) {
		return {
			restrict: 'E',
			templateUrl: "js/directives/hdrstudent.html",
			controller: function ($scope, $element, $attrs) {

				$scope.showtitle=true;

				if (ionic.Platform.isWebView()) {
					hdrdbx.selectStudentAbsences($scope.student.massar_number)
						.then(function (arr) {
							$timeout(function () {
								$scope.student_absences = arr;
							}, 475)
						}, function (err) {
							console.log('Error while getting student absences');
							console.log(err);
						});

				} else {

					$scope.student_absences = [
						{ is_student_fix_problem: 0 },
						{ is_student_fix_problem: 1 },
						{ is_student_fix_problem: 0 }
					];

				}
				$scope.goToStudentView = function (student, classroom) {
					$state.go('tab.student', { 'student': student, 'classroom': classroom });
				}
			},
			link: function (scope, element, attrs) {


				scope.$watch("sessionalterchange", function (newValue, oldValue) {
					//This gets called when data changes.
					if (ionic.Platform.isWebView()) {
						hdrdbx.selectStudentAbsences(scope.student.massar_number)
							.then(function (arr) {
								$timeout(function () {
									scope.student_absences = arr;
								}, 475)
							}, function (err) {
								console.log('Error while getting student absences');
								console.log(err);
							});

					} else {

						scope.student_absences = [
							{ is_student_fix_problem: 0 },
							{ is_student_fix_problem: 1 },
							{ is_student_fix_problem: 0 }
						];

					}
				});
			}
		};
	})