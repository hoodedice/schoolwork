class TableTemplate {

	static fillIn(atrid, dict, coln) {
		//let's get the table first.
		var table = document.getElementById(atrid);
		table.style.visibility = "visible";
		//start with replacing the table headers
		var t_header = table.getElementsByClassName("header")[0]; //there's only one header per table


		//get the actual elements of the headers as an array
		var headers = t_header.getElementsByTagName("td");

		var icol = 0;

		for (var index = 0; index < headers.length; index++) {
			var elem = /\w+/.exec(headers[index].textContent)[0]; //we only need the first elem from the regex output

			if (elem in dict) {
				headers[index].textContent = dict[elem];

				//insert column replacing stuff here
				if (coln == dict[elem]){
					var allthings = table.rows;

					for (var index = 1; index < allthings.length; index++) {
						var elemB = allthings[index];

						//now we have an array of size two for this instance, so we can use icol to
						//access the column we need
						var t_col = elemB.getElementsByTagName("td");

						elemB = /\w+/.exec(t_col[icol].textContent)[0];

						if (elemB in dict){
							t_col[icol].textContent = dict[elemB];
						}
						
					}
				}
				
				icol++;
			}

		}


	}


}


