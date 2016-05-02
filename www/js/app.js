// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('btc', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('BtcCtrl', function($scope, $http, $ionicModal) {
  const priceApi = 'http://btc.blockr.io/api/v1/exchangerate/current';
  const balanceApi = 'http://btc.blockr.io/api/v1/address/balance/';
  var addresses = ['15ZGJX9H3NS2xvujrKH39ZLy9Q9orJ3hzj', '1dice8EMZmqKvrGE4Qc9bUFf9PX3xaYDp'];

  $scope.addressInfo = [];
  $scope.btcTotal = 0.00;
  $scope.usdTotal = 0.00;

  // Build URL
  var url = balanceApi;
  for(var i = 0; i < addresses.length; i++) {
    url += addresses[i] + ',';
  }
  url = url.slice(0, -1);

  $http.get(priceApi).then(function(json) {
    $scope.btcPrice = 1.0/json.data.data[0].rates.BTC;
  }).then(function() {
    $http.get(url).then(function(json) {
      if (addresses.length > 1) {
        for (var i = 0; i < json.data.data.length; i++) {
          var data = json.data.data;
          $scope.btcTotal += data[i].balance;
          $scope.usdTotal += data[i].balance * $scope.btcPrice;
          $scope.addressInfo.push({
            'address': data[i].address,
            'balance': data[i].balance,
            'usd': data[i].balance * $scope.btcPrice
          });
        }
      }
    });
  });

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Called when the form is submitted
  $scope.createTask = function(task) {
    $scope.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();
    task.title = "";
  };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };
});
