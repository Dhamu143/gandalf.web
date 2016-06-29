"use strict";

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('tables', {
    parent: 'private',
    url: '/tables',
    abstract: 'tables-list',
    template: '<ui-view />'
  });

  $stateProvider.state('tables-list', {
    parent: 'tables',
    url: '?size?page',
    params: {
      size: '25'
    },
    controller: 'TablesListController',
    templateUrl: 'templates/tables-list.html'
  }).state('tables-create', {
    parent: 'tables',
    url: '/create',
    controller: 'TablesCreateController',
    templateUrl: 'templates/tables-create.html'
  });

  $stateProvider.state('tables-details', {
    parent: 'tables',
    abstract: '.edit',
    url: '/:id',
    templateUrl: 'templates/tables-details.html',
    controller: 'TablesDetailsController',
    resolve: {
      table: ['DecisionTable', '$stateParams', 'projects', function (DecisionTable, $stateParams, projects) {
        return DecisionTable.byId($stateParams.id);
      }]
    },
    ncyBreadcrumb: {
      label: "{{table.title || 'Untitled table'}}",
      parent: 'tables-list',
      skip: false
    }
  }).state('tables-details.edit', {
    url: '/edit',
    controller: 'TablesEditController',
    templateUrl: 'templates/tables-details-edit.html',
  }).state('tables-details.revisions', {
    url: '/revisions',
    controller: 'TablesRevisionsController',
    templateUrl: 'templates/tables-details-revisions.html',
  }).state('tables-details.history', {
    url: '/history?size?page',
    params: {
      size: '25'
    },
    controller: 'HistoryListController',
    templateUrl: 'templates/history-list.html',
    resolve: {
      selectedTable: ['DecisionTable', '$stateParams', function (DecisionTable, $stateParams) {
        return DecisionTable.byId($stateParams.id);
      }]
    }
  });

  $stateProvider.state('tables-details.variant', {
    abstract: 'tables-details.variant.edit',
    url: '/:variantId',
    views: {
      "secondary-nav": {
        templateUrl: 'templates/tables-details-variant_nav.html',
        controller: 'TablesDetailsVariantController'
      },
      '': {
        templateUrl: 'templates/tables-details-variant.html',
        controller: 'TablesDetailsVariantController'
      }
    },
    resolve: {
      variant: ['table', '$stateParams', function (table, $stateParams) {
        return table.getVariant($stateParams.variantId);
      }]
    }

  }).state('tables-details.variant.edit', {
    url: '/edit',
    controller: 'TablesEditVariantController',
    templateUrl: 'templates/tables-details-variant-edit.html'
  }).state('tables-details.variant.analytics', {
    url: '/analytics',
    controller: 'TablesAnalyticsController',
    templateUrl: 'templates/tables-details-variant-analytics.html',
    resolve: {
      analytics: ['AnalyticsTable', '$stateParams', function (AnalyticsTable, $stateParams) {
        return AnalyticsTable.byIdAndVariantId($stateParams.id, $stateParams.variantId);
      }]
    }
  }).state('tables-details.variant.debugger', {
    url: '/debug',
    controller: 'DebuggerDetailsController',
    templateUrl: 'templates/tables-details-variant-debugger.html',
    params: {
      id: null,
      decision: null
    }
  }).state('tables-details.variant.new', {
    url: '/new',
    controller: 'TablesEditVariantController',
    templateUrl: 'templates/tables-details-variant-edit.html',
    params: {
      newVariant: true
    }
  });

  $stateProvider.state('tables-diff', {
    parent: 'tables',
    url: '/:id/diff/:revisionId',
    controller: 'TablesDiffController',
    templateUrl: 'templates/tables-diff.html',
    resolve: {
      compare: ['$gandalf', '$stateParams', 'DecisionDiffTable', function ($gandalf, $stateParams, DecisionDiffTable) {
        return $gandalf.admin.getTableChangelogsDiff($stateParams.id, $stateParams.revisionId).then(function (resp) {
          return {
            original: new DecisionDiffTable(null, resp.data.original.model.attributes),
            revision: new DecisionDiffTable(null, resp.data.compare_with.model.attributes)
          }
        })
      }]
    }
  });

});
