var app = angular.module('MQTTable', ['ngAnimate']);

app.filter('Object', function() {
	return function(input, search) {
		if (!input) return input;
		if (!search) return input;
		var expected = ('' + search).toLowerCase();
		var result = {};
		angular.forEach(input, function(value, key) {
			var actual = ('' + key).toLowerCase();
			if (actual.indexOf(expected) !== -1) {
				result[key] = value;
			}
		});
		return result;
	};
});

app.directive('animateOnChange',['$animate','$timeout', function($animate,$timeout) {
	return function(scope, elem, attr) {
		scope.$watch(attr.animateOnChange, function(nv,ov) {
			if (nv!=ov) {
				var c = 'change';
				$animate.addClass(elem,c).then(function() {
					$timeout(function() {$animate.removeClass(elem,c);});
				});
			}
		}); 
	};  
}]);


app.controller('TableController',[ '$scope', '$window', function($scope, $window) {
	var stream = new EventSource('https://revspace.nl/mqtt?revspace%2F%23=');
	$scope.values = {};
	$scope.Search = $window.decodeURIComponent($window.location.hash.replace(/^#+/,''));

	$scope.$watch('Search', function(n,o){
		$window.history.replaceState(undefined, undefined, "#"+n);
	});

	stream.onmessage = function(e) {
		var data = JSON.parse(e.data);
		console.log(data);
		$scope.values[data[0]] = data[1];
		$scope.$apply();
	};
}]);


