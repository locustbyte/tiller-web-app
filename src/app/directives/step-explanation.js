angular.module('ui.step-explanation')
    .directive('stepExplanation', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            replace: false,
            templateUrl: 'components/step-explanation.html',
            scope: {
                seModel: "="
                //seModel: {
                //    title: "",
                //    strapline: "",
                //    steps: [
                //        {
                //            stepIcon: "",
                //            descriptionTitle: "",
                //            description: "",
                //            arrowToNextStep: ""
                //        }
                //    ]
                //}
            },
            link: function ($scope, $element) {
            }
        };
    }]);
