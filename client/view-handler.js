$(document).ready(function(){
    $("input.submitbutton").click(function(){
        alert("Button click event triggered!");
        $(this).hide();
    });
});