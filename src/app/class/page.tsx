import { StudentObj } from "../../lib/StudentObj";
import Seating from "./_classroom";

async function getSeatingPlan() {
  const studentList: StudentObj[] = [
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1101",
      "givenNames": [
        {
          "annotation": "エミリ",
          "nameToken": {
            "en": "Emiri",
            "ja": "愛美莉"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "イヅミ",
          "nameToken": {
            "en": "Izumi",
            "ja": "泉"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1102",
      "givenNames": [
        {
          "annotation": "ジュンキ",
          "nameToken": {
            "en": "Junki",
            "ja": "淳樹"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "オサムラ",
          "nameToken": {
            "en": "Osamura",
            "ja": "長村"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1103",
      "givenNames": [
        {
          "annotation": "ユキナオ",
          "nameToken": {
            "en": "Yukinao",
            "ja": "恭尚"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "カネヒサ",
          "nameToken": {
            "en": "Kanehisa",
            "ja": "金久"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1104",
      "givenNames": [
        {
          "annotation": "アカリ",
          "nameToken": {
            "en": "Akari",
            "ja": "朱里"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "キムラ",
          "nameToken": {
            "en": "Kimura",
            "ja": "木村"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1105",
      "givenNames": [
        {
          "annotation": "ナナハ",
          "nameToken": {
            "en": "Nanaha",
            "ja": "奈々葉"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "クシタニ",
          "nameToken": {
            "en": "Kushitani",
            "ja": "櫛谷"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1106",
      "givenNames": [
        {
          "annotation": "ケンジン",
          "nameToken": {
            "en": "Kenjin",
            "ja": "謙仁"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "コバヤシ",
          "nameToken": {
            "en": "Kobayashi",
            "ja": "小林"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1107",
      "givenNames": [
        {
          "annotation": "アキヒサ",
          "nameToken": {
            "en": "Akihisa",
            "ja": "瑛久"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "シオミ",
          "nameToken": {
            "en": "Shiomi",
            "ja": "塩見"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1108",
      "givenNames": [
        {
          "annotation": "レナ",
          "nameToken": {
            "en": "Rena",
            "ja": "玲奈"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "イイッシ",
          "nameToken": {
            "en": "Iisshi",
            "ja": "一志"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1109",
      "givenNames": [
        {
          "annotation": "ヨコ",
          "nameToken": {
            "en": "Yoko",
            "ja": "葉子"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ツカハラ",
          "nameToken": {
            "en": "Tsukahara",
            "ja": "塚原"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1110",
      "givenNames": [
        {
          "annotation": "ユイナ",
          "nameToken": {
            "en": "Yuina",
            "ja": "結愛"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ドテ",
          "nameToken": {
            "en": "Dote",
            "ja": "土手"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1111",
      "givenNames": [
        {
          "annotation": "ミズキ",
          "nameToken": {
            "en": "Mizuki",
            "ja": "瑞樹"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ナカセ",
          "nameToken": {
            "en": "Nakase",
            "ja": "中瀬"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1112",
      "givenNames": [
        {
          "annotation": "ミハル",
          "nameToken": {
            "en": "Miharu",
            "ja": "美暖"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ハシモト",
          "nameToken": {
            "en": "Hashimoto",
            "ja": "橋本"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1113",
      "givenNames": [
        {
          "annotation": "マオ",
          "nameToken": {
            "en": "Mao",
            "ja": "真緒"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ハヤシ",
          "nameToken": {
            "en": "Hayashi",
            "ja": "林"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1114",
      "givenNames": [
        {
          "annotation": "メイ",
          "nameToken": {
            "en": "Mei",
            "ja": "芽郁"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "マツオ",
          "nameToken": {
            "en": "Matsuo",
            "ja": "松尾"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1115",
      "givenNames": [
        {
          "annotation": "ナオヤ",
          "nameToken": {
            "en": "Naoya",
            "ja": "直也"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "マツモト",
          "nameToken": {
            "en": "Matsumoto",
            "ja": "松本"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1116",
      "givenNames": [
        {
          "annotation": "ヨ",
          "nameToken": {
            "en": "Yo",
            "ja": "葉"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "マルヤマ",
          "nameToken": {
            "en": "Maruyama",
            "ja": "丸山"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1117",
      "givenNames": [
        {
          "annotation": "モモカ",
          "nameToken": {
            "en": "Momoka",
            "ja": "百香"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "イマガワ",
          "nameToken": {
            "en": "Imagawa",
            "ja": "今川"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1118",
      "givenNames": [
        {
          "annotation": "カリン",
          "nameToken": {
            "en": "Karin",
            "ja": "花鈴"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "イワサキ",
          "nameToken": {
            "en": "Iwasaki",
            "ja": "岩崎"
          }
        }
      ],
    }
  ];

  return studentList;
}


export default async function Class() {
  const studentList = await getSeatingPlan();
  return <Seating studentList={studentList}></Seating>
}