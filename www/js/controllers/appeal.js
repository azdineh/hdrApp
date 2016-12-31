angular.module('hdrApp')
	.controller('AppealController', function ($scope, $stateParams, $rootScope, $filter, $ionicPopup, $ionicSlideBoxDelegate) {
		$scope.classroom = $stateParams.classroomid;
		var currentClassroomObj = $filter('filter')($rootScope.classrooms, { "issm": $scope.classroom })[0];
		$scope.numOfStudents = currentClassroomObj.talaamiid.length;
		$scope.numOfSlides = Math.ceil($scope.numOfStudents / 4);

		$rootScope.today = moment().local('ar-ma').format('dddd Do MMMM YYYY');

		$scope.absentStudents = [];
		$scope.hdriterator = "all";

		for (var i = 1; i <= currentClassroomObj.talaamiid.length; i++) {
			currentClassroomObj.talaamiid[i - 1].number = i;
		};

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
		}

		$scope.studentsDistribuedBy4InArray = [];
		$scope.distributeStudentsBy4 = function (sourcearray) {
			for (var i = 0; i < $scope.numOfSlides; i++) {

				var subArray = sourcearray.slice(i * 4, (i * 4) + 4);
				$scope.studentsDistribuedBy4InArray.push(subArray);
			};
		}

		$scope.distributeStudentsBy4(currentClassroomObj.talaamiid);

		$scope.showPopup = function () {
			$scope.data = {};

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
							e.preventDefault();
						}
					},
					{
						text: 'حفظ',
						type: 'button-positive',
						onTap: function (e) {
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



	});