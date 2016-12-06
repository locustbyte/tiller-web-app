'use strict';

angular.module('tillerWebApp')

    .controller('discoveryCtrl', ['$rootScope', '$scope', '$location', '$state', 'initialState', 'restService', 'sliderService', 'validationService', 'userHistoryService', 'userService', 'chart.pastPerformanceService', function ($rootScope, $scope, $location, $state, initialState, restService, sliderService, validationService, userHistoryService, userService, chartPastPerformanceService) {

        $scope.state = 'discovery';

        $scope.userHistory = userHistoryService.get();
        sliderService.enableReRouting = true;

        if($scope.userHistory === undefined)
        {
            $scope.userHistory = userHistoryService.getDefaults();
        }

        userHistoryService.set($scope.userHistory);

        $scope.data = {};

        $scope.sessionData = function(response){

            // $timeout(function(){

            userService.getUserDataAsync().then(function(user){

                $scope.data = user;
                $scope.user = user;

                /**
                 * Build the lump sum slider
                 */

                if($scope.data.upFrontSum === undefined)
                {
                    $scope.data.upFrontSum = 500;
                }

                sliderService.setSliderData('lumpSum', $scope.data.upFrontSum);

                $scope.lumpSumModel = {
                    min: 5000,
                    max: 10000000,
                    scaleBounds: [
                        {"increment" : 500, "threshold" : 5000},
                        {"increment" : 1000, "threshold" : 20000},
                        {"increment" : 5000, "threshold" : 50000},
                        {"increment" : 10000, "threshold" : 250000},
                        {"increment" : 25000, "threshold" : 500000},
                        {"increment" : 100000, "threshold" : 1000000},
                        {"increment" : 500000, "threshold" : null}
                    ],
                    change: function(value) {

                        $scope.data.upFrontSum = value;

                    }
                };

                sliderService.setSliderModel('lumpSum', $scope.lumpSumModel);

                $scope.lumpSumValidationModel = {rule: validationService.findRule($scope.data.validationRules, 'UpFrontSum'), isValid: true};

                sliderService.setSliderValidationModel('lumpSum', $scope.lumpSumValidationModel);

                /**
                 * Build the top up slider
                 */
                sliderService.setSliderData('topUp', $scope.data.topUp);

                $scope.topUpModel = {
                    min: 0,
                    max: 100000,
                    scaleBounds: [
                        {"increment" : 50, "threshold" : 2000},
                        {"increment" : 100, "threshold" : 5000},
                        {"increment" : 500, "threshold" : 10000},
                        {"increment" : 1000, "threshold" : 30000},
                        {"increment" : 5000, "threshold" : null}

                    ],
                    change: function(value) {

                        $scope.data.topUp = value;

                        $scope.topUpModel.noTopUp = false;

                    }
                };

                sliderService.setSliderModel('topUp', $scope.topUpModel);

                $scope.topUpValidationModel = {rule: validationService.findRule($scope.data.validationRules, 'TopUp'), isValid: true};

                sliderService.setSliderValidationModel('topUp', $scope.topUpValidationModel);

                /**
                 * Build the target slider
                 */

                sliderService.setSliderData('target', $scope.data.target);

                $scope.targetModel = {
                    min: 0,
                    max: 50000000,
                    scaleBounds: [
                        {"increment" : 1000, "threshold" : 20000},
                        {"increment" : 5000, "threshold" : 100000},
                        {"increment" : 10000, "threshold" : 300000},
                        {"increment" : 50000, "threshold" : 2000000},
                        {"increment" : 100000, "threshold" : 10000000},
                        {"increment" : 1000000, "threshold" : null}
                    ],
                    change: function(value) {

                        $scope.data.target = value;

                        $scope.targetModel.noTarget = false;

                    }
                };

                sliderService.setSliderModel('target', $scope.targetModel);

                $scope.targetValidationModel = {rule: validationService.findRule($scope.data.validationRules, 'Target'), isValid: true};

                sliderService.setSliderValidationModel('target', $scope.targetValidationModel);

                /**
                 * Build the total years slider
                 */

                if($scope.data.totalYears === undefined)
                {
                    $scope.data.totalYears = 1;
                }

                sliderService.setSliderData('totalYears', $scope.data.totalYears);

                $scope.totalYearsModel = {
                    min: 1,
                    max: 40,
                    change: function(value) {

                        $scope.data.totalYears = value;

                        $scope.totalYearsModel.noTimeFrame = false;

                    }
                };

                sliderService.setSliderModel('totalYears', $scope.totalYearsModel);

                $scope.totalYearsValidationModel = {rule: validationService.findRule($scope.data.validationRules, 'TotalYears'), isValid: true};

                sliderService.setSliderValidationModel('totalYears', $scope.totalYearsValidationModel);

                /**
                 * Build the risk slider
                 */

                if($scope.data.riskLevel === undefined)
                {
                    $scope.data.riskLevel = 3;
                }

                sliderService.setSliderData('risk', $scope.data.riskLevel);

                $scope.riskSliderOptions = {
                    buttons: false,
                    input: false
                };

                sliderService.setSliderOptions('risk', $scope.riskSliderOptions);

                $scope.riskSliderModel = {
                    min: 1,
                    max: 5,
                    change: function (value) {

                        $scope.data.riskLevel = value;
                    }
                };

                sliderService.setSliderModel('risk', $scope.riskSliderModel);

                $scope.riskValueValidationModel = {rule: validationService.findRule($scope.data.validationRules, 'TotalYears'), isValid: true};

                sliderService.setSliderValidationModel('risk', $scope.riskValueValidationModel);

                //$scope.$watch('data.riskLevel')

                /**
                 * Build the history slider
                 */
                $scope.data.history = 5;

                sliderService.setSliderData('history', 5);

                $scope.historySliderOptions = {
                    buttons: false,
                    input: false
                };

                sliderService.setSliderOptions('history', $scope.historySliderOptions);

                $scope.historySliderModel = {
                    min: 1,
                    max: 10,
                    change: function (value) {

                        $scope.data.history = value;
                    }
                };

                sliderService.setSliderModel('history', $scope.historySliderModel);

                $scope.historyValueValidationModel = {rule: validationService.findRule($scope.data.validationRules, 'TotalYears'), isValid: true};

                sliderService.setSliderValidationModel('history', $scope.historyValueValidationModel);

                //$scope.$watch('data.riskLevel')

            });

        };

        $scope.sessionData();

        if(initialState) {

            if(initialState.collapsed) {

                 $scope.step = 5;

            } else if(initialState.initialStep) {

                $scope.step = initialState.initialStep;

            } else {

                $scope.step = 1;

            }

        } else {

            $scope.step = 1;

        }

        $scope.goToStep = function(step) {

            $scope.step = step;

        };

        $scope.navigateToSlider = function(sliderName) {
            sliderService.navigateToSlider(sliderName);
        };

        $scope.navigateBack = function() {
            sliderService.navigateBack();
        };

        $scope.navigateForwards = function() {
            sliderService.navigateForwards();
        };

        $scope.updateProfile = function()
        {
            if(sliderService.slidersAreValid()) {
                userService.updateProfile();
            }
        };

        $scope.resetSlider = function(sliderKey)
        {
            sliderService.resetSlider(sliderKey);
        };

        $scope.sliderValueChanged = function(sliderKey, value) {
            $scope.updateProfile();
        };

        $scope.sliderHistoryValueChanged = function(sliderKey, value) {
            $scope.updatePortfolioChart(value.value);
        };

        /**
         * Update the chart when updateProfile triggered
         * @param response
         */
        $scope.updatePortfolioChart = function (value) {

            chartPastPerformanceService.setYears(value);

            restService.getPastPerformance(value, $scope.state).then(function (response) {

                if(response !== false && chartPastPerformanceService.chartIsBuilt())
                {

                    $scope.chartData = chartPastPerformanceService.setValues(response, $scope.user);

                    $scope.currentIndice = chartPastPerformanceService.getCurrentIndice();

                    chartPastPerformanceService.destroyChart();

                    chartPastPerformanceService.setElement('pastPerformanceChart');

                    $scope.chart = chartPastPerformanceService.createChart();

                }

            });
        };

        $scope.chartIsBuilt = function()
        {
            if($scope.chart !== undefined && !helperService.isEmptyObj($scope.chart))
            {
                return true;
            }

            return false;
        };

    }]);