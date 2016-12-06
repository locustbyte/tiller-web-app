'use strict';

angular.module('tillerWebApp')

    .controller('onboardingInvestmentCtrl', ['$rootScope', '$scope', '$location', '$state', '$sessionStorage', 'initialState', 'restService', 'sliderService', 'validationService', 'userHistoryService', 'userService', 'onboardingPortfolioService', '$controller', 'chart.pastPerformanceService', function ($rootScope, $scope, $location, $state, $sessionStorage, initialState, restService, sliderService, validationService, userHistoryService, userService, onboardingPortfolioService, $controller, chartPastPerformanceService) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.state = 'onboarding-investment';

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
                    min: 500,
                    max: 100000,
                    scaleBounds: [
                        {"increment" : 500, "threshold" : 5000},
                        {"increment" : 1000, "threshold" : 20000},
                        {"increment" : 5000, "threshold" : 50000},
                        {"increment" : 10000, "threshold" : 200000},
                        {"increment" : 50000, "threshold" : null}
                    ],
                    change: function(value) {

                        $scope.data.upFrontSum = value;


                        /**
                         * @todo - requires the change event to be handled correctly (ie not on load)
                         */
                        /*if($scope.sliders.lumpSum.validationModel.isValid)
                        {
                            sliderService.updateProfile();
                        }*/

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
                    max: 5000,
                    scaleBounds: [
                        {"increment" : 50, "threshold" : null}
                    ],
                    change: function(value) {

                        $scope.data.topUp = value;

                        $scope.topUpModel.noTopUp = false;

                        /**
                         * @todo - requires the change event to be handled correctly (ie not on load)
                         */
                        /*if($scope.sliders.topUp.validationModel.isValid)
                        {
                            sliderService.updateProfile();
                        }*/

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
                    max: 5000000,
                    scaleBounds: [
                        {"increment" : 1000, "threshold" : 20000},
                        {"increment" : 5000, "threshold" : 100000},
                        {"increment" : 10000, "threshold" : 300000},
                        {"increment" : 50000, "threshold" : null}
                    ],
                    change: function(value) {

                        $scope.data.target = value;

                        $scope.targetModel.noTarget = false;

                        /**
                         * @todo - requires the change event to be handled correctly (ie not on load)
                         */
                        /*if($scope.sliders.target.validationModel.isValid)
                        {
                            sliderService.updateProfile();
                        }*/

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

                        /**
                         * @todo - requires the change event to be handled correctly (ie not on load)
                         */
                        /*if($scope.sliders.totalYears.validationModel.isValid)
                        {
                            sliderService.updateProfile();
                        }*/

                    }
                };

                sliderService.setSliderModel('totalYears', $scope.totalYearsModel);

                $scope.totalYearsValidationModel = {rule: validationService.findRule($scope.data.validationRules, 'TotalYears'), isValid: true};

                sliderService.setSliderValidationModel('totalYears', $scope.totalYearsValidationModel);


                /**
                 * Build the drawdown timeline slider
                 */

                if($scope.sliders.portfolioIncomeTimeFrame) {
                    if($scope.data.drawdownTimeline === undefined)
                    {
                        $scope.data.drawdownTimeline = {
                            value1: $scope.sliders.portfolioIncomeTimeFrame.data.value,
                            value2: $scope.sliders.portfolioIncomeTimeFrame.data.value + $scope.sliders.portfolioIncomeDuration.data.value
                        };
                    }
                    
                    sliderService.setSliderData('drawdownTimeline', $scope.data.drawdownTimeline);

                    $scope.drawdownTimelineModel = {
                        min: 1,
                        max: 70,
                        slider1Max: 40,
                        minSliderDifference: 3,
                        change: function(sliderValue) {
                            sliderService.setSliderData('portfolioIncomeTimeFrame', sliderValue.value1);
                            sliderService.setSliderData('portfolioIncomeDuration', sliderValue.value2 - sliderValue.value1);
                            
                            $scope.data.drawdownTimeline = sliderValue;
                        }
                    };

                    sliderService.setSliderModel('drawdownTimeline', $scope.drawdownTimelineModel);
                }

                $scope.drawdownTimelineSliderChanged = function(sliderKey, sliderData) {
                    var initialYearsToIncomeGeneration = sliderData.value1;
                    var initialIncomeDuration = sliderData.value2 - sliderData.value1;
                    sliderService.setSliderData('portfolioIncomeTimeFrame', initialYearsToIncomeGeneration);
                    $sessionStorage.user.portfolio.initialYearsToIncomeGeneration = initialYearsToIncomeGeneration;
                    sliderService.setSliderData('portfolioIncomeDuration', initialIncomeDuration);
                    $sessionStorage.user.portfolio.initialIncomeDuration = initialIncomeDuration;
                    $scope.updatePortfolio();
                };


                /**
                 * Build the risk slider
                 */

                //the slider data for the portfolioRisk slider is set in portfolio.js

                $scope.riskSliderOptions = {
                    buttons: false,
                    input: false
                };

                sliderService.setSliderOptions('portfolioRisk', $scope.riskSliderOptions);

                $scope.riskSliderModel = {
                    min: 1,
                    max: 5,
                    change: function (value) {

                        $scope.data.riskLevel = value;
                        $scope.portfolio.targetRiskRatingId = value;
                    }
                };
                
                sliderService.setSliderModel('portfolioRisk', $scope.riskSliderModel);



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

        $scope.getInvestmentWrapperTypeHeading = function () {
            return ($scope.stepScope.portfolio.wrapperId === 1) ? 'General Investment' : 'ISA Investment';
        }

        $scope.getPortfolioTypeHeading = function () {
            return ($scope.stepScope.portfolio.portfolioTypeId === 1) ? 'Capital Growth' : 'Income';
        }


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

                    $scope.chart = chartPastPerformanceService.createChart($scope.chartElement);

                }

            });
        };

    }]);