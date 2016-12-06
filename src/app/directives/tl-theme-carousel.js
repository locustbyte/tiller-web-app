angular.module('ui.tiller-sliders')

    .directive('tlThemeCarousel', ['validationService', '$timeout', '$rootScope', 'chart.securityPerformanceService', function (validationService, $timeout, $rootScope, chartSecurityPerformanceService) {

        return {
            restrict: 'E',
            replace: false,
            require: 'ngModel',
            template: '<div class="tl-theme-carousel">' +
                      '  <button ng-click="moveBack()" title="Back" class="carousel-back-button" ng-class="moveBackButtonClass"></button>' +
                      '  <ul class="items">' +
                      '      <li ng-repeat="item in ngModel.items" ng-class="classList[$index]">' +
                      '          <label ng-class="{\'checked\':item.selected, \'loading\':loading, \'label-hidden\':item.updating}">' +
                      '              <input type="checkbox" ng-model="item.selected" ng-change="valueChanged(item)" ng-if="!item.inactive && !loading" />' +
                      '          </label>' +
                      '          <div class="loading-spinner" ng-if="item.updating"></div>' +
                      '          <span class="label cursor cursor-pointer" ng-class="{\'loading\':loading && !item.updating}" ng-bind="item.label" ng-click="showThemeInfo(item)"></span>' +
                      '      </li>' +
                      '  </ul>' +
                      '  <button ng-click="moveNext()" title="Next" class="carousel-next-button" ng-class="moveNextButtonClass"></button>' +
                      '</div>',
            scope: {
                ngModel: '=',
                itemChanged: '=',
                themeChart: '=',
                maxVisibleItems: '@'
            },
            link: function ($scope, $element) {

                var _visibleItems = 0;
                $scope.carouselOffset = 0;

                $scope.loading = false;

                $scope.valueChanged = function (item) {
                    item.updating = true;
                    $scope.loading = true;
                    $scope.itemChanged(item);
                };

                $scope.updateClassList = function () {
                    for (var i = 0; i < $scope.ngModel.items.length; i++) {
                        if (i < $scope.carouselOffset) {
                            $scope.classList[i] = 'hidden-item position-1';
                        }
                        else if (i >= $scope.carouselOffset + _visibleItems) {
                            $scope.classList[i] = 'hidden-item' + ' position-' + (_visibleItems + 2);
                        }
                        else {
                            $scope.classList[i] = 'item-' + (i - $scope.carouselOffset + 1) + ' position-' + (i - $scope.carouselOffset + 2);
                        }

                        $scope.classList[i] += $scope.ngModel.items[i].inactive ? ' inactive' : '';
                    }
                    if ($scope.carouselOffset === 0) {
                        $scope.moveBackButtonClass = 'position-1 disabled';
                    }
                    else {
                        $scope.moveBackButtonClass = 'position-1';
                    }
                    if ($scope.carouselOffset + _visibleItems >= $scope.ngModel.items.length) {
                        $scope.moveNextButtonClass = 'position-' + (_visibleItems + 2) + ' disabled';
                    }
                    else {
                        $scope.moveNextButtonClass = 'position-' + (_visibleItems + 2);
                    }
                    // hide arrows if we have less than maxVisibleItems
                    if ($scope.ngModel.items.length <= $scope.maxVisibleItems) {
                        $scope.moveBackButtonClass = 'hidden';
                        $scope.moveNextButtonClass = 'hidden';
                    }
                };

                $scope.updateItems = function () {
                    _visibleItems = (parseInt($scope.maxVisibleItems) > 0 && parseInt($scope.maxVisibleItems) <= 6) ? parseInt($scope.maxVisibleItems) : 6;
                    _visibleItems = (_visibleItems <= $scope.ngModel.items.length) ? _visibleItems : $scope.ngModel.items.length;
                    $scope.classList = [];
                    $scope.updateClassList();
                };

                $scope.$watch('ngModel', function (newValue) {
                    if (typeof newValue !== 'undefined') {
                        $scope.updateItems();
                        $scope.loading = false;
                    }
                });

                $scope.moveBack = function () {
                    if ($scope.carouselOffset > 0) {
                        $scope.carouselOffset--;
                        $scope.updateClassList();
                    }
                };

                $scope.moveNext = function () {
                    if ($scope.carouselOffset < $scope.ngModel.items.length - _visibleItems) {
                        $scope.carouselOffset++;
                        $scope.updateClassList();
                    }
                };

                $scope.themeChartElement = document.getElementById('themeChart');

                $scope.showThemeInfo = function (theme) 
                {
                    $($scope.themeChartElement).html("");//TIL-200 destroy before rebuild todo: is there an actual destroy option rather than this?
                    $scope.themeChart.display = true;
                    chartSecurityPerformanceService.initThemeChart(theme, $scope.themeChartElement);
                };

            }
        };
    }]);
