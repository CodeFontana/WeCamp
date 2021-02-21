const mongoose = require('mongoose');
const Campground = require('./models/campground.js');
const Comment = require('./models/comment.js');
const User = require('./models/user.js');

let data = [
	{
		name: 'Death Valley',
		price: '6.66',
		image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
		description:
			'Bacon ipsum dolor amet shoulder porchetta brisket hamburger tail ham. Corned beef bacon tenderloin filet mignon drumstick pork loin. Ball tip turducken tongue pork chop chuck ham. Leberkas boudin sirloin picanha shank pork chop filet mignon shankle meatloaf chislic ground round turkey ball tip doner chuck.'
	},
	{
		name: "Hell's Underbelly",
		price: '6.66',
		image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
		description:
			'Bacon ipsum dolor amet jerky boudin beef ribs prosciutto. Pork loin turducken pig jowl bresaola kielbasa biltong. Strip steak fatback tail porchetta ham hock, ground round salami ham kielbasa. Venison kielbasa burgdoggen capicola. Ham ground round boudin, meatball biltong kielbasa brisket alcatra ham hock pork belly bacon flank.'
	},
	{
		name: 'Snoreville',
		price: '9.99',
		image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
		description:
			'Spicy jalapeno bacon ipsum dolor amet turkey shank tongue strip steak meatball ribeye porchetta picanha turducken capicola brisket fatback boudin. Tail chislic filet mignon, corned beef short loin swine fatback chuck tongue. Fatback t-bone jowl venison shank kevin. Meatball tongue corned beef ham rump.'
	}
];

function findOrCreateSeedUser(callback) {
	User.findOne({ username: 'Francis' }, (err, foundUser) => {
		if (err || !foundUser) {
			console.log("Create user: Francis");
			const newUser = new User({ username: 'Francis' });
			User.register(newUser, "password", (err, seedUser) => {
				if (err || !seedUser) {
					const errorString = 'Failed to register user [Francis]: ' + err.message;
					console.log(errorString);
					return callback(new Error(errorString));
				} else {
                    console.log('Created successfully: Francis');
                    return callback(null, seedUser);
                }
			});
		} else {
			console.log('Existing user: Francis');
			return callback(null, foundUser);
		}
	});
};

function seedDB() {
	findOrCreateSeedUser((err, seedUser) => {
		if (err || !seedUser) {
			console.log(err);
		} else {
			console.log('Seed data user: ' + seedUser.username + ' [' + seedUser._id + ']');
			data.forEach((seed) => {
				Campground.findOne({ name: seed.name }, (err, foundCampground) => {
					if (err || !foundCampground) {
						console.log('Seed campground: ' + seed.name);
						seed.author = { id: seedUser._id, username: seedUser.username };
						Campground.create(seed, (err, campground) => {
							if (err) {
								console.log(err);
							} else {
								Comment.create(
									{
										text: 'Fuck this hell hole!!!',
										author: { id: seedUser._id, username: seedUser.username }
									},
									(err, comment) => {
										if (err) {
											console.log(err);
										} else {
											console.log('Seed comment [' + seed.name + ']: ' + comment.text);
											campground.comments.push(comment);
											// campground.save();
										}
									}
								);
								Comment.create(
									{
										text: "I've been in porta-johns better than this place!!",
										author: { id: seedUser._id, username: seedUser.username }
									},
									(err, comment) => {
										if (err) {
											console.log(err);
										} else {
											console.log('Seed comment [' + seed.name + ']: ' + comment.text);
											campground.comments.push(comment);
											campground.save();
										}
									}
								);
							}
						});
					} else {
                        console.log("Already exists: " + seed.name);
                    }
				});
			});
		}
	});
}

module.exports = seedDB;
