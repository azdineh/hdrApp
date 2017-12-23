
angular.module('hdrApp')
    .controller('SessionshistoryController', function ($scope, hdrdbx) {

        //$state.go($state.current, $stateParams, {reload: true, inherit: false});
        //$watch

        $scope.daies = [];

        $scope.$on('$ionicView.enter', function () {
            if (ionic.Platform.isWebView()) {

                $scope.selectSessionsHistory();

            } else {

                $scope.daies = [
                    {
                        date : '1254876321545454',
                        sessions_view:[
                            {
                                session: {
                                    id: '',
                                    unix_time: '9876543210',
                                    title: '10-11',
                                    students_count: 50,
                                    parity: 'odd',
                                    observation: "حصة امتحان"
        
                                },
                                classroom: {
                                    title: 'TCS-3'
                                },
                                students: [
                                    {
                                        full_name: 'الرياحي منير',
                                        queuing_number: '15'
                                    },
                                    {
                                        full_name: 'كوثر الغيابة',
                                        queuing_number: '19'
                                    },
                                    {
                                        full_name: 'كمال الأجسام',
                                        queuing_number: '33'
                                    }
                                ]
                            },
                            {
                                session: {
                                    id: '',
                                    unix_time: '9876543210',
                                    title: '10-11',
                                    students_count: 50,
                                    parity: 'even',
                                    observation: "حصة امتحان"
        
                                },
                                classroom: {
                                    title: 'TCS-3'
                                },
                                students: [
                                    {
                                        full_name: 'الرياحي منير',
                                        queuing_number: '15'
                                    },
                                    {
                                        full_name: 'كوثر الغيابة',
                                        queuing_number: '19'
                                    },
                                    {
                                        full_name: 'كمال الأجسام',
                                        queuing_number: '33'
                                    }
                                ]
                            }
                        ]
                    }
                    ,
                    {
                        date : '125487878845454',
                        sessions_view:[
                            {
                                session: {
                                    id: '',
                                    unix_time: '9876543210',
                                    title: '10-11',
                                    students_count: 50,
                                    parity: 'all',
                                    observation: "حصة امتحان"
        
                                },
                                classroom: {
                                    title: 'TCS-3'
                                },
                                students: [
                                    {
                                        full_name: 'الرياحي منير',
                                        queuing_number: '15'
                                    },
                                    {
                                        full_name: 'كوثر الغيابة',
                                        queuing_number: '19'
                                    },
                                    {
                                        full_name: 'كمال الأجسام',
                                        queuing_number: '33'
                                    }
                                ]
                            }
                        ]
                    }
                    
                ];

            }
        });




        $scope.selectSessionsHistory = function () {


            hdrdbx.selectRows('session', " 1=1 order by unix_time desc")
                .then(function (sessions_arr) {

                    hdrdbx.daies_arr = [];
                    //var start_index = hdrdbx.sessions_view_obj_arr.length > 0 ? hdrdbx.sessions_view_obj_arr.length - 1 : 0;
                    hdrdbx.selectSessionsView2(sessions_arr, 0, sessions_arr.length,
                        function () {
                            $scope.daies = hdrdbx.daies_arr;
                        });
                }, function (err) {
                    console.log(err);
                })
        }

    });
