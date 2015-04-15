/* Chapter 4: Functions */

// Create a variable called add and store a function
// in it that adds two numbers.
var add = function (a, b) {
    return a + b;
};

// The Method Invocation Pattern
// Create myObject. It has a value and an increment
// method. The increment method takes an optional
// parameter. If the argument is not a number, then 1
// is used as the default.
var myObject = {
    value: 0,
    increment: function (inc) {
	this.value += typeof inc === 'number' ? inc : 1;
    }
};
myObject.increment();
console.log(myObject.value); // 1
myObject.increment(2);
console.log(myObject.value); // 3

/** The Function Invocation Pattern **/
var sum = add(3, 4); // sum is 7
console.log(sum);

// Augment myObject with a double method.
myObject.double = function ( ) {
    var that = this; // Workaround.
    var helper = function ( ) {
	that.value = add(that.value, that.value);
    };
    helper( ); // Invoke helper as a function.
};
// Invoke double as a method.
myObject.double( );
console.log(myObject.value); // 6

/** The Constructor Invocation Pattern **/
// Create a constructor function called Quo.
// It makes an object with a status property.
var Quo = function (string) {
 this.status = string;
};
// Give all instances of Quo a public method
// called get_status.
Quo.prototype.get_status = function ( ) {
 return this.status;
};
// Make an instance of Quo.
var myQuo = new Quo("confused");
console.log(myQuo.get_status( )); // confused
