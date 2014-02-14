
Handlebars Template Windows Service
-----------

This project will lead you to run powertemplate.js as a windows service for long processing.

The powertemplate.js uses Handlebars which provides the power necessary to let you build semantic templates effectively with no frustration.
Mustache templates are compatible with Handlebars, so you can take a Mustache template, import it into Handlebars, and start taking advantage of the extra Handlebars features.

Refer to <http://handlebarsjs.com>

Reference to design template using custom helpers <http://assemble.io/helpers/>

-----------

Run following commands to install required node modules

    npm install

Install powertemplate.js as a windows service, the new windows service named PowerTemplateEngine.exe windows will be installed and started automatically

    node install-windows-service.js

Uninstall PowerTempalteEngine.exe

    node uninstall-windows-service.js

### Use PowerTemplateEngine.exe windows service

This windows service will run powertemplate.js and be listening to `http://127.0.0.1:8888`.
You will need to send a POST request to `http://127.0.0.1:8888/PowerTemplate`

*Posted data*

- `source`: template content

- `data`: an object or json string of the object

*Output data*

- The corresponding content with template content and json data

-----
Example
-----

POST: http://localhost:8888/PowerTemplate

Content-Type: application/json


```
{
	"source": "<h1> Hello {{firstName}} {{lastName}}</h1><p>Emails</p><ul>{{#each emails}}<li>{{this.value}}</li>{{/each}}</ul>",
	"data": {
		"firstName": "Hung",
		"lastName": "Nguyen",
		"emails": [
			{
				"value": "hung@agencyrevolution.com",
				"primary": true
			}, {
				"value": "hungnt.bkit@gmail.com",
				"primary": false
			}, {
				"value": "hungnt.me@gmail.com",
				"primary": false
			}
		]
	}
}
```

Content-Type: application/x-wwww-form-urlencoded


```
source="<h1> Hello {{firstName}} {{lastName}}</h1><p>Emails</p><ul>{{#each emails}}<li>{{this.value}}</li>{{/each}}</ul>"
```

```
data={
		"firstName": "Hung",
		"lastName": "Nguyen",
		"emails": [
			{
				"value": "hung@agencyrevolution.com",
				"primary": true
			}, {
				"value": "hungnt.bkit@gmail.com",
				"primary": false
			}, {
				"value": "hungnt.me@gmail.com",
				"primary": false
			}
		]
	}
```

Response

```
"<h1> Hello Hung Nguyen</h1><p>Emails</p><ul><li>hung@agencyrevolution.com</li><li>hungnt.bkit@gmail.com</li><li>hungnt.me@gmail.com</li></ul>"
```

----
Custom Block Helpers
----

#### 1. Each with sort

Syntax: Similar to each but have two more parameters
- sortyBy: the json property name of the element
- sortOrder: 'asc' or 'desc'

```
{{#each_with_sort array sortBy sortOrder}}...{{/each}}
```

JSON
```
{
	"data": [
		{
			"role": "B"
		},
		{
			"role": "A"
		},
		{
			"role": "C"
		}
	]
}
```

Handlebars template
```
<ol>
	{{#each_with_sort data 'role' 'asc'}}
		<li>{{role}}</li>
	{{/each}}
</ol>
```

Html
```
<ol>
	<li>A</li>
	<li>B</li>
	<li>C</li>
</ol>
```

Handlebars template
```
<ol>
	{{#each_with_sort data 'role' 'desc'}}
		<li>{{role}}</li>
	{{/each}}
</ol>
```

Html
```
<ol>
	<li>C</li>
	<li>B</li>
	<li>A</li>
</ol>
```

