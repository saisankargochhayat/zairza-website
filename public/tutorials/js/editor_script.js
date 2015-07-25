// JavaScript source code
jQuery(document).ready(function ($) {
    CKEDITOR.config.disableNativeSpellChecker = false;
    CKEDITOR.config.removeButtons = 'Source';
    CKEDITOR.config.filebrowserUploadUrl= '/inbound/newImage';

    //BUG: file no. generation based on time may lead to race condition
    var f = new Date().getTime();
    $('#fileId').append(f);
    $('#Filetarget').append('/usr/docs/'+f+'.html');
    //dropdown menu selector
    var menuSelected='1',
        menuShortName = 'Manual',
        menuFullName = 'Robotics|Manual';
    var setMenu = function(mfullname){
        $('#selectedTarget').empty();
        $('#selectedTarget').append(mfullname);
    }                        
    setMenu(menuFullName);
    $('.dept').click(function(){
        menuSelected = this.id;
        switch(menuSelected){
            case '1' : menuShortName='manual' ; menuFullName='Robotics|Manual';
            break;
            case '2' : menuShortName='electronics' ; menuFullName='Robotics|Electronics';
            break;
            case '3' : menuShortName='avr' ; menuFullName='Robotics|Avr';
            break;
            case '4' : menuShortName='arduino' ; menuFullName='Robotics|Arduino';
            break;
            case '5' : menuShortName='misc_robotics' ; menuFullName='Robotics|Miscellaneous';
            break;
            case '6' : menuShortName='web' ; menuFullName='Software|Web Development';
            break;
            case '7' : menuShortName='languages' ; menuFullName='Software|Languages';
            break;
            case '8' : menuShortName='standalone' ; menuFullName='Software|Standalone Apps';
            break;
            case '9' : menuShortName='misc_software' ; menuFullName='Software|Everything Else';
            break;
            case '10' : menuShortName='sae' ; menuFullName='Automobile|SAE';
            break;
            case '11' : menuShortName='asme' ; menuFullName='Automobile|ASME';
            break;
            case '12' : menuShortName='misc_automobile' ; menuFullName='Automobile|Miscellaneous';
            break;
        }
        setMenu(menuFullName);
    })
    /*fading out warning, status bar other stuffs*/
    $('.frclose').click(function () {
        var par = $(this).parent();
        var gpar = $(par[0]).parent();
        $(gpar[0]).fadeOut();
    });

    var processGist = function(htmlString){
        return htmlString.split('<p>&lt;script').join('<script')
                .split('&gt;&lt;/script&gt;<br></p>').join('></script>');
    }

    $('#uploadToServer').click(function () {
        var uploadObj = {
            update: false,
            fileid: f.toString(),
            placement: menuFullName,
            savePosition:menuShortName,
            title : $('#Title').html(),
            contributers : $('#Contrib').html(),
            mainbody : processGist($('#mainBody').html()),
            tagfield : $('#Tags').val()
        }
        var upstr = JSON.stringify(uploadObj);
        console.log(upstr);
        $.post('/inbound/newpage',uploadObj, function (data) {
            alert(data);
        })
        .success(function(){window.location.replace("/display/"+f)})
        .error(function(){console.log('error')})
    })
});