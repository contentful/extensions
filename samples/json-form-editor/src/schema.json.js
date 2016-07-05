// https://github.com/jdorn/json-editor/blob/master/examples/advanced.html
// TODO: Make this configurable on Data Type level.
/*eslint quotes: [2, "double"]*/
window.CONTENTFUL_FORM_EDITOR_SCHEMA = {
  "title": "Person",
  "oneOf": [
    {
      "$ref": "#/definitions/basicperson",
      "title": "Basic Person"
    },
    {
      "$ref": "#/definitions/person",
      "title": "Complex Person"
    }
  ],
  "definitions": {
    "basicperson": {
      "title": "Person",
      "type": "object",
      "id": "person",
      "properties": {
        "name": {
          "type": "string",
          "description": "First and Last name",
          "minLength": 4,
          "propertyOrder": 10
        },
        "age": {
          "type": "integer",
          "default": 21,
          "minimum": 18,
          "maximum": 99,
          "propertyOrder": 20
        },
        "gender": {
          "type": "string",
          "enum": [
            "male",
            "female"
          ],
          "propertyOrder": 30
        },
        "favorite_color": {
          "type": "string",
          "format": "color",
          "title": "favorite color",
          "default": "#19CD91",
          "propertyOrder": 40
        }
      }
    },
    "person": {
      "$ref": "#/definitions/basicperson",
      "properties": {
        "location": {
          "type": "object",
          "title": "Location",
          "properties": {
            "city": {
              "type": "string"
            },
            "state": {
              "type": "string"
            },
            "citystate": {
              "type": "string",
              "description": "This is generated automatically from the previous two fields",
              "template": "{{city}}, {{state}}",
              "watch": {
                "city": "location.city",
                "state": "location.state"
              }
            }
          }
        },
        "pets": {
          "type": "array",
          "format": "table",
          "title": "Pets",
          "uniqueItems": true,
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "cat",
                  "dog",
                  "bird",
                  "reptile",
                  "other"
                ],
                "default": "dog"
              },
              "name": {
                "type": "string"
              },
              "fixed": {
                "type": "boolean",
                "title": "spayed / neutered"
              }
            }
          }
        }
      }
    }
  }
};
