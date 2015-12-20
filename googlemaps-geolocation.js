var initflag = 'false'

if (Meteor.isServer) {
// for setting extra fields other then username and password in accounts-ui
Accounts.onCreateUser(function(options, user) {
    if (options.secretAttribute)
        user.secretAttribute = options.secretAttribute;

    if (options.profile)
        user.profile = options.profile;

    return user;
});

}


Router.configure({
    layoutTemplate: 'main'
});


if (Meteor.isClient) {
	var flag = 'true';
  var MAP_ZOOM = 12;

  //Session.set('apimaps', false);
  Session.set('epoly', false);
  
  Meteor.startup(function() {
    GoogleMaps.load();
/*
	$.getScript('http://maps.google.com/maps/api/js?sensor=false', function(){
	// script has loaded
	  Session.set('apimaps', true);
	 });
*/
	 $.getScript('http://www.geocodezip.com/scripts/v3_epoly.js', function(){
	// script has loaded
	  Session.set('epoly', true);
	 });
 
 
  });

  Template.map.onCreated(function() {
    var self = this;
	
    GoogleMaps.ready('map', function(map) {
		
		google.maps.event.addListener(map.instance, 'click', function(event) {
		if(initflag == 'true'){
		Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
		  //console.log("clicked");
		}
		});
		

	var markers = {};
	var i = 1;
	Markers.find().observe({  
		added: function(document) {
			// Create a marker for this document
			i++;
		    window.setTimeout(function() {
		    var marker = new google.maps.Marker({
			  draggable: true,
			  animation: google.maps.Animation.DROP,
			  position: new google.maps.LatLng(document.lat, document.lng),
			  map: map.instance,
			  id: document._id
			});
			}, i*200);
	    }
	});
	/*
	Meteor.users.find().observe({  
		added: function(document) {
			// Create a marker for this document
			i++;
		    window.setTimeout(function() {
		    var marker = new google.maps.Marker({
			  draggable: true,
			  animation: google.maps.Animation.DROP,
			  position: new google.maps.LatLng(document.profile.coordinates.lat, document.profile.coordinates.lng),
			  map: map.instance,
			  id: document._id
			});
			}, i*200);
	    }
	});
*/	
	
	
	google.maps.event.addListener(map.instance, 'click', function(event) {
      
	  if(Session.get("passid") === Meteor.userId()){
	   var passengerlat = event.latLng.lat();
	  var passengerLng = event.latLng.lng();
	  console.log("clicked pannenger");
	  console.log(event.latLng.lat());
	  Session.set("passlat",event.latLng.lat());
	  Session.set("passlng",event.latLng.lng());
	  console.log(event.latLng.lng());
	  if(flag == 'true'){
		var passmarker = new google.maps.Marker({
			  draggable: true,
			  animation: google.maps.Animation.DROP,
			  position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
			  map: map.instance,
			  icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
			});
			flag = 'false';
	  }
		 google.maps.LatLng.prototype.distanceFrom = function(lat_lng) {
			  var lat = [this.lat(), lat_lng.lat()]
			  var lng = [this.lng(), lat_lng.lng()]
			  var R = 6378137;
			  var dLat = (lat[1]-lat[0]) * Math.PI / 180;
			  var dLng = (lng[1]-lng[0]) * Math.PI / 180;
			  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			  Math.cos(lat[0] * Math.PI / 180 ) * Math.cos(lat[1] * Math.PI / 180 ) *
			  Math.sin(dLng/2) * Math.sin(dLng/2);
			  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			  var d = R * c;
			  return (d);
			}
			var cabloc = [];
			var distarry = [];
			var passpos = new google.maps.LatLng(Session.get("passlat"),Session.get("passlng"));
			var data = Markers.find().fetch();
				
			for(var k=0; k<data.length;k++){
				cabloc[k] = new google.maps.LatLng(data[k].lat, data[k].lng);
				distarry[k] = cabloc[k].distanceFrom(passpos);
			
			}
			var minval = _.min(distarry);
			var indx = _.indexOf(distarry, minval);
			var nearestcab = new google.maps.LatLng(data[indx].lat, data[indx].lng);
			 polyline = new google.maps.Polyline({
                path: [nearestcab, passpos],
                strokeColor: "#FF0000",
                strokeOpacity: 0.5,
                strokeWeight: 4,
                geodesic: true,
                map: map.instance
            });
		

var request = {
            origin: nearestcab,
            destination: passpos,
            travelMode: google.maps.TravelMode.DRIVING
			};
			
			var rendererOptions = {
				map: map.instance,
				suppressMarkers : true,
				preserveViewport: true
			}
			console.log("testing1");

			directionsService = new google.maps.DirectionsService();
			directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);     
            directionsService.route(request, function(response, status) {
					console.log("testing2");

				if (status == google.maps.DirectionsStatus.OK) {
				console.log("testing3");

				directionsDisplay.setDirections(response);
				showSteps(response);
				}
				else
					console.log(status);
			});

			
			function showSteps(directionResult) {
			// For each step, place a marker, and add the text to the marker's
			// info window. Also attach the marker to an array so we
			// can keep track of it and remove it when calculating new
			// routes.
			var legs = directionResult.routes[0].legs[0];
			console.log("STEPS");
			console.log(legs);
			    var steps = legs.steps;
				console.log(steps);
		    for (var i = 0; i < legs.length; i++) {
				console.log("inn");
				var marker = new google.maps.Marker({
					position: legs[i].start_location,
					map: map.instance,
					icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
				});
			console.log(legs[i].start_location);
			}
			}




		
	  }  
    });
	//=====================================
		
			
	
	
});
  });

  Template.map.helpers({
    geolocationError: function() {
      var error = Geolocation.error();
      return error && error.message;
    },
    mapOptions: function() {
      var latLng = Geolocation.latLng();
      // Initialize the map once we have the latLng.
      if (GoogleMaps.loaded() && latLng) {
        return {
          center: new google.maps.LatLng(latLng.lat, latLng.lng),
          zoom: MAP_ZOOM
        };
      }
    }
  });
  
  //APP-1


Template.Initialize.events({
    'click .done': function(event){
		console.log("DONE");
        initflag = 'false';
	   Router.go('login');
    },
	'click .start': function(event){
		console.log("START");
        initflag = 'true';
	   
    }
});  
  
Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
}); 
  //define a default set of rules and error messages for our validate functions:



$.validator.setDefaults({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    messages: {
        email: {
            required: "You must enter an email address.",
            email: "You've entered an invalid email address."
        },
        password: {
            required: "You must enter a password.",
            minlength: "Your password must be at least {0} characters."
        }
    }
});

  
  Template.login.onRendered(function(){
	  var validator = $('.login').validate({
		submitHandler: function(event){
            //console.log("You just submitted the 'login' form.");
			        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
		
        Meteor.loginWithPassword(email, password, function(error){
				if(error){
//					console.log(error.reason);
					if(error.reason == "User not found"){
	//					console.log(error.reason);
						validator.showErrors({
							email: "That email doesn't belong to a registered user."   
						});
					}
					if(error.reason == "Incorrect password"){
						validator.showErrors({
							password: "You entered an incorrect password."    
						});
					}
				}			    
				else {
                    var currentRoute = Router.current().route.getName();
                    if(currentRoute == "login"){
						Session.set("passid", Meteor.userId());
						Router.go("map");
                    }
                }
		});
		

        }
    });
});
  
  
  Template.registerCab.onRendered(function(){
	  var validator = $('.registerCab').validate({
		
			rules: {
			usrname: {
				required: true,
				minlength: 4
			},
			mobile: {
				required: true,
				minlength: 10,
				digits: true
			},
			latitude: {
				required: true
			},
			longitude: {
				required: true
			}
		},
		messages: {
			usrname: {
				required: "You must enter a user name.",
				minlength: "Your User name must be at least {0} characters."
			},
			mobile: {
				required: "You must enter a mobile number.",
				minlength: "Your number must be at least {0} characters.",
				digits: "You must enter valid digits."
			},
			latitude: {
				required: "You must enter a latitude."
			},
			longitude: {
				required: "You must enter a longitude."
			}
				
		},
	  

		submitHandler: function(event){
		var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        var mobile = $('[name=mobile]').val();
        var usrname = $('[name=usrname]').val();
        var type = $('[name=typeofuser]').val();
		var latitude = $('[name=latitude]').val();
        var longitude = $('[name=longitude]').val();
		var options = {
			email: email,
			password: password,
			profile: {
				name: usrname,
				mobile: mobile,
				typeofuser: type,
				coordinates: {
                        lat: latitude,
                        lng: longitude
                    }
			},
			secretAttribute: "secretString"
		};

		Accounts.createUser(options, function(error){
			if(error){
				if(error.reason == "Email already exists."){
					validator.showErrors({
						email: "That email already belongs to a registered user."   
					});
				}
			} else {
				//this.render('map', {data: {title: 'Now You are a Registered Cab Driver at Devois'}});
				Router.go("map"); // Redirect user if registration succeeds
			}
		});
	  
        }
    });
	//var res = Meteor.users.find().fetch();
	//console.log("RES");
	//console.log(res);
});
  

 
 Template.registerPass.onRendered(function(){
	  var validator = $('.registerPass').validate({
		
			rules: {
			usrname: {
				required: true,
				minlength: 4
			},
			mobile: {
				required: true,
				minlength: 10,
				digits: true
			}
		},
		messages: {
			usrname: {
				required: "You must enter a user name.",
				minlength: "Your User name must be at least {0} characters."
			},
			mobile: {
				required: "You must enter a mobile number.",
				minlength: "Your number must be at least {0} characters.",
				digits: "You must enter valid digits."
			}
		},

		submitHandler: function(event){
		var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        var mobile = $('[name=mobile]').val();
        var usrname = $('[name=usrname]').val();
        var type = $('[name=typeofuser]').val();
		var options = {
			email: email,
			password: password,
			profile: {
				name: usrname,
				mobile: mobile,
				typeofuser: type,
				coordinates: {
                        lat: 0,
                        lng: 0
                    }
			},
			secretAttribute: "secretString"
		};

		Accounts.createUser(options, function(error){
			if(error){
				if(error.reason == "Email already exists."){
					validator.showErrors({
						email: "That email already belongs to a registered user."   
					});
				}
			}			
			else {
				Session.set("passid", Meteor.userId());
				Router.go("map"); // Redirect user if registration succeeds
			}
		});
		
        }
    });
});
 
  
}



Router.route('/registerCab');
Router.route('/registerPass');

Router.route('/map');
Router.route('/login');
Router.route('/Initialize');

Router.route('/', {
    name: 'home',
    template: 'home'
});

