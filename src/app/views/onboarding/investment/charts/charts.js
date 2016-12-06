'use strict';

angular.module('tillerWebApp')

    .controller('onboardingInvestment.chartsCtrl', ['$controller', '$scope', '$rootScope', 'userHistoryService', 'userService', 'restService', 'chart.assetAllocationService', 'PubSub', function ($controller, $scope, $rootScope, userHistoryService, userService, restService, chartAssetAllocationService, PubSub) {

        $controller('portfolioCtrl', { $scope: $scope });

        /**
         * Get data from the userHistory service so that we can check where the user has already been
         */
        $scope.userHistory = userHistoryService.get();

        /**
         * Set up the settings for the display of the theme charts
         * @type {{display: boolean}}
         */
        $scope.themeChart = {
            display: false
        };

        /**
         * Set up the settings for the display of page overlays
         * @type {{display: boolean}}
         */
        $scope.pageOverlay = {
            display: false,
            chartDeSaturation: false
        };

        /**
         * Check for changes in the user in scope so that we can show an overlay if it's required
         */
        $scope.$watch('user', function(){
            if($scope.user !== undefined)
            {
                $scope.maybeShowOverview();
            }
        });

        /**
         * Create settings for overview display
         * @type {{1: boolean, 2: boolean, 3: boolean, 4: boolean, 5: boolean}}
         */
        $scope.modals = {
            tracker: false,
            active: false,
            activePlus: false,
            addTheme: false,
            themeException: false
        };

        /**
         * Create settings for expanded views
         * @type {{assetAllocationChart: boolean, fundList: boolean, pastPerformance: boolean, futurePerformance: boolean}}
         */
        $scope.expandedViews = {
            assetAllocationChart: false,
            fundList: false,
            pastPerformance: false,
            futurePerformance: false
        };

        /**
         * Create the legends object
         * @type {{}}
         */
        $scope.legends = {
        };

        /**
         * Set the default state
         * @type {string}
         */
        $scope.state = 'onboarding-investment.charts';

        /**
         * Listen for the view.change event from the router to trigger view related settings
         */
        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

        });

        /**
         * Subscribers for actions published by onboardingPortfolioService
         * @param data
         */
        $scope.onboardingPortfoliosListener = function(data) {

            $scope.loadThemes();

        };

        PubSub.subscribe('portfolio.updated', $scope.onboardingPortfoliosListener);

        /**
         * Get the legend for asset allocations
         * @type {*}
         */
        $scope.legend = chartAssetAllocationService.getLegend();

        /**
         * Subscribers for actions published by charts.assetAllocationService
         * @param data
         */
        $scope.assetAllocationlistener = function(data) {
            $scope.legends.assetAllocation = data;
        };

        PubSub.subscribe('charts.assetAllocation.legend.updated', $scope.assetAllocationlistener);

        /**
         * Rerturns the correct classes for the theme chart overlays
         * @returns {*}
         */
        $scope.getThemeChartClass = function()
        {

            if($scope.themeChart.display)
            {
                $scope.showPageOverlay();
                return 'opacity opacity-1 z-index z-index-highest';
            }

            return '';

        };


        $scope.themeChartCloseListener = function(data) {
            $scope.themeChart.display = data;
            $scope.hidePageOverlay();
        };

        /**
         * Subscribe to publishers from chart.securityPerformanceService
         */

        PubSub.subscribe('charts.securityPerformance.close', $scope.themeChartCloseListener);

        $scope.updatedThemeListener = function(theme) {
            $scope.themeChanged(theme);
        };

        PubSub.subscribe('charts.securityPerformance.updateTheme', $scope.updatedThemeListener);

        $scope.assetAllocationFilterlistener = function(group) {
            $scope.filterLegend(group, 'in');
        };

        PubSub.subscribe('charts.assetAllocation.legend.filter', $scope.assetAllocationFilterlistener);

        $scope.assetAllocationUnFilterlistener = function(group) {
            $scope.filterLegend(group, 'reset');
        };

        PubSub.subscribe('charts.assetAllocation.legend.unfilter', $scope.assetAllocationUnFilterlistener);

        /*$scope.assetRegionlistener = function(data) {
            $scope.legends.assetRegion = data;
        };

        PubSub.subscribe('charts.assetRegion.legend.updated', $scope.assetRegionlistener);*/


        /**
         * Get the navigation button state
         * @param activeRouteSegment
         * @returns {*}
         */
        $scope.getNavigationButtonState = function(activeRouteSegment)
        {
            if($scope.state.indexOf(activeRouteSegment) != -1)
            {
                return 'btn-active btn-xlarge';
            }

            return 'btn-large';
        };

        /**
         * Get the navigation button classes
         * @param activeRouteSegment
         * @returns {*}
         */
        $scope.getNavigationButtonIconState = function(activeRouteSegment)
        {
            if($scope.state.indexOf(activeRouteSegment) != -1)
            {
                return 'icon-xlg';
            }

            return 'icon-lg';
        };

        /**
         * Get the sub navigation classes
         * @param activeRouteSegment
         * @returns {*}
         */
        $scope.getSubNavigationButtonState = function(activeRouteSegment)
        {
            if($scope.state.indexOf(activeRouteSegment) !== -1 && $scope.state.indexOf(activeRouteSegment + '.') === -1)
            {
                return 'btn-active btn-medium';
            }

            return 'btn-small';
        };

        /**
         * Get the theme control classes
         * @param level
         * @returns {*}
         */
        $scope.getThemeControlState = function(level)
        {

            if($scope.portfolio.allocationModelTypeId === level)
            {
                return 'btn-xlarge btn-active';
            }

            return 'btn-large';
        };

        /**
         * Get the class for the theme controls info buttons
         * @param level
         * @returns {string}
         */
        $scope.getThemeControlInfoState = function(level)
        {

            var infoClass = 'animate animate-scale-down opacity opacity-0';

            if($scope.portfolio.allocationModelTypeId === level)
            {
                infoClass = 'animate animate-scale-up opacity opacity-1';

                var investorLevel = $scope.getInvestorLevelKey(level);

                if(!$scope.userHistory.investorLevels[investorLevel] || $scope.modals[investorLevel] === true)
                {
                    infoClass = infoClass + ' btn-active';
                }
            }

            return infoClass;
        };

        /**
         * Helper function to return overlay container class
         * @returns {string}
         */
        $scope.getChartOverlaysClass = function()
        {
            var overlayClass = '',
                deSaturate = false;

            angular.forEach($scope.modals, function(value, key){

                if(value === true)
                {
                    if(key == 'addTheme')
                    {
                        overlayClass = 'opacity opacity-1 z-index z-index-high border border-transparent';
                        deSaturate = true;
                    }
                    else
                    {
                        overlayClass = 'opacity opacity-1 z-index z-index-high';
                    }
                }
            });

            $scope.toggleChartDeSaturation(deSaturate);

            $scope.maybeShowPageOverlay();

            return overlayClass;
        };

        /**
         * Switches the desaturation on charts from true to false based on a Boolean passed to the function and the userlevel
         * @param deSaturate Boolean
         */
        $scope.toggleChartDeSaturation = function(deSaturate)
        {
            if(deSaturate)
            {
                $scope.pageOverlay.chartDeSaturation = true;
            }
            else if($scope.pageOverlay.chartDeSaturation === true)
            {
                $scope.pageOverlay.chartDeSaturation = false;
            }
        };

        /**
         * Class helper for chart containers - this helps to add desaturated classes etc
         * @returns {*}
         */
        $scope.getChartContainerClass = function()
        {
            if($scope.pageOverlay.chartDeSaturation === true)
            {
                return 'desaturated';
            }
            return '';
        };

        /**
         * Helper to get the class for the various overlays
         * @param level
         * @returns {*}
         */
        $scope.getChartModalClass = function(level)
        {
            if($scope.modals[level] === true)
            {
                return 'animate animate-scale-up z-index z-index-highest opacity opacity-1';
            }

            return 'animate animate-scale-down z-index z-index-negative opacity opacity-0';
        };

        /**
         * Toggle beteen investor levels and update profile
         * @param level
         */
        $scope.switchInvestorLevel = function(level)
        {
            var investorLevelKey = $scope.getInvestorLevelKey(level);

            $scope.portfolio.allocationModelTypeId = level;

            $scope.updatePortfolio();

            if($scope.userHistory.investorLevels[investorLevelKey] === false)
            {
                $scope.toggleThemeControlOverview(investorLevelKey);

                $scope.userHistory.investorLevels[investorLevelKey] = true;

                userHistoryService.set($scope.userHistory);
            }
            else
            {
                $scope.resetThemeControlOverviewStates();
            }

        };

        /**
         * Reset all overview states so they are hidden
         */
        $scope.resetThemeControlOverviewStates = function()
        {
            angular.forEach($scope.modals, function(value, key){
                $scope.modals[key] = false;
            });

            $scope.hidePageOverlay();
        };

        /**
         * Cycle through the theme overviews and set them accordingly
         * @param level
         */
        $scope.toggleThemeControlOverview = function(level)
        {

            angular.forEach($scope.modals, function(value, key){

                if(level === key)
                {
                    if(value === false)
                    {
                        $scope.modals[key] = true;
                    }
                    else
                    {
                        $scope.modals[key] = false;
                    }
                }
                else
                {
                    $scope.modals[key] = false;
                }
            });

            /**
             * Handle extra 4th overlay for theme overview
             */
            if(level === 'activePlus' && $scope.modals.activePlus === false && !$scope.isThemeSelected()) {
                $scope.modals.addTheme = true;
            }

            $scope.maybeShowPageOverlay();

        };

        /**
         * Load the themes from the api
         */
        $scope.loadThemes = function() {

            restService.getPortfolioThemes($scope.state).then(function(themes) {

                var items = themes.map(function(theme) {
	                return { id: theme.themeId, themeSecurity: theme.themeSecurity, label: theme.themeName, selected: theme.isSelected, inactive: theme.isException};
                });

                $scope.themesList = {items: items};


                $scope.$watch('themesList.items', function(newVal){

                    if($scope.isThemeSelected())
                    {
                        $scope.modals.addTheme = false;
                    }
                    else if($scope.portfolio.allocationModelTypeId === 3)
                    {
                        $scope.resetThemeControlOverviewStates();
                        $scope.modals.addTheme = true;
                    }

                }, true);

            });
        };

        $scope.loadThemes();

        /**
         * Get the name of an investor level
         * @returns {*}
         */
        $scope.getInvestorLevelKey = function()
        {

            if($scope.user !== undefined)
            {
                switch($scope.user.investorLevel)
                {
                    case 1:

                        return 'tracker';

                    case 2:

                        return 'active';

                    case 3:

                        return 'activePlus';
                }
            }

            return false;
        };

        /**
         * Decide whether to display the relevant investor level overlay
         */
        $scope.maybeShowOverview = function()
        {

            var key = $scope.getInvestorLevelKey();

            if($scope.userHistory.investorLevels[key] === false)
            {
                $scope.toggleThemeControlOverview(key);
                $scope.userHistory.investorLevels[key] = true;
            }

            $scope.maybeShowPageOverlay();

        };

        /**
         * Return whether theme is selected or not
         * @returns {boolean}
         */
        $scope.isThemeSelected = function(){

            var isSelected = false;

            angular.forEach($scope.themesList.items, function(item, key) {

                if(item.selected) {
                    
                    isSelected = true;

                }

            });

            return isSelected;

        };

        /**
         * Handle the update of themes with the api/interface
         * @param selectedTheme
         */
        $scope.themeChanged = function(selectedTheme) {

            restService.updatePortfolioTheme(selectedTheme.id, selectedTheme.selected, $scope.state).then(function(themes) {

                var items = themes.map(function(theme) {
	                return { id: theme.themeId, themeSecurity: theme.themeSecurity, label: theme.themeName, selected: theme.isSelected, inactive: theme.isException};
                });

                /**
                 * @todo - need to avoid updating the
                 * @type {{items: *}}
                 */
                //update the local themesList array with the data from the api
                $scope.themesList = { items: items };

                //get the api data for the selected theme
                var themeModel;
                angular.forEach(themes, function(theme, themeKey) {
                    if(theme.themeId === selectedTheme.id) {
                        themeModel = theme;
                    }
                });

                //toggle the overview if the theme data returned has an exception message
                if(themeModel.isException) {
                    $scope.themeExceptionMessage = themeModel.exceptionMessage;
                    $scope.toggleThemeControlOverview(5);
                }

                $scope.updatePortfolio();

            });

        };

        /**
         * Toggles the expanded views for charts
         * @param view
         */
        $scope.toggleExpandedView = function(view) {

            if($scope.expandedViews[view] !== undefined) {

                $scope.expandedViews[view] = !$scope.expandedViews[view];

            }
        
        };

        /**
         * Filter display the asset group on the chart and legend using a legend key
         */
        $scope.showAssetGroup = function(legend)
        {
            $scope.filterLegend(legend.group, 'reset');
            $scope.filterLegend(legend.group, 'in');
            chartAssetAllocationService.filterAssetClass(legend.group);
        };

        /**
         * Reset the filtering on the asset group on the chart and legend using a legend key
         */
        $scope.hideAssetGroup = function(legend)
        {
            $scope.filterLegend(legend.group, 'reset');
            chartAssetAllocationService.unfilterAssetClass(legend.group);
        };


        /**
         * Show the page overlay
         */
        $scope.showPageOverlay = function()
        {
            $scope.pageOverlay.display = true;
        };


        /**
         * Hide the page overlay
         */
        $scope.hidePageOverlay = function()
        {
            $scope.pageOverlay.display = false;
        };
        
        /**
         * Test to see if we should show the page overlay
         */
        $scope.maybeShowPageOverlay = function()
        {
            var display = false;

            angular.forEach($scope.modals, function(value, key){

                if(value === true)
                {
                    display = true;
                }

            });

            $scope.pageOverlay.display = display;

        };

        /**
         * Filter the legend based on group and filter in or out
         * @param group - the slugified group
         * @param filter - 'in' or 'reset' - fairly self explanatory
         */
        $scope.filterLegend = function(group, filter)
        {
            angular.forEach($scope.legends.assetAllocation, function(legend, key){
                if(legend.group !== group)
                {
                    switch(filter) {
                        case 'in':
                            legend.class = legend.class + ' disabled';
                            break;

                        default:
                            legend.class = legend.class.replace(' disabled', '');
                    }
                }
            });
        };

    }]);