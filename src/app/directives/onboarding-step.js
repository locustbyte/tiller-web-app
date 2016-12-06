angular.module('ui.steps')
    .directive('onboardingStep', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            replace: false,
            templateUrl: 'components/onboarding-step.html',
            transclude: true,
            scope: {
                title: "@",
                strapline: "@",
                showNextBack: "=",
                currentStep: '@',
                next: "@",
                back: "@",
                nextDisabled: "=",
                showLogInSaveExit: "=",
                showSaveExit: "=",
                onNext: "&",
                onLoad: "&",
                stepScope: "=?", //for passing the controller scope to the directive
                hideBack: "=?"
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                //clean up root
                element.removeAttr('title')
                    .removeAttr('strapline')
                    .removeAttr('show-next-back')
                    .removeAttr('next')
                    .removeAttr('back')
                    .removeAttr('next-disabled')
                    .removeAttr('show-log-in-save-exit')
                    .removeAttr('show-save-exit')
                    .removeAttr('step-scope')
                    .removeAttr('on-load')
                    .removeAttr('show-back')
                    .removeAttr('on-next');

                //Hook up functions for sub directive
                if (scope.stepScope)
                    scope.saveProgress = scope.stepScope.saveProgress;

                scope.onLoad();
            }
        };
    }]);
