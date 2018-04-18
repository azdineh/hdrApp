angular.module('hdrApp')
	.directive('hdrabsencehistoryitem', [function ($scope, $rootscope, $ionicScrollDelegate) {
		return {
			restrict: 'E',
			templateUrl: "js/directives/hdrabsencehistory-item.html",
			controller: function ($scope, $element) {
				$scope.limitstudent = 9;
				$scope.moreStudent = function () {
					$scope.limitstudent += 5;
					$ionicScrollDelegate.resize();
				}

			}
		};
	}]);