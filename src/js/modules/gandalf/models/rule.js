angular.module('ng-gandalf').factory('DecisionRule', function (DecisionRuleCondition, utils) {


  function Rule (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.id = options.id || utils.guid();
    this.priority = options.priority;
    this.decision = options.than;
    this.description = options.description;
    this.conditions = (options.conditions || []).map(function (item) {
      return new this._modelCondition(item);
    }.bind(this));
  }

  Rule.prototype = Object.create({}, {
    _modelCondition: {
      value: DecisionRuleCondition
    }
  });

  Rule.prototype.addCondition = function (field) {
    this.conditions.push(this._modelCondition.fromField(field))
  };
  Rule.prototype.removeConditionByField = function (field) {
    this.conditions = this.conditions.filter(function (item) {
      return item.field_alias !== field.alias;
    });
  };

  Rule.prototype.toJSON = function () {
    return {
      id: this.id,
      priority: this.priority,
      than: this.decision,
      description: utils.orNull(this.description),
      conditions: JSON.parse(JSON.stringify(this.conditions))
    };
  };

  Rule.fromFields = function (fields, options) {
    var rule = new this(options);
    fields.forEach(function (item) {
      rule.addCondition(item);
    });
    return rule;
  };

  return Rule;

});

