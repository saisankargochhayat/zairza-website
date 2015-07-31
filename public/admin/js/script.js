jQuery(document).ready(function($){
	$('#img-file').hide();
    $('input[type=radio]').click(function(){
    	radid = this.id;
       if (this.id == 'rad1') {
    	$('#img-link').show();
    	$('#img-file').hide();
    } else{
    	$('#img-link').hide();
    	$('#img-file').show();
    };
    });
});