require('angular');
//require('angular-sanitize');

global.gitlist.ng =  angular.module('p3x-gitlist', [
//    'ngSanitize'
]);
//require('./controller/main');
require('./component/commit-diff.js');
//require('./angular/main-controller');

global.gitlist.ng.run(($rootScope) => {
    $rootScope.gitlist = window.gitlist;
})

angular.element(document).ready(() => {
    const bootstrapElement = document.getElementById('p3x-gitlist-ng');
    angular.bootstrap(bootstrapElement, ['p3x-gitlist']);
})
