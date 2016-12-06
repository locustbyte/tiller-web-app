'use strict';

angular.module('validationService', [])
    /*
     * Validation helper
     */
    .service('validationService', function () {

        this.findRule = function(validationRules, rulePropertyName) {

            return validationRules.find(function(rule){

                return rule.propertyName === rulePropertyName;

            });

        };

        this.validate = function(validationRule, value) {

            if(validationRule) {

                return new RegExp(validationRule.validationExpression).test(value);

            }

            return true;

        };

    })
;