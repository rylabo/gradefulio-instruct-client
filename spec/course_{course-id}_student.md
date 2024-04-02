# /api/course/{course-id}/student

A collection of summary data for students enrolled in a course

I/O
Instruct frontend <-> Course api

**URL:** /api/course/{course-id}/student

**Methods:** GET

## Request Headers

| Key | Values | Notes |
|-----|------------|-------|
| `Accept` | `application/ld+json`, `application/json` | Optional. Defaults to JSON |

## Request Body

Not Applicable

## Response Headers

TBD

## Response Body

```json
[
  {
    "@id": "https://.../api/course/NTE4NjU1NjAxNDM1/student/01/",
    "@type": ["Student"],
    "givenNames": [{
      "annotation": "ケンタロ",
      "nameToken": {"en": "Kentaro", "ja": "健太郎"}
    }],
    "familyNames": [{
      "annotation": "サトウ",
      "nameToken": {"en": "Satou", "ja": "佐藤"}
    }],
    "attendanceForTerm": {
      "absences": 0,
      "lates": 2,
      "excused": 4
    }
  },
  {
    "@id": "https://.../api/course/NTE4NjU1NjAxNDM1/student/02/",
    "@type": ["Student"],
    "givenNames": [{
      "annotation": "マリコ",
      "nameToken": {"en": "Mariko", "ja": "まり子"}
    }],
    "familyNames": [{
      "annotation": "スズキ",
      "nameToken": {"en": "Suzuki", "ja": "鈴木"}
    }],
    "attendanceForTerm": {
      "absences": 0,
      "lates": 0,
      "excused": 0
    }
  },
  { 
    "@id": "https://.../api/course/NTE4NjU1NjAxNDM1/student/03/",
    "@type": ["Student"],
    "givenNames": [{
      "annotation": "ユウ",
      "nameToken": {"en": "Yuu", "ja": "ゆう"}
    }],
    "familyNames": [{
      "annotation": "タナカ",
      "nameToken": {"en": "Tanaka", "ja": "田中"}
    }],
    "attendanceForTerm": {
      "absences": 0,
      "lates": 0,
      "excused": 0
    }
  },
  {
    "@id": "https://.../api/course/NTE4NjU1NjAxNDM1/student/04/",
    "@type": ["Student"],
    "givenNames": [{
      "annotation": "タロウ",
      "nameToken": {"en": "Tarou", "ja": "太郎"}
    }],
    "familyNames": [{
      "annotation": "ヤマダ",
      "nameToken": {"en": "Yamada", "ja": "山田"}
    }],
    "attendanceForTerm": {
      "absences": 0,
      "lates": 0,
      "excused": 2
    }
  },
  {
    "@id": "https://.../api/course/NTE4NjU1NjAxNDM1/student/05/",
    "@type": ["Student"],
    "givenName": {
      "annotation": "ハナコ",
      "nameToken": {"en": "Hanako", "ja": "花子"}
    },
    "familyName": {
      "annotation": "ヤマダ",
      "nameToken": {"en": "Yamada", "ja": "山田"}
    },
    "attendanceForTerm": {
      "absences": 0,
      "lates": 1,
      "excused": 0
    }
  }
]
```

## Properties

### Top Level

| Key               | Type     | Example                                                                 |
|-------------------|----------|-------------------------------------------------------------------------|
| @id               | IRI      | `"https://.../api/course/NTE4NjU1NjAxNDM1/student/05/"`                 |
| @type             | string[] | **Must be** `["Student"]`                                               |
| givenName         | Object   | [See Name Objects](#name-objects)                                       |
| familyName        | Object   | [See Name Objects](#name-objects)                                       |
| attendanceForTerm | Object   | [See Attendance Summary Objects](attendance-summary-objects)            |

### Name Objects

| Key               | Type     | Example                                               |
|-------------------|----------|-------------------------------------------------------|
| annotation        | string   | `"ハナコ"`, `"マツザカ"`                                 |
| nameToken         | Object   |                                                       |
| nameToken.en      | String   | `"Hanako"`, `"Matsuzaka"`                             |
| nameToken.ja      | String   | `"花子"`, `"松阪"`                                      |

**Note:** Either nameToken.en or nameToken.ja must be provided.

### Attendance Summary Objects

| Key               | Type     | Example                                               |
|-------------------|----------|-------------------------------------------------------|
| absences          | number   | `1`, `0`, `20`                                        |
| lates             | number   | `1`, `0`, `20`                                        |
| excused           | number   | `1`, `0`, `20`                                        |
