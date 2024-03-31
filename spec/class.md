# /api/class

Endpoint representing classes being taught at a user's school.

## Preface

While most coders can use JSON as the serialization format, it's important to note that in the context of using this API each property, JSON object class, etc., usually has a URI associated with it.

## Table of Contents



## I/O

Instruct frontend <-> Gradeful.io Class api
**URL:** /api/class
**Methods:** GET, POST


### Endpoint

`/api/class`

### Request Headers

Responses by default will be in JSON, but JSON-LD will be sent if the `Accept` header is specified.

#### For JSON-LD responses (optional)

```http
Accept: application/ld+json
```

### Supported Methods

#### GET

Returns an array of Class objects representing the classes that a user teaches.

##### Request Headers


##### Response Body

```json
[
  {
    "@id": "https://www.gradeful.io/api/class/[:id]",
    "@type": ["Class"],
    "className": {
      "key": "",
      "ja": "",
      "en": ""
    },
    "gradeLevel": "中1",
    "classNumber": 1,
    "deskLayout": {
      "rows": 4,
      "columns": 5
    },
    "desks": [
      {
        "@type": ["Desk"],
        "position": {
          "row": 1,
          "column": 2
        },
        "assignedTo": {
          "@id": "https://www.gradeful.io/api/student/[:id]",
          "@type": ["Student"],
          "attendanceNumber": 4,
          "familyName": {
            "annotation": "ヤマダ",
            "nameToken": {
              "en": "Yamada",
              "ja": "山田"
            }
          },
          "givenName": {
            "annotation": "タロウ",
            "nameToken": {
              "en": "Tarou",
              "ja": "太郎"
            }
          }
        }
      }
    ]
  }
]
```

#### POST

##### Request Headers


##### Request Body

## Response Headers

JSON

```http
Content-Type: application/json
```

JSON-LD

```http
Content-Type: application/ld+json
```

## Response Body

## Flow

## Appendix A: JSON-LD Context
