'use strict';


angular.module('app', [
  'conditions',
  'ng-equal',
  'lodash',

  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'ui.sortable',
  'ncy-angular-breadcrumb',

  'hljs'
]);

angular.module('app').constant('ENV', window.env);


angular.module('app').filter('string', function () {
  return function (str) {
    return str == null ? 'null' : str.toString();
  };
});

angular.module('app').config(function (hljsServiceProvider) {
  hljsServiceProvider.setOptions({
    // replace tab with 4 spaces
    tabReplace: '  '
  });
});
