import { KanjiData } from "@/types/kanji";

export const KANJI_DATASET: KanjiData[] = [
  {
    id: "kanji-1",
    character: "日",
    meaning: "Sun, Day",
    meaningId: "Matahari, Hari",
    onyomi: ["ニチ", "ジツ"],
    kunyomi: ["ひ", "-び", "-か"],
    strokes: 4,
    jlpt: "N5",
    grade: 1,
    radical: "日",
    radicalMeaning: "Sun",
    frequency: 1,
    strokePaths: [
      "M25,20 L25,85",
      "M25,20 L75,20 L75,85",
      "M25,50 L75,50",
      "M25,85 L75,85"
    ],
    examples: [
      { word: "日本", reading: "にほん (nihon)", meaning: "Jepang" },
      { word: "日曜日", reading: "にちようび (nichiyoubi)", meaning: "Hari Minggu" },
      { word: "毎日", reading: "まいにち (mainichi)", meaning: "Setiap hari" },
      { word: "今日", reading: "きょう (kyou)", meaning: "Hari ini" }
    ],
    sentences: [
      {
        japanese: "今日はいい日ですね。",
        reading: "Kyou wa ii hi desu ne.",
        meaning: "Hari ini adalah hari yang cerah ya."
      }
    ]
  },
  {
    id: "kanji-2",
    character: "月",
    meaning: "Moon, Month",
    meaningId: "Bulan (benda langit / kalender)",
    onyomi: ["ゲツ", "ガツ"],
    kunyomi: ["つき"],
    strokes: 4,
    jlpt: "N5",
    grade: 1,
    radical: "月",
    radicalMeaning: "Moon",
    frequency: 23,
    strokePaths: [
      "M30,18 L25,88",
      "M30,18 L70,18 L70,88 L60,82",
      "M30,42 L70,42",
      "M30,64 L70,64"
    ],
    examples: [
      { word: "月曜日", reading: "げつようび (getsuyoubi)", meaning: "Hari Senin" },
      { word: "一月", reading: "いちがつ (ichigatsu)", meaning: "Bulan Januari" },
      { word: "今月", reading: "こんげつ (kongetsu)", meaning: "Bulan ini" },
      { word: "満月", reading: "まんげつ (mangetsu)", meaning: "Bulan purnama" }
    ],
    sentences: [
      {
        japanese: "夜空にきれいな月が出ています。",
        reading: "Yozora ni kirei na tsuki ga dete imasu.",
        meaning: "Bulan yang indah tampak di langit malam."
      }
    ]
  },
  {
    id: "kanji-3",
    character: "火",
    meaning: "Fire",
    meaningId: "Api",
    onyomi: ["カ"],
    kunyomi: ["ひ", "-び", "ほ-"],
    strokes: 4,
    jlpt: "N5",
    grade: 1,
    radical: "火",
    radicalMeaning: "Fire",
    frequency: 574,
    strokePaths: [
      "M30,35 L20,50",
      "M70,35 L80,50",
      "M50,15 L50,85",
      "M50,45 L25,80"
    ],
    examples: [
      { word: "火曜日", reading: "かようび (kayoubi)", meaning: "Hari Selasa" },
      { word: "火山", reading: "かざん (kazan)", meaning: "Gunung berapi" },
      { word: "火事", reading: "かじ (kaji)", meaning: "Kebakaran" },
      { word: "花火", reading: "はなび (hanabi)", meaning: "Kembang api" }
    ],
    sentences: [
      {
        japanese: "キャンプで火を囲んで話しました。",
        reading: "Kyanpu de hi o kakonde hanashimashita.",
        meaning: "Kami berbincang mengelilingi api saat berkemah."
      }
    ]
  },
  {
    id: "kanji-4",
    character: "水",
    meaning: "Water",
    meaningId: "Air",
    onyomi: ["スイ"],
    kunyomi: ["みず"],
    strokes: 4,
    jlpt: "N5",
    grade: 1,
    radical: "水",
    radicalMeaning: "Water",
    frequency: 223,
    strokePaths: [
      "M50,15 L50,88 L40,78",
      "M35,35 L20,45",
      "M25,60 L45,45",
      "M55,30 L80,75"
    ],
    examples: [
      { word: "水曜日", reading: "すいようび (suiyoubi)", meaning: "Hari Rabu" },
      { word: "冷水", reading: "れいすい (reisui)", meaning: "Air dingin" },
      { word: "水泳", reading: "すいえい (suiei)", meaning: "Berenang" },
      { word: "飲み水", reading: "のみみず (nomimizu)", meaning: "Air minum" }
    ],
    sentences: [
      {
        japanese: "毎日きれいな水をたくさん飲みます。",
        reading: "Mainichi kirei na mizu o takusan nomimasu.",
        meaning: "Setiap hari saya minum banyak air bersih."
      }
    ]
  },
  {
    id: "kanji-5",
    character: "木",
    meaning: "Tree, Wood",
    meaningId: "Pohon, Kayu",
    onyomi: ["ボク", "モク"],
    kunyomi: ["き", "こ-"],
    strokes: 4,
    jlpt: "N5",
    grade: 1,
    radical: "木",
    radicalMeaning: "Tree",
    frequency: 319,
    strokePaths: [
      "M20,38 L80,38",
      "M50,15 L50,88",
      "M50,38 L25,75",
      "M50,38 L75,75"
    ],
    examples: [
      { word: "木曜日", reading: "もくようび (mokuyoubi)", meaning: "Hari Kamis" },
      { word: "木立", reading: "こだち (kodachi)", meaning: "Rumpun pepohonan" },
      { word: "大木", reading: "たいぼく (taiboku)", meaning: "Pohon besar" }
    ],
    sentences: [
      {
        japanese: "庭に大きな木があります。",
        reading: "Niwa ni ookina ki ga arimasu.",
        meaning: "Ada pohon besar di halaman rumah."
      }
    ]
  },
  {
    id: "kanji-6",
    character: "金",
    meaning: "Gold, Money",
    meaningId: "Emas, Uang, Logam",
    onyomi: ["キン", "コン"],
    kunyomi: ["かね", "かな-"],
    strokes: 8,
    jlpt: "N5",
    grade: 1,
    radical: "金",
    radicalMeaning: "Metal, Gold",
    frequency: 53,
    strokePaths: [
      "M50,15 L25,35",
      "M50,15 L75,35",
      "M35,38 L65,38",
      "M28,52 L72,52",
      "M50,38 L50,75",
      "M38,62 L32,70",
      "M62,62 L68,70",
      "M20,82 L80,82"
    ],
    examples: [
      { word: "金曜日", reading: "きんようび (kinyoubi)", meaning: "Hari Jumat" },
      { word: "お金", reading: "おかね (okane)", meaning: "Uang" },
      { word: "料金", reading: "りょうきん (ryoukin)", meaning: "Biaya / tarif" }
    ],
    sentences: [
      {
        japanese: "財布にお金があまり入っていません。",
        reading: "Saifu ni okane ga amari haitte imasen.",
        meaning: "Tidak ada banyak uang di dalam dompet."
      }
    ]
  },
  {
    id: "kanji-7",
    character: "土",
    meaning: "Soil, Earth, Ground",
    meaningId: "Tanah, Bumi",
    onyomi: ["ド", "ト"],
    kunyomi: ["つち"],
    strokes: 3,
    jlpt: "N5",
    grade: 1,
    radical: "土",
    radicalMeaning: "Earth",
    frequency: 297,
    strokePaths: [
      "M30,42 L70,42",
      "M50,18 L50,80",
      "M20,80 L80,80"
    ],
    examples: [
      { word: "土曜日", reading: "どようび (doyoubi)", meaning: "Hari Sabtu" },
      { word: "土地", reading: "とち (tochi)", meaning: "Tanah kavling / lahan" },
      { word: "お土産", reading: "おみやげ (omiyage)", meaning: "Oleh-oleh" }
    ],
    sentences: [
      {
        japanese: "豊かな土で野菜を育てます。",
        reading: "Yutaka na tsuchi de yasai o sodatemasu.",
        meaning: "Menanam sayuran di tanah yang subur."
      }
    ]
  },
  {
    id: "kanji-8",
    character: "山",
    meaning: "Mountain",
    meaningId: "Gunung",
    onyomi: ["サン", "セン"],
    kunyomi: ["やま"],
    strokes: 3,
    jlpt: "N5",
    grade: 1,
    radical: "山",
    radicalMeaning: "Mountain",
    frequency: 131,
    strokePaths: [
      "M50,15 L50,85",
      "M25,45 L25,85 L75,85 L75,45"
    ],
    examples: [
      { word: "富士山", reading: "ふじさん (fujisan)", meaning: "Gunung Fuji" },
      { word: "登山", reading: "とざん (tozan)", meaning: "Mendaki gunung" },
      { word: "山道", reading: "やまみち (yamamichi)", meaning: "Jalan setapak pegunungan" }
    ],
    sentences: [
      {
        japanese: "週末に友達と山へ行きました。",
        reading: "Shuumatsu ni tomodachi to yama e ikimashita.",
        meaning: "Akhir pekan kemarin saya pergi ke gunung bersama teman."
      }
    ]
  },
  {
    id: "kanji-9",
    character: "川",
    meaning: "River",
    meaningId: "Sungai",
    onyomi: ["セン"],
    kunyomi: ["かわ"],
    strokes: 3,
    jlpt: "N5",
    grade: 1,
    radical: "川",
    radicalMeaning: "River",
    frequency: 181,
    strokePaths: [
      "M28,25 L25,80",
      "M50,30 L50,75",
      "M72,18 L72,85"
    ],
    examples: [
      { word: "小川", reading: "おがわ (ogawa)", meaning: "Sungai kecil / parit" },
      { word: "河川", reading: "かせん (kasen)", meaning: "Sungai dan perairan" },
      { word: "川岸", reading: "かわぎし (kawagishi)", meaning: "Tepi sungai" }
    ],
    sentences: [
      {
        japanese: "川の水はとても澄んでいます。",
        reading: "Kawa no mizu wa totemo sunde imasu.",
        meaning: "Air sungai sangat jernih."
      }
    ]
  },
  {
    id: "kanji-10",
    character: "人",
    meaning: "Person, Human",
    meaningId: "Orang, Manusia",
    onyomi: ["ジン", "ニン"],
    kunyomi: ["ひと", "-り", "-と"],
    strokes: 2,
    jlpt: "N5",
    grade: 1,
    radical: "人",
    radicalMeaning: "Person",
    frequency: 5,
    strokePaths: [
      "M50,18 L25,85",
      "M45,45 L75,85"
    ],
    examples: [
      { word: "日本人", reading: "にほんじん (nihonjin)", meaning: "Orang Jepang" },
      { word: "三人", reading: "さんにん (sannin)", meaning: "Tiga orang" },
      { word: "大人", reading: "おとな (otona)", meaning: "Dewasa" },
      { word: "人気", reading: "にんき (ninki)", meaning: "Kepopuleran" }
    ],
    sentences: [
      {
        japanese: "駅の前にはたくさんの人がいます。",
        reading: "Eki no mae ni wa takusan no hito ga imasu.",
        meaning: "Ada banyak orang di depan stasiun."
      }
    ]
  },
  {
    id: "kanji-11",
    character: "学",
    meaning: "Study, Learn, Science",
    meaningId: "Belajar, Ilmu pengetahuan",
    onyomi: ["ガク"],
    kunyomi: ["まな-ぶ"],
    strokes: 8,
    jlpt: "N5",
    grade: 1,
    radical: "子",
    radicalMeaning: "Child",
    frequency: 66,
    examples: [
      { word: "学生", reading: "がくせい (gakusei)", meaning: "Pelajar / mahasiswa" },
      { word: "大学", reading: "だいがく (daigaku)", meaning: "Universitas" },
      { word: "学校", reading: "がっこう (gakkou)", meaning: "Sekolah" }
    ],
    sentences: [
      {
        japanese: "毎日日本語を熱心に学びます。",
        reading: "Mainichi nihongo o nesshin ni manabimasu.",
        meaning: "Setiap hari saya giat mempelajari bahasa Jepang."
      }
    ]
  },
  {
    id: "kanji-12",
    character: "校",
    meaning: "School, Exam",
    meaningId: "Sekolah",
    onyomi: ["コウ"],
    kunyomi: [],
    strokes: 10,
    jlpt: "N5",
    grade: 1,
    radical: "木",
    radicalMeaning: "Tree",
    frequency: 271,
    examples: [
      { word: "学校", reading: "がっこう (gakkou)", meaning: "Sekolah" },
      { word: "高校", reading: "こうこう (koukou)", meaning: "SMA" },
      { word: "校長", reading: "こうちょう (kouchou)", meaning: "Kepala sekolah" }
    ],
    sentences: [
      {
        japanese: "朝八時に学校へ着きます。",
        reading: "Asa hachiji ni gakkou e tsukimasu.",
        meaning: "Tiba di sekolah pada pukul delapan pagi."
      }
    ]
  },
  {
    id: "kanji-13",
    character: "生",
    meaning: "Life, Birth, Genuine",
    meaningId: "Hidup, Lahir, Murid",
    onyomi: ["セイ", "ショウ"],
    kunyomi: ["い-きる", "う-まれる", "なま"],
    strokes: 5,
    jlpt: "N5",
    grade: 1,
    radical: "生",
    radicalMeaning: "Life",
    frequency: 29,
    examples: [
      { word: "先生", reading: "せんせい (sensei)", meaning: "Guru / dokter" },
      { word: "生活", reading: "せいかつ (seikatsu)", meaning: "Kehidupan sehari-hari" },
      { word: "誕生日", reading: "たんじょうび (tanjoubi)", meaning: "Hari ulang tahun" }
    ],
    sentences: [
      {
        japanese: "先生に質問をしました。",
        reading: "Sensei ni shitsumon o shimashita.",
        meaning: "Saya mengajukan pertanyaan kepada guru."
      }
    ]
  },
  {
    id: "kanji-14",
    character: "先",
    meaning: "Before, Ahead, Previous",
    meaningId: "Sebelumnya, Dahulu, Masa depan",
    onyomi: ["セン"],
    kunyomi: ["さき", "ま-ず"],
    strokes: 6,
    jlpt: "N5",
    grade: 1,
    radical: "儿",
    radicalMeaning: "Legs",
    frequency: 173,
    examples: [
      { word: "先週", reading: "せんしゅう (senshuu)", meaning: "Minggu lalu" },
      { word: "先月", reading: "せんげつ (sengetsu)", meaning: "Bulan lalu" },
      { word: "お先に", reading: "おさきに (osakini)", meaning: "Duluan ya (permisi)" }
    ],
    sentences: [
      {
        japanese: "先月日本へ旅行に行きました。",
        reading: "Sengetsu nihon e ryokou ni ikimashita.",
        meaning: "Bulan lalu saya bepergian ke Jepang."
      }
    ]
  },
  {
    id: "kanji-15",
    character: "本",
    meaning: "Book, Origin, Real",
    meaningId: "Buku, Asal mula, Utama",
    onyomi: ["ホン"],
    kunyomi: ["もと"],
    strokes: 5,
    jlpt: "N5",
    grade: 1,
    radical: "木",
    radicalMeaning: "Tree",
    frequency: 10,
    examples: [
      { word: "本屋", reading: "ほんや (hon'ya)", meaning: "Toko buku" },
      { word: "基本", reading: "きほん (kihon)", meaning: "Dasar / fundamental" },
      { word: "本当に", reading: "ほんとうに (hontouni)", meaning: "Sungguh / benar-benar" }
    ],
    sentences: [
      {
        japanese: "図書館で面白い本を借りました。",
        reading: "Toshokan de omoshiroi hon o karimashita.",
        meaning: "Saya meminjam buku menarik di perpustakaan."
      }
    ]
  },
  {
    id: "kanji-16",
    character: "中",
    meaning: "Inside, Middle, Center",
    meaningId: "Di dalam, Tengah",
    onyomi: ["チュウ"],
    kunyomi: ["なか", "うち", "あた-る"],
    strokes: 4,
    jlpt: "N5",
    grade: 1,
    radical: "丨",
    radicalMeaning: "Line",
    frequency: 11,
    examples: [
      { word: "一日中", reading: "いちにちじゅう (ichinichijuu)", meaning: "Sepanjang hari" },
      { word: "中学校", reading: "ちゅうがっこう (chuugakkou)", meaning: "SMP" },
      { word: "中国", reading: "ちゅうごく (chuugoku)", meaning: "Tiongkok" }
    ],
    sentences: [
      {
        japanese: "カバンの中に財布があります。",
        reading: "Kaban no naka ni saifu ga arimasu.",
        meaning: "Ada dompet di dalam tas."
      }
    ]
  },
  {
    id: "kanji-17",
    character: "大",
    meaning: "Big, Large, Great",
    meaningId: "Besar",
    onyomi: ["ダイ", "タイ"],
    kunyomi: ["おお-きい", "おお-いに"],
    strokes: 3,
    jlpt: "N5",
    grade: 1,
    radical: "大",
    radicalMeaning: "Big",
    frequency: 7,
    examples: [
      { word: "大変", reading: "たいへん (taihen)", meaning: "Berat / gawat" },
      { word: "大切", reading: "たいせつ (taisetsu)", meaning: "Penting / berharga" },
      { word: "大好き", reading: "だいすき (daisuki)", meaning: "Sangat suka" }
    ],
    sentences: [
      {
        japanese: "この公園には大きな池があります。",
        reading: "Kono kouen ni wa ookina ike ga arimasu.",
        meaning: "Di taman ini ada kolam yang besar."
      }
    ]
  },
  {
    id: "kanji-18",
    character: "小",
    meaning: "Small, Little",
    meaningId: "Kecil",
    onyomi: ["ショウ"],
    kunyomi: ["ちい-さい", "こ-", "お-"],
    strokes: 3,
    jlpt: "N5",
    grade: 1,
    radical: "小",
    radicalMeaning: "Small",
    frequency: 114,
    examples: [
      { word: "小学校", reading: "しょうがっこう (shougakkou)", meaning: "Sekolah Dasar" },
      { word: "小鳥", reading: "ことり (kotori)", meaning: "Burung kecil" },
      { word: "小説", reading: "しょうせつ (shousetsu)", meaning: "Novel" }
    ],
    sentences: [
      {
        japanese: "小さな声で話してください。",
        reading: "Chiisana koe de hanashite kudasai.",
        meaning: "Tolong bicara dengan suara kecil/pelan."
      }
    ]
  },
  {
    id: "kanji-19",
    character: "上",
    meaning: "Above, Up, Over",
    meaningId: "Atas, Naik",
    onyomi: ["ジョウ", "ショウ"],
    kunyomi: ["うえ", "あ-がる", "のぼ-る"],
    strokes: 3,
    jlpt: "N5",
    grade: 1,
    radical: "一",
    radicalMeaning: "One",
    frequency: 35,
    examples: [
      { word: "机の上", reading: "つくえのうえ (tsukue no ue)", meaning: "Di atas meja" },
      { word: "上手", reading: "じょうず (jouzu)", meaning: "Pandai / mahir" },
      { word: "向上", reading: "こうじょう (koujou)", meaning: "Peningkatan" }
    ],
    sentences: [
      {
        japanese: "机の上にペンを置きました。",
        reading: "Tsukue no ue ni pen o okimashita.",
        meaning: "Saya meletakkan pena di atas meja."
      }
    ]
  },
  {
    id: "kanji-20",
    character: "下",
    meaning: "Below, Down, Under",
    meaningId: "Bawah, Turun",
    onyomi: ["カ", "ゲ"],
    kunyomi: ["した", "さ-がる", "くだ-さる"],
    strokes: 3,
    jlpt: "N5",
    grade: 1,
    radical: "一",
    radicalMeaning: "One",
    frequency: 97,
    examples: [
      { word: "地下鉄", reading: "ちかてつ (chikatetsu)", meaning: "Kereta bawah tanah" },
      { word: "下手", reading: "へた (heta)", meaning: "Kurang pandai" },
      { word: "靴下", reading: "くつした (kutsushita)", meaning: "Kaos kaki" }
    ],
    sentences: [
      {
        japanese: "木の下で涼しい風を感じました。",
        reading: "Ki no shita de suzushii kaze o kanjimashita.",
        meaning: "Merasakan angin sejuk di bawah pohon."
      }
    ]
  },
  {
    id: "kanji-21",
    character: "食",
    meaning: "Eat, Food",
    meaningId: "Makan, Makanan",
    onyomi: ["ショク", "ジキ"],
    kunyomi: ["た-べる", "く-う"],
    strokes: 9,
    jlpt: "N5",
    grade: 2,
    radical: "食",
    radicalMeaning: "Eat, Food",
    frequency: 300,
    examples: [
      { word: "食堂", reading: "しょくどう (shokudou)", meaning: "Kantin / ruang makan" },
      { word: "食事", reading: "しょくじ (shokuji)", meaning: "Makan (aktivitas)" },
      { word: "食べ物", reading: "たべもの (tabemono)", meaning: "Makanan" }
    ],
    sentences: [
      {
        japanese: "家族と一緒に夕食を食べました。",
        reading: "Kazoku to issho ni yuushoku o tabemashita.",
        meaning: "Makan malam bersama keluarga."
      }
    ]
  },
  {
    id: "kanji-22",
    character: "飲",
    meaning: "Drink",
    meaningId: "Minum",
    onyomi: ["イン"],
    kunyomi: ["の-む"],
    strokes: 12,
    jlpt: "N5",
    grade: 3,
    radical: "食",
    radicalMeaning: "Eat, Food",
    frequency: 840,
    examples: [
      { word: "飲み物", reading: "のみもの (nomimono)", meaning: "Minuman" },
      { word: "飲食店", reading: "いんしょくてん (inshokuten)", meaning: "Rumah makan / kafe" }
    ],
    sentences: [
      {
        japanese: "朝温かいお茶を飲みます。",
        reading: "Asa atatakai ocha o nomimasu.",
        meaning: "Minum teh hangat di pagi hari."
      }
    ]
  },
  {
    id: "kanji-23",
    character: "行",
    meaning: "Go, Act, Conduct",
    meaningId: "Pergi, Melakukan",
    onyomi: ["コウ", "ギョウ"],
    kunyomi: ["い-く", "ゆ-く", "おこな-う"],
    strokes: 6,
    jlpt: "N5",
    grade: 2,
    radical: "行",
    radicalMeaning: "Go, Do",
    frequency: 20,
    examples: [
      { word: "旅行", reading: "りょこう (ryokou)", meaning: "Wisata / tamasya" },
      { word: "銀行", reading: "ぎんこう (ginkou)", meaning: "Bank" },
      { word: "行動", reading: "こうどう (koudou)", meaning: "Tindakan" }
    ],
    sentences: [
      {
        japanese: "明日新幹線で京都へ行きます。",
        reading: "Ashita shinkansen de Kyouto e ikimasu.",
        meaning: "Besok saya pergi ke Kyoto dengan kereta peluru Shinkansen."
      }
    ]
  },
  {
    id: "kanji-24",
    character: "来",
    meaning: "Come, Due, Next",
    meaningId: "Datang, Tiba",
    onyomi: ["ライ", "タイ"],
    kunyomi: ["く-る", "きた-る"],
    strokes: 7,
    jlpt: "N5",
    grade: 2,
    radical: "木",
    radicalMeaning: "Tree",
    frequency: 104,
    examples: [
      { word: "来年", reading: "らいねん (rainen)", meaning: "Tahun depan" },
      { word: "未来", reading: "みらい (mirai)", meaning: "Masa depan" },
      { word: "来客", reading: "らいきゃく (raikyaku)", meaning: "Tamu yang datang" }
    ],
    sentences: [
      {
        japanese: "友達が家へ遊びに来ました。",
        reading: "Tomodachi ga ie e asobi ni kimashita.",
        meaning: "Teman datang ke rumah untuk bermain."
      }
    ]
  },
  {
    id: "kanji-25",
    character: "見",
    meaning: "See, Look, View",
    meaningId: "Melihat, Memperhatikan",
    onyomi: ["ケン"],
    kunyomi: ["み-る", "み-える", "み-せる"],
    strokes: 7,
    jlpt: "N5",
    grade: 1,
    radical: "見",
    radicalMeaning: "See",
    frequency: 161,
    examples: [
      { word: "見学", reading: "けんがく (kengaku)", meaning: "Kunjungan studi / tur" },
      { word: "意見", reading: "いけん (iken)", meaning: "Pendapat" },
      { word: "花見", reading: "はなみ (hanami)", meaning: "Melihat bunga sakura" }
    ],
    sentences: [
      {
        japanese: "昨夜テレビで映画を見ました。",
        reading: "Sakuya terebi de eiga o mimashita.",
        meaning: "Tadi malam saya menonton film di televisi."
      }
    ]
  },
  {
    id: "kanji-26",
    character: "聞",
    meaning: "Hear, Ask, Listen",
    meaningId: "Mendengar, Bertanya",
    onyomi: ["ブン", "モン"],
    kunyomi: ["き-く", "き-こえる"],
    strokes: 14,
    jlpt: "N5",
    grade: 2,
    radical: "耳",
    radicalMeaning: "Ear",
    frequency: 315,
    examples: [
      { word: "新聞", reading: "しんぶん (shinbun)", meaning: "Koran / surat kabar" },
      { word: "聞き手", reading: "ききて (kikite)", meaning: "Pendengar" }
    ],
    sentences: [
      {
        japanese: "毎朝ラジオニュースを聞きます。",
        reading: "Maiasa rajio nyuusu o kikimasu.",
        meaning: "Setiap pagi saya mendengarkan berita radio."
      }
    ]
  },
  {
    id: "kanji-27",
    character: "書",
    meaning: "Write, Book, Document",
    meaningId: "Menulis, Surat, Dokumen",
    onyomi: ["ショ"],
    kunyomi: ["か-く"],
    strokes: 10,
    jlpt: "N5",
    grade: 2,
    radical: "曰",
    radicalMeaning: "Say",
    frequency: 156,
    examples: [
      { word: "読書", reading: "どくしょ (dokusho)", meaning: "Membaca buku" },
      { word: "辞書", reading: "じしょ (jisho)", meaning: "Kamus" },
      { word: "書類", reading: "しょるい (shorui)", meaning: "Dokumen berkas" }
    ],
    sentences: [
      {
        japanese: "日本人の友達に手紙を書きました。",
        reading: "Nihonjin no tomodachi ni tegami o kakimashita.",
        meaning: "Saya menulis surat kepada sahabat asal Jepang."
      }
    ]
  },
  {
    id: "kanji-28",
    character: "話",
    meaning: "Talk, Story, Conversation",
    meaningId: "Berbicara, Cerita",
    onyomi: ["ワ"],
    kunyomi: ["はな-す", "はなし"],
    strokes: 13,
    jlpt: "N5",
    grade: 2,
    radical: "言",
    radicalMeaning: "Say, Word",
    frequency: 147,
    examples: [
      { word: "電話", reading: "でんわ (denwa)", meaning: "Telepon" },
      { word: "会話", reading: "かいわ (kaiwa)", meaning: "Percakapan" },
      { word: "話題", reading: "わだい (wadai)", meaning: "Topik pembicaraan" }
    ],
    sentences: [
      {
        japanese: "日本語で楽しく話しましょう。",
        reading: "Nihongo de tanoshiku hanashimashou.",
        meaning: "Mari bercakap-cakap dengan menyenangkan dalam bahasa Jepang."
      }
    ]
  },
  {
    id: "kanji-29",
    character: "語",
    meaning: "Language, Word, Speech",
    meaningId: "Bahasa, Kata",
    onyomi: ["ゴ"],
    kunyomi: ["かた-る", "かた-らう"],
    strokes: 14,
    jlpt: "N5",
    grade: 2,
    radical: "言",
    radicalMeaning: "Say, Word",
    frequency: 301,
    examples: [
      { word: "日本語", reading: "にほんご (nihongo)", meaning: "Bahasa Jepang" },
      { word: "英語", reading: "えいご (eigo)", meaning: "Bahasa Inggris" },
      { word: "単語", reading: "たんご (tango)", meaning: "Kosakata" }
    ],
    sentences: [
      {
        japanese: "新しい単語をノートにメモします。",
        reading: "Atarashii tango o nooto ni memo shimasu.",
        meaning: "Mencatat kosakata baru ke dalam buku catatan."
      }
    ]
  },
  {
    id: "kanji-30",
    character: "道",
    meaning: "Road, Way, Path, Tao",
    meaningId: "Jalan, Cara, Jalur",
    onyomi: ["ドウ", "トウ"],
    kunyomi: ["みち"],
    strokes: 12,
    jlpt: "N4",
    grade: 2,
    radical: "辷",
    radicalMeaning: "Road, Walk",
    frequency: 205,
    examples: [
      { word: "水道", reading: "すいどう (suidou)", meaning: "Saluran air / PDAM" },
      { word: "書道", reading: "しょどう (shodou)", meaning: "Kaligrafi Jepang" },
      { word: "近道", reading: "ちかみち (chikamichi)", meaning: "Jalan pintas" }
    ],
    sentences: [
      {
        japanese: "静かな並木道を歩きました。",
        reading: "Shizuka na namikimichi o arukimashita.",
        meaning: "Berjalan menyusuri jalan rindang yang tenang."
      }
    ]
  },
  {
    id: "kanji-31",
    character: "雨",
    meaning: "Rain",
    meaningId: "Hujan",
    onyomi: ["ウ"],
    kunyomi: ["あめ", "あま-"],
    strokes: 8,
    jlpt: "N5",
    grade: 1,
    radical: "雨",
    radicalMeaning: "Rain",
    frequency: 890,
    examples: [
      { word: "大雨", reading: "おおあめ (ooame)", meaning: "Hujan lebat" },
      { word: "雨天", reading: "うてん (uten)", meaning: "Cuaca hujan" },
      { word: "雨具", reading: "あまぐ (amagu)", meaning: "Perlengkapan hujan" }
    ],
    sentences: [
      {
        japanese: "午後は激しい雨が降る予報です。",
        reading: "Gogo wa hageshii ame ga furu yohou desu.",
        meaning: "Prakiraan cuaca menyebutkan hujan deras sore nanti."
      }
    ]
  },
  {
    id: "kanji-32",
    character: "天",
    meaning: "Heaven, Sky, Imperial",
    meaningId: "Langit, Surga, Cuaca",
    onyomi: ["テン"],
    kunyomi: ["あまつ", "あめ", "あま-"],
    strokes: 4,
    jlpt: "N5",
    grade: 1,
    radical: "大",
    radicalMeaning: "Big",
    frequency: 510,
    examples: [
      { word: "天気", reading: "てんき (tenki)", meaning: "Cuaca" },
      { word: "天才", reading: "てんさい (tensai)", meaning: "Jenius" },
      { word: "天国", reading: "てんごく (tengoku)", meaning: "Surga" }
    ],
    sentences: [
      {
        japanese: "明日の天気はどうですか。",
        reading: "Ashita no tenki wa dou desu ka.",
        meaning: "Bagaimana perkiraan cuaca besok?"
      }
    ]
  },
  {
    id: "kanji-33",
    character: "気",
    meaning: "Spirit, Mind, Air, Atmosphere",
    meaningId: "Energi, Perasaan, Udara",
    onyomi: ["キ", "ケ"],
    kunyomi: ["いき"],
    strokes: 6,
    jlpt: "N5",
    grade: 1,
    radical: "气",
    radicalMeaning: "Steam, Breath",
    frequency: 110,
    examples: [
      { word: "元気", reading: "げんき (genki)", meaning: "Sehat / bersemangat" },
      { word: "気持ち", reading: "きもち (kimochi)", meaning: "Perasaan" },
      { word: "電気", reading: "でんき (denki)", meaning: "Listrik" }
    ],
    sentences: [
      {
        japanese: "お元気ですか。はい、元気です。",
        reading: "Ogenki desu ka. Hai, genki desu.",
        meaning: "Apa kabar? Ya, saya sehat dan bugar."
      }
    ]
  },
  {
    id: "kanji-34",
    character: "車",
    meaning: "Car, Vehicle, Wheel",
    meaningId: "Mobil, Kendaraan, Roda",
    onyomi: ["シャ"],
    kunyomi: ["くるま"],
    strokes: 7,
    jlpt: "N5",
    grade: 1,
    radical: "車",
    radicalMeaning: "Cart, Car",
    frequency: 334,
    examples: [
      { word: "電車", reading: "でんしゃ (densha)", meaning: "Kereta listrik" },
      { word: "自転車", reading: "じてんしゃ (jitensha)", meaning: "Sepeda" },
      { word: "駐車場", reading: "ちゅうしゃじょう (chuushajou)", meaning: "Tempat parkir" }
    ],
    sentences: [
      {
        japanese: "毎朝電車で通勤しています。",
        reading: "Maiasa densha de tsuukin shite imasu.",
        meaning: "Setiap pagi saya berangkat kerja naik kereta listrik."
      }
    ]
  },
  {
    id: "kanji-35",
    character: "門",
    meaning: "Gate, Counter for Cannons",
    meaningId: "Gerbang, Pintu masuk",
    onyomi: ["モン"],
    kunyomi: ["かど", "と"],
    strokes: 8,
    jlpt: "N5",
    grade: 2,
    radical: "門",
    radicalMeaning: "Gate",
    frequency: 489,
    examples: [
      { word: "正門", reading: "せいもん (seimon)", meaning: "Gerbang utama" },
      { word: "専門", reading: "せんもん (senmon)", meaning: "Bidang spesialisasi" },
      { word: "入門", reading: "にゅうもん (nyuumon)", meaning: "Pengantar / pemula" }
    ],
    sentences: [
      {
        japanese: "大学の正門で待ち合わせをしました。",
        reading: "Daigaku no seimon de machiawase o shimashita.",
        meaning: "Kami berjanji bertemu di gerbang utama universitas."
      }
    ]
  },
  {
    id: "kanji-36",
    character: "名",
    meaning: "Name, Fame, Reputation",
    meaningId: "Nama, Terkenal",
    onyomi: ["メイ", "ミョウ"],
    kunyomi: ["な", "-な"],
    strokes: 6,
    jlpt: "N5",
    grade: 1,
    radical: "口",
    radicalMeaning: "Mouth",
    frequency: 178,
    examples: [
      { word: "名前", reading: "なまえ (namae)", meaning: "Nama" },
      { word: "有名", reading: "ゆうめい (yuumei)", meaning: "Terkenal" },
      { word: "名刺", reading: "めいし (meishi)", meaning: "Kartu nama" }
    ],
    sentences: [
      {
        japanese: "お名前をここに書いてください。",
        reading: "Onamae o koko ni kaite kudasai.",
        meaning: "Silakan tuliskan nama Anda di sini."
      }
    ]
  },
  {
    id: "kanji-37",
    character: "前",
    meaning: "In Front, Before",
    meaningId: "Depan, Sebelum",
    onyomi: ["ゼン"],
    kunyomi: ["まえ", "-まえ"],
    strokes: 9,
    jlpt: "N5",
    grade: 2,
    radical: "刀",
    radicalMeaning: "Knife, Sword",
    frequency: 28,
    examples: [
      { word: "午前", reading: "ごぜん (gozen)", meaning: "Pagi (AM)" },
      { word: "駅前", reading: "えきまえ (ekimae)", meaning: "Depan stasiun" },
      { word: "前後", reading: "ぜんご (zengo)", meaning: "Depan dan belakang" }
    ],
    sentences: [
      {
        japanese: "食事の前に手を洗います。",
        reading: "Shokuji no mae ni te o araimasu.",
        meaning: "Mencuci tangan sebelum makan."
      }
    ]
  },
  {
    id: "kanji-38",
    character: "後",
    meaning: "Behind, After, Later",
    meaningId: "Belakang, Setelah, Nanti",
    onyomi: ["ゴ", "コウ"],
    kunyomi: ["のち", "うし-ろ", "あと", "おく-れる"],
    strokes: 9,
    jlpt: "N5",
    grade: 2,
    radical: "彳",
    radicalMeaning: "Step",
    frequency: 27,
    examples: [
      { word: "午後", reading: "ごご (gogo)", meaning: "Siang/sore (PM)" },
      { word: "最後", reading: "さいご (saigo)", meaning: "Terakhir" },
      { word: "後ろ", reading: "うしろ (ushiro)", meaning: "Bagian belakang" }
    ],
    sentences: [
      {
        japanese: "仕事の後に映画を見に行きます。",
        reading: "Shigoto no ato ni eiga o mi ni ikimasu.",
        meaning: "Setelah bekerja saya akan pergi menonton film."
      }
    ]
  },
  {
    id: "kanji-39",
    character: "手",
    meaning: "Hand",
    meaningId: "Tangan",
    onyomi: ["シュ", "ズ"],
    kunyomi: ["て", "て-", "-て", "た-"],
    strokes: 4,
    jlpt: "N5",
    grade: 1,
    radical: "手",
    radicalMeaning: "Hand",
    frequency: 60,
    examples: [
      { word: "手紙", reading: "てがみ (tegami)", meaning: "Surat" },
      { word: "歌手", reading: "かしゅ (kashu)", meaning: "Penyanyi" },
      { word: "上手", reading: "じょうず (jouzu)", meaning: "Mahir" }
    ],
    sentences: [
      {
        japanese: "両手で大切に箱を持ちました。",
        reading: "Ryoute de taisetsu ni hako o mochimashita.",
        meaning: "Memegang kotak itu dengan hati-hati menggunakan kedua tangan."
      }
    ]
  },
  {
    id: "kanji-40",
    character: "目",
    meaning: "Eye, Class, Look",
    meaningId: "Mata, Penglihatan",
    onyomi: ["モク", "ボク"],
    kunyomi: ["め", "-め", "ま-"],
    strokes: 5,
    jlpt: "N5",
    grade: 1,
    radical: "目",
    radicalMeaning: "Eye",
    frequency: 76,
    examples: [
      { word: "目的", reading: "もくてき (mokuteki)", meaning: "Tujuan" },
      { word: "注目", reading: "ちゅうもく (chuumoku)", meaning: "Perhatian" },
      { word: "目薬", reading: "めぐすり (megusuri)", meaning: "Obat tetes mata" }
    ],
    sentences: [
      {
        japanese: "パソコンを長時間使うときは目を休めましょう。",
        reading: "Pasokon o choujikan tsukau toki wa me o yasumemashou.",
        meaning: "Istirahatkan mata saat menggunakan komputer dalam waktu lama."
      }
    ]
  }
];

export const PRESET_QUIZ_SETS = [
  {
    id: "preset-n5-nature",
    title: "JLPT N5 : Alam dan Elemen",
    description: "Kanji dasar tentang alam, hari dalam sepekan, dan elemen (Matahari, Bulan, Api, Air, Kayu, Emas, Tanah, Gunung, Sungai).",
    kanji_list: ["日", "月", "火", "水", "木", "金", "土", "山", "川", "雨"],
    quiz_type: "meaning" as const,
    created_at: "2026-11-13",
    is_preset: true
  },
  {
    id: "preset-n5-readings",
    title: "JLPT N5 : Latihan Cara Baca",
    description: "Tebak bacaan On'yomi dan Kun'yomi untuk kanji dasar sekolah dan kehidupan sehari-hari.",
    kanji_list: ["人", "学", "校", "生", "先", "本", "中", "大", "小"],
    quiz_type: "reading" as const,
    created_at: "2026-11-13",
    is_preset: true
  },
  {
    id: "preset-n5-actions",
    title: "JLPT N5 : Kata Kerja Penting",
    description: "Kanji aktivitas sehari-hari: Makan, Minum, Pergi, Datang, Melihat, Mendengar, Menulis, Berbicara.",
    kanji_list: ["食", "飲", "行", "来", "見", "聞", "書", "話"],
    quiz_type: "mixed" as const,
    created_at: "2026-11-13",
    is_preset: true
  },
  {
    id: "preset-n5-writing",
    title: "JLPT N5 : Praktik Menulis Kanji",
    description: "Latihan menulis manual karakter kanji dasar langsung di kanvas digital dengan evaluasi mandiri.",
    kanji_list: ["一", "二", "三", "日", "月", "木", "人", "山", "川", "大"],
    quiz_type: "writing" as const,
    created_at: "2026-11-14",
    is_preset: true
  }
];

