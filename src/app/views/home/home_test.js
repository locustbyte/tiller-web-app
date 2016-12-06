'use strict';

describe('homeCtrl', function() {

  beforeEach(module('tillerWebApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;

  }));


  describe('emailValidationModel', function(){

    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('homeCtrl', { $scope: $scope });
    });

    it('should have a userHasInput value of false', inject(function(){
      expect($scope.userHasInput).toBeFalsy();
    }));

    it('should have an isValid value of false', inject(function() {

      expect($scope.emailValidationModel.isEmailValid).toEqual(false);

    }));

  });

});