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

function parseTag(str){
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

