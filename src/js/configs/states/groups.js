"use strict";

angular.module('app').config(function ($stateProvider) {

  $stateProvider.state('groups', {
    parent: 'private',
    url: '/groups',
    abstract: 'groups-list',
    template: '<ui-view />',
    ncyBreadcrumb: {
      skip: true
    }
  });

  $stateProvider.state('groups-list', {
    parent: 'groups',
    url: '?size?page',
    params: {
      size: '25'
    },
    controller: 'GroupsListController',
    templateUrl: 'templates/groups-list.html',
    ncyBreadcrumb: {
      label: 'Groups'
    }
  });

  $stateProvider.state('groups-details', {
    parent: 'groups',
    url: '/:id',
    templateUrl: 'templates/groups-details.html',
    controller: 'GroupsDetailsController',
    resolve: {
      group: ['DecisionGroup', '$stateParams', 'projects', function (DecisionGroup, $stateParams, projects) {
        return (new DecisionGroup($stateParams.id)).fetch();
      }]
    },
    ncyBreadcrumb: {
      label: '{{group.title}}',
      parent: 'groups-list'
    }
  });

});
