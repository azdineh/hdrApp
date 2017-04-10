angular.module('hdrApp')
.directive('hdrabsencehistoryitem', [function ($scope,$rootscope) {
	return {
		restrict: 'E',
		templateUrl:"js/directives/hdrabsencehistory-item.html",
		controller: function ($scope, $element) {
			//$scope.cardInRed="";
			//$scope.tapped=false;
			//$scope.cardInGray="card-gray";

			//$scope.meth=function(){};

		}
	};
}]);