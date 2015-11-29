var $output = $('#output');
var $input = $('#text-editor');


function parseStr(str){
    //USED INSIDE MASTERPARSER TO CHANGE STRING INTO ARR FOR TAG PARSING.
    var arr = typeof str === 'string' ? htmlToArray(str): str;
    var result = [];
    for(var i = 0; i < arr.length; i++){
        //Open Tag Case:
        if (i % 2 === 0){
            if(/^<[^\/]/.test(arr[i])) result.push(arr[i]);
            else return result;
        }
        //Closing Tag Case:
        else {
            if(/^<\//.test(arr[i])) continue;
            var childArr = parseStr(arr.slice(i));
            result.push(childArr);
            i += (childArr.length);
        }
    }
    return result;
}
function htmlToArray(str){
    var arr = str.match(/<\/[^>]+>|<[^>]*>[^<]*/g).filter(function(i){
        return !!i;
    });
    return arr;
}

var s = "<span></span><span></span>";

var Tag = function(tagName, body, isBlock, attributes){
  this.tagName = tagName;
  this.body = body;
  this.isBlock = true; //always true, but code might break if taken out right now.
  if(!attributes) this.attributes = {};
  else this.attributes = attributes;
  if(isBlock) this.children = [];
  else this.children = null;
}
Tag.prototype.addChild = function(child) {
  if(this.children !== null) this.children.push(child);
  else throw new Error("Cannot add children to inline objects (set isBlock to 'true')");
}
Tag.prototype.showInfo = function(level) {
    var result = "";
    result += this.tagName;
    if(this.attributes.id) result += "#" + this.attributes.id;
    if(this.attributes.class) result = "." + this.attributes.class;

    var offset = result.length + 1; //for aligning multiple body lines.
    if(this.body) result += '~"' + this.body.join("\n"+repeatStr ("|  ", level-1) + ":" + repeatStr(" ", offset)) + '"';
    return result;
}

var HTMLParser = function() {};
HTMLParser.prototype.parse = masterParser;

function masterParser(str){
  try{
    if(!str) return [];
    str = typeof str === 'string' ? str.replace(/\n/g,"") : str;

    var htmlTree =[];
      //array/string failsafe:
    var tagsArr = typeof str === 'string' ? parseStr(str) : /*str is actually arr*/str;

    //SINGLE-TAG DATA PARSING
    for(var i = 0; i < tagsArr.length; i++){
      var error = Array.isArray(tagsArr[i]) ? true : false;
        // A correctly given HTML should never have an Array as in index in this part
        // of the iteration. Doing so means there is an unclosed tag. an !ERROR! node
        // will be created in the subsequent variables for Tag constrution. Otherwise,
        // standard Tag construction takes place.
      var tagName = error ? "!ERROR!" : tagsArr[i].match(/<([\w\d]+)/)[1];
      var tagNameArr = error ? null : tagsArr[i].split(">");
      var tagInfo = error ? "" : tagNameArr[0].replace("<","");
      var tagBody = error ? "***There is probably an unclosed tag around here***" : tagNameArr[1];
      var attrObj = {};
        
      //Parse all Body lines (max 3) into an array (35 chars max)
      var tagBodyLines = lineify(tagBody);
      
      //Parse all Tag Attributes into an object
      tagInfo.split(" ").slice(1).forEach(function(attr){
        var key = attr.split("=")[0];
        var value = attr.split("=")[1].match(/[^\s]+/)[0];
        attrObj[key] = value;
      });
        //create the tag with all info
        var createdTag = new Tag(tagName, tagBodyLines, /*always true*/true, attrObj);

        if(Array.isArray(tagsArr[i+1])){
            createdTag.children = masterParser(tagsArr[i+1]);
            i++;
        }
        htmlTree.push(createdTag);
    };
    //push to master tags array
    return htmlTree;
  }
  catch(e){
    console.error(e)
    return 0; //This is the value we look for to send a fun error message to the output.
    }
};

function lineify(string, max, _n){
  var count = _n || 1;
  while(string[0] === " "){
    string = string.slice(1);
  }
  string = string.replace(/\n/g,"");
  var limit = max || 35;
  var result = [];
  //takes a string and returns an array, +
  //each index representing a "line"
  //for paragraph formatting.
  if(string.length < limit + 1) return [string];
  else {
    var thisLine;
    for(var i = limit; i > 0; i--){
      if(string[i] === " ") {
        result.push(string.substr(0,i));
        if(count === 3) return result + "...";
        else return result.concat(lineify(string.substr(i), limit, count+1));
      }
    }
    //if we get to here, word is larger than limit chars. Cut off word instead.
    if(count === 3) return result + "...";
    return result.concat(lineify(string.substr(limit), limit, count+1));
  }
}

function treeify(arr, _level){
//    if(useParser) arr = masterParser(arr); --to be removed; treeify should only be called with arrays of Tags already returned from masterParser
    var level = _level || 0;
    var result = [];
    
    for(var i = 0; i < arr.length; i++){
        var tag = arr[i];
        if(tag.children.length){
            result.push(repeatStr("|  ", level) + "+--" + tag.showInfo(level));
            result.push("|" + repeatStr("  |", level+1), "|" + repeatStr("  |", level+1));
            result = result.concat(treeify(tag.children, (level+1)));
        } else {
            result.push(repeatStr("|  ", level) + tag.showInfo(level));
            result.push("|" + repeatStr("  |", level), "|" + repeatStr("  |", level));
        }
    }
    for(var i = result.length - 1; i > 0; i--){
        if(result[i][0] === "|") result[i] = " " + result[i].slice(1);
        else break;
    }
    //clean up trailing beams
    for(var i = result.length - 1; i > 0; i--){
        var line = result[i];
        if (/[|\s]/.test(line.lastChar())) result[i] = line.slice(0, -1) + " ";
        else break;
    }
    if(!level && result.every(function(node){return /^\W/.test(node)})) result = result.map(function(node){return node.slice(3)});
    result = result.filter(function(item){return !!item});
    return _level ? result : result.join("\n"); //only joins on the final iteration, this essentially takes it from 'array' from to 'ascii' form
}
//helper String method for treeify
String.prototype.lastChar = function(){
  return this[this.length - 1];
}

function displayTree(arr, useParser){
    arr = Array.isArray(arr) ? arr : parseStr(arr);
   console.log(treeify(arr, useParser));
    //TODO: Once treeify is complete, this should be changed to send the text to a DOM element.
}

function repeatStr(str, n){
   var result = "";
   for(var i = 0; i < n; i++){
      result += str;
   }
   return result;
}

//Cases for testing:
var baseCase="<div>Parent</div>";
var baseCase2="<div>Parent</div><div>Parent</div><div>Parent</div>";
var test = "<div>Parent<div>Child1</div><div>Child2></div></div>";
var test2 = "<div>1</div><div>2<div>2.1</div><div>2.2<div>2.2.1</div></div><div>2.3</div></div><div>3</div>"

var baseCaseA = masterParser(baseCase);
var baseCase2A = masterParser(baseCase2);
var testA = masterParser(test);
var test2A = masterParser(test2);

//DOM implimentation
function evaluateTheHTML(){
    if($input.val()) {
        var result = (treeify(masterParser($input.val())))||"Something's up with yo markup...";
        $output.val(result);
        if(result === "Something's up with yo markup...") $output.addClass('error');
        else $output.removeClass('error');
    }
}

$('#text-editor').on('keypress', evaluateTheHTML);

setInterval(evaluateTheHTML,100);