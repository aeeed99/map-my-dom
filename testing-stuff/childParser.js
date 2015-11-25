function parse(str){
    var result = [];
    var arr = str.split("</").map(function(i){return (i.match(/<.*/)||[null])[0]}).filter(function(i){return !!i});
    console.log(arr);
  
    arr.forEach(function(content){
        var opening = content.search(/.<[^\/]/)+1;
        if(!opening) result.push(content);
        else{
            result.push(content.slice(0, opening));
            result.push(parse(content.slice(opening)));
        }
    });
  
    return result.filter(function(i){return /^</.test(i)});
}

function htmlToArray(str){
    var arr = str.match(/<\/[^>]+>|<[^>]*>[^<]*/g).filter(function(i){
        return !!i;
    });
    return arr;
}
function parse2(arr){
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
            var childArr = parse2(arr.slice(i));
            result.push(childArr);
            i += (childArr.length);
        }
    }
}
var baseCase= htmlToArray("<div>Parent</div>");
var baseCase2=htmlToArray("<div>Parent</div><div>Parent</div><div>Parent</div>");
var test = htmlToArray("<div>Parent<div>Child1</div><div>Child2></div></div>");
var test2 = htmlToArray("<div>1</div><div>2<div>2.1</div><div>2.2<div>2.2.1</div></div><div>2.3</div></div><div>3</div>");