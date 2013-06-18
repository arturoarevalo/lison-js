/*!{id:lison.js,ver:1.0,license:"MIT",author:"arturo.arevalo.gonzalez@gmail.com"}*/

// === lison ===
// LiSON -> http://github.com/arturoarevalo/lison-js

this.LISON || (function(scope) {

scope.LISON = {
	serialize: notImplemented,
	deserialize: deserialize,
	
	download: notImplemented,
	decompressString : decompressString
};

var _cache = {},
	_compilerConstants = {
		objectHead : "__parts[++__cpart] == '0' ? null : {",
		objectTail : "}",
		
		arrayHead : "(function (n) { var ar = new Array(n); for (var i = 0; i < n; i++) { ar[i]=",
		arrayTail : ";} return ar;}) (__parts[++__cpart])",

		dictionaryHead : "(function (n) { var ar = {}; for (var i = 0; i < n; i++) { o={",
		dictionaryTail : "}; ar [o.k] = o.v; } return ar;}) (__parts[++__cpart])",
		
		booleanType : "!(__parts[++__cpart]=='0')",
		//stringType : "LISON.decompressString(__parts[++__cpart])",
		stringType : "__parts[++__cpart] == '' ? '' : (__parts[__cpart] == '0' ? null : __parts[__offset + parseInt (__parts[__cpart])])",
		//stringType : "__parts[++__cpart] ?  __parts [__offset] : __parts [__offset]",
		integerType : "__parts[++__cpart]",
		floatType : "__parts[++__cpart]",
		unknownType : "__parts[++__cpart]",
		
		compilerHead : "(function () { function __idec (__parts, __cpart, __offset) { return ",
		compilerTail : " ; }; return __idec; })()"
	};

function notImplemented () {
	alert ("Not implemented");
}

function deserialize (data) {
	var parts = data.split ('|');
	
	if (_cache [parts [1]] == undefined) {
		var generatedEvaluator = compile (_compilerConstants, parts[1]);
		console.log (generatedEvaluator);
		_cache [parts [1]] = eval (generatedEvaluator);
	}
	
	var stringTableOffset = parts.length - parts [parts.length - 1] - 2;
	
	console.log (stringTableOffset);
	console.log (parts [stringTableOffset]);
	
	var output = _cache [parts [1]] (parts, 1, stringTableOffset);
	return output;
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
			.replace (/#S/g, compiler.stringType)
			.replace (/#s/g, ":" + compiler.stringType + ",")
			// booleans
			.replace (/#B/g, compiler.booleanType)
			.replace (/#b/g, ":" + compiler.booleanType + ",")
			// integers
			.replace (/#I/g, compiler.integerType)
			.replace (/#i/g, ":" + compiler.integerType + ",")
			// floating point
			.replace (/#F/g, compiler.floatType)
			.replace (/#f/g, ":" + compiler.floatType + ",")
			// unknown types
			.replace (/#U/g, compiler.unknownType)
			.replace (/#u/g, ":" + compiler.unknownType + ",")
		+ compiler.compilerTail;							// tail
}

var reverse_codebook = [" ", "the", "e", "t", "a", "of", "o", "and", "i", "n", "s", "e ", "r", " th", " t", "in", "he", "th", "h", "he ", "to", "\r\n", "l", "s ", "d", " a", "an", "er", "c", " o", "d ", "on", " of", "re", "of ", "t ", ", ", "is", "u", "at", "   ", "n ", "or", "which", "f", "m", "as", "it", "that", "\n", "was", "en", "  ", " w", "es", " an", " i", "\r", "f ", "g", "p", "nd", " s", "nd ", "ed ", "w", "ed", "http://", "for", "te", "ing", "y ", "The", " c", "ti", "r ", "his", "st", " in", "ar", "nt", ",", " to", "y", "ng", " h", "with", "le", "al", "to ", "b", "ou", "be", "were", " b", "se", "o ", "ent", "ha", "ng ", "their", "\"", "hi", "from", " f", "in ", "de", "ion", "me", "v", ".", "ve", "all", "re ", "ri", "ro", "is ", "co", "f t", "are", "ea", ". ", "her", " m", "er ", " p", "es ", "by", "they", "di", "ra", "ic", "not", "s, ", "d t", "at ", "ce", "la", "h ", "ne", "as ", "tio", "on ", "n t", "io", "we", " a ", "om", ", a", "s o", "ur", "li", "ll", "ch", "had", "this", "e t", "g ", "e\r\n", " wh", "ere", " co", "e o", "a ", "us", " d", "ss", "\n\r\n", "\r\n\r", "=\"", " be", " e", "s a", "ma", "one", "t t", "or ", "but", "el", "so", "l ", "e s", "s,", "no", "ter", " wa", "iv", "ho", "e a", " r", "hat", "s t", "ns", "ch ", "wh", "tr", "ut", "/", "have", "ly ", "ta", " ha", " on", "tha", "-", " l", "ati", "en ", "pe", " re", "there", "ass", "si", " fo", "wa", "ec", "our", "who", "its", "z", "fo", "rs", ">", "ot", "un", "<", "im", "th ", "nc", "ate", "><", "ver", "ad", " we", "ly", "ee", " n", "id", " cl", "ac", "il", "</", "rt", " wi", "div", "e, ", " it", "whi", " ma", "ge", "x", "e c", "men", ".com"];

function decompressString (str_input) {
	var i, input, j, output, _i, _ref;
	output = '';
	input = (function() {
	var _i, _ref, _results;
	_results = [];
	for (i = _i = 0, _ref = str_input.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
	  _results.push(str_input.charCodeAt(i));
	}
	return _results;
	})();
	i = 0;
	while (i < input.length) {
	if (input[i] === 254) {
	  if (i + 1 > input.length) {
		throw 'Malformed SMAZ';
	  }
	  output += str_input[i + 1];
	  i += 2;
	} else if (input[i] === 255) {
	  if (i + input[i + 1] + 2 >= input.length) {
		throw 'Malformed SMAZ';
	  }
	  for (j = _i = 0, _ref = input[i + 1] + 1; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
		output += str_input[i + 2 + j];
	  }
	  i += 3 + input[i + 1];
	} else {
	  output += reverse_codebook[input[i]];
	  i++;
	}
	}
	return output;
}



})(this);