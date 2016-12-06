'use strict';

angular.module('tillerWebApp')

    .controller('riskCtrl', ['$scope', '$controller', '$rootScope', '$state', '$sessionStorage', 'onboardingPortfolioService', 'identityApiAdapter', 'sliderService', function ($scope, $controller, $rootScope, $state, $sessionStorage, onboardingPortfolioService, identityApiAdapter, sliderService) {

        $controller('portfolioCtrl', { $scope: $scope });

        //for back button nav
        $scope.incomeOrGrowth = $sessionStorage.user.portfolio.portfolioTypeId == 1 ? 'onboarding-portfolio.growth-duration' : 'onboarding-portfolio.income-target';

        var updateSessionData = function() {
            if($sessionStorage.user != undefined) {
                if($sessionStorage.user.risk === undefined) {
                    $sessionStorage.user.risk = {};
                }
                $sessionStorage.user.risk.suitabilityQuestions = $scope.questions;
            }
        }

        if($sessionStorage.user != undefined && $sessionStorage.user.risk != undefined && $sessionStorage.user.risk.suitabilityQuestions != undefined) {
            $scope.questions = $sessionStorage.user.risk.suitabilityQuestions;
        }
        else {
            //load suitability questions
            onboardingPortfolioService.getSuitabilityquestions()
                .then(function success(response) {
                    //console.log('Suitablity questions data...');
                    //console.log(response.data);

                    $scope.questions = response.data;

                    //add validation flags to the questions
                    $scope.questions.forEach(function(question) {
                        question.isValid = false;
                        question.responses.forEach(function(response) {
                            if(response.isSelected) {
                                question.isValid = true;
                            }
                        });
                    });
                    updateSessionData();

                }, function error(response) {

                });
        }

        $scope.selectAnswer = function(questionIndex, responseIndex) {

            var portfolioId = $sessionStorage.user.portfolio.portfolioId;
            var questionId = $scope.questions[questionIndex].questionId;
            var responseId = $scope.questions[questionIndex].responses[responseIndex].responseId;

            var suitabilityQuestionUpdateModel = {
                portfolioId: portfolioId,
                questionId: questionId,
                responseId: responseId
            };

            onboardingPortfolioService.answerSuitabilityQuestion(suitabilityQuestionUpdateModel)
                .then(function success(response) {
                    
                }, function error(response) {
                    
                });

            //need to manually update each of the radio buttons as the tiller-radio-option directive doesn't currently use model binding
            $scope.questions[questionIndex].responses.forEach(function(response) {
                response.isSelected = false;
            });
            $scope.questions[questionIndex].responses[responseIndex].isSelected = true;
            $scope.questions[questionIndex].isValid = true;
            updateSessionData();
        }

        $scope.getPortfolioRiskLevel = function() {
            onboardingPortfolioService.calculatePortfolioRisk($sessionStorage.user.portfolio.portfolioId)
                .then(function success(response) {
                    $sessionStorage.user.portfolio.targetRiskRatingId = response.data.riskLevel;
                    $scope.riskLevel = response.data.riskLevel;
                    sliderService.setSliderData('portfolioRisk', response.data.riskLevel);
                });
        }

        $scope.retakeQuestionaire = function() {
            //ToDo: maybe need to reset answers to all questions here?
            $state.go('onboarding-portfolio.onboarding-risk.intro');
        };

    }]);