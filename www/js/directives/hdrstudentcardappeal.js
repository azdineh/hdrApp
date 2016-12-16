angular.module('hdrApp')
.directive('hdrStudentCardAppeal', [function ($scope) {
	return {
		restrict: 'E',
		templateUrl:"js/directives/hdrstudentcardappeal.html",
		controller: function ($scope, $element) {
			$scope.cardInRed="";
			$scope.tapped=false;
			$scope.cardInGray="card-gray";

			$scope.onDoubleTap=function(student){
				if($scope.tapped){
					$scope.tapped=false;
					$scope.absentStudents.splice($scope.absentStudents.indexOf(student),1);
					//$scope.absentStudents.push(student);
			 		$scope.cardInRed="";
				}else{
					$scope.tapped=true;
					//$scope.absentStudents.push(student);
					$scope.absentStudents.splice($scope.absentStudents.length,0,student);
			 		$scope.cardInRed="card-red";
				}
 			};

		}
	};
}]);