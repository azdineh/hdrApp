angular.module('hdrApp')
	.controller('SessionalterController', ['$scope', '$rootScope', function ($scope, $rootScope) {
		if (ionic.Platform.isWebView()) {

		}
		else {
			var students = [];
			students.push({ id: "1", full_name: 'كريم فيلالي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/01/2000", queuing_number: '1' });
			students.push({ id: "2", full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/02/2000", queuing_number: '2' });
			students.push({ id: "5", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '5' });

			$scope.session = {};
			$scope.session.title = "10-11";
			$scope.session.parity = "odd";
			$scope.session.date = "21/08/2018";
			$scope.session.classroom_title = "TCS-8";
			$scope.session.students = students;
		}


		$scope.showHelpPopup = function () {
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


	}]);