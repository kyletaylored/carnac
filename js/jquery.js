$(function() {
	$('.button').click(function(){
		let userInput = {
			subreddit: $('#name').val(),
			number: $('#number').val()
		};

		console.log(userInput);

		$.ajax({
			type: 'POST', // added
			url: '/api/subreddit-info',
			data: userInput,
			success: function(post_listings) {

				console.log('Success!');
				console.log(userInput);
				console.log(post_listings);
			},
			error: function (xhr, status, error) {
				alert('Error: ' + error.message);
			}
		});
	});
});

