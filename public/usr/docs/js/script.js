// JavaScript source code
jQuery(document).ready(function ($) {
	var t = $('title').html().split(/&lt;\/*\w*&gt;/).join('');
	$('title').html(t);
    $('.anchorthis').each(function(){
    	var anchor = this.id;
    	$('#sidenav').append(
    		'<li><a href="#'+anchor+'">'+anchor+'</a></li>'
    	)
    })    
});