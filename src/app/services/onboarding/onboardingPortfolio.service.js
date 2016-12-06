'use strict';

angular.module('onboardingPortfolioService', [])
    .service('onboardingPortfolioService', ['$http', '$q', '$rootScope', '$state', '$sessionStorage', 'identityApiAdapter', 'envService', 'PubSub', 'errorService', function ($http, $q, $rootScope, $state, $sessionStorage, identityApiAdapter, envService, PubSub, errorService) {

        var serviceBase = envService.read("apiUrl"),
            portfolio = this;

        portfolio.getPortfolioModels = function () {

            if(portfolio.portfolioTypes == undefined)
            {

                return $http.get(serviceBase + 'portfolio/initiateportfoliocreation').then(function (response) {

                    portfolio.setPortfolioTypes(response.data);
                    portfolio.setWrappers(response.data);
                    portfolio.setRiskTargets(response.data);
                    portfolio.setAllocationModels(response.data);

                    return response;

                });
            }
            else
            {
                return Promise.resolve(portfolio.portfolioTypes);
            }
        };

        portfolio.updatePortfolio = function (portfolioUpdateModel) {
            return $http.put(serviceBase + 'portfolio/updateportfolio?portfolioId=' + portfolioUpdateModel.portfolioId, portfolioUpdateModel).then(function (response) {

                if(response.status === 200)
                {
                    PubSub.publish('portfolio.updated', response);

                    return response;
                }
                else
                {
                    response.source = serviceBase + 'portfolio/updateportfolio?portfolioId=' + portfolioUpdateModel.portfolioId;
                    errorService.setError(response);
                }

            }, function(response) {

                response.source = serviceBase + 'portfolio/updateportfolio?portfolioId=' + portfolioUpdateModel.portfolioId;
                errorService.setError(response);

            });
        };

        portfolio.getPortfolio = function (portfolioId) {
            return $http.get(serviceBase + 'portfolio/getportfolio?portfolioId=' + portfolioId).then(function (response) {

                if(response.status === 200)
                {
                    return response;
                }
                else
                {
                    response.source = serviceBase + 'portfolio/getportfolio?portfolioId=' + portfolioId;
                    errorService.setError(response);

                }

            }, function(response) {

                response.source = serviceBase + 'portfolio/getportfolio?portfolioId=' + portfolioId;
                errorService.setError(response);

            });
        };

        //Gets all the portfolios for the logged in user
        portfolio.getPortfolios = function () {
            return $http.get(serviceBase + 'portfolio/getportfolios').then(function (response) {

                if(response.status === 200)
                {
                    return response;
                }
                else
                {

                    response.source = serviceBase + 'portfolio/getportfolios';
                    errorService.setError(response);

                }

            }, function(response) {

                response.source = serviceBase + 'portfolio/getportfolios';
                errorService.setError(response);

            });
        };

        //GET /api/portfolio/suitabilityquestions
        portfolio.getSuitabilityquestions = function (portfolioId) {
            return $http.get(serviceBase + 'portfolio/suitabilityquestions').then(function (response) {

                if(response.status === 200)
                {
                    return response;
                }
                else
                {

                    response.source = serviceBase + 'portfolio/suitabilityquestions';
                    errorService.setError(response);

                }
            }, function(response) {

                response.source = serviceBase + 'portfolio/suitabilityquestions';
                errorService.setError(response);

            });
        };

        //POST /api/portfolio/suitabilityanswer
        portfolio.answerSuitabilityQuestion = function (suitabilityQuestionUpdateModel) {
            return $http.post(serviceBase + 'portfolio/suitabilityanswer', suitabilityQuestionUpdateModel).then(function (response) {

                if(response.status === 200)
                {
                    return response;
                }
                else
                {

                    response.source = serviceBase + 'portfolio/suitabilityanswer', suitabilityQuestionUpdateModel;
                    errorService.setError(response);

                }

            }, function(response) {

                response.source = serviceBase + 'portfolio/suitabilityanswer', suitabilityQuestionUpdateModel;
                errorService.setError(response);

            });
        };

        //POST /api/portfolio/calculateportfoliorisk
        portfolio.calculatePortfolioRisk = function (portfolioId) {
            return $http.post(serviceBase + 'portfolio/calculateportfoliorisk?portfolioId=' + portfolioId, {}).then(function (response) {

                if(response.status === 200)
                {
                    return response;
                }
                else
                {

                    response.source = serviceBase + 'portfolio/calculateportfoliorisk?portfolioId=' + portfolioId;
                    errorService.setError(response);

                }

            }, function(response) {

                response.source = serviceBase + 'portfolio/calculateportfoliorisk?portfolioId=' + portfolioId;
                errorService.setError(response);

            });
        };

        /**
         * Sets up the portfolioTypes object for use by controllers to extract the
         */
        portfolio.setPortfolioTypes = function(data)
        {
            portfolio.portfolioTypes = {};

            angular.forEach(data.portfolioTypes, function(type, key){

                portfolio.portfolioTypes[type.portfolioTypeId] = type.portfolioType;

            });

        };

        /**
         * Gets a portfolioTypeLabel from an id
         * @param id
         * @returns {*}
         */
        portfolio.getPortfolioTypeLabel = function(id)
        {
            return portfolio.portfolioTypes[id];

        };

        /**
         * Sets up the portfolioTypes object for use by controllers to extract the
         */
        portfolio.setWrappers = function(data)
        {
            portfolio.wrappers = data.wrappers;

        };

        /**
         * Gets a wrapper object from an id
         * @param id
         * @returns {*}
         */
        portfolio.getWrapper = function(id)
        {
            portfolio.wrapper = false;

            portfolio.wrappers.filter(function(obj){
                if(obj.wrapperId === parseInt(id))
                {
                    //console.log('this should be returned', obj);
                    portfolio.wrapper = obj;
                }
            });

            return portfolio.wrapper;

        };

        /**
         * Sets up the portfolioTypes object for use by controllers to extract the
         */
        portfolio.setRiskTargets = function(data)
        {
            portfolio.riskTargets = data.riskTargets;

        };

        /**
         * Gets a risk object from an id
         * @param id
         * @returns {*}
         */
        portfolio.getRisk = function(id)
        {
            portfolio.riskTarget = false;

            portfolio.riskTargets.filter(function(obj){
                if(obj.riskValue === parseInt(id))
                {
                    //console.log('this should be returned', obj);
                    portfolio.riskTarget = obj;
                }
            });

            return portfolio.riskTarget;

        };

        /**
         * Sets up the portfolioTypes object for use by controllers to extract the
         */
        portfolio.setAllocationModels = function(data)
        {
            portfolio.allocationModelTypes = data.allocationModelTypes;

        };

        /**
         * Gets an allocation object from an id
         * @param id
         * @returns {*}
         */
        portfolio.getAllocationModel = function(id)
        {
            portfolio.allocationModel = false;

            portfolio.allocationModelTypes.filter(function(obj){
                if(obj.allocationModelTypeId === parseInt(id))
                {
                    portfolio.allocationModel = obj;
                }
            });

            return portfolio.allocationModel;

        };


        //get the portfolio models as defined by the api
        portfolio.getPortfolioModels()
            .then(function success(response) {

                PubSub.publish('onboarding.portfolioModels.loaded', response.data.portfolioModel);

            }, function error(response) {

            });

    }]);