angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('main', {

    abstract: true,
    template: '<ui-view />'
  });

  $stateProvider.state('private', {
    parent: 'auth',
    abstract: true,
    auth: true,
    template: '<ui-view />'
  });
  $stateProvider.state('public', {
    parent: 'auth',
    abstract: true,
    auth: false,
    template: '<ui-view />'
  });

  $stateProvider.state('sign-in', {
    url: '/sign-in?username',
    controller: 'SignInController',
    templateUrl: 'templates/sign-in.html',
    ncyBreadcrumb: {
      label: 'Sign in to Gandalf'
    }
  });

  $stateProvider.state('decision-list', {
    parent: 'private',
    url: '/?size?page',
    params: {
      size: '25'
    },
    controller: 'DecisionListController',
    templateUrl: 'templates/decision-list.html',
    ncyBreadcrumb: {
      label: 'Tables'
    }
  }).state('decision-create', {
    parent: 'private',
    url: '/decision/create',
    controller: 'DecisionCreateController',
    templateUrl: 'templates/decision-details.html',
    ncyBreadcrumb: {
      label: 'Create new table',
      parent: 'decision-list'
    }
  }).state('decision-details', {
    parent: 'private',
    url: '/decision/:id',
    controller: 'DecisionDetailsController',
    templateUrl: 'templates/decision-details.html',
    resolve: {
      decision: ['DecisionTable', '$stateParams', function (DecisionTable, $stateParams) {
        return DecisionTable.byId($stateParams.id);
      }]
    },
    ncyBreadcrumb: {
      label: 'Edit: {{table.title}}',
      parent: 'decision-list'
    }
  });

  $stateProvider.state('history-list', {
    parent: 'private',
    url: '/history?tableId?size?page',
    params: {
      size: '25'
    },
    controller: 'HistoryListController',
    templateUrl: 'templates/history-list.html',
    ncyBreadcrumb: {
      label: 'History'
    }
  }).state('history-details', {
    parent: 'private',
    url: '/history/:id',
    controller: 'HistoryDetailsController',
    templateUrl: 'templates/history-details.html',
    ncyBreadcrumb: {
      label: 'Decision: {{table.id}}',
      parent: 'history-list'
    },
    resolve: {
      historyResult: ['DecisionHistoryTable', '$stateParams', function (DecisionHistoryTable, $stateParams) {
        var res = new DecisionHistoryTable($stateParams.id);
        return res.fetch();
      }]
    }
  });

  $stateProvider.state('debugger-details', {
    parent: 'private',
    url: '/table/:id/debug',
    controller: 'DebuggerDetailsController',
    templateUrl: 'templates/debugger-details.html',
    ncyBreadcrumb: {
      label: 'Debugger: {{table.id}}',
      parent: 'decision-details'
    },
    params: {
      id: null,
      decision: null
    },
    resolve: {
      table: ['DecisionTable', '$stateParams', function (DecisionTable, $stateParams) {
        return DecisionTable.byId($stateParams.id);
      }]
    }
  });

  $urlRouterProvider.otherwise('/');
});
