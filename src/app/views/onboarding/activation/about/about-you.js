
'use strict';

angular.module('tillerWebApp')

    .controller('activation.aboutCtrl', ['$scope', '$controller', '$timeout', function ($scope, $controller, $timeout) {

        $controller('activationCtrl', { $scope: $scope });

        $scope.address = { text: "" };

        //todo: factor address lookup out of controller to directive---------------------

        var pca_key = "CH62-BD45-EG23-WW28"; //todo: into env

        $scope.CapturePlus_Interactive_Find_v2_10 = function (Key, SearchTerm, LastId, SearchFor, Country, LanguagePreference, MaxSuggestions, MaxResults) {
            $.getJSON("//services.postcodeanywhere.co.uk/CapturePlus/Interactive/Find/v2.10/json3.ws?callback=?",
            {
                Key: Key,
                SearchTerm: SearchTerm,
                LastId: LastId,
                SearchFor: SearchFor,
                Country: Country,
                LanguagePreference: LanguagePreference,
                MaxSuggestions: MaxSuggestions,
                MaxResults: MaxResults
            },
            function (data) {
                // Test for an error
                if (data.Items.length == 1 && typeof (data.Items[0].Error) != "undefined") {
                    // Show the error message
                    console.log(data.Items[0].Description);
                    console.log("Using test data instead.")
                }
                else {
                    // Check if there were any items found
                    if (data.Items.length == 0)
                        //alert("Sorry, there were no results");
                        $scope.foundAddresses = null;
                    else {
                        $scope.foundAddresses = data.Items;
                        $scope.$apply();
                    }
                }
            });
        };

        $scope.Capture_Interactive_Retrieve_v1_00 = function (Key, Id, Field1Format, Field2Format, Field3Format, Field4Format, Field5Format, Field6Format, Field7Format, Field8Format, Field9Format, Field10Format, Field11Format, Field12Format, Field13Format, Field14Format, Field15Format, Field16Format, Field17Format, Field18Format, Field19Format, Field20Format) {
            $.getJSON("//services.postcodeanywhere.co.uk/Capture/Interactive/Retrieve/v1.00/json3.ws?callback=?",
            {
                Key: Key,
                Id: Id,
                Field1Format: Field1Format,
                Field2Format: Field2Format,
                Field3Format: Field3Format,
                Field4Format: Field4Format,
                Field5Format: Field5Format,
                Field6Format: Field6Format,
                Field7Format: Field7Format,
                Field8Format: Field8Format,
                Field9Format: Field9Format,
                Field10Format: Field10Format,
                Field11Format: Field11Format,
                Field12Format: Field12Format,
                Field13Format: Field13Format,
                Field14Format: Field14Format,
                Field15Format: Field15Format,
                Field16Format: Field16Format,
                Field17Format: Field17Format,
                Field18Format: Field18Format,
                Field19Format: Field19Format,
                Field20Format: Field20Format
            },
            function (data) {
                // Test for an error
                if (data.Items.length == 1 && typeof (data.Items[0].Error) != "undefined") {
                    // Show the error message
                    alert(data.Items[0].Description);
                }
                else {
                    // Check if there were any items found
                    if (data.Items.length == 0)
                        alert("Sorry, there were no results");
                    else {
                        $scope.address.full = data.Items[0];
                        $scope.setAddressForApi();
                        $scope.$apply();
                    }
                }
            });
        }

        $scope.getAddress = function () {
            if ($scope.address.text && $scope.address.text.length > 3) {
                $scope.CapturePlus_Interactive_Find_v2_10(pca_key, $scope.address.text);
            }
        };

        $timeout(function () {
            $('.address-look-up-results').scrollbar();
            $('.address-look-up-results').on("click", 'li', function () {
                $scope.address = {
                    text: $(this).html(),
                    id: $(this).attr('id')
                }
                $scope.buildAddress();
                $scope.foundAddresses = null;
                $scope.$apply();
            });

        }, 1000); //todo: need for a delay means something wrong here ... perhaps when in the context of a directive link this problem will go away.


        //--------------above to directive--------------------------------------------------------------

        $scope.foundAddresses = null;

        $scope.buildAddress = function () {
            $scope.Capture_Interactive_Retrieve_v1_00(pca_key, $scope.address.id);
            $scope.profile.addresses = [];
        };

        $scope.setAddressForApi = function () {
            $scope.profile.addresses = [];
            $scope.profile.addresses.push({
                "address1": $scope.address.full.Line1,
                "address2": $scope.address.full.Line2,
                "address3": $scope.address.full.City,
                "address4": $scope.address.full.AdminAreaName,
                "postOrZip": $scope.address.full.PostalCode,
                "countryCode": $scope.address.full.CountryIso2
            });
        };

        $scope.buildAddressFromApi = function () {
            if ($scope.profile.addresses && $scope.profile.addresses.length > 0)
                $scope.address.text = $scope.profile.addresses[0].address1 + ' ' + $scope.profile.addresses[0].address2 + ' ' + $scope.profile.addresses[0].postOrZip;
        };

        $scope.daysOfMonth = [];
        $scope.monthsOfYear = [];
        $scope.years = [];

        //Build dates. Todo: use date validation / only allow actual dates to be selected e.g 31st Feb not allowed.
        var i = 0;
        for (i = 1; i < 32; i++) {
            $scope.daysOfMonth.push({ id: i, value: ('0' + i).slice(-2) });
        };
        for (i = 1; i < 13; i++) {
            $scope.monthsOfYear.push({ id: i, value: ('0' + i).slice(-2) });
        };

        var currentYear = new Date().getFullYear();
        var latestYear = currentYear - 17;
        for (i = latestYear; i > 1915; i--) {
            $scope.years.push({ id: i, value: i });
        };

        $scope.day = 1;
        $scope.month = 0;
        $scope.year = latestYear;

        $scope.selectDayOfMonth = function (day) {
            $scope.day = day;
            $scope.setDate();
        };

        $scope.selectMonthOfYear = function (month) {
            $scope.month = month;
            $scope.setDate();
        };

        $scope.selectYear = function (year) {
            $scope.year = year;
            $scope.setDate();
        };

        $scope.setDate = function () {
            $scope.profile.dateOfBirth = new Date($scope.year.value, $scope.month.value - 1, $scope.day.value).toISOString();
        };


        $scope.setPhoneNumber = function () {
            $scope.profile.phoneNumber = $scope.phoneNumber;
            $scope.profile.phoneNumberAreaCode = $scope.areaCode;

            if ($scope.areaCode && $scope.areaCode.length === 1 && $scope.areaCode !== "+")
                $scope.areaCode = "+" + $scope.areaCode;
            else if ($scope.areaCode === "+")
                $scope.areaCode = "";
        }

        //todo: to directive
        var isNumberKey = function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
        };

        $scope.validateCountryCode = function (e) {
            if(!isNumberKey(e))
                e.preventDefault();
            //more country code validation from the API to follow
        };

        $scope.validateTelephoneNumber = function (e) {
            if (!isNumberKey(e))
                e.preventDefault();
            //more validation from the API to follow
        }

        $scope.allValid = function () {
            return $scope.profile.phoneNumber && $scope.profile.phoneNumber.length > 0 &&
                $scope.profile && $scope.profile.addresses &&
                $scope.profile.addresses.length > 0 && $scope.address && $scope.address.text && $scope.address.text.length > 3;
            //todo: more form validation from API pending.
        }

        $scope.initialiseProfileData = function () {
            $scope.areaCode = $scope.profile.phoneNumberAreaCode || "";
            $scope.phoneNumber = $scope.profile.phoneNumber || "";

            var dob = new Date($scope.profile.dateOfBirth);

            $scope.day = $.grep($scope.daysOfMonth, function (a) {
                return a.value === ('0' + dob.getDate()).slice(-2);
            })[0];
            $scope.month = $.grep($scope.monthsOfYear, function (a) {
                return a.value === ('0' + (dob.getMonth() + 1)).slice(-2);
            })[0];
            $scope.year = $.grep($scope.years, function (a) {
                return a.value === dob.getFullYear();
            })[0];

            $scope.setDate();
            $scope.buildAddressFromApi();
            $scope.setPhoneNumber();
        };

        if ($scope.profile != null)
            $scope.initialiseProfileData();

    }]);