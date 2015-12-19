(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// googlemaps-geolocation.js                                           //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
                                                                       //
                                                                       //
if (Meteor.isServer) {                                                 // 3
	// for setting extra fields other then username and password in accounts-ui
	Accounts.onCreateUser(function (options, user) {                      // 5
		if (options.secretAttribute) user.secretAttribute = options.secretAttribute;
                                                                       //
		if (options.profile) user.profile = options.profile;                 // 9
                                                                       //
		return user;                                                         // 12
	});                                                                   //
}                                                                      //
                                                                       //
Router.configure({                                                     // 18
	layoutTemplate: 'main'                                                // 19
});                                                                    //
                                                                       //
if (Meteor.isClient) {                                                 // 23
	var flag = 'true';                                                    // 24
	var MAP_ZOOM = 12;                                                    // 25
                                                                       //
	//Session.set('apimaps', false);                                      //
	Session.set('epoly', false);                                          // 28
                                                                       //
	Meteor.startup(function () {                                          // 30
		GoogleMaps.load();                                                   // 31
		/*                                                                   //
  	$.getScript('http://maps.google.com/maps/api/js?sensor=false', function(){
  	// script has loaded                                                //
  	  Session.set('apimaps', true);                                     //
  	 });                                                                //
  */                                                                   //
		$.getScript('http://www.geocodezip.com/scripts/v3_epoly.js', function () {
			// script has loaded                                                //
			Session.set('epoly', true);                                         // 40
		});                                                                  //
	});                                                                   //
                                                                       //
	Template.map.onCreated(function () {                                  // 46
		var self = this;                                                     // 47
                                                                       //
		GoogleMaps.ready('map', function (map) {                             // 49
			/*		  google.maps.event.addListener(map.instance, 'click', function(event) {
   		  Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
   		  //console.log("clicked");                                       //
   	});                                                                //
   */                                                                  //
			var markers = {};                                                   // 55
			var i = 1;                                                          // 56
			Markers.find().observe({                                            // 57
				added: function (document) {                                       // 58
					// Create a marker for this document                              //
					i++;                                                              // 60
					window.setTimeout(function () {                                   // 61
						var marker = new google.maps.Marker({                            // 62
							draggable: true,                                                // 63
							animation: google.maps.Animation.DROP,                          // 64
							position: new google.maps.LatLng(document.lat, document.lng),   // 65
							map: map.instance,                                              // 66
							id: document._id                                                // 67
						});                                                              //
					}, i * 200);                                                      //
				}                                                                  //
			});                                                                 //
			/*                                                                  //
   Meteor.users.find().observe({                                       //
   	added: function(document) {                                        //
   		// Create a marker for this document                              //
   		i++;                                                              //
   	    window.setTimeout(function() {                                 //
   	    var marker = new google.maps.Marker({                          //
   		  draggable: true,                                                //
   		  animation: google.maps.Animation.DROP,                          //
   		  position: new google.maps.LatLng(document.profile.coordinates.lat, document.profile.coordinates.lng),
   		  map: map.instance,                                              //
   		  id: document._id                                                //
   		});                                                               //
   		}, i*200);                                                        //
       }                                                               //
   });                                                                 //
   */                                                                  //
                                                                       //
			google.maps.event.addListener(map.instance, 'click', function (event) {
                                                                       //
				if (Session.get("passid") === Meteor.userId()) {                   // 93
					var passengerlat = event.latLng.lat();                            // 94
					var passengerLng = event.latLng.lng();                            // 95
					console.log("clicked pannenger");                                 // 96
					console.log(event.latLng.lat());                                  // 97
					Session.set("passlat", event.latLng.lat());                       // 98
					Session.set("passlng", event.latLng.lng());                       // 99
					console.log(event.latLng.lng());                                  // 100
					if (flag == 'true') {                                             // 101
						var passmarker = new google.maps.Marker({                        // 102
							draggable: true,                                                // 103
							animation: google.maps.Animation.DROP,                          // 104
							position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
							map: map.instance,                                              // 106
							icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'   // 107
						});                                                              //
						flag = 'false';                                                  // 109
					}                                                                 //
					google.maps.LatLng.prototype.distanceFrom = function (lat_lng) {  // 111
						var lat = [this.lat(), lat_lng.lat()];                           // 112
						var lng = [this.lng(), lat_lng.lng()];                           // 113
						var R = 6378137;                                                 // 114
						var dLat = (lat[1] - lat[0]) * Math.PI / 180;                    // 115
						var dLng = (lng[1] - lng[0]) * Math.PI / 180;                    // 116
						var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
						var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));          // 120
						var d = R * c;                                                   // 121
						return d;                                                        // 122
					};                                                                //
					var cabloc = [];                                                  // 124
					var distarry = [];                                                // 125
					var passpos = new google.maps.LatLng(Session.get("passlat"), Session.get("passlng"));
					var data = Markers.find().fetch();                                // 127
                                                                       //
					for (var k = 0; k < data.length; k++) {                           // 129
						cabloc[k] = new google.maps.LatLng(data[k].lat, data[k].lng);    // 130
						distarry[k] = cabloc[k].distanceFrom(passpos);                   // 131
					}                                                                 //
					var minval = _.min(distarry);                                     // 134
					var indx = _.indexOf(distarry, minval);                           // 135
					var nearestcab = new google.maps.LatLng(data[indx].lat, data[indx].lng);
					polyline = new google.maps.Polyline({                             // 137
						path: [nearestcab, passpos],                                     // 138
						strokeColor: "#FF0000",                                          // 139
						strokeOpacity: 0.5,                                              // 140
						strokeWeight: 4,                                                 // 141
						geodesic: true,                                                  // 142
						map: map.instance                                                // 143
					});                                                               //
                                                                       //
					var request = {                                                   // 147
						origin: nearestcab,                                              // 148
						destination: passpos,                                            // 149
						travelMode: google.maps.TravelMode.DRIVING                       // 150
					};                                                                //
                                                                       //
					var rendererOptions = {                                           // 153
						map: map.instance,                                               // 154
						suppressMarkers: true,                                           // 155
						preserveViewport: true                                           // 156
					};                                                                //
					console.log("testing1");                                          // 158
                                                                       //
					directionsService = new google.maps.DirectionsService();          // 160
					directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
					directionsService.route(request, function (response, status) {    // 162
						console.log("testing2");                                         // 163
                                                                       //
						if (status == google.maps.DirectionsStatus.OK) {                 // 165
							console.log("testing3");                                        // 166
                                                                       //
							directionsDisplay.setDirections(response);                      // 168
							showSteps(response);                                            // 169
						} else console.log(status);                                      //
					});                                                               //
                                                                       //
					function showSteps(directionResult) {                             // 176
						// For each step, place a marker, and add the text to the marker's
						// info window. Also attach the marker to an array so we         //
						// can keep track of it and remove it when calculating new       //
						// routes.                                                       //
						var legs = directionResult.routes[0].legs[0];                    // 181
						console.log("STEPS");                                            // 182
						console.log(legs);                                               // 183
						var steps = legs.steps;                                          // 184
						console.log(steps);                                              // 185
						for (var i = 0; i < legs.length; i++) {                          // 186
							console.log("inn");                                             // 187
							var marker = new google.maps.Marker({                           // 188
								position: legs[i].start_location,                              // 189
								map: map.instance,                                             // 190
								icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
							});                                                             //
							console.log(legs[i].start_location);                            // 193
						}                                                                //
					}                                                                 //
				}                                                                  //
			});                                                                 //
			//=====================================                             //
		});                                                                  //
	});                                                                   //
                                                                       //
	Template.map.helpers({                                                // 211
		geolocationError: function () {                                      // 212
			var error = Geolocation.error();                                    // 213
			return error && error.message;                                      // 214
		},                                                                   //
		mapOptions: function () {                                            // 216
			var latLng = Geolocation.latLng();                                  // 217
			// Initialize the map once we have the latLng.                      //
			if (GoogleMaps.loaded() && latLng) {                                // 219
				return {                                                           // 220
					center: new google.maps.LatLng(latLng.lat, latLng.lng),           // 221
					zoom: MAP_ZOOM                                                    // 222
				};                                                                 //
			}                                                                   //
		}                                                                    //
	});                                                                   //
                                                                       //
	//APP-1                                                               //
                                                                       //
	Template.navigation.events({                                          // 230
		'click .logout': function (event) {                                  // 231
			event.preventDefault();                                             // 232
			Meteor.logout();                                                    // 233
			Router.go('login');                                                 // 234
		}                                                                    //
	});                                                                   //
                                                                       //
	//define a default set of rules and error messages for our validate functions:
                                                                       //
	$.validator.setDefaults({                                             // 243
		rules: {                                                             // 244
			email: {                                                            // 245
				required: true,                                                    // 246
				email: true                                                        // 247
			},                                                                  //
			password: {                                                         // 249
				required: true,                                                    // 250
				minlength: 6                                                       // 251
			}                                                                   //
		},                                                                   //
		messages: {                                                          // 254
			email: {                                                            // 255
				required: "You must enter an email address.",                      // 256
				email: "You've entered an invalid email address."                  // 257
			},                                                                  //
			password: {                                                         // 259
				required: "You must enter a password.",                            // 260
				minlength: "Your password must be at least {0} characters."        // 261
			}                                                                   //
		}                                                                    //
	});                                                                   //
                                                                       //
	Template.login.onRendered(function () {                               // 267
		var validator = $('.login').validate({                               // 268
			submitHandler: function (event) {                                   // 269
				//console.log("You just submitted the 'login' form.");             //
				var email = $('[name=email]').val();                               // 271
				var password = $('[name=password]').val();                         // 272
                                                                       //
				Meteor.loginWithPassword(email, password, function (error) {       // 274
					if (error) {                                                      // 275
						//					console.log(error.reason);                                //
						if (error.reason == "User not found") {                          // 277
							//					console.log(error.reason);                               //
							validator.showErrors({                                          // 279
								email: "That email doesn't belong to a registered user."       // 280
							});                                                             //
						}                                                                //
						if (error.reason == "Incorrect password") {                      // 283
							validator.showErrors({                                          // 284
								password: "You entered an incorrect password."                 // 285
							});                                                             //
						}                                                                //
					} else {                                                          //
						var currentRoute = Router.current().route.getName();             // 290
						if (currentRoute == "login") {                                   // 291
							Session.set("passid", Meteor.userId());                         // 292
							Router.go("map");                                               // 293
						}                                                                //
					}                                                                 //
				});                                                                //
			}                                                                   //
		});                                                                  //
	});                                                                   //
                                                                       //
	Template.registerCab.onRendered(function () {                         // 304
		var validator = $('.registerCab').validate({                         // 305
                                                                       //
			rules: {                                                            // 307
				usrname: {                                                         // 308
					required: true,                                                   // 309
					minlength: 4                                                      // 310
				},                                                                 //
				mobile: {                                                          // 312
					required: true,                                                   // 313
					minlength: 10,                                                    // 314
					digits: true                                                      // 315
				},                                                                 //
				latitude: {                                                        // 317
					required: true                                                    // 318
				},                                                                 //
				longitude: {                                                       // 320
					required: true                                                    // 321
				}                                                                  //
			},                                                                  //
			messages: {                                                         // 324
				usrname: {                                                         // 325
					required: "You must enter a user name.",                          // 326
					minlength: "Your User name must be at least {0} characters."      // 327
				},                                                                 //
				mobile: {                                                          // 329
					required: "You must enter a mobile number.",                      // 330
					minlength: "Your number must be at least {0} characters.",        // 331
					digits: "You must enter valid digits."                            // 332
				},                                                                 //
				latitude: {                                                        // 334
					required: "You must enter a latitude."                            // 335
				},                                                                 //
				longitude: {                                                       // 337
					required: "You must enter a longitude."                           // 338
				}                                                                  //
                                                                       //
			},                                                                  //
                                                                       //
			submitHandler: function (event) {                                   // 344
				var email = $('[name=email]').val();                               // 345
				var password = $('[name=password]').val();                         // 346
				var mobile = $('[name=mobile]').val();                             // 347
				var usrname = $('[name=usrname]').val();                           // 348
				var type = $('[name=typeofuser]').val();                           // 349
				var latitude = $('[name=latitude]').val();                         // 350
				var longitude = $('[name=longitude]').val();                       // 351
				var options = {                                                    // 352
					email: email,                                                     // 353
					password: password,                                               // 354
					profile: {                                                        // 355
						name: usrname,                                                   // 356
						mobile: mobile,                                                  // 357
						typeofuser: type,                                                // 358
						coordinates: {                                                   // 359
							lat: latitude,                                                  // 360
							lng: longitude                                                  // 361
						}                                                                //
					},                                                                //
					secretAttribute: "secretString"                                   // 364
				};                                                                 //
                                                                       //
				Accounts.createUser(options, function (error) {                    // 367
					if (error) {                                                      // 368
						if (error.reason == "Email already exists.") {                   // 369
							validator.showErrors({                                          // 370
								email: "That email already belongs to a registered user."      // 371
							});                                                             //
						}                                                                //
					} else {                                                          //
						//this.render('map', {data: {title: 'Now You are a Registered Cab Driver at Devois'}});
						Router.go("map"); // Redirect user if registration succeeds      // 376
					}                                                                 //
				});                                                                //
			}                                                                   //
		});                                                                  //
		//var res = Meteor.users.find().fetch();                             //
		//console.log("RES");                                                //
		//console.log(res);                                                  //
	});                                                                   //
                                                                       //
	Template.registerPass.onRendered(function () {                        // 389
		var validator = $('.registerPass').validate({                        // 390
                                                                       //
			rules: {                                                            // 392
				usrname: {                                                         // 393
					required: true,                                                   // 394
					minlength: 4                                                      // 395
				},                                                                 //
				mobile: {                                                          // 397
					required: true,                                                   // 398
					minlength: 10,                                                    // 399
					digits: true                                                      // 400
				}                                                                  //
			},                                                                  //
			messages: {                                                         // 403
				usrname: {                                                         // 404
					required: "You must enter a user name.",                          // 405
					minlength: "Your User name must be at least {0} characters."      // 406
				},                                                                 //
				mobile: {                                                          // 408
					required: "You must enter a mobile number.",                      // 409
					minlength: "Your number must be at least {0} characters.",        // 410
					digits: "You must enter valid digits."                            // 411
				}                                                                  //
			},                                                                  //
                                                                       //
			submitHandler: function (event) {                                   // 415
				var email = $('[name=email]').val();                               // 416
				var password = $('[name=password]').val();                         // 417
				var mobile = $('[name=mobile]').val();                             // 418
				var usrname = $('[name=usrname]').val();                           // 419
				var type = $('[name=typeofuser]').val();                           // 420
				var options = {                                                    // 421
					email: email,                                                     // 422
					password: password,                                               // 423
					profile: {                                                        // 424
						name: usrname,                                                   // 425
						mobile: mobile,                                                  // 426
						typeofuser: type,                                                // 427
						coordinates: {                                                   // 428
							lat: 0,                                                         // 429
							lng: 0                                                          // 430
						}                                                                //
					},                                                                //
					secretAttribute: "secretString"                                   // 433
				};                                                                 //
                                                                       //
				Accounts.createUser(options, function (error) {                    // 436
					if (error) {                                                      // 437
						if (error.reason == "Email already exists.") {                   // 438
							validator.showErrors({                                          // 439
								email: "That email already belongs to a registered user."      // 440
							});                                                             //
						}                                                                //
					} else {                                                          //
						Session.set("passid", Meteor.userId());                          // 445
						Router.go("map"); // Redirect user if registration succeeds      // 446
					}                                                                 //
				});                                                                //
			}                                                                   //
		});                                                                  //
	});                                                                   //
}                                                                      //
                                                                       //
Router.route('/registerCab');                                          // 459
Router.route('/registerPass');                                         // 460
                                                                       //
Router.route('/map');                                                  // 462
Router.route('/login');                                                // 463
                                                                       //
Router.route('/', {                                                    // 465
	name: 'home',                                                         // 466
	template: 'home'                                                      // 467
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=googlemaps-geolocation.js.map
