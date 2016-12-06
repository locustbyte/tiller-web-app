angular.module('tillerWebApp')
    
    .directive('tlPageOverlay', [function() {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/tl-page-overlay.html',
            link: function($scope, $element) {

                $scope.getClass = function()
                {
                    if($scope.pageOverlay.display)
                    {
                        return 'opacity opacity-1 z-index z-index-low';
                    }
                }

            }
        };
    }]);
