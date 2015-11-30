+ Might want to try doing a `map` over the str for getting all the tag parts;

```
'<div id="anId" class="a Class"></div>'

//=> ['div', ['id="anId"', 'class="a Class"'], '']
//=> [name, [listOfAttr], "text of the body"]
```