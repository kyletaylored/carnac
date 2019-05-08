// $(function () {
//       $('#signup').on('click', function () {
//         console.log('signup')
//         var email = $('#email').val();
//         var fname = $('#fname').val();
//         var lname = $('#lname').val();
//         var dob = $('#dob').val();
//          var gender = $('input[name=gender]:checked').val();
//         var password = $('#password').val();
        
//         $.ajax({
//             type: 'POST',
//             url: '/signup',
//             data: {
//                 email: email,
//                 lname: lname,
//                 fname: fname,
//                 password: password,
//                 dob: dob,
//                 gender: gender
//             },
//             success: function (data) {

                
//             },
//             error: function (err) {
//                 console.log(err)
//             }
//         })
//     }); 

//      $('#addSub').on('click', function () {
        
//         var subreddit = $('#item').val();
//         console.log(subreddit)

//         $.ajax({
//             type: 'POST',
//             url: '/add-subreddit',
//             data: {
//                 subreddit: subreddit
//             },
//             success: function (data) {
               
                    
//                 $('#item').val('');

//             },
//             error: function (err) {
//                 console.log(err)
//             }
//         })
//     });



    


// });