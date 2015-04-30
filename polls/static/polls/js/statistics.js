$(document).ready(function() {
	var d = new Date();
	var month = d.getMonth()+1;
	var year = d.getFullYear();

	$('#next').hide();

	function showCatagory(myOptions){
		var mySelect = $('#myselect');
		$.each(myOptions, function(val, text) {
		    mySelect.append(
		        $('<option></option>').val(val).html(text)
		    );
		});
	}

	function postCall(sendData,URL){
		var result = ''
		$.ajax({ //Process the form using $.ajax()
		        type      : 'POST', //Method type
		        url       : URL, //Your form processing file URL
		        context: this,
		        data: sendData,
		        dataType  : 'json',
		        async: false,
		        success   : function(data) {
		        	//alert(data[0].catagoryName);
		        	result = data;
		        },
		        error	: function(jqXHR, exception){
			        if (jqXHR.status === 0) {
				       alert('Not connect.\n Verify Network.');
				   } else if (jqXHR.status == 404) {
				       alert('Requested page not found. [404]');
				   } else if (jqXHR.status == 500) {
				       alert('Internal Server Error [500].');
				   } else if (exception === 'parsererror') {
				       alert('Requested JSON parse failed.');
				   } else if (exception === 'timeout') {
				       alert('Time out error.');
				   } else if (exception === 'abort') {
				       alert('Ajax request aborted.');
				   } else {
				       alert('Uncaught Error.\n' + jqXHR.responseText);
				   }
			  }

		    });
		return result;
	}

	function showAllData(data){
		//alert(data[0].dayData.length);
		for(k=0;k<data.length;k++){
			if(data[k].dayData.length !=0){
				var daData="";
				var pers = []
				var header = "<tr><th>Date</th>";
				for(i=0;i<data[k].dayData.length;i++){
					var persData="";
					for(j=0;j<data[k].dayData[i].personalData.length;j++){
						persData = persData +'\
						<td>'+data[k].dayData[i].personalData[j].expenditure+'/'+data[k].dayData[i].personalData[j].quantity+'</td>';
					}
					pers[i] = persData;
				}

				for(i=0;i<data[k].dayData.length;i++){
					daData = daData +'\
					<tr>\
					<td>'+data[k].dayData[i].date+'</td>\
					'+pers[i]+'\
					</tr>'
				}
				
				for(j=0;j<data[0].dayData[0].personalData.length;j++){
					header = header +'\
					<th>'+data[0].dayData[0].personalData[j].name+'<br><small>(Expend/Share)</small></th>\
					';
				}

				var totalExpenditure = 0;
				var totalQuantitiy = 0;
				for(i=0;i<data[k].dayData.length;i++){
					for(j=0;j<data[k].dayData[i].personalData.length;j++){
						totalExpenditure += data[k].dayData[i].personalData[j].expenditure;
						totalQuantitiy += data[k].dayData[i].personalData[j].quantity;
					}
				}

				var len = data[k].dayData[0].personalData.length;
				var persQua = [len]
				while (--len >= 0) {
				        persQua[len] = 0;
				}

				for(i=0;i<data[k].dayData.length;i++){
					for(j=0;j<data[k].dayData[i].personalData.length;j++){
						persQua[j] += data[k].dayData[i].personalData[j].quantity;
					}
				}
				var result = "<tr><td><b>Total<br>"+totalExpenditure+"/"+totalQuantitiy+"<b></td>"
				for(j=0;j<data[k].dayData[0].personalData.length;j++){
						dat = parseFloat(((totalExpenditure/totalQuantitiy)*persQua[j]).toPrecision(5));
						result += "<td>"+dat+"/"+persQua[j]+"</td>";
				}
				result += "</tr>"
				header = header + '</tr>';

				$("#AllData").append("<h1>"+data[k].catagoryName+"</h1>");
				$("#AllData").append("<table class='bordered'>"+header+daData+result+"</table><br>");
				
			}
		}
	}

	function main(){
		
		allData = postCall({'catId':0,'month':month,'year':year},'getInfo');
		showAllData(allData);/////
		catData = postCall({},'getcatagory');
		catData.data['0'] = "All";
		showCatagory(catData.data);
	}

	main();
	

	$('#prev').on('click', function (e) {
		month = month -1;
		if(month<1){
			month = 12;
			year = year -1;
		}
		if(month < d.getMonth()+1){
			$('#next').fadeIn(2000);
		}
		else{$('#next').fadeOut('slow');}

		//$("#AllData").hide();
	     	$("#AllData").html('');
	     	allData = postCall({'catId':0,'month':month,'year':year},'getInfo');
		showAllData(allData);
		$("#AllData").show('slow');
	});

	$('#next').on('click', function (e) {
		month = month +1;
		if(month>12){
			month = 1;
			year = year +1;
		}
		if(month < d.getMonth()+1){
			$('#next').fadeIn(2000);
		}
		else{$('#next').fadeOut('slow');}

		//$("#AllData").hide();
	     	$("#AllData").html('');
	     	$("#AllData").hide();
	     	allData = postCall({'catId':0,'month':month,'year':year},'getInfo');
		showAllData(allData);
		$("#AllData").show('slow');
	});

	$('select').on('change', function (e) {
	             var optionSelected = $(this).find("option:selected");
	             var valSelected   = optionSelected.val();
	             var textSelected   = optionSelected.text();
	     	//$("#AllData").fadeOut(2000);
	     	$("#AllData").html('');
	     	$("#AllData").hide();
	     	allData = postCall({'catId':valSelected,'month':month,'year':year},'getInfo');
		showAllData(allData);
		$("#AllData").fadeIn(2000);
	});
});
