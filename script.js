//OBJECT EXAMPLE
/*
{
  tag: "tag name",
  block: true,
  content: {
    body: "text inside brackets"
    id: "#id",
    class: '.class',
    attribute: {
      attr1: 'info',
      attr2: 'info',
      attrN: 'info'
    }
  },
  children: [child1Ref, child2Ref, childNRef]
}
*/
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
  var tags = []
  str = str.split(/[<|>]/).forEach(function(tag) {
    if(!tag)return;
    if(tag[0] === '/') return;
    
    
    //construct a tag
    var tagInfo = {
      tag: tag,
      content: {
        body: ''
      }
    };
    //get add attributes
    str.split(" ").slice(1).split(" ").forEach(function(attr){
      attr = attr.slice("=");
    });
    
    //push to master tags array
    tags.push(tagInfo);
  });
  return tags;
}

