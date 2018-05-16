require('angular/angular');

global.gitlist.ng =  angular.module('p3x-gitlist', [
]);

global.gitlist.ng.config(($interpolateProvider) => {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
})

require('./injector/angular')

global.gitlist.ng.run(() => {
})

angular.element(document).ready(() => {
    const bootstrapElement = document.getElementById('p3x-gitlist-ng-bootstrap');
    angular.bootstrap(bootstrapElement, ['p3x-gitlist']);
})
