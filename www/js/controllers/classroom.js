angular.module('hdrApp')
	.controller('ClassroomController', function ($scope, $rootScope, $window, $state, $stateParams, $timeout, hdrdbx) {
		$scope.classroom = $stateParams.classroom;
		$scope.students=[];
		$scope.fct = function (id) {

			var initial_bg = document.getElementById(id).style.backgroundColor;

			document.getElementById(id).style.backgroundColor = "lightgray";
			$timeout(function () {
				document.getElementById(id).style.backgroundColor = initial_bg;
			}, 150);
		}
		$scope.goToStudentView = function (student) {
			$scope.fct(student.id);
			$state.go('tab.student', { 'student': student, 'classroom': $scope.classroom });
		}


		if (ionic.Platform.isWebView()) {
			ionic.Platform.ready(function () {

				hdrdbx.selectRows('student', 'id_classroom=' + $scope.classroom.id)
					.then(function (students) {
						$scope.students = students;
					}, function (err) {
						console.log(err);
					});


			});
		}
		else {
			console.log(" controller  " + $scope.classroom.title);
			$scope.students.push({ id: "1", full_name: 'كريم فيلالي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/01/2000", queuing_number: '1' });
			$scope.students.push({ id: "2", full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/02/2000", queuing_number: '2' });
			$scope.students.push({ id: "3", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "04/08/1986", queuing_number: '3' });
			$scope.students.push({ id: "4", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "12/04/2000", queuing_number: '4' });
			$scope.students.push({ id: "5", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '5' });
			$scope.students.push({ id: "6", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "12/06/2000", queuing_number: '6' });
			$scope.students.push({ id: "7", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "12/07/2000", queuing_number: '7' });
			$scope.students.push({ id: "8", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "12/08/2000", queuing_number: '8' });
			$scope.students.push({ id: "9", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '9' });
			$scope.students.push({ id: "10", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "15/10/1998", queuing_number: '10' });
			$scope.students.push({ id: "11", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "12/11/2000", queuing_number: '11' });
			$scope.students.push({ id: "12", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "12/12/2000", queuing_number: '12' });

		}
	})