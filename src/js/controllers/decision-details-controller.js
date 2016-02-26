angular.module('app').controller('DecisionDetailsController', function ($scope, $uibModal, $timeout, decision, CONDITION_OPTIONS, DecisionRule) {

  var table = decision;
  $scope.saved = true;
  $scope.table = table;
  $scope.sortableOptions = {
    axis: 'y',
    handle: '> .decision-table__handler'
  };
  $scope.decisions = ['Approve', 'Decline', 'Manual'];

  $scope.getSampleCheck = function (table) {
    var example = {};
    table.fields.forEach(function (item) {
      switch (item.type) {
        case 'number':
          example[item.alias] = 100;
          break;
        case 'string':
          example[item.alias] = 'sample';
          break;
        case 'bool':
          example[item.alias] = true;
          break;
        case 'default':
          example[item.alias] = 'sample';
          break;
      }
    });

    return JSON.stringify(example);
  };

  $scope.editField = function (field) {
    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/add-field.html',
      controller: 'AddFieldController',
      resolve: {
        field: field
      }
    });
    modalInstance.result.then(function (field) {
      if (!field.typeChanged) return;
      table.findConditionsByField(field).forEach(function (item) {
        item.reset();
      });
    })
  };
  $scope.addNewField = function () {

    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/add-field.html',
      controller: 'AddFieldController',
      resolve: {
        field: null
      }
    });
    modalInstance.result.then(function (newField) {
      table.addField(newField);
    });

  };
  $scope.addNewRule = function () {

    var rule = DecisionRule.fromFields(table.fields); // can be different

    rule.priority = table.rules.length;
    rule.decision = table.defaultResult;

    table.addRule(rule);

    $scope.editRule(rule);
  };

  $scope.save = function () {
    table.save().then(function () {
      console.log('save success');
      $scope.saved = true;
    }, function () {
      console.warn('save error')
    })
  };

  $scope.editRule = function (rule) {
    rule.isEditing = true;
  };
  $scope.saveRule = function (rule, form) {
    console.log('save rule', form);
    if (form.$invalid) return;
    rule.isEditing = false;
  };

  $scope.$watch('table', function () {
    console.log('table change');
    $scope.saved = false;
  }, true);

  var fnOnBeforeUnload = window.onbeforeunload;
  window.onbeforeunload = function () {
    return $scope.saved ? null : 'You have unsaved data';
  };
  $scope.$on('$destroy', function () {
    window.onbeforeunload = fnOnBeforeUnload;
  });

  $timeout(function () {
    $scope.saved = true;
  })

});
