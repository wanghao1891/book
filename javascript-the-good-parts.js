/* Chapter 4: Functions */
/** Function Literal */
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

/** Invocation */
/*** The Function Invocation Pattern */
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


/*** The Constructor Invocation Pattern */
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


/*** The Apply Invocation Pattern */
// Make an array of 2 numbers and add them.
var array = [3, 4];
var sum = add.apply(null, array); // sum is 7
// Make an object with a status member.
var statusObject = {
    status: 'A-OK'
};
// statusObject does not inherit from Quo.prototype,
// but we can invoke the get_status method on
// statusObject even though statusObject does not have
// a get_status method.
var status = Quo.prototype.get_status.apply(statusObject);
// status is 'A-OK'
console.log(status);


/** Arguments */
// Make a function that adds a lot of stuff.
// Note that defining the variable sum inside of
// the function does not interfere with the sum
// defined outside of the function. The function
// only sees the inner one.
var sum = function ( ) {
    var i, sum = 0;
    for (i = 0; i < arguments.length; i += 1) {
	sum += arguments[i];
    }
    return sum;
};
console.log(sum(4, 8, 15, 16, 23, 42)); // 108


/** Exceptions */
var add = function (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
	throw {
	    name: 'TypeError',
	    message: 'add needs numbers'
	};
    }
    return a + b;
}

// Make a try_it function that calls the new add
// function incorrectly.
var try_it = function ( ) {
    try {
	add("seven");
    } catch (e) {
	console.log(e.name + ': ' + e.message);
    }
}
try_it( );


/** Augmenting Types */
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

Number.method('integer', function ( ) {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
});
console.log((-10 / 3).integer( )); // -3

String.method('trim', function ( ) {
    return this.replace(/^\s+|\s+$/g, '');
});
console.log('"' + " neat ".trim( ) + '"');

// Add a method conditionally.
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
	this.prototype[name] = func;
    }
};

/** Recursion */
var hanoi = function (disc, src, aux, dst) {
    if (disc > 0) {
	hanoi(disc - 1, src, dst, aux);
	console.log('Move disc ' + disc +
			 ' from ' + src + ' to ' + dst);
	hanoi(disc - 1, aux, src, dst);
    }
};
hanoi(3, 'Src', 'Aux', 'Dst');

// Make a factorial function with tail
// recursion. It is tail recursive because
// it returns the result of calling itself.
// JavaScript does not currently optimize this form.
var factorial = function factorial(i, a) {
    a = a || 1;
    if (i < 2) {
	return a;
    }
    return factorial(i - 1, a * i);
};
console.log(factorial(4)); // 24

/** Scope */
var foo = function ( ) {
    var a = 3, b = 5;
    var bar = function ( ) {
	var b = 7, c = 11;
	// At this point, a is 3, b is 7, and c is 11
	a += b + c;
	// At this point, a is 21, b is 7, and c is 11
    };
    // At this point, a is 3, b is 5, and c is not defined
    bar( );
    // At this point, a is 21, b is 5
};


/** Closure */
var myObject = function ( ) {
    var value = 0;
    return {
	increment: function (inc) {
	    value += typeof inc === 'number' ? inc : 1;
	},
	getValue: function ( ) {
	    return value;
	}
    };
}( );

// Create a maker function called quo. It makes an
// object with a get_status method and a private
// status property.
var quo = function (status) {
    return {
	get_status: function ( ) {
	    return status;
	}
    };
};
// Make an instance of quo.
var myQuo = quo("amazed");
console.log(myQuo.get_status( ));
console.log(myQuo.get_status( ));

/** Module */
String.method('deentityify', function ( ) {
    // The entity table. It maps entity names to
    // characters.
    var entity = {
	quot: '"',
	lt: '<',
	gt: '>'
    };
    // Return the deentityify method.
    return function ( ) {
	// This is the deentityify method. It calls the string
	// replace method, looking for substrings that start
	// with '&' and end with ';'. If the characters in
	// between are in the entity table, then replace the
	// entity with the character from the table. It uses
	// a regular expression (Chapter 7).
	return this.replace(/&([^&;]+);/g,
			    function (a, b) {
				var r = entity[b];
				return typeof r === 'string' ? r : a;
			    }
			   );
    };
}( ));

console.log(
    '&lt;&quot;&gt;'.deentityify( )); // <">

var serial_maker = function ( ) {
    // Produce an object that produces unique strings. A
    // unique string is made up of two parts: a prefix
    // and a sequence number. The object comes with
    // methods for setting the prefix and sequence
    // number, and a gensym method that produces unique
    // strings.
    var prefix = '';
    var seq = 0;
    return {
	set_prefix: function (p) {
	    prefix = String(p);
	},
	set_seq: function (s) {
	    seq = s;
	},
	gensym: function ( ) {
	    var result = prefix + seq;
	    seq += 1;
	    return result;
	}
    };
};
var seqer = serial_maker( );
seqer.set_prefix('Q');
seqer.set_seq(1000);
var unique = seqer.gensym( ); // unique is "Q1000"
console.log(unique);


/** Curry */
Function.method('curry', function ( ) {
    var slice = Array.prototype.slice,
    args = slice.apply(arguments),
    that = this;
    return function ( ) {
	return that.apply(null, args.concat(slice.apply(arguments)));
    };
});

var add1 = add.curry(1);
console.log(add1(6)); // 7


/** Memoization */
var fibonacci = function (n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
};
for (var i = 0; i <= 10; i += 1) {
    console.log('// ' + i + ': ' + fibonacci(i));
}

var fibonacci = function ( ) {
    var memo = [0, 1];
    var fib = function (n) {
	var result = memo[n];
	if (typeof result !== 'number') {
	    result = fib(n - 1) + fib(n - 2);
	    memo[n] = result;
	}
	return result;
    };
    return fib;
}( );

for (var i = 0; i <= 10; i += 1) {
    console.log('// ' + i + ': ' + fibonacci(i));
}
