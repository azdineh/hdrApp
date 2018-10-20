angular.module('hdrApp')
	.controller('SessionalterController', function ($scope, $rootScope, $state, $stateParams, $ionicPopup, hdrdbx) {

		$scope.initialobservation = "";
		$scope.session_view = $stateParams.session_view;

		$scope.test009 = function () {
			//alert('dfdfdf');
			$scope.showUpdateSessionConfirm();
		}

		if (ionic.Platform.isWebView()) {

			$scope.$on('$ionicView.enter', function () {

				/* if (!$scope.session_view) {

					$scope.session_view = $stateParams.session_view;
				} */

				$scope.session_view.session.observation = $scope.session_view.session.observation.replace(/<br>/g, "\r");
				$scope.sessionalterchange = 0;
			});

			/* 			$scope.initialobservation = $scope.session_view.session.observation;
			
			
						$scope.hidden = true;
						$scope.$watch('session_view.session.observation', function (newVal, oldval) {
							if (newVal == $scope.initialobservation) {
								$scope.hidden = true;
							}
							else {
								$scope.hidden = false;
							}
						}); */

			$scope.saveObservation = function (session, observation) {
				var obsToDB = observation.replace(/\r/g, "\n");
				hdrdbx.saveObservations(session.id, obsToDB)
					.then(function (res) {
						$scope.saved = true;
					}, function (err) {

					})
			}

			$scope.updateSession = function (session_id) {
				var newTitle = $scope.hEnd + "-" + $scope.hStart;
				hdrdbx.updateSessionTitle(session_id, newTitle);
			}






			$scope.showConfirmForRemoveStudent = function (id) {
				document.getElementById('hdr-session-alter-confirm' + id).classList.remove("ng-hide");
			}
			$scope.hideConfirmForRemoveStudent = function (id) {
				document.getElementById('hdr-session-alter-confirm' + id).classList.add("ng-hide");
			}

			$scope.removeStudent = function (student, session_id) {

				hdrdbx.removeStudentFromAbsenceLine(student.massar_number, session_id)
					.then(function (count) {
						document.getElementById('hdr-session-alter-student' + student.massar_number).classList.add("ng-hide");
						document.getElementById('hdr-session-alter-confirm' + student.massar_number).classList.add("ng-hide");
						var index0 = $scope.session_view.students.indexOf(student);
						var newarr = [];
						$scope.session_view.students.forEach(function (student, index) {
							if (index != index0) {
								newarr.push(student);
							}
							$scope.session_view.students = newarr;
						}, this);
					}, function (err) {

					});
			}

			/* 			$scope.$on('$ionicView.leave', function () {
							$stateParams.session_view = $scope.session_view;
						}); */

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
			students.push({ id: "1", full_name: 'جباري هبة الحكيم', registration_number: '159986', massar_number: "S1234200", birth_date: "12/01/2000", queuing_number: '1' });
			students.push({ id: "2", full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345977", birth_date: "12/02/2000", queuing_number: '2' });
			students.push({ id: "5", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S123ZI687", birth_date: "12/05/2000", queuing_number: '5' });

			$scope.session_view = {};
			$scope.session_view.classroom_title = "TCS-8";
			$scope.session_view.students = students;

			var session = {};
			session.title = "11-10";
			session.parity = "odd";
			session.unix_time = "15478421547";

			$scope.session_view.session = session;
		}


		$scope.showHelp = function () {
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


		$scope.showUpdateSessionConfirm = function () {

			//session_view.session.title
			var str = new String($scope.session_view.session.title);
			var tiretIndex = str.indexOf('-');
			$scope.hStart = parseInt(str.substring(tiretIndex + 1, str.length));
			$scope.hEnd = parseInt(str.substring(0, tiretIndex));

			var confirmPopup = $ionicPopup.confirm({
				title: 'تعديل الفترة الزمنية',
				templateUrl: "views/sessionshistory/sessionalter/updatesession.html",
				scope: $scope,
				cancelText: 'إلغاء الأمر',
				okText: 'تعديل'
			});

			confirmPopup.then(function (res) {
				if (res) {
					console.log('You are sure');
					$scope.session_view.session.title = $scope.hEnd + "-" + $scope.hStart;
					if(ionic.Platform.isWebView()){

						$scope.updateSession($scope.session_view.session.id)
					}

				} else {
					console.log('You are not sure');
				}
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