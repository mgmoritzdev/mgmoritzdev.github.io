var app = angular.module("App", []);

app.controller("MainCtrl", ["$scope", "$http", function($scope, $http) {
	$scope.data = [];
	$scope.labels = [];

	$http({
	  method: 'GET',
	  url: 'https://spreadsheets.google.com/feeds/list/1RvBt-GXz7kKzYj3XLpwatdMNZxKjwq3qqx5sm_WRzb4/1/public/basic?alt=json'
	}).then(function successCallback(response) {
	  var rows = [];
	  var labels = [];
		var cells = response.data.feed.entry;

		var rowCols = cells[0].content.$t.split(',');

		labels.push("id");
		for (var j = 0; j < rowCols.length; j++){
	    var keyVal = rowCols[j].split(':');
	    labels.push(keyVal[0].trim());
	  }

		for (var i = 0; i < cells.length; i++){
		  var rowObj = {};
		  rowObj.id = cells[i].title.$t;
		  var rowCols = cells[i].content.$t.split(',');

	  	for (var j = 0; j < rowCols.length; j++){
		    var keyVal = rowCols[j].split(':');
		    rowObj[keyVal[0].trim()] = keyVal[1].trim();
		  }
		  rows.push(rowObj);
      if (parseFloat(rows[0].km)) {
        rows.sort((a, b) => b.km - a.km)
      }
		}

		$scope.data = rows;
		$scope.labels = labels;
	  }, function errorCallback(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });
}]);
