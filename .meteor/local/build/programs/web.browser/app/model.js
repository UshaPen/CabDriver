(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// model.js                                                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
// globalvars                                                          //
CabDrivers = new Mongo.Collection('drivers');                          // 2
passengersList = new Mongo.Collection('passengers');                   // 3
Markers = new Mongo.Collection('markers');                             // 4
/////////////////////////////////////////////////////////////////////////

}).call(this);
