describe("The Tag class", function(){
  it("should be instantiated with a tagName, body, block, and attribute class", function(){
    var newTag = new Tag('div', 'body text', true)
    expect(newTag.tagName).toEqual('p');
    expect(newTag.body).toEqual('body text');
    expect(newTag.hasOwnProperty(isBlock)).toEqual(true);
    expect(newTag.attributes).toEqual({});
  });
  it("can have additional properties in the attributes object", function(){
    var newTag = new Tag('div', 'body text', true, {'src': '#', 'href': 'localhost'});
    expect(newTag.attributes.src).toEqual('#');
    expect(newTag.attributes.href).toEqual('localhost');
  });
});

xdescribe("The html tag parser", function() {
  it("returns an epty array if there's nothing to pares", function(){
    expect(parseTag('')).toEqual([]);
  });
  it("gets the correct tag name", function(){
    expect(parseTag('<span></span>')[0].tag).toEqual('span');
    expect(parseTag('<p></p>')[0].tag).toEqual('p');
     });
  it("can parse multiple tags", function(){
    expect(parseTag('<span></span><p></p><h1></h1>').map(function(tagObj){
      return tagObj.tag;
    })).toEqual(['span','p','h1'])
    });
});

xdescribe("Parsing attributes & content", function() {
  var pTag ="<p>This is some text in a p</p>";
  var pTagLong ="<p>This tag has way too much text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et venenatis risus, nec dignissim justo. Integer molestie pellentesque bibendum. Nullam congue posuere efficitur. Praesent eget accumsan ex. Quisque nulla mauris, accumsan sed consequat a, condimentum ac augue. Suspendisse potenti. Aliquam malesuada consectetur est, vitae vestibulum libero vehicula id. Sed suscipit, quam eu dignissim dictum, velit justo eleifend erat, eu convallis dolor lectus a eros. Nunc et mauris lectus. Nulla laoreet pretium venenatis. Maecenas id blandit turpis.</p>";
  var divTag = "<div id='divId' class='divClass'>Here's some content</div>";
  
  var parsedDivTag = parseTag(divTag)[0];
  var parsedPTag = parseTag(pTag)[0];
  var parsedPTagLong = parseTag(pTagLong)[0];
  
  it("adds a content attribute which is an object",function(){
    expect(typeof parsedDivTag.content).toEqual('object');
  });
  it("adds takes attributes and adds them as properties to the body object.", function() {
    expect(parsedDivTag.content.id).toEqual('divId');
    expect(parsedDivTag.content.class).toEqual('divClass');
  });
  it("Parses text within element (into anarray)", function(){
    expect(parsedDivTcontent.body[0]).toEqual("Here's some content")
    expect(parsedPTag.content.body[0]).toEqual("This is some text in a p")
  });
  it("The body index stores in groups of 35 characters", function(){
    expect(parsedPTagLong.body[0].length).toBeLessThan(36);
  });
  it("And wraps words to the next line", function(){
    expect(parsedPTagLong.body[0]).toEqual("This tag has way too much text.");
  });
  it("Creates lines in subsequent indecies, truncating on the third", function(){
    expect(parsedPTagLong.body[1]).toEqual("Lorem ipsum dolor sit amet,");
    expect(parsedPTagLong.body[2]).toEqual("consectetur adipiscing elit....")//period in the end of this string plus '...'
  });
});