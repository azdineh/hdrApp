angular.module('hdrApp')
	.controller('AppealController', function ($scope, $window, $stateParams, $rootScope, $filter, $ionicPopup,
		$ionicSlideBoxDelegate, hdrdbx, $timeout, $state) {

		//$rootScope.today already defined in home controller
		//$scope.classroom_title = $stateParams.classroom_title;
		$scope.classroom = $filter('filter')($rootScope.classrooms_view, $stateParams.classroom_title)[0];
		

		$scope.choiceIndexOfFastCase = $stateParams.index;

		$scope.numOfSlides = 0;
		$scope.catchedSessions = [];
		$scope.absentStudents = [];
		/** @param this param is for be allimented in dr-student-card-appeal directive*/
		$scope.hdriterator = "all";
		$scope.pagename = $scope.choiceIndexOfFastCase == '-1' ? "نداء القسم" : "تحديد تغيبات القسم";

		$scope.studentsDistribuedBy5InArray = [];

		$scope.helpPopupShown = $window.localStorage['hdr.helpPopupShown'] ? angular.fromJson($window.localStorage['hdr.helpPopupShown']) : 0;

		/**
		* @description return session title array like 14-15, 15-16
		* it catch the session according to the current system time.
		* @return array session title [3-4 , 2-4] or [8-9,8-10]
		*/
		$scope.catchSessions = function () {
			var session = [];
			// see http://momentjs.com/docs/
			//var h = moment().hour();
			var h = $filter('date')(Date.now(), 'H');
			var h1 = h - (-1);
			session.push(h + "-" + h1);
			if (h % 2 !== 0) {
				h = h - 1;
			}
			var h2 = h - (-2);
			session.push(h + "-" + h2);

			return session;
		};
		$scope.catchedSessions = $scope.catchSessions();

		$scope.groups = ["all", "odd", "even"];
		$scope.currentGroup = "all";

		$scope.nextGroup = function () {
			var currentIndex = $scope.groups.indexOf($scope.currentGroup);

			if (currentIndex == $scope.groups.length - 1) {
				$scope.currentGroup = $scope.groups[0];
			} else {
				$scope.currentGroup = $scope.groups[currentIndex + 1];
			}

			switch ($scope.currentGroup) {
				case 'all':
					var arr = $scope.classroom.students;
					$scope.numOfSlides = Math.ceil(arr.length / 5);
					$scope.distributeStudentsBy5(arr); break;

				case 'even':
					var arr = $scope.classroom.students.filter($scope.even);
					$scope.numOfSlides = Math.ceil(arr.length / 5);
					$scope.distributeStudentsBy5(arr); break;

				case 'odd':
					var arr = $scope.classroom.students.filter($scope.odd);
					$scope.numOfSlides = Math.ceil(arr.length / 5);
					$scope.distributeStudentsBy5(arr); break;
			}


			$scope.absentStudents = [];
			$ionicSlideBoxDelegate.update();
			$timeout(function () {
				$ionicSlideBoxDelegate.update();
				$ionicSlideBoxDelegate.slide($scope.numOfSlides - 1, 225);
			}, 250)
		};

		$scope.even = function (input, index) { return (index + 1) % 2 === 0 };
		$scope.odd = function (input, index) { return (index + 1) % 2 === 1 };


		$scope.distributeStudentsBy5 = function (sourcearray) {
			//var arr=sourcearray.reverse();
			$scope.studentsDistribuedBy5InArray = [];
			for (var i = 0; i < $scope.numOfSlides; i++) {

				var subArray = sourcearray.slice(i * 5, (i * 5) + 5);
				$scope.studentsDistribuedBy5InArray.unshift(subArray);

			}
		};


		if (ionic.Platform.isWebView()) {
			ionic.Platform.ready(function () {
				hdrdbx.getStudentsAbsencesCount($scope.classroom.title)
				.then(function(arr){
					console.log(arr);
					for (var i = 0; i < arr.length; i++) {
						$scope.classroom.students[arr[i].queuing_number-1].times=new Array(arr[i].absences_count);
					}
		
					
				},function(err){
					console.log(err);
				});
				$scope.numOfSlides = Math.ceil($scope.classroom.students.length / 5);
				$scope.distributeStudentsBy5($scope.classroom.students);
			});

		} else {
			$scope.classroom.students = [];
			$scope.classroom.students.push({ id: '1', full_name: 'كريم فيلالي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/01/2000", queuing_number: '1' });
			$scope.classroom.students.push({ id: '2', full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/02/2000", queuing_number: '2' });
			$scope.classroom.students.push({ id: '3', full_name: 'عزيز ملوكي', registration_number: '159986', massar_number: "S12345687", birth_date: "04/08/1986", queuing_number: '3' });
			$scope.classroom.students.push({ id: '4', full_name: 'سناء عكرود', registration_number: '159986', massar_number: "S12345687", birth_date: "12/04/2000", queuing_number: '4' });
			$scope.classroom.students.push({ id: '5', full_name: 'لحبيب نظيف', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '5' });
			$scope.classroom.students.push({ id: '6', full_name: 'كبور سميرس', registration_number: '159986', massar_number: "S12345687", birth_date: "12/06/2000", queuing_number: '6' });
			$scope.classroom.students.push({ id: '7', full_name: 'بوكيمون لزعر', registration_number: '159986', massar_number: "S12345687", birth_date: "12/07/2000", queuing_number: '7' });
			$scope.classroom.students.push({ id: '8', full_name: 'عبدو فريد', registration_number: '159986', massar_number: "S12345687", birth_date: "12/08/2000", queuing_number: '8' });
			$scope.classroom.students.push({ id: '9', full_name: 'يسرى منال', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '9' });
			$scope.classroom.students.push({ id: '10', full_name: 'خولة لحمر', registration_number: '159986', massar_number: "S12345687", birth_date: "15/10/1998", queuing_number: '10' });
			$scope.classroom.students.push({ id: '11', full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/02/2000", queuing_number: '11' });
			$scope.classroom.students.push({ id: '12', full_name: 'عزيز ملوكي', registration_number: '159986', massar_number: "S12345687", birth_date: "04/08/1986", queuing_number: '12' });
			$scope.classroom.students.push({ id: '13', full_name: 'سناء عكرود', registration_number: '159986', massar_number: "S12345687", birth_date: "12/04/2000", queuing_number: '13' });
			$scope.classroom.students.push({ id: '14', full_name: 'لحبيب نظيف', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '14' });
			$scope.classroom.students.push({ id: '15', full_name: 'كبور سميرس', registration_number: '159986', massar_number: "S12345687", birth_date: "12/06/2000", queuing_number: '15' });
			$scope.classroom.students.push({ id: '16', full_name: 'بوكيمون لزعر', registration_number: '159986', massar_number: "S12345687", birth_date: "12/07/2000", queuing_number: '16' });
			$scope.classroom.students.push({ id: '17', full_name: 'عبدو فريد', registration_number: '159986', massar_number: "S12345687", birth_date: "12/08/2000", queuing_number: '17' });
			$scope.classroom.students.push({ id: '18', full_name: 'يسرى منال', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '18' });
			/*$scope.students.push({ id: '19', full_name: 'خولة لحمر', registration_number: '159986', massar_number: "S12345687", birth_date: "15/10/1998", queuing_number: '19' });
			$scope.students.push({ id: '20', full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/02/2000", queuing_number: '20' });
			$scope.students.push({ id: '21', full_name: 'عزيز ملوكي', registration_number: '159986', massar_number: "S12345687", birth_date: "04/08/1986", queuing_number: '21' });
			$scope.students.push({ id: '22', full_name: 'سناء عكرود', registration_number: '159986', massar_number: "S12345687", birth_date: "12/04/2000", queuing_number: '22' });
			$scope.students.push({ id: '23', full_name: 'لحبيب نظيف', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '23' });
			$scope.students.push({ id: '24', full_name: 'كبور سميرس', registration_number: '159986', massar_number: "S12345687", birth_date: "12/06/2000", queuing_number: '24' });
			$scope.students.push({ id: '25', full_name: 'بوكيمون لزعر', registration_number: '159986', massar_number: "S12345687", birth_date: "12/07/2000", queuing_number: '25' });
			$scope.students.push({ id: '26', full_name: 'عبدو فريد', registration_number: '159986', massar_number: "S12345687", birth_date: "12/08/2000", queuing_number: '26' });
			$scope.students.push({ id: '27', full_name: 'يسرى منال', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '27' });
			$scope.students.push({ id: '28', full_name: 'خولة لحمر', registration_number: '159986', massar_number: "S12345687", birth_date: "15/10/1998", queuing_number: '28' });
			$scope.students.push({ id: '29', full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/02/2000", queuing_number: '29' });
			$scope.students.push({ id: '30', full_name: 'عزيز ملوكي', registration_number: '159986', massar_number: "S12345687", birth_date: "04/08/1986", queuing_number: '30' });
			$scope.students.push({ id: '31', full_name: 'سناء عكرود', registration_number: '159986', massar_number: "S12345687", birth_date: "12/04/2000", queuing_number: '31' });
			$scope.students.push({ id: '32', full_name: 'لحبيب نظيف', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '32' });
			$scope.students.push({ id: '33', full_name: 'كبور سميرس', registration_number: '159986', massar_number: "S12345687", birth_date: "12/06/2000", queuing_number: '33' });
			$scope.students.push({ id: '34', full_name: 'بوكيمون لزعر', registration_number: '159986', massar_number: "S12345687", birth_date: "12/07/2000", queuing_number: '34' });
			$scope.students.push({ id: '35', full_name: 'عبدو فريد', registration_number: '159986', massar_number: "S12345687", birth_date: "12/08/2000", queuing_number: '35' });
			$scope.students.push({ id: '36', full_name: 'يسرى منال', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '36' });
			$scope.students.push({ id: '37', full_name: 'خولة لحمر', registration_number: '159986', massar_number: "S12345687", birth_date: "15/10/1998", queuing_number: '37' });
			$scope.students.push({ id: '38', full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/02/2000", queuing_number: '38' });
			$scope.students.push({ id: '39', full_name: 'عزيز ملوكي', registration_number: '159986', massar_number: "S12345687", birth_date: "04/08/1986", queuing_number: '39' });
			$scope.students.push({ id: '40', full_name: 'سناء عكرود', registration_number: '159986', massar_number: "S12345687", birth_date: "12/04/2000", queuing_number: '40' });
			$scope.students.push({ id: '41', full_name: 'لحبيب نظيف', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '41' });
			$scope.students.push({ id: '42', full_name: 'لحبيب نظيف', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '42' });
			$scope.students.push({ id: '43', full_name: 'لحبيب نظيف', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '43' }); */

			$scope.numOfSlides = Math.ceil($scope.classroom.students.length / 5);
			//fill $scope.studentsDistribuedBy5InArray
			$scope.distributeStudentsBy5($scope.classroom.students);

		}


		$scope.showPopup = function (index) {
			$scope.data = {
				choice: $scope.catchedSessions[0]
			};

			// An elaborate, custom popup
			var appealPopup = $ionicPopup.show({
				templateUrl: "views/classrooms/appeal/absentstudentsview.html",
				title: 'التلاميذ المتغيبون : ' + $scope.classroom.title,
				/* subTitle: $rootScope.today, */
				subTitle: $filter('date')($rootScope.today, 'fullDate'),
				scope: $scope,
				buttons: [
					{
						text: 'رجوع',
						type: 'button',
						onTap: function (e) {
							if (index == -1) {
							}
							else {
								$state.go('tab.classrooms');
							}
							//e.preventDefault();
						}
					},
					{
						text: 'حفظ',
						type: 'button-assertive',
						onTap: function (e) {
							//console.log($scope.data.choice);

							if (index == 1) {
								$scope.absentStudents = $scope.classroom.students;
							}

							$scope.saveSession(function () {
								$state.go('tab.classrooms');
							});
							//e.preventDefault();
						}
					}
				]
			});
		};

		$scope.showHelpPopup = function () {
			var helpPopup = $ionicPopup.show({
				templateUrl: "views/classrooms/appeal/helpappealview.html",
				title: '<h3 class="title assertive-bg padding light" >دليل الإستخدام</h3>',
				subTitle: '',
				scope: $scope,
				buttons: [
					{
						text: 'رجوع للنداء',
						type: 'button',
						onTap: function (e) {
							//e.preventDefault();
						}
					}
				]
			});
		};

		$scope.$on('$ionicView.afterEnter', function () {



			if ($scope.choiceIndexOfFastCase == '-1') {

				$ionicSlideBoxDelegate.slide($scope.numOfSlides - 1, 30);
				if ($scope.helpPopupShown <= 1) {
					$timeout(function () {
						$scope.showHelpPopup();
					}, 750);
					$scope.helpPopupShown += 1;
					$window.localStorage['hdr.helpPopupShown'] = angular.toJson($scope.helpPopupShown);
				}

			}
			else {
				$scope.showPopup($scope.choiceIndexOfFastCase);
			}

		});

		$scope.slideHasChanged = function (index) {
			if (index == $scope.numOfSlides - 1) {
				$scope.isLastSlide = true;
				$scope.isFirstSlide = false;

			}
			else if (index == 0) {
				$scope.isLastSlide = false;
				$scope.isFirstSlide = true;
			}
			else {
				$scope.isLastSlide = false;
				$scope.isFirstSlide = false;

			}
		};

		$scope.goDetailSlide = function (last) {
			$ionicSlideBoxDelegate.slide(last);
		};


		$scope.saveSession = function (callback) {
			var session = {
				id: null,
				id_classroom: $scope.classroom.id,
				classroom_title: $scope.classroom.title,
				id_teacher: $rootScope.teacher.id,
				unix_time: Date.now(),
				title: $scope.data.choice,
				students_count: $scope.classroom.students.length,
				parity: $scope.currentGroup,
				isExamSession: 0,
				observation: ""

			}

			session.isExamSession = $scope.data.isExamSession == true ? 1 : 0;

			console.log("Current parity: " + session.parity);

			if ($scope.absentStudents.length == 0) {
				session.observation = "لم يتغيب أحد.";
			}
			if ($scope.absentStudents.length == $scope.classroom.students.length) {
				session.observation = "غياب جماعي.";
			}

			if (session.isExamSession == 1) {
				session.observation += "~" + "حصة اختبار.";
			}



			hdrdbx.saveAbsentStudents(session, $scope.absentStudents)
				.then(function (count) {
					console.log('save ' + count + ' absent students is done');
					//$scope.absentStudents = [];
					//$scope.data.isExamSession = false;
					alert("تم تسجيل الحصة بنجاح.");
					callback();
				}, function (err) {
					console.log(err);
				});
		}



	});