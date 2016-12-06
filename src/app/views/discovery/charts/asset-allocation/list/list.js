'use strict';

angular.module('tillerWebApp')

    .controller('discovery.charts.fundListCtrl', ['$scope', '$timeout', 'restService', '$localStorage', 'allocationsService', '$rootScope', function ($scope, $timeout, restService, $localStorage, allocationsService, $rootScope) {

        $scope.state = 'discovery.charts.assetAllocation.list';

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

            initTable();

        });

        /**
         * Reload the asset allocation chart daat when the user profile is updated
         */
        $rootScope.$on('profile.updated', function(e, profile){

            $scope.user = profile;

            $scope.reloadAllocations();

        });

        $scope.data = [];

        var initTable = function(){

            // initialize perfect scrollbar
            $('.table-fixed-scroller').perfectScrollbar();

            // initialize / destroy tooltips
            $('.fund-table tr:first-child .fund-table-tooltip').tooltip({placement: 'bottom'});
            $('.fund-table tr:nth-child(n+2) .fund-table-tooltip').tooltip({placement: 'top'});

            // if($scope.state === 'discovery.charts.assetAllocation.list') {

            //     $('.fund-table [data-toggle="tooltip"]').tooltip(); 

            // } else {

            //     $('.fund-table [data-toggle="tooltip"]').tooltip('destroy')

            // }

        };
        
        $scope.initAllocations = function (response) {

            restService.getAllocations({take: 200}, $scope.state).then(function (response) {

                if (response.data.allocationsModels !== undefined) {

                    $scope.data = allocationsService.getAllocationsListData(response.data);

					$timeout(initTable, 500);

                }

            });
        };

        $scope.initAllocations();

        /**
         * Get new data and populate the chart
         * @param response
         */
        $scope.reloadAllocations = function (response) {

            restService.getAllocations({take: 200}, $scope.state).then(function (response) {

                if (response.data.allocationsModels !== undefined) {

                    $scope.data = allocationsService.getAllocationsListData(response.data);

                    //$timeout(initTable, 500);

                }

            });

        };

    }]);