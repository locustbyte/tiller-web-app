angular.module('ui.steps')
    .directive('logInSaveExit', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/log-in-save-exit.html',
            scope: {
                saveExit: "=" 
            },
            link: function ($scope, $element) {
            }
        };
    }]);
