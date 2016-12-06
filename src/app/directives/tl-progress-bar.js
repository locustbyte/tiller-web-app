angular.module('tillerWebApp')

    .directive('tlProgressBar',
        function () {
            return {
                restrict: 'E',
                template: '<div class="tl-progress-bar">' +
                          '	 <div class="tl-progress-track" style="width: {{(currentStep/steps.length)*100}}%"></div>' +
                          '	 <div class="tl-progress-step" ng-repeat="step in steps" ng-class="{\'highlighted\': currentStep > $index, \'active\': currentStep == $index+1}"  style="width: {{100/steps.length}}%">' +
                          '	   <label ng-bind="step"></label>' +
                          '  </div>' +
                          '</div>',
                scope: {
                    steps: '=?',
                    currentStep: '=?'
                }
            };
        }
    );