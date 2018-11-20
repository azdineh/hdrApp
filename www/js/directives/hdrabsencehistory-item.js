angular.module('hdrApp')
	.directive('hdrabsencehistoryitem', function ($ionicScrollDelegate) {
		return {
			restrict: 'E',
			templateUrl: "js/directives/hdrabsencehistory-item.html",
			controller: function ($scope, $element, $attrs) {

				$scope.limitstudent = 9;


				$scope.moreStudent = function () {
					$scope.limitstudent += 5;
					$ionicScrollDelegate.resize();
				}


/* 				if (ionic.Platform.isWebView()) {

					//$scope.exception_students = [];

					var a_history_absents_students = $scope.session_view.students;

					console.log("session_view.students");
					console.log($scope.session_view.students);

					var b_history_students_count = $scope.session_view.session.students_count;

					console.log("session_view student_count");
					console.log($scope.session_view.session.students_count);
					//var c_current_classroom_students = $filter('filter')($rootScope.classrooms_view, scope.session_view.classroom.title)[0].students;
					//var c_current_classroom_students = scope.c_current_classroom_students;

					if (a_history_absents_students.length == b_history_students_count) {
						$scope.session_view.self_observation = "غياب جماعي";
						//scope.exception_students = absoluateDiff(c_current_classroom_students, a_history_absents_students);
					}
					else if (a_history_absents_students.length == 0) {
						$scope.session_view.self_observation = "حضور كلي";
						//scope.exception_students = absoluateDiff(c_current_classroom_students, a_history_absents_students);
					}
					else {
						$scope.session_view.self_observation = "";
					}

					$scope.session_view.session.observation = $scope.session_view.self_observation + "\n" + $scope.session_view.session.observation;



				} */


			},
			link: function (scope, element, attrs) {

				/* var absoluateDiff = function (arr1, arr2) {
					var arr3 = [];

					if (arr1.length >= arr2.length) {
						arr2.forEach(function (element) {
							if (!isStudentExist(element, arr1)) {
								arr3.push(element);
							}
						}, this);

					}
					else {
						arr1.forEach(function (element) {
							if (!isStudentExist(element, arr2)) {
								arr3.push(element);
							}
						}, this);
					}


					return arr3;
				} */

				/* var isStudentExist = function (student, arr) {
					var flag = false;

					arr.forEach(function (element) {
						if (student.massar_number == element.massar_number) {
							flag = true;
						}
					}, this);

					return flag;
				} */

				//add self observation to observation field






			}
		};
	});