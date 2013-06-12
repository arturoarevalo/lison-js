/*!{id:lison.js,ver:1.0,license:"MIT",author:"arturo.arevalo.gonzalez@gmail.com"}*/

// === lison ===
// LiSON -> http://github.com/arturoarevalo/lison-js

this.LISON || (function(scope) {

scope.LISON = {
	serialize: notImplemented,
	deserialize: deserialize,
	
	download: notImplemented
};

var _cache = {},
	_compilerConstants = {
		objectHead : "__parts[++__cpart] == '0' ? null : {",
		objectTail : "}",
		
		arrayHead : "(function (n) { var ar = new Array(n); for (var i = 0; i < n; i++) { ar[i]=",
		arrayTail : ";} return ar;}) (__parts[++__cpart])",
		
		stringType : "__parts[++__cpart]",
		integerType : "__parts[++__cpart]",
		
		compilerHead : "(function () { function __idec (__parts, __cpart) { return ",
		compilerTail : " ; }; return __idec; })()"
	};

function notImplemented () {
	alert ("Not implemented");
}

function deserialize (data) {
	var parts = data.split ('|');
	
	if (_cache [parts [1]] == undefined) {
		_cache [parts [1]] = eval (compile (_compilerConstants, parts[1]));
	}
	
	var output = _cache [parts [1]] (parts, 1);
	return output;
}

function compile (compiler, expression) {
	return  compiler.compilerHead 							// head
		+ expression.replace (/<O/g, compiler.objectHead) 	// objects
					.replace (/\/O/g, compiler.objectTail)
					.replace (/<o/g, ":" + compiler.objectHead)
					.replace (/\/o/g, compiler.objectTail + ",")
					.replace (/<A/g, compiler.arrayHead)		// arrays
					.replace (/\/A/g, compiler.arrayTail)
					.replace (/<a/g, ":" + compiler.arrayHead)
					.replace (/\/a/g, compiler.arrayTail + ",")
					.replace (/#S/g, compiler.stringType)		// data types
					.replace (/#s/g, ":" + compiler.stringType + ",")
		+ compiler.compilerTail;								// tail
}

})(this);