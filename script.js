function parse(str){
    debugger;
    var result = [];
    var arr = str.split(/<\/.*>/).filter(function(i){return !!i});
    arr.forEach(function(content){
        var opening = content.search(/.<[^\/]/)+1;
        if(!opening) result.push(content);
        else{
            result.push(content.slice(0, opening));
            result.push(parse(content.slice(opening)));
        }
    });
    return result;
}

//CONSTANTS LIBRARY
var isBlock = {
  address: true,
  article: true,
  aside: true,
  blockquote: true,
  canvas: true,
  dd: true,
  div: true,
  dl: true,
  fieldset: true,
  figcaption: true,
  figure: true,
  footer: true,
  form: true,
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  header: true,
  hgroup: true,
  hr: true,
  li: true,
  main: true,
  nav: true,
  noscript: true,
  ol: true,
  output: true,
  p: true,
  pre: true,
  section: true,
  table: true,
  tfoot: true,
  ul: true,
  video: true
}

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

var HTMLParser = function () {};
HTMLParser.prototype.parse = function (str){
  if(!str) return [];
  
  var htmlTree =[];
  var tagsArr = str.match(/<[^/][^>]*>[^<]*/g);
  
  tagsArr.forEach(function(tagStr){
    var tagName = tagStr.match(/<([\w\d]+)/)[1];
    var tagNameArr = tagStr.split(">");
    var tagInfo = tagNameArr[0]
    var tagBody = tagNameArr[1];
    var attrObj = {};
    
    //Parse all Body lines (max 3) into an array (35 chars max)
    var tagBodyLines = lineify(tagBody).slice(0,3);
    
    //Parse all Tag Attributes into an object
    tagInfo.split(" ").slice(1).forEach(function(attr){
      var key = attr.split("=")[0];
      var value = attr.split("=")[1].match(/[\d\w]+/)[0];
      attrObj[key] = value;
    });
    //create the tag with all info
    htmlTree.push(new Tag(tagName, tagBodyLines, Boolean(isBlock[tagName]), attrObj));
  });
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
