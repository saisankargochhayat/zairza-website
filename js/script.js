jQuery(document).ready(function($){
	$('.menu li').click(function(){
		console.log(this);
	});
	$('[data-toggle="offcanvas"]').click(function(){
		$('.row-offcanvas').toggleClass('active');});
	
	//search button start
	$(function(){
	$( "#search_dialog" ).dialog({
	autoOpen: false,
	width: 400,
	buttons: [
				{
				text: "Search",
				click: function() {
					console.log(this);
					$( this ).dialog( "close" );
					}
				},
				{
				text: "Cancel",
				click: function() {
					$( this ).dialog( "close" );
					}
				}
			]
	 });
	});
	$( "#search" ).click(function() {
      $( "#search_dialog" ).dialog( "open" );
    });
	//search end
	//info dialog start
	$(function(){
	$( "#info_dialog" ).dialog({
	autoOpen: false,
	width: 400,
	buttons: [{
				text: "Cancel",
				click: function() {
					$( this ).dialog( "close" );
				}
			}]
	 });
	});
	openInfo = function(info) {
		$('#info_dialog p').empty();
        $('#info_dialog p').append(info);
        $('#info_dialog').dialog( "open" );
    }
    //info end

});

