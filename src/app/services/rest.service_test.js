'use strict';

describe('restService', function() {

    var restService, $httpBackend, sessionResponse, allocationsResponse, portfolioThemesResponse;

    sessionResponse = {
        "sessionToken": "370957ce-cefd-4b93-ad7d-44d27598934d",
        "emailAddress": "",
        "isMarketingAllowed": false,
        "isNewProfile": true,
        "totalYears": 10,
        "upFrontSum": 10000,
        "topUp": 500,
        "target": 50000
    };

    allocationsResponse = {
        "allocationsId": "95834af898c946318ec573de69323785",
        "sessionId": "63e34fe1-9452-4d29-80f4-c62d50b09450",
        "allocationsModels": [
            {
                "securityId": 3,
                "name": "test",
                "isin": "GBE102AC0B6E",
                "sedol": "BE102AC0",
                "assetClass": "Eq",
                "region": "Dev",
                "sector": "Mix",
                "weight": 1
            }
        ]
    };

    portfolioThemesResponse = []; //ToDo: need to add proper example of themes response here when the API is ready...

    beforeEach(module('tillerWebApp'));

    beforeEach(module('stateMock'));

    beforeEach(inject(function (_$httpBackend_, _restService_) {
        $httpBackend = _$httpBackend_;
        restService = _restService_;
    }));

    it('should have an initialiseSession method', function() {
        expect(angular.isFunction(restService.initialiseSession)).toBe(true);
    });

    it('initialiseSession method should have a sessionToken key', function() {

        /**
         * Mock the $http request using $httpBackend to test the service service
         */
        $httpBackend.expectPOST(/.*?discovery\/initialisesession?.*/g).respond(sessionResponse);

        restService.initialiseSession().then(function(response){

            expect(response.sessionToken).toBeDefined('need');

        });

        $httpBackend.flush();
    });

    it('initialiseSession method should have a sessionToken key which is a string', function() {

        /**
         * Mock the $http request using $httpBackend to test the service service
         */
        $httpBackend.expectPOST(/.*?discovery\/initialisesession?.*/g).respond(sessionResponse);

        restService.initialiseSession().then(function(response){


            expect(typeof response.sessionToken).toEqual('string');

        });

        $httpBackend.flush();
    });

    it('initialiseSession method should have a sessionToken key which contains a dash', function() {

        /**
         * Mock the $http request using $httpBackend to test the service service
         */
        $httpBackend.expectPOST(/.*?discovery\/initialisesession?.*/g).respond(sessionResponse);

        restService.initialiseSession().then(function(response){
            expect(response.sessionToken).toContain('-');

        });

        $httpBackend.flush();
    });

    it('should have an getAllocations method', function() {
        expect(angular.isFunction(restService.getAllocations)).toBe(true);
    });

    it('getAllocations method should return an object', function() {

        var params = {
            riskValue: 3,
            take: 1
        };

        /**
         * Mock the $http request using $httpBackend to test the service service
         */
        $httpBackend.expectPOST(/.*?discovery\/getallocations?.*/g).respond(allocationsResponse);

        restService.getAllocations(params).then(function(response){

            expect(typeof response).toEqual('object');

        });

        $httpBackend.flush();
    });

    it('getAllocations method should have an allocationsId which is a string', function() {

        var params = {
            riskValue: 3,
            take: 1
        };

        /**
         * Mock the $http request using $httpBackend to test the service service
         */
        $httpBackend.expectPOST(/.*?discovery\/getallocations?.*/g).respond(allocationsResponse);

        restService.getAllocations(params).then(function(response){

            expect(typeof response.data.allocationsId).toEqual('string');

        });

        $httpBackend.flush();
    });

    it('getAllocations method should return and array of allocationsModels with an ID (isin) as a string', function() {

        var params = {
            riskValue: 3,
            take: 1
        };

        /**
         * Mock the $http request using $httpBackend to test the service service
         */
        $httpBackend.expectPOST(/.*?discovery\/getallocations?.*/g).respond(allocationsResponse);

        restService.getAllocations(params).then(function(response){

            expect(typeof response.data.allocationsModels[0].isin).toEqual('string');

        });

        $httpBackend.flush();
    });


    it('should have a getPortfolioThemes method', function() {
        expect(angular.isFunction(restService.getPortfolioThemes)).toBe(true);
    });

    it('getPortfolioThemes method should return an array', function() {

        /**
         * Mock the $http request using $httpBackend to test the service service
         */
        $httpBackend.expectPOST(/.*?discovery\/portfoliothemes?.*/g).respond(portfolioThemesResponse);

        restService.getPortfolioThemes().then(function(response){

            expect(Array.isArray(response)).toBe(true);

        });

        $httpBackend.flush();
    });

});