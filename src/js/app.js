'use strict';


angular.module('app', [
  'conditions',

  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'ui.sortable'
]);

angular.module('app').constant('ENV', window.env);
