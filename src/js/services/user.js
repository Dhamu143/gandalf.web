angular.module('app').service('UserService', function ($cacheFactory, $rootScope, $gandalf, User) {

  var cache = $cacheFactory('user');

  $rootScope.$on('userDidLogout', function () {
    cache.removeAll();
  });

  this.current = function () {
    return cache.get('user') || $gandalf.admin.getUser().then(function (resp) {
      var user = new User(resp.data);
      cache.put('user', user);
      return user;
    });
  };
});
