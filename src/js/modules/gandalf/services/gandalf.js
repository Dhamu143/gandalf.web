'use strict';

var base64 = (function () {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  return {
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
        chr1 = input.charCodeAt (i++);
        chr2 = input.charCodeAt (i++);
        chr3 = input.charCodeAt (i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN (chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN (chr3)) {
          enc4 = 64;
        }

        output = output +
          keyStr.charAt (enc1) +
          keyStr.charAt (enc2) +
          keyStr.charAt (enc3) +
          keyStr.charAt (enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    },

    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec (input)) {
        window.alert ("There were invalid base64 characters in the input text.\n" +
          "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
          "Expect errors in decoding.");
      }
      input = input.replace (/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf (input.charAt (i++));
        enc2 = keyStr.indexOf (input.charAt (i++));
        enc3 = keyStr.indexOf (input.charAt (i++));
        enc4 = keyStr.indexOf (input.charAt (i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode (chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode (chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode (chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
    }
  };
})();

angular.module('ng-gandalf').provider('$gandalf', function () {

  var config = {
    apiEnpoint: '/api/v1/',
    authorization: null
  };

  return {
    setEndpoint: function (endpoint) {
      config.apiEnpoint = endpoint;
    },
    setAuthorization: function (apiKey, apiSecret) {
      config.authorization = 'Basic ' + base64.encode([apiKey, apiSecret].join(':'));
    },
    $get: function ($httpParamSerializer, $http, $log, $q, $filter) {

      function $request(opts, data) {

        var endpoint = opts.endpoint,
          method = opts.method || 'get',
          params = opts.params || {};

        if (angular.isUndefined(endpoint)) {
          throw Error('undefined request enpoint');
        }

        endpoint = config.apiEnpoint + endpoint;
        endpoint += '?' + $httpParamSerializer(params);

        var headers = {
          'Content-type': 'application/json'
        };
        if (config.token) {
          headers['Authorization'] = 'Bearer ' + config.token;
        }
        if (config.authorization) {
          headers['Authorization'] = config.authorization;
        }

        return $http({
          method: method,
          url: endpoint,
          headers: headers,
          data: data || null
        }).then(function (resp) {
          $log.debug('$request: response', resp);
          return resp.data;
        });
      }

      $request.get = function (url, options) {
        var config = angular.extend({
          endpoint: url,
          method: 'get'
        }, options);

        return $request(config);
      };

      var self = {};

      self.decisions = function (size, page) {
        return $request.get('admin/tables', {
          params: {
            size: size,
            page: page
          }
        });
      };
      self.decisionById = function (id) {
        return $request.get('admin/tables/'+id);
      };
      self.createDecision = function (obj) {
        return $request({
          endpoint: 'admin/tables/',
          method: 'post'
        }, {
          table: obj
        });
      };
      self.updateDecisionById = function (id, obj) {
        return $request({
          endpoint: 'admin/tables/'+id,
          method: 'put'
        }, {
          table: obj
        });
      };
      self.deleteDecisionById= function (id) {
        return $request({
          endpoint: 'admin/tables/'+id,
          method: 'delete'
        });
      };

      self.history = function (tableId, size, page) {
        return $request.get('admin/decisions', {
          params: {
            table_id: tableId,
            size: size,
            page: page
          }
        });
      };
      self.historyById = function (historyId) {
        return $request.get('admin/decisions/'+historyId);
      };

      self.update = function (decisionTableObj) {
        return $q.when(decisionTableObj);
      };
      return self;

    }
  };

});
