"use strict";

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('tables', {
    parent: 'private',
    url: '/tables',
    abstract: 'tables-list',
    template: '<ui-view />',
    ncyBreadcrumb: {
      skip: true
    }
  });

  $stateProvider.state('tables-list', {
    parent: 'tables',
    url: '?size?page',
    params: {
      size: '25'
    },
    controller: 'TablesListController',
    templateUrl: 'templates/tables-list.html',
    ncyBreadcrumb: {
      label: 'Tables'
    }
  }).state('tables-create', {
    parent: 'tables',
    url: '/create',
    controller: 'TablesCreateController',
    templateUrl: 'templates/tables-create.html',
    ncyBreadcrumb: {
      label: 'Create new table',
      parent: 'tables-list'
    }
  });

  $stateProvider.state('tables-details', {
    parent: 'tables',
    abstract: true,
    url: '/:id/:variantId',
    templateUrl: 'templates/tables-details.html',
    controller: 'TablesDetailsController',
    resolve: {
      table: ['DecisionTable', '$stateParams', 'projects', function (DecisionTable, $stateParams, projects) {
        return DecisionTable.byId($stateParams.id);
      }],
      variant: ['table', '$stateParams', function (table, $stateParams) {
        return table.getVariant($stateParams.variantId);
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
    templateUrl: 'templates/tables-edit.html',
    ncyBreadcrumb: {
      label: 'Edit'
    }
  }).state('tables-details.analytics', {
    url: '/analytics',
    controller: 'TablesAnalyticsController',
    templateUrl: 'templates/tables-analytics.html',
    resolve: {
      analytics: ['AnalyticsTable', '$stateParams', function (AnalyticsTable, $stateParams) {
        return AnalyticsTable.byIdAndVariantId($stateParams.id, $stateParams.variantId);
      }]
    },
    ncyBreadcrumb: {
      label: 'Analytics'
    }
  }).state('tables-details.revisions', {
    url: '/revisions',
    controller: 'TablesRevisionsController',
    templateUrl: 'templates/tables-revisions.html',
    ncyBreadcrumb: {
      label: 'Revisions'
    }
  }).state('tables-details.debugger', {
    url: '/debug',
    controller: 'DebuggerDetailsController',
    templateUrl: 'templates/tables-debugger.html',
    ncyBreadcrumb: {
      label: 'Debugger'
    },
    params: {
      id: null,
      decision: null
    }
  }).state('tables-details.new-variant', {
    url: '/variant',
    controller: 'TablesEditController',
    templateUrl: 'templates/tables-edit.html',
    ncyBreadcrumb: {
      label: 'New variant'
    },
    params: {
      newVariant: true
    }
  }).state('tables-details.change-traffic', {
    url: '/traffic',
    controller: 'TablesTrafficListController',
    templateUrl: 'templates/tables-traffic-list.html',
    ncyBreadcrumb: {
      label: 'Change Traffic Allocation'
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
    },
    ncyBreadcrumb: {
      label: 'Diff: {{revision.id}}',
      parent: 'tables-details.edit'
    }
  });

});
