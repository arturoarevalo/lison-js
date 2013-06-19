/*!{id:lison.js,ver:1.0,license:"MIT",author:"arturo.arevalo.gonzalez@gmail.com"}*/

// === lison ===
// LiSON -> http://github.com/arturoarevalo/lison-js

this['LISON'] || (function(scope) {

scope['LISON'] = {
	'deserialize': deserialize
};

var _cache = {},
	_compilerConstants = {
		objectHead : "p[++c]=='0'?null:{",
		objectTail : "}",
		
		arrayHead : "(function(n){var a=new Array(n);for(var i=0;i<n;i++){a[i]=",
		arrayTail : ";}return a;})(p[++c])",

		dictionaryHead : "(function(n){var a={};for(var i=0;i<n;i++){t={",
		dictionaryTail : "};a[t.k]=t.v;}return a;})(p[++c])",
		
		booleanType : "!(p[++c]=='0')",
		tableStringType : "p[++c]==''?'':(p[c]=='0'?null:p[o+parseInt(p[c])])",
		inlineStringType : "p[++c]",
		integerType : "p[++c]",
		floatType : "p[++c]",
		
		compilerHead : "(function(){return function(p,c,o){return ",
		compilerTail : ";};})()"
	};

function deserialize (data) {
	var parts = data.split ('|');
	var typeDefinition = parts [1];
	var deserializer = _cache [typeDefinition] 
		? _cache [typeDefinition] 
		: _cache [typeDefinition] = eval (compile (_compilerConstants, typeDefinition));
	var stringTableOffset = parts.length - parts [parts.length - 1] - 2;

	return deserializer (parts, 1, stringTableOffset);
}

function compile (compiler, expression) {
	return  compiler.compilerHead 							// head
		+ expression
			// objects
			.replace (/<O/g, compiler.objectHead) 	
			.replace (/\/O/g, compiler.objectTail)
			.replace (/<o/g, ":" + compiler.objectHead)
			.replace (/\/o/g, compiler.objectTail + ",")
			// arrays
			.replace (/<A/g, compiler.arrayHead)		
			.replace (/\/A/g, compiler.arrayTail)
			.replace (/<a/g, ":" + compiler.arrayHead)
			.replace (/\/a/g, compiler.arrayTail + ",")
			// dictionaries (associative arrays)
			.replace (/<D/g, compiler.dictionaryHead)		
			.replace (/\/D/g, compiler.dictionaryTail)
			.replace (/<d/g, ":" + compiler.dictionaryHead)
			.replace (/\/d/g, compiler.dictionaryTail + ",")
			// strings
			.replace (/#T/g, compiler.tableStringType)
			.replace (/#t/g, ":" + compiler.tableStringType + ",")
			.replace (/#S/g, compiler.inlineStringType)
			.replace (/#s/g, ":" + compiler.inlineStringType + ",")
			// booleans
			.replace (/#B/g, compiler.booleanType)
			.replace (/#b/g, ":" + compiler.booleanType + ",")
			// integers
			.replace (/#I/g, compiler.integerType)
			.replace (/#i/g, ":" + compiler.integerType + ",")
			// floating point
			.replace (/#F/g, compiler.floatType)
			.replace (/#f/g, ":" + compiler.floatType + ",")
		+ compiler.compilerTail;							// tail
}

})(this);