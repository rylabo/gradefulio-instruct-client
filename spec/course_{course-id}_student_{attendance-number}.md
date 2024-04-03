# /api/course/{course-id}/student/{attendance-number}

A collection of summary data for students enrolled in a course

I/O
Instruct frontend <-> Course api

**URL:** /api/course/{course-id}/student/{attendance-number}

**Methods:** GET

## Query Parameters

| Key               | Type     | Example                                                 |
|-------------------|----------|---------------------------------------------------------|
| getall            | boolean  | `true`                                                  |

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
  "attendanceHistory": [
    {
      "@type": ["AttendanceRecord"],
      "date": "2024/04/22",
      "period": 1,
      "attendanceStatus": "present"
    },
    {
      "@type": ["AttendanceRecord"],
      "date": "2024/04/23",
      "period": 4,
      "attendanceStatus": "present"
    },
    {
      "@type": ["AttendanceRecord"],
      "date": "2024/04/24",
      "period": 7,
      "attendanceStatus": "present"
    },
    {
      "@type": ["AttendanceRecord"],
      "date": "2024/04/25",
      "period": 1,
      "attendanceStatus": "late"
    },
  ] 
}

```

## Properties

### Top Level

| Key               | Type     | Example                                                 |
|-------------------|----------|---------------------------------------------------------|
| @id               | IRI      | `"https://.../api/course/NTE4NjU1NjAxNDM1/student/05/"` |
| @type             | string[] | **Must be** `["Student"]`                               |
| givenName         | Object   | [See Name Objects](#name-objects)                       |
| familyName        | Object   | [See Name Objects](#name-objects)                       |
| attendance        | Object[] | [See Attendance Objects](attendance-objects)            |

### Name Objects

| Key               | Type     | Example                                               |
|-------------------|----------|-------------------------------------------------------|
| annotation        | string   | `"ハナコ"`, `"マツザカ"`                                 |
| nameToken         | Object   |                                                       |
| nameToken.en      | String   | `"Hanako"`, `"Matsuzaka"`                             |
| nameToken.ja      | String   | `"花子"`, `"松阪"`                                      |

**Note:** Either nameToken.en or nameToken.ja must be provided.

### Attendance Record Objects

| Key                   | Type     | Example                                                 |
|-----------------------|----------|---------------------------------------------------------|
| *attendanceFor*       | Node ID  | `"https://.../api/course/NTE4NjU1NjAxNDM1/student/05/"` |
| **dateTime**          | string   | `"2024/04/22"`                                          |
| **period**            | number   | `1`, `5`, `7`                                           |
| **attendanceStatus**  | string   | `"present"`, `"late"`, `"left early"`, `"excused"`      |

#### Example Object

```json
{
  "@type": ["AttendanceRecord"],
  "attendanceFor": "https://.../api/course/NTE4NjU1NjAxNDM1/student/05/",
  "date": "2024/04/22",
  "period": 1,
  "attendanceStatus": "present"
}
```
