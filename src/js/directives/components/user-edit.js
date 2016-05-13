"use strict";

angular.module('app').controller('userEditController', function ($scope, project, user, $uibModalInstance, PROJECT_USER_SCOPES) {

  $scope.user = user; // from directive scope
  $scope.project = project; // from directive scope

  $scope.scopes = PROJECT_USER_SCOPES;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    $scope.project.updateUser($scope.user).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };
  $scope.remove = function () {
    $scope.project.removeUser($scope.user).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  }
});

angular.module('app').directive('userEdit', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      project: '=userEdit',
      user: '=userEditModel'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/user-edit.html',
          controller: 'userEditController',
          resolve: {
            project: function () {
              return scope.project;
            },
            user: function () {
              return scope.user;
            }
          }
        });
      })
    }
  };
});
