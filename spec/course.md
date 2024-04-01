# /api/course

Summary data about the collection of courses being taught by a user.

## Table of Contents
1. [I/O](#io)
2. [Request Headers](#request-headers)
3. [Request Body](#request-body)
   1. [Type `Course`](#type-course)
   2. [Type `Desk`](#type-desk)
   3. [Type `Student`](#type-desk)


## I/O

Instruct frontend <-> Course api

**URL:** /api/course

**Methods:** GET, POST

Get a summary of the user's courses.

## Request Headers


| Key | Values | Notes |
|-----|------------|-------|
| `Accept` | `application/ld+json`, `application/json` | Optional. Defaults to JSON |

## Example Request Body

This illustrates a case of a JHS first year course called "英語" in Japanese, and "English" in English. The seating plan is as follows.

![a seating plan example](./seatingPlanExample.svg)

The request body for this class setup would look like this:

```json
{
  "@type": ["Course"],
  "courseName": {
    "ja": "英語",
    "en": "English"
  },
  "gradeLevel": "中1",
  "classNumber": 1,
  "deskRows": 3,
  "deskColumns": 3,
  "desks": [
    {"@id": "_:d11", "@type": ["Desk"],"row": 1, "column": 1},
    {"@id": "_:d12", "@type": ["Desk"],"row": 1, "column": 2},
    {"@id": "_:d13", "@type": ["Desk"],"row": 1, "column": 3},
    {"@id": "_:d21", "@type": ["Desk"],"row": 2, "column": 1},
    {"@id": "_:d22", "@type": ["Desk"],"row": 2, "column": 2},
    {"@id": "_:d23", "@type": ["Desk"],"row": 2, "column": 3},
    {"@id": "_:d32", "@type": ["Desk"],"row": 3, "column": 2}
  ],
  "enrollment": [
    {
      "@type": ["Student"],
      "givenNames": [{
        "annotation": "タロウ",
        "nameToken": {"en": "Tarou", "ja": "太郎"}
      }],
      "familyNames": [{
        "annotation": "ヤマダ",
        "nameToken": {"en": "Yamada", "ja": "山田"}
      }],
      "atDesk": "_:d22"
    },
    {
      "@type": ["Student"],
      "givenNames": [{
        "annotation": "ハナコ",
        "nameToken": {"en": "Hanako", "ja": "花子"}
      }],
      "familyNames": [{
        "annotation": "ヤマダ",
        "nameToken": {"en": "Yamada", "ja": "山田"}
      }],
      "atDesk": "_:d13"
    },
    {
      "@type": ["Student"],
      "givenNames": [{
        "annotation": "マリコ",
        "nameToken": {"en": "Mariko", "ja": "まり子"}
      }],
      "familyNames": [{
        "annotation": "スズキ",
        "nameToken": {"en": "Suzuki", "ja": "鈴木"}
      }],
      "atDesk": "_:d21"
    },
    {
      "@type": ["Student"],
      "givenNames": [{
        "annotation": "ユウ",
        "nameToken": {"en": "Yuu", "ja": "ゆう"}
      }],
      "familyNames": [{
        "annotation": "タナカ",
        "nameToken": {"en": "Tanaka", "ja": "田中"}
      }],
      "atDesk": "_:d12"
    },
    {
      "@type": ["Student"],
      "givenNames": [{
        "annotation": "ケンタロ",
        "nameToken": {"en": "Kentaro", "ja": "健太郎"}
      }],
      "familyNames": [{
        "annotation": "サトウ",
        "nameToken": {"en": "Satou", "ja": "佐藤"}
      }],
      "atDesk": "_:d11"
    }
  ]
}
```

### Object Class

#### `Course` Properties

| Key | Type | Example| Constraints |
|-----|------|--------|-------------|
|courseName|`{`<br>`    "ja": string,`<br>` "en": string`<br>`}`| `{"ja": "数学", "en": "Math"}`| At least one of `"ja"` or `"en"` must be provided|
|gradeLevel| `string` | `"高2"` | Must be one of `"小1"`, `"小2"`, `"小3"`,　`"小4"`, `"小5"`, `"小6"`, `"中1"`, `"中2"`, `"中3"`, `"高1"`, `"高2"`, `"高3"`|
|classNumber| `number` | `1` | integer > 0 |
|deskRows| `number` | `4` |    |
|deskColumns| `number` | `5` |  |
|desks| [`Desk[]`](#type-desk) | [(See type definition)](#type-desk)| desks.length &leq; deskRows * deskColumns |
|enrollment| [`Student[]`](#type-student) | [(See type definition)](#type-student) | Array length &leq; desks.length|

#### `Desk` Properties
| Key    | Type     | Example | Constraints                       |
|--------|----------|---------|-----------------------------------|
| @id    | IRI      | `_:d13` | Has the template`_:d{row}{column}`|
| row    | `number` | `3`     |  0 < `row` < `Course.deskRows`            |
| column | `number` | `2`     |  0 < `column` < `Course.deskColumns`      |

#### `Student` Properties

## Response Headers

| Key | Values |
|-----|--------|
|`Location`|`https://.../api/course/{course-id}`|
|`Link`|`<https://.../api/course/{course-id}/student/{student-id}>; rel="enrollment",...`|

## Response Body

```json


```

#### POST

Add a course for this user.

##### Request Headers

- Accept (Optional)
  Used to optionally indicate the client wants JSON-LD

  ```http
  Accept: application/ld+json
  ```

##### Request Body


### /api/course/{course-id}/

**Methods:** GET, PUT

#### GET

##### Request Headers

#### PUT

Used for updates to desk layout and enrollment

### /api/course/{course-id}/attendance
**Methods:** GET
parameters
academic year, term, month, date

summary

{}


### /api/course/{course-id}/attendance/{yyyy}-{mm}-{dd}-{period}
**Methods:** GET, PUT


### /api/course/{course-id}/student

### /api/course/{course-id}/student/{student-id}/

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
    "@id": "https://www.gradeful.io/api/course/",
    "@type": ["Course"],
    "className": {
      "key": "エイゴエンシュウ",
      "ja": "英語演習",
      "en": "English Practice"
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
        "assignedTo": "https://www.gradeful.io/api/course/{course-id}/student/{student-id}"
      }
    ],
    "enrollment": [

    ],
    "attendanceRecords": [
      {
        "@id": "https://www.gradeful.io/api/student/{id}/attendance/{year}-{month}-{day}-{class_period}",
        "@type": ["ClassAttendanceRecords"],
        "attendance"
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
