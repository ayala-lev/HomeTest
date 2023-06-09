var app = angular.module('myApp', ['ngRoute']);


app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'Login.html',
            controller: 'loginController'
        })
        .when('/heroes/:trainId/:username', {
            templateUrl: 'heroes.html',
            controller: 'heroesController'
        })
        .otherwise({
            redirectTo: '/'
        });

});

app.controller('loginController', ['$scope', '$location', '$window', '$log', 'TrainsFactory', function ($scope, $location, $window, $log, TrainsFactory) {

    $scope.username = '';
    $scope.password = '';
    $scope.loginError = '';

    $scope.login = function () {
        $scope.loginError = '';

        // Check password requirements
        var regex = /^(?=.*[0-9])(?=.*[^0-9])[a-zA-Z0-9]{8,}$/;
        if (!regex.test($scope.password)) {
            $scope.loginError = 'Password must be at least 8 characters, contain numbers, and one non-numeric character.';
            $log.warn('Invalid password entered');
            return;
        }


        TrainsFactory.getTrainId($scope.username, $scope.password).then(function (trainId) {
            $location.path('/heroes/' + trainId + '/' + $scope.username);
            $log.info('User ' + $scope.username + ' logged in successfully');
        }).catch(function (error) {
            $scope.loginError = error.message;
            $log.warn(error.message);
        });
    };

}]);

app.controller('heroesController', ['$scope', '$log', 'HeroesFactory', '$routeParams', function ($scope, $log, HeroesFactory, $routeParams) {
    HeroesFactory.getHeroesDetails().then(function (data) {
        $scope.heroes = data;
        $scope.trainId = $routeParams.trainId;
        $scope.username = $routeParams.username;

        var now = new Date();
        angular.forEach($scope.heroes, function (hero) {
            hero.trainingStartDate = new Date(hero.trainingStartDate);
            if (hero.trainingStartDate.getFullYear() == now.getFullYear()
                && hero.trainingStartDate.getMonth() == now.getMonth()
                && hero.trainingStartDate.getDate() == now.getDate()) {
                hero.trainingCount = 0;
            }
        });
        $log.info('Loaded ' + $scope.heroes.length + ' heroes');

    }, function (error) {
        $log.error('Error loading heroes:', error);
    });

    $scope.train = function (hero) {
        if (hero.trainingCount < 5) {
            hero.trainingCount++;
            var randomPercent = parseFloat((Math.random() * 11).toFixed(2));
            alert(randomPercent);
            var increaseAmount = hero.startingPower * (randomPercent / 100);
            hero.currentPower += increaseAmount;

            HeroesFactory.updateHeroes($scope.heroes).then(function (response) {
                $log.debug('Heroes updated successfully');
            }, function (response) {
                $log.error('Error updating hero:', response);
            });
        }
        $log.debug('Trained hero ' + hero.name + ' with current power ' + hero.currentPower);
    }
}]);

app.factory('HeroesFactory', function ($http) {
    var data = {};

    data.getHeroesDetails = function () {
        return $http({
            method: 'GET',
            url: '../api/heroes',
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            throw new Error('Error loading heroes: ' + response.status + ' ' + response.statusText);
        });
    };

    data.updateHeroes = function (heroes) {
        return $http({
            method: 'POST',
            url: '../api/heroes',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: heroes
        }).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            throw new Error('Error updating heroes: ' + response.status + ' ' + response.statusText);
        });
    };

    return data;
});

app.factory('TrainsFactory', function ($http) {
    var data = {};

    data.getTrainId = function (username, password) {
        return $http({
            method: 'GET',
            url: '../api/trains',
            params: { username: username, password: password },
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).then(function successCallback(response) {
            return response.data;
        }
            , function errorCallback(response) {
                throw new Error('Error loading trains: ' + response.status + ' ' + response.statusText);
            });
    }

    return data;
});