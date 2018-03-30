angular.module('hdrApp')
	.controller('SessionalterController', function ($scope, $rootScope, $state, $stateParams, $ionicPopup, hdrdbx) {

		$scope.initialobservation = "";

		if (ionic.Platform.isWebView()) {

			$scope.session_view = $stateParams.session_view;


			/* 			hdrdbx.selectStudentAbsencesIn($scope.session_view.students)
							.then(function (arr) {
								arr.forEach(function (element, index) {
									$scope.session_view.students[index].times = new Array(element.absences_count);
								}, this);
								$scope.session_view.session.observation = $scope.session_view.session.observation.replace(/<br>/g, "\r");
								$scope.initialobservation = $scope.session_view.session.observation;
							}, function (err) {
								console.log(err)
							}); */

			/* 		hdrdbx.selectStudentAbsences($scope.student.massar_number)
						.then(function (arr) {
							$timeout(function () {
								$scope.student_absences = arr;
							}, 100)
						}, function (err) {
							console.log('Error while getting student absences');
							console.log(err);
						}); */





			$scope.hidden = true;
			$scope.$watch('session_view.session.observation', function (newVal, oldval) {
				if (newVal == $scope.initialobservation || newVal == "") {
					$scope.hidden = true;
				}
				else {
					$scope.hidden = false;
				}
			});

			$scope.saveObservation = function (session, observation) {
				var obsToDB = observation.replace(/\r/g, "\n");
				hdrdbx.saveObservations(session.id, obsToDB)
					.then(function (res) {
						$scope.saved = true;
					}, function (err) {

					})
			}

			$scope.showConfirmForRemoveStudent = function (id) {
				document.getElementById('hdr-session-alter-confirm' + id).classList.remove("ng-hide");
			}
			$scope.hideConfirmForRemoveStudent = function (id) {
				document.getElementById('hdr-session-alter-confirm' + id).classList.add("ng-hide");
			}

			$scope.removeStudent = function (id, session_id) {

				hdrdbx.removeStudentFromAbsenceLine(id, session_id)
					.then(function (count) {
						document.getElementById('hdr-session-alter-student' + id).classList.add("ng-hide");
						document.getElementById('hdr-session-alter-confirm' + id).classList.add("ng-hide");
					}, function (err) {

					});
			}
			$scope.sessionalterchange = 0;
			$scope.changeStudentFixProblem = function (student, session_id) {
				hdrdbx.changeStudentFixProblem(student, session_id)
					.then(function (count) {
						$scope.sessionalterchange += 1;
					}, function (err) {

					});
			}
		}
		else {

			var students = [];
			students.push({ id: "1", full_name: 'كريم فيلالي', registration_number: '159986', massar_number: "S1234200", birth_date: "12/01/2000", queuing_number: '1' });
			students.push({ id: "2", full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345977", birth_date: "12/02/2000", queuing_number: '2' });
			students.push({ id: "5", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S123ZI687", birth_date: "12/05/2000", queuing_number: '5' });

			$scope.session_view = {};
			$scope.session_view.classroom_title = "TCS-8";
			$scope.session_view.students = students;

			var session = {};
			session.title = "10-11";
			session.parity = "odd";
			session.unix_time = "15478421547";

			$scope.session_view.session = session;
		}


		$scope.showHelpPopup = function () {
			var helpPopup = $ionicPopup.show({
				templateUrl: "views/sessionshistory/sessionalter/helpsessionalterview.html",
				title: '<h3 class="title assertive-bg padding light" >مساعدة</h3>',
				subTitle: '',
				scope: $scope,
				buttons: [
					{
						text: 'رجوع ',
						type: 'button',
						onTap: function (e) {
							//e.preventDefault();
						}
					}
				]
			});
		};

		$scope.showConfirmForRemoveStudent = function (id) {
			document.getElementById('hdr-session-alter-confirm' + id).classList.remove("ng-hide");
		}
		$scope.hideConfirmForRemoveStudent = function (id) {
			document.getElementById('hdr-session-alter-confirm' + id).classList.add("ng-hide");
		}

		$scope.removeStudnet = function (id) {
			document.getElementById('hdr-session-alter-student' + id).classList.add("ng-hide");
			document.getElementById('hdr-session-alter-confirm' + id).classList.add("ng-hide");
		}


	});