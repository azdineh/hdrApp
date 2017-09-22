angular.module('hdrApp')
	.controller('AppealController', function ($scope, $stateParams, $rootScope, $filter, $ionicPopup,
		$ionicSlideBoxDelegate, hdrdb) {
		$scope.classroom = $stateParams.classroomid;
		/**
		 * @param currentClassroomObj presents a classroom selectected from classrooms by
		 * filter (issm of classroom)
		 * the [0] is only for make sure that we have a single returned item.
		 */
		var currentClassroomObj = $filter('filter')($rootScope.classrooms, { "issm": $scope.classroom })[0];
		$scope.numOfStudents = currentClassroomObj.talaamiid.length;
		$scope.numOfSlides = Math.ceil($scope.numOfStudents / 4);

		$rootScope.today = moment().local('ar-ma').format('dddd Do MMMM YYYY');
		$scope.selectedSessionTitle = "none";

		/**
		 * @param this param is for be allimented in dr-student-card-appeal directive
		 */
		$scope.absentStudents = [];
		$scope.hdriterator = "all";

		for (var i = 1; i <= currentClassroomObj.talaamiid.length; i++) {
			currentClassroomObj.talaamiid[i - 1].number = i;
		}

		/**
		 * sperate odd ans even student by tow arrays
		 * @param {array} array [oddarray, evenarray]
		 */
		$scope.oddAndEvenStudents = function (array) {
			var oddsudents = [];
			var evenstudents = [];
			angular.forEach(array, function (student) {
				if ((student.number % 2) != 0) {
					oddsudents.push(student);
				}
				else {
					evenstudents.push(student);
				}
			});
			return [oddsudents, evenstudents];
		};

		$scope.studentsDistribuedBy4InArray = [];
		$scope.distributeStudentsBy4 = function (sourcearray) {
			for (var i = 0; i < $scope.numOfSlides; i++) {

				var subArray = sourcearray.slice(i * 4, (i * 4) + 4);
				$scope.studentsDistribuedBy4InArray.push(subArray);
			}
		};

		$scope.distributeStudentsBy4(currentClassroomObj.talaamiid);

		$scope.showPopup = function () {
			$scope.data = {
				choice: $scope.catchedSessions[0]
			};

			// An elaborate, custom popup
			var appealPopup = $ionicPopup.show({
				templateUrl: "views/classrooms/appeal/absentstudentsview.html",
				title: 'أرقام التلاميذ المتغيبين',
				subTitle: $rootScope.today,
				scope: $scope,
				buttons: [
					{
						text: 'رجوع',
						type: 'button',
						onTap: function (e) {
							hdrdb.dropTables();
							//e.preventDefault();
						}
					},
					{
						text: 'حفظ',
						type: 'button-positive',
						onTap: function (e) {
							console.log($scope.data.choice);
							if ($scope.absentStudents.length == 0) {
								var studentnull = {};
								studentnull.ra9mTasjiil = "0";
								studentnull.ra9mMasar = "0";
								studentnull.issmKamel = "studentnull";
								studentnull.tari5Izdiad = "01/01/2000";
								$scope.absentStudents.push(studentnull);
							}
							$scope.saveSession($scope.absentStudents);

							//e.preventDefault();
						}
					}
					// {
					//   text: '<b>Save</b>',
					//   type: 'button-positive',
					//   onTap: function(e) {

					//   }
					// }
				]
			});
		};

		$scope.slideHasChanged = function (index) {
			if (index == $scope.numOfSlides - 1)
				$scope.isLastSlide = true;
			else
				$scope.isLastSlide = false;
		};

		$scope.goDetailSlide = function (last) {
			$ionicSlideBoxDelegate.slide(last);
		};


        /**
         * @description return session title array like 14-15, 15-16
         * it catch the session according to the current system time.
         * @return array session title [3-4 , 2-4] or [8-9,8-10]
         */
		$scope.catchSessions = function () {
			var session = [];
			// see http://momentjs.com/docs/
			var h = moment().hour();
			var h1 = Math.abs(h + 1);
			session.push(h + "-" + h1);
			if (h % 2 !== 0) {
				h = h - 1;
			}
			var h2 = Math.abs(h + 2);
			session.push(h + "-" + h2);

			return session;
		};
		$scope.catchedSessions = $scope.catchSessions();

		$scope.removeTables = function () {
			hdrdb.dropTables();
		};

        /**
		 * 
         * @description save session in db, this use saveAbsence function inside
         */
		$scope.saveSession = function (absentStudents) {
			//save session
			//hdrdb.initDB();

			hdrdb.initTables()
				.then(function (res) {
					var session = hdrdb.createSession();
					session.title = $scope.data.choice;
					session.unix_time = moment().format('x');
					hdrdb.insertSession(session)
						.then(function (session) {

							$scope.saveAbsence(absentStudents, session);

						}, function (err) {

						});
					// save absence
				}, function (err) {
					console.log('Error while initializing tables');
				});

		};
        /**
         * @description a asynchronoused function that saves all absent students while a session.
         * @param  absentStudents is an array
         */
		$scope.saveAbsence = function (absentStudents, session) {
			// add absent students in table if not exit
			// add session if not exist
			// add new absence line
			for (var i = 0; i < absentStudents.length; i++) {
				var student = hdrdb.createStudent();
				student.fromXmlStudent(absentStudents[i]);
				hdrdb.insertStudent(student)
					.then(function (studentfromdb) {
						var absence = hdrdb.createAbsence();
						absence.id_student = studentfromdb.id;
						absence.id_session = session.id;
						hdrdb.insertAbsence(absence)
							.then(function (res) {
								console.log('save absence terminated successfully. ' + res);
							}, function (err) {
								console.log('Error while saving absence ' + err.code + " " + err.message);
							});
						$scope.absentStudents.shift();
						if (i == absentStudents.length - 1) {
							$state.go("tab.classrooms", {}, { reload: true });
							//$state.go($state.current, $stateParams, {reload: true, inherit: false});
						}


					}, function (err) {
						console.log(err);
					});
			}

		};

	});