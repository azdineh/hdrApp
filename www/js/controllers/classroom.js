angular.module('hdrApp')
.controller('ClassroomController', function ($scope,$rootScope,$stateParams,$filter) {
	$scope.classroomid=$stateParams.classroomid;
	//$scope.page="Classroom : "+$scope.classroomid;
	//alert("classroom : "+ $scope.classroomid);
	$scope.classroom = $filter('filter')($rootScope.classrooms,{"issm":$scope.classroomid})[0];

	for (var i = 1; i <= $scope.classroom.talaamiid.length; i++) {
 		$scope.classroom.talaamiid[i-1].number=i;
 	};

});