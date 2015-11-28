describe("The Tag class", function(){
  
  it("should be instantiated with a tagName, body, block, and attribute class", function(){
    var newTag = new Tag('div', 'body text', true)
    expect(newTag.tagName).toEqual('div');
    expect(newTag.body).toEqual('body text');
    expect(newTag.hasOwnProperty('isBlock')).toEqual(true);
    expect(newTag.attributes).toEqual({});
  });
  
  it("can have additional properties in the attributes object", function(){
    var newTag = new Tag('div', 'body text', true, {'src': '#', 'href': 'localhost'});
    expect(newTag.attributes.src).toEqual('#');
    expect(newTag.attributes.href).toEqual('localhost');
  });
  
  describe("The children attribute",function(){
    var parent = new Tag('div', 'parent', true);
    var child1 = new Tag('div', 'child 1', true);
    var child2 = new Tag('div', 'child 2', true);
    var inline = new Tag('p', 'paragraph', false);
    it("block elements should have a children attribute as an empty array", function(){
      expect(parent.children).toEqual([]);
      expect(inline.children).toBeNull();
      });
    
    it("has an addChild method",function(){
      parent.addChild(child1);
      parent.addChild(child2);
      expect(typeof parent.addChild).toEqual('function');
      expect(parent.children.length).toEqual(2);
    });
  });
});

describe("The html tag parser", function() {
  var parser = new HTMLParser();
  it("returns an epty array if there's nothing to pares", function(){
    expect(parser.parse('')).toEqual([]);
  });
  it("gets the correct tag name", function(){
    expect(parser.parse('<span></span>')[0].tagName).toEqual('span');
    expect(parser.parse('<p></p>')[0].tagName).toEqual('p');
     });
  it("can parse multiple tags", function(){
    expect(parser.parse('<span></span><p></p><h1></h1>').map(function(tagObj){
      return tagObj.tagName;
    })).toEqual(['span','p','h1'])
  });
});

describe("Parsing attributes & content", function() {
  var parser = new HTMLParser();
  var pTag ="<p>This is some text in a p</p>";
  var pTagLong ="<p>This tag has way too much text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et venenatis risus, nec dignissim justo. Integer molestie pellentesque bibendum. Nullam congue posuere efficitur. Praesent eget accumsan ex. Quisque nulla mauris, accumsan sed consequat a, condimentum ac augue. Suspendisse potenti. Aliquam malesuada consectetur est, vitae vestibulum libero vehicula id. Sed suscipit, quam eu dignissim dictum, velit justo eleifend erat, eu convallis dolor lectus a eros. Nunc et mauris lectus. Nulla laoreet pretium venenatis. Maecenas id blandit turpis.</p>";
  var divTag = "<div id='divId' class='divClass'>Here's some content</div>";
  
  var parsedDivTag = parser.parse(divTag)[0];
  var parsedPTag = parser.parse(pTag)[0];
  var parsedPTagLong = parser.parse(pTagLong)[0];
  
  describe("attributes", function(){
    xit("adds an attributes attribute which is an object",function(){
      expect(typeof parsedDivTag.attributes).toEqual('object');
    });
    xit("adds takes attributes and adds them as properties to the body object.", function() {
      expect(parsedDivTag.attributes.id).toEqual('divId');
      expect(parsedDivTag.attributes.class).toEqual('divClass');
    });
  });
  
  describe("Parsing text",function(){
    it("Parses text within element (into anarray)", function(){
      expect(parsedDivTag.body[0]).toEqual("Here's some content")
      expect(parsedPTag.body[0]).toEqual("This is some text in a p")
    });

    it("The body index stores in groups of 35 characters", function(){
      expect(parsedPTagLong.body[0].length).toBeLessThan(36);
    });

    it("And wraps words to the next line", function(){
      expect(parsedPTagLong.body[0]).toEqual("This tag has way too much text.");
    });

    it("Creates lines in subsequent indecies, truncating on the third", function(){
      expect(parsedPTagLong.body[1]).toEqual("Lorem ipsum dolor sit amet,");
      expect(parsedPTagLong.body[2]).toEqual("consectetur adipiscing elit. Nullam...")//period in the end of this string plus '...'
    });
  });
  describe("parsing tags within tags", function(){
    //add tests about this, and properly appending objects as children
  })
});

describe("test parse function", function(){
  it("does it", function(){
    expect(parse("<parent>PText<child>CText</child></parent>"))
      .toEqual(['<parent>PText', ['<child>CText']]);
  });
});

describe("children", function(){
  var parser = new HTMLParser();
  var parsedBody = parser.parse("<div><h1>Text</h1></div>");
  console.log("PARSED", parsedBody);
  it("are put into a parent's array", function(){
    expect(parsedBody.length).toEqual(1);
    expect(Array.isArray(parsedBody[0].children)).toEqual(true);
    expect(parsedBody[0].children.length).toEqual(1);
  });
});