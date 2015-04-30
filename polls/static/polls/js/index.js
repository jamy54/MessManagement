$(document).ready(function() {
    /** work when all HTML loaded except images and DOM is ready **/
    //alert('jamy');
    	submitButton = false;
	getCatagory();

	function validateForm(data){
		var expendFlag = true;
		var quantityFlag = true;
		var hoga = true;
		$("#error").html("");
		$("#error").css('color','red');

		$.each(data, function(k, v) {
			var Expenditure = $('#'+k+'E');
			var Quantity = $('#'+k+'Q');
			console.log(Expenditure.val());
			console.log(Quantity.val());

			//alert(Expenditure.val());
			if(Expenditure.val() != "Expenditure"){
				if (Expenditure.val() !=""){

					if (isNaN(Expenditure.val())){
						expendFlag = false;
						quantityFlag = false;
						hoga = false;
						$("#error").html("Asshole! Insert a digit");
						Expenditure.show('slow');
						Quantity.show('slow');

						Expenditure.focus();
						Expenditure.css("color","#F00");
						return false;
					}
					else{
						expendFlag = false;
					}
				}
			}

			if(Quantity.val() !="Quantity = 1"){
				if (Quantity.val() !="" ){
					if (isNaN(Quantity.val())){
						quantityFlag = false;
						expendFlag = false;
						hoga = false;
						$("#error").html("Asshole! Insert a digit<br>");
						Expenditure.show('slow');
						Quantity.show('slow');

						Quantity.focus();
						Quantity.css("color","#F00");
						return false;
					}
					else{
						quantityFlag = false;
					}
				}
			}
		});

		//alert(Expenditure.val());
		
		if(expendFlag){
			hoga =false;
			$("#error").html("Asshole! input today's expenditure ");
			return false;
		}
		/*
		else if(quantityFlag){
			hoga = false;
			$("#error").html("Asshole! you need to input quantity");
			return false;
		}*/

		else if(hoga){
			var mealData = new Object();
			var a = {};
			a['data']={}
			$.each(data, function(key, val) {
				var i = key;
				var k  = {};
				if ($("#"+key+"E").val() == 'Expenditure'){
					k.expenditure = '0';
				}
				else {
					k.expenditure = $("#"+key+"E").val();
				}
				if($("#"+key+"Q").val() == 'Quantity = 1'){
					k.quantity = '1';
				}
				else{
					k.quantity = $("#"+key+"Q").val();
				}
				
				//mealData.k = {$("#"+key+"Q").val() = $("#"+key+"E").val()};
				console.log(k);
				a['data'][i] = k;
				//mealData.$("#"+key+"E").attr("name") = $("#"+key+"E").val();
			});
			a['cat'] = $ ( "#myselect option:selected" ).val();
			a = JSON.stringify(a);
			console.log(a);
			createInsrteMealReq(a,'insertMeal');
		}
	}

	function createInsrteMealReq(mealData,URL){
		$.ajax({ //Process the form using $.ajax()
		        type      : 'POST', //Method type
		        url       : URL, //Your form processing file URL
		        context: this,
		        data: mealData,
		        dataType  : 'json',
		        success   : function(data) {
		        	   if(data['status']=='ok'){
		        	   	$("#error").html(data['message']);
		        	   	$("#error").css('color','green');
		        	   }
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
	}

	function createForm(data){
		//alert(data.length);
		$form = $("#mealForm");
		//i=0;
		$.each(data, function(key, val) {
			$form.append('<span  id="name'+key+'" > <a href="javascript:void()" style="text-decoration: none; color: #777">'+val+'</a></span>');

			//$form.append('<div class="inp" >');
			$form.append('<input type="text" id="'+key+'E" class="inp'+key+'" name="'+key+'"  value="Expenditure" onFocus="this.select();" onMouseOut="javascript:return false;"/>');
			$form.append('<input type="text" id="'+key+'Q" class="inp'+key+'" name="'+key+'" value="Quantity = 1" onFocus="this.select();" onMouseOut="javascript:return false;"/>');
			//$form.append('</div>');
			$form.append('<br>');
			$form.append('<br>');
		});


	     	var valSelected   =$ ( "#myselect option:selected" ).val();
	     	//alert(valSelected);
	     	$form.append('<input type="text"  id="cat" name="cat" value="'+valSelected+'" style="display: none;"/>');
		$form.append('<input type="submit"  id="submitButton" value="Submit"/>');
		/*
		for (i = 0; i < data.length; i++){
			$( '.inp'+i).hide();
		}*/
		$("#catInp").hide();

		for (i = 0; i < data.length; i++) {
			//$( '.inp'+i ).css("visibility","hidden");
			$('#name'+i).click(function () {
				var visIndex = $(this).index()/5;
				$( '.inp'+visIndex ).toggle('slow');
			});
		}

		$( "#mealForm" ).submit(function () {
			$.ajax({ //Process the form using $.ajax()
			        type      : 'POST', //Method type
			        url       : 'getName', //Your form processing file URL
			        context: this,
			        data: {
			                    "somedata": "jamyOne",
			                    "moredata": "jamyTwo",
			                    "csrfmiddlewaretoken": "{{ csrf_token }}"
			                },
			        dataType  : 'json',
			        success   : function(data) {
			        	  validateForm(data);
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
			//alert(submitButton);
			return submitButton;
		});
	}

    $.ajax({ //Process the form using $.ajax()
        type      : 'POST', //Method type
        url       : 'getName', //Your form processing file URL
        context: this,
        data: {
                    "somedata": "jamyOne",
                    "moredata": "jamyTwo",
                    "csrfmiddlewaretoken": "{{ csrf_token }}"
                },
        dataType  : 'json',
        success   : function(data) {
        	   createForm(data);
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

	var myOptions = {
	    val1 : 'meal',
	    val2 : 'text1',
	    val3 : 'create a catagory'
	};

	function showCatagory(myOptions){
		var mySelect = $('#myselect');
		$.each(myOptions, function(val, text) {
		    mySelect.append(
		        $('<option></option>').val(val).html(text)
		    );
		});
	}



	$('select').on('change', function (e) {
	     var optionSelected = $(this).find("option:selected");
	     var valSelected   = optionSelected.val();
	     var textSelected   = optionSelected.text();
	     if (textSelected == 'create a catagory'){
	     	//$("#catInp").css('visibility','block'); 
	     	$("#catInp").show('slow');
	     }
	     else{
	     	$("#catInp").hide('slow');
	     	$("#cat").val(valSelected);
	     	//alert($("#cat").val());
	     }
	});

	$('#catBtn').on('click', function (e) {
		var VAL = $("#catInpTxt").val();
		//alert(VAL);
		        var cat = '^[a-zA-Z0-9_]*$';

		        if (VAL == 'cetagory') VAL='';
		        
		        if (!VAL.match(cat) || VAL=="") {
		            $("#error").html("Asshole! insert a proper catagory");
		            $("#catInpTxt").focus();
		        }
		        else{
		        	var jsonVal = {
				          catagoryName: VAL   
				};
		        	creaeteCatagory(jsonVal);
		        }
	});

	function creaeteCatagory(jsonVal){
		 $.ajax({ //Process the form using $.ajax()
		        type      : 'POST', //Method type
		        url       : 'addcatagory', //Your form processing file URL
		        context: this,
		        data: jsonVal,
		        dataType  : 'json',
		        success   : function(data) {
		        	   //alert(data.status);
		        	   $('#myselect').html('');
		        	   $("#catInp").hide('slow');
		        	   getCatagory();
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
	}

	function getCatagory(){
		 $.ajax({ //Process the form using $.ajax()
		        type      : 'POST', //Method type
		        url       : 'getcatagory', //Your form processing file URL
		        context: this,
		        data: {},
		        dataType  : 'json',
		        success   : function(data) {
		        	   data.data.c =  "create a catagory"
		        	   showCatagory(data.data);
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
	}
});
