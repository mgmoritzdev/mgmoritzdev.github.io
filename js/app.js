var app = angular.module("App", []);

app.controller("MainCtrl", ["$scope", "$http", function($scope, $http) {
	$scope.data = [];
	$scope.labels = [];

	$http({
	  method: 'GET',
	  url: 'https://docs.google.com/spreadsheets/d/1RvBt-GXz7kKzYj3XLpwatdMNZxKjwq3qqx5sm_WRzb4/gviz/tq?tqx=out:json'
	}).then(function successCallback(response) {
		let data = response.data
    const r = data.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)
    data = (JSON.parse(r[1])).table
    const labels = data.cols.map(d => d.label).filter(l => l)
    const rows = []
    data.rows.forEach(r => {
      const rowObj = {}
      for(let l = 0; l < labels.length; l++){
        rowObj[labels[l]] = r.c[l].f ?? r.c[l].v
      }
      rows.push(rowObj)
    })
    if (parseFloat(rows[0].km)) {
      rows.sort((a, b) => b.km - a.km)
    }

    const displayLabels = ['nome', 'km']
		$scope.data = rows
		$scope.labels = labels.filter(i => displayLabels.includes(i))
	  }, function errorCallback(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });
}]);
