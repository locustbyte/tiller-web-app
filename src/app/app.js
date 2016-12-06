'use strict';
angular.module('ui.tiller-sliders', []);
angular.module('ui.step-explanation', []);
angular.module('ui.steps', []);
angular.module('ui.tiller-inputs', []);
/*angular.module('myChart', [])
 .factory('d3', function() {
 return d3;
 });*/

// Declare app level module which depends on views, and components
angular.module('tillerWebApp', [ 
    'ngRoute',
    //'ui.bootstrap',
    'environment',
    'base64',
    'ngStorage',
    'PubSub',
    'helperService',
    'ui.tiller-sliders',
    'ui.step-explanation',
    'ui.steps',
    'ui.tiller-inputs',
    'restService',
    'errorService',
    'allocationsService',
    'validationService',
    'chart.helperService',
    'chart.responsiveService',
    'chart.assetAllocationService',
    'chart.assetRegionService',
    'chart.futurePerformanceService',
    'chart.pastPerformanceService',
    'chart.securityPerformanceService',
    'ui.router',
    //'ct.ui.router.extras',
    'jQueryScrollbar',
    'sliderService',
    'userService',
    'userHistoryService',
    'onboardingUserService',
    'onboardingPortfolioService',
    'onboardingProfileService',
    'saveExitService'
])
    .config(['$routeProvider', '$urlRouterProvider', '$localStorageProvider', '$sessionStorageProvider', '$stateProvider', 'envServiceProvider', function ($routeProvider, $urlRouterProvider, $localStorageProvider, $sessionStorageProvider, $stateProvider, envServiceProvider) {


        $urlRouterProvider.deferIntercept();

        /**
         * Provide the routes for the application
         */

        $stateProvider
            .state({
                name: 'home',
                url: '',
                templateUrl: 'views/home/home.html',
                controller: 'homeCtrl'
            })
            .state({
                name: 'error',
                url: '/error',
                templateUrl: 'views/error/error.html',
                controller: 'errorCtrl'
            })
            .state({
                name: 'discovery',
                url: '/discovery',
                templateUrl: 'views/discovery/discovery.html',
                controller: 'discoveryCtrl',
                resolve: {
                    initialState: function () {
                        return {};
                    }
                }
            })
            .state({
                name: 'discovery.profiling',
                url: '/profiling',
                templateUrl: 'views/discovery/profiling/ui-view.html'
            })
            .state({
                name: 'discovery.profiling.lumpSum',
                url: '/lump-sum',
                templateUrl: 'views/discovery/profiling/lump-sum/heading.html'
            })
            .state({
                name: 'discovery.profiling.topUp',
                url: '/top-up',
                templateUrl: 'views/discovery/profiling/top-up/heading.html',
                controller: 'discovery.profiling.topUpCtrl'
            })
            .state({
                name: 'discovery.profiling.target',
                url: '/target',
                templateUrl: 'views/discovery/profiling/target/heading.html',
                controller: 'discovery.profiling.targetCtrl'
            })
            .state({
                name: 'discovery.profiling.totalYears',
                url: '/total-years',
                templateUrl: 'views/discovery/profiling/total-years/heading.html',
                controller: 'discovery.profiling.totalYearsCtrl'
            })
            .state({
                name: 'discovery.charts',
                url: '/charts',
                templateUrl: 'views/discovery/charts/ui-view.html'
            })
            .state({
                name: 'discovery.charts.assetAllocation',
                url: '/asset-allocation',
                views: {
                    'discovery-chart-titles@discovery.charts': {
                        templateUrl: 'views/discovery/charts/asset-allocation/heading.html'
                    }
                }
            })
            .state({
                name: 'discovery.charts.assetAllocation.region',
                url: '/region',
                views: {
                    'discovery-chart-titles@discovery.charts': {
                        templateUrl: 'views/discovery/charts/asset-allocation/region/heading.html'
                    }
                }
            })
            .state({
                name: 'discovery.charts.assetAllocation.list',
                url: '/list',
                views: {
                    'discovery-chart-titles@discovery.charts': {
                        templateUrl: 'views/discovery/charts/asset-allocation/list/heading.html'
                    }
                }
            })
            .state({
                name: 'discovery.charts.assetAllocation.list.expanded',
                url: '/expanded',
                views: {
                    'discovery-chart-titles@discovery.charts': {
                        templateUrl: 'views/discovery/charts/asset-allocation/list/heading-expanded.html'
                    }
                }
            })
            .state({
                name: 'discovery.charts.futurePerformance',
                url: '/future-performance',
                views: {
                    'discovery-chart-titles@discovery.charts': {
                        templateUrl: 'views/discovery/charts/future-performance/heading.html'
                    }
                }
            })
            .state({
                name: 'discovery.charts.futurePerformance.expanded',
                url: '/expanded'
            })
            .state({
                name: 'discovery.charts.pastPerformance',
                url: '/past-performance',
                views: {
                    'discovery-chart-titles@discovery.charts': {
                        templateUrl: 'views/discovery/charts/past-performance/heading.html'
                    }
                }
            })
            .state({
                name: 'discovery.charts.pastPerformance.expanded',
                url: '/expanded'
            })
            .state({
                name: 'onboarding',
                url: '/onboarding',
                templateUrl: 'views/onboarding/onboarding.html',
                controller: 'onboardingCtrl'
            })
            .state({
                name: 'onboarding.get-started',
                url: '/get-started',
                templateUrl: 'views/onboarding/get-started.html'
            })
            .state({
                name: 'onboarding.welcome-back',
                url: '/welcome-back',
                templateUrl: 'views/onboarding/welcome-back.html',
                controller: 'helloAgainCtrl'
            })
            .state({
                name: 'onboarding.your-account',
                url: '/your-account',
                templateUrl: 'views/onboarding/account/your-account.html',
                controller: 'onboardingCtrl'
            })
            .state({
                name: 'onboarding.your-account-hello-again',
                url: '/your-account/hello-again',
                templateUrl: 'views/onboarding/account/hello-again.html',
                controller: 'helloAgainCtrl'
            })
            .state({
                name: 'onboarding.check-email',
                url: '/check-your-email',
                templateUrl: 'views/onboarding/account/check-your-email.html',
                controller: 'onboardingCtrl'
            })
            .state({
                name: 'forgotten-details',
                url: '/account/forgotten-details',
                templateUrl: 'views/onboarding/account/forgotten-details.html',
                controller: 'onboardingCtrl'
            })
            .state({
                name: 'onboarding.your-account-details',
                url: '/details',
                templateUrl: 'views/onboarding/account/your-account-details.html',
                controller: 'onboardingCtrl'
            })
            .state({
                name: 'onboarding.your-account-name',
                url: '/onboarding/your-account-details/name',
                templateUrl: 'views/onboarding/account/your-account-details-name.html',
                controller: 'onboardingCtrl'
            })
            .state({
                name: 'onboarding.verify-email',
                url: '/onboarding/your-account-details/verify-email',
                templateUrl: 'views/onboarding/account/verify-email.html',
                controller: 'onboardingCtrl'
            })
            .state({
                name: 'onboarding-portfolio',
                url: '/onboarding/portfolio',
                templateUrl: 'views/onboarding/portfolio/portfolio.html'
            })
            .state({
                name: 'onboarding-portfolio.name',
                url: '/name',
                templateUrl: 'views/onboarding/portfolio/portfolio-name.html',
                controller: 'portfolioCtrl'
            })
            .state({
                name: 'onboarding-portfolio.wrapper',
                url: '/wrapper',
                templateUrl: 'views/onboarding/portfolio/portfolio-wrapper.html',
                controller: 'portfolioCtrl'
            })
            .state({
                name: 'onboarding-portfolio.wrapper-isa',
                url: '/isa',
                templateUrl: 'views/onboarding/portfolio/info/isa.html',
                controller: 'portfolioCtrl'
            })
            .state({
                name: 'onboarding-portfolio.wrapper-general-investment',
                url: '/general-investment',
                templateUrl: 'views/onboarding/portfolio/info/general-investment.html',
                controller: 'portfolioCtrl'
            })
            .state({
                name: 'onboarding-portfolio.investment-goal',
                url: '/goal',
                templateUrl: 'views/onboarding/portfolio/portfolio-investment-goal.html',
                controller: 'portfolioCtrl'
            })
            .state({
                name: 'onboarding-portfolio.type-income',
                url: '/income',
                templateUrl: 'views/onboarding/portfolio/info/type-income.html'
            })
            .state({
                name: 'onboarding-portfolio.type-capital-growth',
                url: '/capital-growth',
                templateUrl: 'views/onboarding/portfolio/info/type-capital-growth.html'
            })
            .state({
                name: 'onboarding-portfolio.understand-options',
                url: '/options',
                templateUrl: 'views/onboarding/portfolio/allocations/portfolio-understand-options.html',
                controller: 'onboardingAllocationsCtrl'
            })
            .state({
                name: 'onboarding-portfolio.save-exit',
                url: '/save-exit',
                templateUrl: 'views/onboarding/save-exit.html',
                controller: 'saveExitCtrl'
            })
            .state({
                name: 'onboarding-portfolio.growth-investment-level',
                url: '/growth/investment-level',
                templateUrl: 'views/onboarding/portfolio/growth/level/growth-investment-level.html',
                controller: 'portfolioLevelCtrl'
            })
            .state({
                name: 'onboarding-portfolio.income-investment-level',
                url: '/income/investment-level',
                templateUrl: 'views/onboarding/portfolio/income/level/income-investment-level.html',
                controller: 'portfolioLevelCtrl'
            })
            .state({
                name: 'onboarding-portfolio.income-investment-monthly',
                url: '/income/investment-monthly',
                templateUrl: 'views/onboarding/portfolio/income/monthly/income-investment-monthly.html',
                controller: 'portfolioTopUpCtrl'
            })
            .state({
                name: 'onboarding-portfolio.growth-investment-monthly',
                url: '/growth/investment-monthly',
                templateUrl: 'views/onboarding/portfolio/growth/monthly/growth-investment-monthly.html',
                controller: 'portfolioTopUpCtrl'
            })
            .state({
                name: 'onboarding-portfolio.income-timeframe',
                url: '/income/investment-timeframe',
                templateUrl: 'views/onboarding/portfolio/income/timeframe/income-investment-timeframe.html',
                controller: 'portfolioIncomeTimeframeCtrl'
            })
            .state({
                name: 'onboarding-portfolio.growth-target',
                url: '/growth/target',
                templateUrl: 'views/onboarding/portfolio/growth/target/growth-investment-target.html',
                controller: 'portfolioGrowthTargetCtrl'
            })
            .state({
                name: 'onboarding-portfolio.growth-duration',
                url: '/growth/duration',
                templateUrl: 'views/onboarding/portfolio/growth/duration/growth-investment-duration.html',
                controller: 'portfolioGrowthDurationCtrl'
            })
            .state({
                name: 'onboarding-portfolio.income-duration',
                url: '/income/duration',
                templateUrl: 'views/onboarding/portfolio/income/duration/income-investment-duration.html',
                controller: 'portfolioIncomeDurationCtrl'
            })
            .state({
                name: 'onboarding-portfolio.income-target',
                url: '/income/target',
                templateUrl: 'views/onboarding/portfolio/income/target/income-investment-target.html',
                controller: 'portfolioIncomeTargetCtrl'
            })
            .state({
                name: 'onboarding-investment',
                url: '/onboarding/investment',
                templateUrl: 'views/onboarding/investment/investment.html',
                controller: 'onboardingInvestmentCtrl',
                resolve: {
                    initialState: function () {
                        return {};
                    }
                }
            })
            .state({
                name: 'onboarding-investment.charts',
                url: '/charts',
                templateUrl: 'views/onboarding/investment/charts/ui-view.html'
            })
            .state({
                name: 'onboarding-investment.charts.assetAllocation',
                url: '/asset-allocation',
                views: {
                    'onboarding-investment-chart-titles@onboarding-investment.charts': {
                        templateUrl: 'views/onboarding/investment/charts/asset-allocation/heading.html'
                    }
                }
            })
            .state({
                name: 'onboarding-investment.charts.assetAllocation.region',
                url: '/region',
                views: {
                    'onboarding-investment-chart-titles@onboarding-investment.charts': {
                        templateUrl: 'views/onboarding/investment/charts/asset-allocation/region/heading.html'
                    }
                }
            })
            .state({
                name: 'onboarding-investment.charts.assetAllocation.list',
                url: '/list',
                views: {
                    'onboarding-investment-chart-titles@onboarding-investment.charts': {
                        templateUrl: 'views/onboarding/investment/charts/asset-allocation/list/heading.html'
                    }
                }
            })
            .state({
                name: 'onboarding-investment.charts.assetAllocation.list.expanded',
                url: '/expanded',
                views: {
                    'onboarding-investment-chart-titles@onboarding-investment.charts': {
                        templateUrl: 'views/onboarding/investment/charts/asset-allocation/list/heading-expanded.html'
                    }
                }
            })
            .state({
                name: 'onboarding-investment.charts.futurePerformance',
                url: '/future-performance',
                views: {
                    'onboarding-investment-chart-titles@onboarding-investment.charts': {
                        templateUrl: 'views/onboarding/investment/charts/future-performance/heading.html'
                    }
                }
            })
            .state({
                name: 'onboarding-investment.charts.futurePerformance.expanded',
                url: '/expanded'
            })
            .state({
                name: 'onboarding-investment.charts.futurePerformance.lossscenarios',
                url: '/loss-scenarios',
                views: {
                    'onboarding-investment-chart-titles@onboarding-investment.charts': {
                        templateUrl: 'views/onboarding/investment/charts/future-performance/loss-scenarios/heading.html'
                    }
                }
            })
            .state({
                name: 'onboarding-investment.charts.pastPerformance',
                url: '/past-performance',
                views: {
                    'onboarding-investment-chart-titles@onboarding-investment.charts': {
                        templateUrl: 'views//onboarding/investment/charts/past-performance/heading.html'
                    }
                }
            })
            .state({
                name: 'onboarding-investment.charts.pastPerformance.expanded',
                url: '/expanded'
            })
            .state({
                name: 'onboarding-portfolio.summary',
                url: '/summary',
                templateUrl: 'views/onboarding/portfolio/summary/summary.html',
                controller: 'portfolioSummaryCtrl'
            })
            .state({
                name: 'onboarding-portfolio.onboarding-risk',
                url: '/onboarding/risk',
                templateUrl: 'views/onboarding/portfolio/risk/risk.html',
                controller: 'riskCtrl'
            })
            .state({
                name: 'onboarding-portfolio.onboarding-risk.intro',
                url: '/intro',
                templateUrl: 'views/onboarding/portfolio/risk/risk-intro.html'
            })
            .state({
                name: 'onboarding-portfolio.onboarding-risk.question1',
                url: '/question1',
                templateUrl: 'views/onboarding/portfolio/risk/question1.html'
            })
            .state({
                name: 'onboarding-portfolio.onboarding-risk.question2',
                url: '/question2',
                templateUrl: 'views/onboarding/portfolio/risk/question2.html'
            })
            .state({
                name: 'onboarding-portfolio.onboarding-risk.question3',
                url: '/question3',
                templateUrl: 'views/onboarding/portfolio/risk/question3.html'
            })
            .state({
                name: 'onboarding-portfolio.onboarding-risk.question4',
                url: '/question4',
                templateUrl: 'views/onboarding/portfolio/risk/question4.html'
            })
            .state({
                name: 'onboarding-portfolio.onboarding-risk.question5',
                url: '/question5',
                templateUrl: 'views/onboarding/portfolio/risk/question5.html'
            })
            .state({
                name: 'onboarding-portfolio.onboarding-risk.rating',
                url: '/rating',
                templateUrl: 'views/onboarding/portfolio/risk/risk-rating.html'
            })
            .state({
                name: 'onboarding-activation',
                url: '/onboarding/activation',
                templateUrl: 'views/onboarding/activation/activation.html'
            })
            .state({
                name: 'onboarding-activation.start',
                url: '/start',
                templateUrl: 'views/onboarding/activation/start/start.html',
                controller: 'activation.startCtrl'
            })
            .state({
                name: 'onboarding-activation.about-you',
                url: '/about-you',
                templateUrl: 'views/onboarding/activation/about/about-you.html',
                controller: 'activation.aboutCtrl'
            })
            .state({
                name: 'onboarding-activation.verify',
                url: '/verify',
                templateUrl: 'views/onboarding/activation/verify/verify.html',
                controller: 'activation.verifyCtrl'
            })
            .state({
                name: 'onboarding-activation.investment-knowledge',
                url: '/investment-knowledge',
                templateUrl: 'views/onboarding/activation/investment-knowledge/investment-knowledge.html',
                controller: 'activation.investmentKnowledgeCtrl'
            })
            .state({
                name: 'onboarding-activation.bank-details',
                url: '/bank-details',
                templateUrl: 'views/onboarding/activation/bank-details/bank-details.html',
                controller: 'activation.bankDetailsCtrl'
            })
            .state({
                name: 'onboarding-activation.employment-status',
                url: '/employment-status',
                templateUrl: 'views/onboarding/activation/employment-status/employment-status.html',
                controller: 'activation.empStatusCtrl'
            })
            .state({
                name: 'onboarding-activation.about-your-investment',
                url: '/about-your-investment',
                templateUrl: 'views/onboarding/activation/about-your-investment/about-your-investment.html',
                controller: 'activation.aboutYourInvestmentCtrl'
            })
            .state({
                name: 'dashboard',
                url: '/dashboard',
                templateUrl: 'views/dashboard/dashboard.html',
                controller: 'dashboardCtrl'
            });

        $localStorageProvider.setKeyPrefix('tillerWebApp.');

        $sessionStorageProvider.setKeyPrefix('tillerWebApp.');

        // set the domains and variables for each environment
        envServiceProvider.config({
            domains: {
                development: ['localhost', 'dev.local'],
                qa: ['qa-discovery.tiller-web-app.space04.co.uk'],
                stage: ['tiller-web-app.space04.co.uk'],
                feature: ['feature-onboarding.tiller-web-app.space04.co.uk'],
                uat: ['tillerapp.azurewebsites.net']
            },
            vars: {
                development: {
                    apiUrl: 'https://tillerapidev.azurewebsites.net/api/',
                    identityApiBaseUri: 'https://tillerauthapidev.azurewebsites.net',
                    clientId: '82fb053f-0451-4735-b6a2-70ece6969339',
                    basicAuth: false
                },
                qa: {
                    apiUrl: 'https://tillerapi.azurewebsites.net/api/',
                    identityApiBaseUri: 'https://tillerauthapi.azurewebsites.net',
                    clientId: '82fb053f-0451-4735-b6a2-70ece6969339',
                    basicAuth: true
                },
                stage: {
                    apiUrl: 'https://tillerapi.azurewebsites.net/api/',
                    identityApiBaseUri: 'https://tillerauthapi.azurewebsites.net',
                    clientId: '82fb053f-0451-4735-b6a2-70ece6969339',
                    basicAuth: true
                },
                feature: {
                    apiUrl: 'https://tillerapi.azurewebsites.net/api/',
                    identityApiBaseUri: 'https://tillerauthapi.azurewebsites.net',
                    clientId: '82fb053f-0451-4735-b6a2-70ece6969339',
                    basicAuth: true
                },
                uat: {
                    apiUrl: 'https://tillerapi.azurewebsites.net/api/',
                    identityApiBaseUri: 'https://tillerauthapi.azurewebsites.net',
                    clientId: '82fb053f-0451-4735-b6a2-70ece6969339',
                    basicAuth: false
                }
            }
        });

    }])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    })
    .run(['$rootScope', '$urlRouter', '$location', '$state', '$timeout', function ($rootScope, $urlRouter, $location, $state, $timeout) {

        $rootScope.$on('$locationChangeSuccess', function (e, newUrl, oldUrl) {

            // Prevent $urlRouter's default handler from firing
            e.preventDefault();

            $rootScope.currentUIState = $state;


            $rootScope.$watch('currentUIState.current.name', function (newState, oldState) {
                // console.log('state change...')
                // console.log('new state...', newState)
                // console.log('old state...', oldState)
                if (newState !== oldState) {
                    $timeout(function () {
                        $rootScope.$emit('view.change', newState);
                    }, 100);
                }

            });

            $urlRouter.sync();

        });

        $rootScope.getCurrentViewClass = function () {

            var uiParts = $state.current.name.split('.');
            var classNames = [];

            for (var i = 0; i < uiParts.length; i++) {
                classNames.push((i === 0) ? uiParts[0] : classNames[i - 1] + '-' + uiParts[i]);
            }

            // return 'ui-' + $state.current.name.replace(/\./g,'-');
            return 'ui-' + classNames.join(' ui-');

        };

        $urlRouter.listen();
         
    }]);