angular.module('hdrApp')
	.directive('hdrabsencehistoryitem', [function ($scope, $rootscope) {
		return {
			restrict: 'E',
			templateUrl: "js/directives/hdrabsencehistory-item.html",
			controller: function ($scope, $element) {


			}
		};
	}]);