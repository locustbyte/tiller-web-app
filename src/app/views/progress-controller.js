
'use strict';

angular.module('tillerWebApp')

    .controller('progressCtrl', ['$rootScope', '$scope', '$state', '$timeout', function ($rootScope, $scope, $state, $timeout) {



        $timeout(function () {

            $scope.currState = $state.current.name;

            $rootScope.$on('view.change', function (e, state) {

                if( state.indexOf('onboarding-activation') !== -1 ) {

                    $scope.steps = ['Start',
                        'About You',
                        'Investment Knowledge',
                        'Employment Status',
                        'About your investment',
                        'Bank details',
                        'App Download'];

                    switch (state) {
                        case 'onboarding-activation.start':
                        case 'onboarding.verify-email':
                            $scope.setStep(1);
                            break;
                        case 'onboarding-activation.about-you':
                        case 'onboarding-portfolio.investment-goal':
                            $scope.setStep(2);
                            break;
                        case 'onboarding-portfolio.income-investment-level':
                        case 'onboarding-portfolio.income-investment-monthly':
                        case 'onboarding-portfolio.income-timeframe':
                        case 'onboarding-portfolio.income-duration':
                        case 'onboarding-portfolio.income-target':
                        case 'onboarding-portfolio.growth-investment-level':
                        case 'onboarding-portfolio.growth-investment-monthly':
                        case 'onboarding-portfolio.growth-target':
                        case 'onboarding-activation.investment-knowledge':
                            $scope.setStep(3);
                            break;
                        case 'onboarding-portfolio.onboarding-risk.intro':
                        case 'onboarding-portfolio.onboarding-risk.question1':
                        case 'onboarding-portfolio.onboarding-risk.question2':
                        case 'onboarding-portfolio.onboarding-risk.question3':
                        case 'onboarding-portfolio.onboarding-risk.question4':
                        case 'onboarding-portfolio.onboarding-risk.question5':
                        case 'onboarding-activation.employment-status':
                            $scope.setStep(4);
                            break;
                        case 'onboarding-activation.about-your-investment':
                            $scope.setStep(5);
                            break;
                        case 'onboarding-activation.bank-details':
                            $scope.setStep(6);
                            break;
                        case 'onboarding-activation.verify':
                            $scope.setStep(7);
                            break;
                        default:
                            $scope.showProgress = false;
                    }
                }
                else
                {

                    $scope.steps = ['Account Details',
                        'Your Portfolio',
                        'Investment Details',
                        'Risk Profile',
                        'Portfolio Builder'];

                    switch (state) {
                        case 'onboarding.your-account':
                        case 'onboarding.your-account-hello-again':
                        case 'onboarding.check-email':
                        case 'onboarding.your-account-details':
                        case 'onboarding.your-account-name':
                        case 'onboarding-activation.investment-knowledge':
                        case 'onboarding.verify-email': $scope.setStep(1);
                            break;
                        case 'onboarding-portfolio.name':
                        case 'onboarding-portfolio.wrapper':
                        case 'onboarding-portfolio.investment-goal': $scope.setStep(2);
                            break;
                        case 'onboarding-portfolio.income-investment-level':
                        case 'onboarding-portfolio.income-investment-monthly':
                        case 'onboarding-portfolio.income-timeframe':
                        case 'onboarding-portfolio.income-duration':
                        case 'onboarding-portfolio.income-target':
                        case 'onboarding-portfolio.growth-investment-level':
                        case 'onboarding-portfolio.growth-investment-monthly':
                        case 'onboarding-portfolio.growth-target':
                        case 'onboarding-portfolio.growth-duration': $scope.setStep(3);
                            break;
                        case 'onboarding-portfolio.onboarding-risk.intro':
                        case 'onboarding-portfolio.onboarding-risk.question1':
                        case 'onboarding-portfolio.onboarding-risk.question2':
                        case 'onboarding-portfolio.onboarding-risk.question3':
                        case 'onboarding-portfolio.onboarding-risk.question4':
                        case 'onboarding-portfolio.onboarding-risk.question5':
                        case 'onboarding-portfolio.onboarding-risk.rating': $scope.setStep(4);
                            break;
                        case 'onboarding-portfolio.understand-options': $scope.setStep(5);
                            break;
                        default:
                            $scope.showProgress = false;
                    }
                }

            });

            //Account set up through Portfolio set up Progress bar
            $scope.showProgress = false;

            $scope.setStep = function (stepNumber) {
                $scope.currentStep = stepNumber;
                $scope.showProgress = true;
            };

        }, 100);
        

    }]);