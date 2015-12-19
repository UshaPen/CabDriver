(function(){
Template.body.addContent((function() {
  var view = this;
  return "";
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("map");
Template["map"] = new Template("Template.map", (function() {
  var view = this;
  return HTML.DIV({
    "class": "map-container"
  }, "\n  ", Blaze.View("lookup:title", function() {
    return Spacebars.mustache(view.lookup("title"));
  }), "\n  ", Blaze.Unless(function() {
    return Spacebars.call(view.lookup("geolocationError"));
  }, function() {
    return [ "\n      ", Blaze._TemplateWith(function() {
      return {
        name: Spacebars.call("map"),
        options: Spacebars.call(view.lookup("mapOptions"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("googleMap"));
    }), "\n    " ];
  }, function() {
    return [ "\n      Geolocation failed: ", Blaze.View("lookup:geolocationError", function() {
      return Spacebars.mustache(view.lookup("geolocationError"));
    }), "\n    " ];
  }), "\n  ");
}));

Template.__checkName("registerCab");
Template["registerCab"] = new Template("Template.registerCab", (function() {
  var view = this;
  return HTML.Raw('<h2>Cab Driver Registration Form</h2>\n	<form class="registerCab">\n        <p>Email: <input type="email" name="email"></p>\n        <p>Password: <input type="password" name="password"></p>\n		<p>Name: <input type="text" name="usrname"></p>\n\n		<p>Mobile: <input type="text" name="mobile"></p>\n		<p><input type="text" name="typeofuser" id="hidden_typeofuser" value="cab_driver"></p>\n			\n        <p><input type="submit" value="Register"></p>\n    </form>');
}));

Template.__checkName("registerPass");
Template["registerPass"] = new Template("Template.registerPass", (function() {
  var view = this;
  return HTML.Raw('<h2>Passengers Registration Form</h2>\n	<form class="registerPass">\n        <p>Email: <input type="email" name="email"></p>\n        <p>Password: <input type="password" name="password"></p>\n		<p>Name: <input type="text" name="usrname"></p>\n\n		<p>Mobile: <input type="text" name="mobile"></p>\n		<p><input type="text" name="typeofuser" id="hidden_typeofuser" value="passenger"></p>\n        <p><input type="submit" value="Register"></p>\n    </form>');
}));

Template.__checkName("login");
Template["login"] = new Template("Template.login", (function() {
  var view = this;
  return HTML.Raw('<h2>Login</h2>\n	<form class="login">\n		<div class="row">\n			<div class="form-group">\n	            <label for="email">Email</label>\n	            <input type="email" name="email">\n		    </div>    <br><br>\n			<div class="form-group">\n	            <label for="password">Password</label>\n	            <input type="password" name="password">\n		    </div>\n        <p><input type="submit" value="Login"></p>\n		</div>\n    </form>');
}));

Template.__checkName("home");
Template["home"] = new Template("Template.home", (function() {
  var view = this;
  return HTML.Raw("<p>Welcome to the Devois Cab application.</p>");
}));

Template.__checkName("navigation");
Template["navigation"] = new Template("Template.navigation", (function() {
  var view = this;
  return HTML.UL({
    "class": "navlist"
  }, "\n    ", HTML.LI(HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "home"
      }));
    }
  }, "Home")), "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n        ", HTML.LI(HTML.A({
      href: "#",
      "class": "logout"
    }, "Logout")), "\n    " ];
  }, function() {
    return [ "\n        ", HTML.LI(HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "registerCab"
        }));
      }
    }, "Cab Driver Registration")), "\n		", HTML.LI(HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "registerPass"
        }));
      }
    }, "Passenger Registration")), "\n        ", HTML.LI(HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "login"
        }));
      }
    }, "Login")), "\n    " ];
  }), "\n	");
}));

Template.__checkName("main");
Template["main"] = new Template("Template.main", (function() {
  var view = this;
  return [ HTML.SPAN("	", HTML.CENTER(HTML.Raw("<h1>Devois</h1>"), "\n	", HTML.Raw("<h1>Welcome To CAB Booking</h1>"), "\n	", HTML.Raw("<p> Login to Access the App </p>"), "\n	", Spacebars.include(view.lookupTemplate("navigation")), "\n	", Spacebars.include(view.lookupTemplate("yield")), "  \n	", HTML.Raw("<hr>")), "\n	"), HTML.Raw("\n	<p>Copyright &copy; Devois, 2014-2015.</p>") ];
}));

}).call(this);
