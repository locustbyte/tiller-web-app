'use strict';

describe('helperService', function() {

    var helperService;

    beforeEach(module('tillerWebApp'));

    beforeEach(inject(function ($injector) {
        helperService = $injector.get('helperService');
    }));

    it('should have a slugify method', function() {
        expect(angular.isFunction(helperService.slugify)).toBe(true);
    });

    it('should return a_useful-slug when passed "A useful Slug"', function() {
        expect(helperService.slugify('A useful Slug')).toBe('a-useful-slug');
    });

});