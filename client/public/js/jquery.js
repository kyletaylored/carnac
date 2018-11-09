$(function(){
    $(".submitbutton").click(function(){
        let userInput = $("input.textbox").val();
        console.log(userInput);
        alert(userInput);
        // $.ajax({
        //     type: 'POST', // added
        //     url: "localhost:36000",
        //     data: '{"data": userInput}',
        //     //dataType: 'jsonp' - removed
        //     //jsonpCallback: 'callback' - removed
        //     success: function (data) {
        //         let ret = jQuery.JSON.parse(data);
        //         // alert(($("input.textbox").val()));
        //         // alert();
        //         alert('Success!');
        //     },
        //     error: function (xhr, status, error) {
        //         alert('Error: ' + error.message);
        //     }
        //     });
    });
});

