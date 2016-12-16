angular.module('hdrApp')
.controller('PrehomeController', function ($scope,$rootScope,$window) {
	$rootScope.deviceWidth=$window.innerWidth;
	$rootScope.deviceHeight=$window.innerHeight;
	$rootScope.today= moment().local('ar-ma').format('dddd Do MMMM YYYY');
	//$rootScope.today= moment().local('ar-ma').format('LLLL');
});