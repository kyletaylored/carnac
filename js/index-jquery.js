const electron = require('electron');
const {ipcRenderer} = electron;


document.addEventListener("DOMContentLoaded", () => {
	//ipcRenderer.send("mainWindowLoaded");
	const ul = document.querySelector('ul');
	ipcRenderer.on('add:subreddit', (e, item) => {
		ul.className = '';
		let li = document.createElement('li');
		li.className = '';
		console.log(item);
		item.forEach( (element) => {
			console.log(element);
			let li = document.createElement('li');
			let itemText = document.createTextNode(element);
			li.appendChild(itemText);
			ul.appendChild(li);
		});		
	});

});
// $(function() {
// 	$('.button').click(function(){
// 		let userInput = {
// 			subreddit: $('#name').val(),
// 			number: $('#number').val()
// 		};

// 		console.log(userInput);

// 		$.ajax({
// 			type: 'POST', // added
// 			url: '/api/subreddit-info',
// 			data: userInput,
// 			success: function(post_listings) {

// 				console.log('Success!');
// 				console.log(userInput);
// 				console.log(post_listings);
// 			},
// 			error: function (xhr, status, error) {
// 				alert('Error: ' + error.message);
// 			}
// 		});
// 	});
// });

