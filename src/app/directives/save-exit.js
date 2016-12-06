angular.module('ui.steps')
    .directive('saveExit', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/save-exit.html',
            scope: {
                saveExit: "=" 
            },
            link: function ($scope, $element) {
            }
        };
    }]);
