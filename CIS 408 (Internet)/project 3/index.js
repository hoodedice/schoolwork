var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var fs = require('fs');

var dumper;

var fd = fs.openSync("index.html", "r+");

fs.readFile('./InfoUnionAddressJefferson.html', "utf-8", function (err, data) {
	if (err) {
		throw err;
	}
	else {
		var doc = new dom().parseFromString(data.toString(), "text/html");
		var nodes = xpath.select("//span", doc);
		for (var index = 0; index < nodes.length; index++) {
			dumper = "<tr><td>"
			var name = /\w+\s\w+/g.exec(nodes[index].lastChild.lastChild.data)[0];
			dumper = dumper + name + "</td><td>";
			var date = /(\w+\s\w+,\s\w+)/g.exec(nodes[index].lastChild.lastChild.data)[0];
			dumper = dumper + date + "</td><td>";
			var link = nodes[0].childNodes[1].attributes[0].value;
			dumper = dumper + link + "</td></tr>";
			console.log(dumper);
		}
	}
});