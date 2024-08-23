import React from 'react'
import MirageServerProvider from './mirageServerProvider'
import { SchoolCourseFactory, SchoolCourseModel } from './course.mock';
import { StudentFactory, StudentModel } from './student.mock';
import { faker } from '@faker-js/faker/locale/ja';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

function mockProvider({ children }) {

  const courses = [
    {
      "courseName": {
        "key": "スウガク",
        "en": "Math",
        "ja": "数学"
      },
      "gradeLevel": "中2",
      "classNumber": "2",
      "enrollment": [
        {
          "familyNames": [
            {
              "annotation": "ワタナベ",
              "nameToken": {
                "en": "Watanabe",
                "ja": "渡辺"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "アオイ",
              "nameToken": {
                "en": "Aoi",
                "ja": "蒼"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "シミズ",
              "nameToken": {
                "en": "Shimizu",
                "ja": "清水"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "メグミ",
              "nameToken": {
                "en": "Megumi",
                "ja": "恵"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "シミズ",
              "nameToken": {
                "en": "Shimizu",
                "ja": "清水"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ヒロユキ",
              "nameToken": {
                "en": "Hiroyuki",
                "ja": "浩之"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ハヤシ",
              "nameToken": {
                "en": "Hayashi",
                "ja": "林"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ヒロミ",
              "nameToken": {
                "en": "Hiromi",
                "ja": "裕美"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ワタナベ",
              "nameToken": {
                "en": "Watanabe",
                "ja": "渡辺"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "キヨ",
              "nameToken": {
                "en": "Kiyo",
                "ja": "キヨ"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ワタナベ",
              "nameToken": {
                "en": "Watanabe",
                "ja": "渡辺"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "タツオ",
              "nameToken": {
                "en": "Tatsuo",
                "ja": "辰男"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマダ",
              "nameToken": {
                "en": "Yamada",
                "ja": "山田"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ナツミ",
              "nameToken": {
                "en": "Natsumi",
                "ja": "菜摘"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "カトウ",
              "nameToken": {
                "en": "Katou",
                "ja": "加藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ユウコ",
              "nameToken": {
                "en": "Yuuko",
                "ja": "裕子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "スズキ",
              "nameToken": {
                "en": "Suzuki",
                "ja": "鈴木"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "トモミ",
              "nameToken": {
                "en": "Tomomi",
                "ja": "智美"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマダ",
              "nameToken": {
                "en": "Yamada",
                "ja": "山田"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "カオリ",
              "nameToken": {
                "en": "Kaori",
                "ja": "香織"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "シミズ",
              "nameToken": {
                "en": "Shimizu",
                "ja": "清水"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "サチコ",
              "nameToken": {
                "en": "Sachiko",
                "ja": "幸子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "マツモト",
              "nameToken": {
                "en": "Matsumoto",
                "ja": "松本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ユイナ",
              "nameToken": {
                "en": "Yuina",
                "ja": "結菜"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマダ",
              "nameToken": {
                "en": "Yamada",
                "ja": "山田"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "アサミ",
              "nameToken": {
                "en": "Asami",
                "ja": "麻美"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマダ",
              "nameToken": {
                "en": "Yamada",
                "ja": "山田"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ハヤオ",
              "nameToken": {
                "en": "Hayao",
                "ja": "颯"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "イノウエ",
              "nameToken": {
                "en": "Inoue",
                "ja": "井上"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "タケオ",
              "nameToken": {
                "en": "Takeo",
                "ja": "武雄"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ナカムラ",
              "nameToken": {
                "en": "Nakamura",
                "ja": "中村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ミライ",
              "nameToken": {
                "en": "Mirai",
                "ja": "未来"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "スズキ",
              "nameToken": {
                "en": "Suzuki",
                "ja": "鈴木"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "キミ",
              "nameToken": {
                "en": "Kimi",
                "ja": "キミ"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "マツモト",
              "nameToken": {
                "en": "Matsumoto",
                "ja": "松本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ヨウシ",
              "nameToken": {
                "en": "Youshi",
                "ja": "陽子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "サイトウ",
              "nameToken": {
                "en": "Saitou",
                "ja": "斎藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ショウタ",
              "nameToken": {
                "en": "Shouta",
                "ja": "翔太"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "カトウ",
              "nameToken": {
                "en": "Katou",
                "ja": "加藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ヨシオ",
              "nameToken": {
                "en": "Yoshio",
                "ja": "義雄"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマダ",
              "nameToken": {
                "en": "Yamada",
                "ja": "山田"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ユカ",
              "nameToken": {
                "en": "Yuka",
                "ja": "優花"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマモト",
              "nameToken": {
                "en": "Yamamoto",
                "ja": "山本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ショウタイラ",
              "nameToken": {
                "en": "Shoutaira",
                "ja": "翔平"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "コバヤシ",
              "nameToken": {
                "en": "Kobayashi",
                "ja": "小林"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ジュンコ",
              "nameToken": {
                "en": "Junko",
                "ja": "純子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "キムラ",
              "nameToken": {
                "en": "Kimura",
                "ja": "木村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "マサオ",
              "nameToken": {
                "en": "Masao",
                "ja": "正雄"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "イトウ",
              "nameToken": {
                "en": "Itou",
                "ja": "伊藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "リョウコ",
              "nameToken": {
                "en": "Ryouko",
                "ja": "良子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ナカムラ",
              "nameToken": {
                "en": "Nakamura",
                "ja": "中村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ヨシオ",
              "nameToken": {
                "en": "Yoshio",
                "ja": "義雄"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "マツモト",
              "nameToken": {
                "en": "Matsumoto",
                "ja": "松本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "アオイ",
              "nameToken": {
                "en": "Aoi",
                "ja": "葵"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマモト",
              "nameToken": {
                "en": "Yamamoto",
                "ja": "山本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ススム",
              "nameToken": {
                "en": "Susumu",
                "ja": "進"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ワタナベ",
              "nameToken": {
                "en": "Watanabe",
                "ja": "渡辺"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ミライ",
              "nameToken": {
                "en": "Mirai",
                "ja": "未来"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "マツモト",
              "nameToken": {
                "en": "Matsumoto",
                "ja": "松本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ココハ",
              "nameToken": {
                "en": "Kokoha",
                "ja": "心春"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "イノウエ",
              "nameToken": {
                "en": "Inoue",
                "ja": "井上"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ユカ",
              "nameToken": {
                "en": "Yuka",
                "ja": "優花"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "キムラ",
              "nameToken": {
                "en": "Kimura",
                "ja": "木村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ダイキ",
              "nameToken": {
                "en": "Daiki",
                "ja": "大貴"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "イノウエ",
              "nameToken": {
                "en": "Inoue",
                "ja": "井上"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "タクミ",
              "nameToken": {
                "en": "Takumi",
                "ja": "拓海"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ワタナベ",
              "nameToken": {
                "en": "Watanabe",
                "ja": "渡辺"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "タクヤ",
              "nameToken": {
                "en": "Takuya",
                "ja": "拓也"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "サイトウ",
              "nameToken": {
                "en": "Saitou",
                "ja": "斎藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "サトコ",
              "nameToken": {
                "en": "Satoko",
                "ja": "智子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヨシダ",
              "nameToken": {
                "en": "Yoshida",
                "ja": "吉田"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ソウマ",
              "nameToken": {
                "en": "Souma",
                "ja": "颯真"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "イノウエ",
              "nameToken": {
                "en": "Inoue",
                "ja": "井上"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ハナ",
              "nameToken": {
                "en": "Hana",
                "ja": "ハナ"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "カトウ",
              "nameToken": {
                "en": "Katou",
                "ja": "加藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "フミ",
              "nameToken": {
                "en": "Fumi",
                "ja": "フミ"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "カトウ",
              "nameToken": {
                "en": "Katou",
                "ja": "加藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ダイショウ",
              "nameToken": {
                "en": "Daishou",
                "ja": "大翔"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ハヤシ",
              "nameToken": {
                "en": "Hayashi",
                "ja": "林"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ユカリ",
              "nameToken": {
                "en": "Yukari",
                "ja": "ゆかり"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "シミズ",
              "nameToken": {
                "en": "Shimizu",
                "ja": "清水"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "カズヒコ",
              "nameToken": {
                "en": "Kazuhiko",
                "ja": "和彦"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "キムラ",
              "nameToken": {
                "en": "Kimura",
                "ja": "木村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "サトシ",
              "nameToken": {
                "en": "Satoshi",
                "ja": "聡"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "サトウ",
              "nameToken": {
                "en": "Satou",
                "ja": "佐藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "リナ",
              "nameToken": {
                "en": "Rina",
                "ja": "里奈"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "シミズ",
              "nameToken": {
                "en": "Shimizu",
                "ja": "清水"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ハナ",
              "nameToken": {
                "en": "Hana",
                "ja": "花"
              }
            }
          ]
        }
      ]
    },
    {
      "courseName": {
        "key": "スウガク",
        "en": "Math",
        "ja": "数学"
      },
      "gradeLevel": "中1",
      "classNumber": "1",
      "enrollment": [
        {
          "familyNames": [
            {
              "annotation": "ヤマグチ",
              "nameToken": {
                "en": "Yamaguchi",
                "ja": "山口"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "チヒロ",
              "nameToken": {
                "en": "Chihiro",
                "ja": "千尋"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "コバヤシ",
              "nameToken": {
                "en": "Kobayashi",
                "ja": "小林"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "アケミ",
              "nameToken": {
                "en": "Akemi",
                "ja": "明美"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ササキ",
              "nameToken": {
                "en": "Sasaki",
                "ja": "佐々木"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "タクヤ",
              "nameToken": {
                "en": "Takuya",
                "ja": "拓哉"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ナカムラ",
              "nameToken": {
                "en": "Nakamura",
                "ja": "中村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "チヨコ",
              "nameToken": {
                "en": "Chiyoko",
                "ja": "千代子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "コバヤシ",
              "nameToken": {
                "en": "Kobayashi",
                "ja": "小林"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "マサコ",
              "nameToken": {
                "en": "Masako",
                "ja": "正子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ナカムラ",
              "nameToken": {
                "en": "Nakamura",
                "ja": "中村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ミホ",
              "nameToken": {
                "en": "Miho",
                "ja": "美穂"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "カトウ",
              "nameToken": {
                "en": "Katou",
                "ja": "加藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ダイチ",
              "nameToken": {
                "en": "Daichi",
                "ja": "大地"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "タカハシ",
              "nameToken": {
                "en": "Takahashi",
                "ja": "高橋"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "サトコ",
              "nameToken": {
                "en": "Satoko",
                "ja": "智子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "イノウエ",
              "nameToken": {
                "en": "Inoue",
                "ja": "井上"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "トモミ",
              "nameToken": {
                "en": "Tomomi",
                "ja": "智美"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマモト",
              "nameToken": {
                "en": "Yamamoto",
                "ja": "山本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "アヤ",
              "nameToken": {
                "en": "Aya",
                "ja": "彩"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ワタナベ",
              "nameToken": {
                "en": "Watanabe",
                "ja": "渡辺"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "イサム",
              "nameToken": {
                "en": "Isamu",
                "ja": "勇"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "スズキ",
              "nameToken": {
                "en": "Suzuki",
                "ja": "鈴木"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ヒデキ",
              "nameToken": {
                "en": "Hideki",
                "ja": "秀樹"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ナカムラ",
              "nameToken": {
                "en": "Nakamura",
                "ja": "中村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ショウゾウ",
              "nameToken": {
                "en": "Shouzou",
                "ja": "昭三"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "スズキ",
              "nameToken": {
                "en": "Suzuki",
                "ja": "鈴木"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "コトネ",
              "nameToken": {
                "en": "Kotone",
                "ja": "琴音"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマグチ",
              "nameToken": {
                "en": "Yamaguchi",
                "ja": "山口"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "チヨ",
              "nameToken": {
                "en": "Chiyo",
                "ja": "千代"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ワタナベ",
              "nameToken": {
                "en": "Watanabe",
                "ja": "渡辺"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ナオキ",
              "nameToken": {
                "en": "Naoki",
                "ja": "直樹"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "マツモト",
              "nameToken": {
                "en": "Matsumoto",
                "ja": "松本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ミヅキ",
              "nameToken": {
                "en": "Mizuki",
                "ja": "美月"
              }
            }
          ]
        }
      ]
    },
    {
      "courseName": {
        "key": "エイゴ",
        "en": "English",
        "ja": "英語"
      },
      "gradeLevel": "中2",
      "classNumber": "B",
      "enrollment": [
        {
          "familyNames": [
            {
              "annotation": "ヤマダ",
              "nameToken": {
                "en": "Yamada",
                "ja": "山田"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "アンズ",
              "nameToken": {
                "en": "Anzu",
                "ja": "杏"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ナカムラ",
              "nameToken": {
                "en": "Nakamura",
                "ja": "中村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ショウヘイ",
              "nameToken": {
                "en": "Shouhei",
                "ja": "翔平"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "シミズ",
              "nameToken": {
                "en": "Shimizu",
                "ja": "清水"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "トオル",
              "nameToken": {
                "en": "Touru",
                "ja": "徹"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ササキ",
              "nameToken": {
                "en": "Sasaki",
                "ja": "佐々木"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "カノン",
              "nameToken": {
                "en": "Kanon",
                "ja": "花音"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ハヤシ",
              "nameToken": {
                "en": "Hayashi",
                "ja": "林"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "リン",
              "nameToken": {
                "en": "Rin",
                "ja": "凛"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "イノウエ",
              "nameToken": {
                "en": "Inoue",
                "ja": "井上"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "マサオ",
              "nameToken": {
                "en": "Masao",
                "ja": "正男"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ハヤシ",
              "nameToken": {
                "en": "Hayashi",
                "ja": "林"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "セツコ",
              "nameToken": {
                "en": "Setsuko",
                "ja": "節子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "タカハシ",
              "nameToken": {
                "en": "Takahashi",
                "ja": "高橋"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "タイショウ",
              "nameToken": {
                "en": "Taishou",
                "ja": "大翔"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "サトウ",
              "nameToken": {
                "en": "Satou",
                "ja": "佐藤"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "タクヤ",
              "nameToken": {
                "en": "Takuya",
                "ja": "拓也"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ハヤシ",
              "nameToken": {
                "en": "Hayashi",
                "ja": "林"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "タクヤ",
              "nameToken": {
                "en": "Takuya",
                "ja": "拓也"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "マツモト",
              "nameToken": {
                "en": "Matsumoto",
                "ja": "松本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "トモミ",
              "nameToken": {
                "en": "Tomomi",
                "ja": "智美"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマダ",
              "nameToken": {
                "en": "Yamada",
                "ja": "山田"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "サチコ",
              "nameToken": {
                "en": "Sachiko",
                "ja": "幸子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "マツモト",
              "nameToken": {
                "en": "Matsumoto",
                "ja": "松本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "フミ",
              "nameToken": {
                "en": "Fumi",
                "ja": "フミ"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "タナカ",
              "nameToken": {
                "en": "Tanaka",
                "ja": "田中"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "カイト",
              "nameToken": {
                "en": "Kaito",
                "ja": "海斗"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマダ",
              "nameToken": {
                "en": "Yamada",
                "ja": "山田"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "シンユ",
              "nameToken": {
                "en": "Shinyu",
                "ja": "心結"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマモト",
              "nameToken": {
                "en": "Yamamoto",
                "ja": "山本"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ダイチ",
              "nameToken": {
                "en": "Daichi",
                "ja": "大地"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "シミズ",
              "nameToken": {
                "en": "Shimizu",
                "ja": "清水"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "カツコ",
              "nameToken": {
                "en": "Katsuko",
                "ja": "勝子"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ナカムラ",
              "nameToken": {
                "en": "Nakamura",
                "ja": "中村"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ヒロシ",
              "nameToken": {
                "en": "Hiroshi",
                "ja": "浩"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "イノウエ",
              "nameToken": {
                "en": "Inoue",
                "ja": "井上"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ミ",
              "nameToken": {
                "en": "Mi",
                "ja": "実"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ワタナベ",
              "nameToken": {
                "en": "Watanabe",
                "ja": "渡辺"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "タケ",
              "nameToken": {
                "en": "Take",
                "ja": "武"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "シミズ",
              "nameToken": {
                "en": "Shimizu",
                "ja": "清水"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "ショウゾウ",
              "nameToken": {
                "en": "Shouzou",
                "ja": "昭三"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "タナカ",
              "nameToken": {
                "en": "Tanaka",
                "ja": "田中"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "エミ",
              "nameToken": {
                "en": "Emi",
                "ja": "恵美"
              }
            }
          ]
        },
        {
          "familyNames": [
            {
              "annotation": "ヤマグチ",
              "nameToken": {
                "en": "Yamaguchi",
                "ja": "山口"
              }
            }
          ],
          "givenNames": [
            {
              "annotation": "トシコ",
              "nameToken": {
                "en": "Toshiko",
                "ja": "敏子"
              }
            }
          ]
        }
      ]
    }
  ]
  const mirageServerConfig = {
  }


  // [mirageServerConfig, setServerConfig] = useState()

  // useEffect(async () => {
  //   const class1Students = await generateStudents(44)
  //   const class2Students = await generateStudents(17)
  //   const class3Students = await generateStudents(23)
  //   setServerConfig({
  //     // environment,
  //     models: models,

  //     factories: factories,
  //   // @ts-ignore      
  //     seeds(server) {
  //       server.create('overview', {
  //         courseName: {
  //           key: 'スウガク',
  //           en: 'Math',
  //           ja: '数学',
  //         },
  //         gradeLevel: '中2',
  //         classNumber: '2',
  //         enrollment: class1Students
  //       });
  //       server.create('overview', {
  //         courseName: {
  //           key: 'スウガク',
  //           en: 'Math',
  //           ja: '数学',
  //         },
  //         gradeLevel: '中1',
  //         classNumber: '1',
  //         enrollment: class2Students
  //       });
  //       server.create('overview', {
  //         courseName: {
  //           key: 'エイゴ',
  //           en: 'English',
  //           ja: '英語'
  //         },
  //         gradeLevel: '中2',
  //         classNumber: 'B',
  //         enrollment: class3Students
  //       });
  //     },      
  //   })
  // }, [])
  return (
    <MirageServerProvider mockCourses={courses}>{children}</MirageServerProvider>
  )
}

export default mockProvider