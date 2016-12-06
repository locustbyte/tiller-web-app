'use strict';

angular.module('tillerWebApp')

    .controller('onboardingInvestment.charts.lossScenariosCtrl', ['$scope', '$timeout', 'restService', '$localStorage', 'allocationsService', '$rootScope', function ($scope, $timeout, restService, $localStorage, allocationsService, $rootScope) {

        //$scope.state = 'onboarding-investment.charts.futurePerformance.lossscenarios';
        $scope.state = 'onboarding-investment.charts';

        /*$rootScope.$on('view.change', function(e, state){

            $scope.state = state;

            initTable();

        });*/

        $scope.scenarios = [
            {
                id: 1,
                title: '2008: Sub Prime',
                date: '2008',
                lossAmount: '12%',
                reason: 'because of a crash in US house prices due to home owners defaulting on their sub-prime mortgages.',
                recoveryTime: '6 weeks'
            },
            {
                id: 2,
                title: '1997: Asian Crisis',
                date: 'July 1997',
                lossAmount: '12%',
                reason: 'because of a financial crisis in Indonesia, South Korea and Thailand.',
                recoveryTime: '8 weeks'
            },
            {
                id: 3,
                title: '1987: Black Monday',
                date: 'October 1987',
                lossAmount: '23%',
                reason: 'because markets around the world crashed, shedding a huge value in a very short time.',
                recoveryTime: '11 weeks'
            }
        ];

        $scope.scenario = $scope.scenarios[1];

        $scope.selectScenario = function(id) {
            $scope.scenario = $scope.scenarios[id-1];
        }

        

    }]);