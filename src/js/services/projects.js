'use strict';

angular.module('app').service('ProjectsService', function (Project, $gandalf, $timeout, $rootScope, $localStorage, lodash, $cacheFactory, utils) {

  var appCache = $cacheFactory('projects');
  var storage = $localStorage.$default({
    project: null
  });
  var initialized = false;

  $rootScope.$on('userDidLogout', function () {
    storage.project = null;
    initialized = false;
    $gandalf.setProjectId(null);
    appCache.remove('projects');
  });

  // collection

  this.all = all;
  this.update = update;
  this.selectProject = selectProject;
  this.selectedProject = function () {
    return new Project(storage.project);
  };

  // functions

  function all() {
    return appCache.get('projects') || update();
  }

  function update() {
    return Project.find().then(function (projectsResp) {
      init(projectsResp);
      appCache.put('projects', projectsResp);
      $rootScope.$broadcast('projectsDidUpdate', projectsResp);
      return projectsResp;
    });
  }

  function selectProject(project) {
    if (!project) return;
    $gandalf.setProjectId(project.id);
    storage.project = project.toJSON();
    $rootScope.$broadcast('projectDidSelect', project);

    if (initialized) utils.reload();
  }

  function init(projects) {
    var storageProject = new Project(storage.project);
    var currentProject = (storageProject ? lodash.find(projects, {
        id: storageProject.id
      }) : null) || projects[0];

    selectProject(currentProject);
    initialized = true;
  }
});
