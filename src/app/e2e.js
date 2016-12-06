//$('html').attr('ng-app', 'tillerWebAppE2E');
angular.module('tillerWebAppE2E', ['tillerWebApp', 'ngMockE2E'])
    .run(function ($httpBackend, $http, envService) {
        
        var authApi = "identityApiBaseUri";
        var tillerApi = "apiUrl";

        //got to be synchronous :(
        var loadJson = function (jsonPath) {
            var result = null;
            jQuery.ajax({
                url: jsonPath,
                success: function (response) {
                    result = response;
                },
                async: false
            });
            return result;
        };

        var onGet = function (api, apiPath, jsonPath) {
            var jsonStub = loadJson(jsonPath);

            var pathMatch = function (url) {
                if (url.toLowerCase().indexOf((envService.read(api) + apiPath).toLowerCase()) != -1)
                    return true;
                return false;
            };

            $httpBackend.whenGET(pathMatch).respond(jsonStub);
        };
        var onPost = function (api, apiPath, data, jsonPath) {
            var jsonStub = loadJson(jsonPath);
            $httpBackend.whenPOST(envService.read(api) + apiPath, data).respond(jsonStub);
        };
        var onPut = function (api, apiPath, data, jsonPath) {
            var jsonStub = loadJson(jsonPath);
            $httpBackend.whenPUT(envService.read(api) + apiPath, data).respond(jsonStub);
        };

        //Initiate portfolio creation for new user
        onGet(tillerApi, 'portfolio/initiateportfoliocreation', "/stub/portfolio/initiateportfoliocreation_unknown_user.json");

        //Update portfolio
        onPut(tillerApi, 'portfolio/updateportfolio?portfolioId=7', undefined, "/stub/portfolio/update_portfolio_request.json");

        //Get portfolio
        onGet(tillerApi, 'portfolio/getportfolio?portfolioId=7', "/stub/portfolio/get_portfolio_response.json");

        //Get portfolios
        onGet(tillerApi, 'portfolio/getportfolios', "/stub/portfolio/get_portfolios_response.json");

        //Login
        onPost(authApi, '/token', undefined, "/stub/user/login_response_ok.json"); //undefined data will match for any login

        //known user
        onGet(authApi, "/api/account/getuser?id=knownUser@test.com", "/stub/user/get_user_response_known.json");

        //unknown users
        onGet(authApi, "/api/account/getuser", "/stub/user/get_user_response_unknown.json");

        //Create user
        onPost(authApi, '/api/account/createuser', undefined, "/stub/user/create_user_response.json"); //undefined means any submitted creation model will do

        //Suitability questions
        onGet(tillerApi, "portfolio/suitabilityquestions", "/stub/risk/suitability_questions_response.json");

        //Answer suitability questions
        onPost(tillerApi, 'portfolio/suitabilityanswer', undefined, "/stub/risk/update_suitability_question_response.json");

        //Get portfolio risk level
        onPost(tillerApi, 'portfolio/calculateportfoliorisk?portfolioId=7', undefined, "/stub/risk/calculate_portfolio_risk_response.json");

        onGet(tillerApi, "profile/profile", "/stub/profile/get_profile_response.json");

        //profile/updateclientprofile
        //Update profile
        onPut(tillerApi, 'profile/updateclientprofile?profileId=1', undefined, "/stub/profile/get_profile_response.json");


        //Everything not covered above will pass through to the api
        $httpBackend.when('GET').passThrough();
        $httpBackend.when('POST').passThrough();
        $httpBackend.when('PUT').passThrough();
    });