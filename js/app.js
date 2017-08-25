var papa = require('papaparse');

var addresses = [];
var townlands = [];
var newCSV = {};

const vm = new Vue({

	el: '#app',

	methods: {
		myMethod() {

			// get csv addresses input
			var csvAddresses = document.getElementById('input').files[0];
			console.log(csvAddresses);

			// parse csv
			papa.parse(csvAddresses, {
				header: true,
				complete: function(results) {
					addresses = results.data;
					console.log('addresses parsed');
					console.log(addresses);
				}
			});

			// get townlands csv 
			var csvTownlands = document.getElementById('input').files[1];
			console.log(csvTownlands);

			// parse townlands csv
			papa.parse(csvTownlands, {
				header: true,
				complete: function(results) {
					townlands = results.data;
					console.log('townlands parsed');
					console.log(townlands);

					// when townlands is parsed,
					// loop over addresses 
					console.log('Addresses length: ' + addresses.length);
					for(var i=0; i<addresses.length; i++) {
						// get each address and parse it 
						var address = addresses[i]["Address"]; // string: "Town, City, County"
						// console.log(address);
						papa.parse(address, { 
							header: true,
							complete: function(stuff) {
								// console.log(stuff["meta"]["fields"]); // Array of Strings [0: "Muckrim", 1: "Kinlough", 2: "leitrim"]
								var first = stuff["meta"]["fields"][0];
								// var second = stuff["meta"]["fields"][1];
								// var third = stuff["meta"]["fields"][2];
								// var fourth = stuff["meta"]["fields"][3];
								var first = first.toUpperCase();
								// now that we have uppercase field[0], we can find where it exists on Townlands.csv
								
								// Check if we have already added the location to newCSV yet 
								// if(!newCSV[first]) {
								// 	console.log(first + ' does not exist');
								// }
								for(var n=0; n<townlands.length; n++) {
									// this.deepBreath = 1;
									if(townlands[n]["English_Name"] == first) {
										console.log('Found address id: ' + i);
										console.log('At townland id: ' + n);
										console.log('Percentage Complete: ' + i / addresses.length * 100);
										console.log('name: ' + first)
										var lat = townlands[n]['Y'];
										console.log('Lat:' + lat);
										var lon = townlands[n]['X'];
										console.log('Lon: ' + lon);
										stuff["meta"]["fields"][5] = lat;
										stuff["meta"]["fields"][6] = lon;
										newCSV[first] = stuff["meta"]["fields"];
									}
								}
							}
						});
					}
					console.log('Done! newCSV:');
					console.log(newCSV);
					console.log(Object.keys(newCSV).length);
					var content = "data:text/csv;charset=utf-8,";
					var dataString = 'First,Second,Third,Fourth,Fifth,Lat,Lon\n';
					for(var a=0; a<Object.keys(newCSV).length; a++) {
						var keyName = Object.keys(newCSV)[a];
						console.log(keyName);
						console.log(newCSV[keyName]); // 0-6 kv pairs
						console.log(newCSV[keyName][0]); // Original field0
						console.log(newCSV[keyName][1]); // Original field1
						console.log(newCSV[keyName][2]); // Original field2
						console.log(newCSV[keyName][5]); // lat 
						console.log(newCSV[keyName][6]); // lon 
						dataString += newCSV[keyName].join(',');
						dataString += "\n";
					}
					console.log(dataString);
					var hiddenElement = document.createElement('a');
					hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(dataString);
				    hiddenElement.target = '_blank';
				    hiddenElement.download = 'newaddresses.csv';
				    hiddenElement.click();
				}
			});
		},

		download() {

		}
	}
});