function parseStr(str){
    var arr = htmlToArray(str);
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
            var childArr = parse(arr.slice(i));
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
  this.isBlock = isBlock;
  if(!attributes) this.attributes = {};
  else this.attributes = attributes;
  if(isBlock) this.children = [];
  else this.children = null;
}
Tag.prototype.addChild = function(child) {
  if(this.children !== null) this.children.push(child);
  else throw new Error("Cannot add children to inline objects (set isBlock to 'true')");
}

var HTMLParser = function() {};
HTMLParser.prototype.parse = masterParser;

function masterParser(str){
  if(!str) return [];
  
  var htmlTree =[];
  var tagsArr = parseStr(str);
  
  //SINGLE-TAG DATA PARSING
  for(var i = 0; i < tagsArr.length; i++){
    var tagName = tagsArr[i].match(/<([\w\d]+)/)[1];
    var tagNameArr = tagsArr[i].split(">");
    var tagInfo = tagNameArr[0].replace("<","");
    var tagBody = tagNameArr[1];
    var attrObj = {};
    
    //Parse all Body lines (max 3) into an array (35 chars max)
    var tagBodyLines = lineify(tagBody).slice(0,3); //TODO: Do we still need slice?
    
    //Parse all Tag Attributes into an object
    tagInfo.split(" ").slice(1).forEach(function(attr){
      var key = attr.split("=")[0];
      var value = attr.split("=")[1].match(/[^\s]+/)[0];
      attrObj[key] = value;
      
      //find if there are children
    });
      var children = [];
      while(Array.isArray(tagsArr[i+1])){
        children.push(tagsArr[i+1][0]);
        i++;
      }
      //create the tag with all info
      var createdTag = new Tag(tagName, tagBodyLines, /*always true*/true, attrObj);
      //add any queued children
      for(var j = 0; j < (children||[]).length; j++){
        createdTag.children.push(masterParser(children[j])[0]);
      }
      htmlTree.push(createdTag);
  };
  //push to master tags array
  return htmlTree;
};

function lineify(string, max, _n){
  var count = _n || 1;
  while(string[0] === " "){
    string = string.slice(1);
  }
  var limit = max || 35;
  var result = [];
  //takes a string and returns an array, +
  //each index representing a "line"
  //for paragraph formatting.
  if(string.length < limit + 1) return [string];
  else {
    var thisLine;
    for(var i = limit; true; i--){
      if(string[i] === " ") {
        result.push(string.substr(0,i));
        if(count === 3) return result + "...";
        else return result.concat(lineify(string.substr(i), limit, count+1));
      }
    }
  }
}

function treeify(arr, _level){
    console.log("ARR in this recurrsion", arr);
    var level = _level || 0;
    var result = [];
    
    arr.forEach(function(tag, i, a){
       if((tag.children||[]).length){
          console.log(tag.children);
          result.push("+---" + tag.tagName);
          result.push("|" + repeatStr("   |", level));
          treeify(result.children);
       }else{
          result.push(tag.tagName);
          result.push("|" + repeatStr("   |", level));
          //if (i+1 !== a.length) result.push("|");
       }
    });
    console.log(result);
    return result.filter(function(item){return !!item}).join("\n");
}

function displayTree(arr){
   console.log(treeify(arr));
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

var baseCaseA = parseStr(baseCase);
var baseCase2A = parseStr(baseCase2);
var testA = parseStr(test);
var test2A = parseStr(test2);