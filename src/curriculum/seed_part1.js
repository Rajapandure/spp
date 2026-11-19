// Verified 2026-27 Curriculum Seed (Part 1: Classes 1 to 5 across NCERT, CBSE, MP Board; EN & HI)
// Official syllabus references: ncert.nic.in/textbook.php & mpbse.nic.in

export function getSeedPart1() {
  const textbooks = [
    // CLASS 1 (NCERT/CBSE EN, NCERT/CBSE HI, MP Board HI, MP Board EN)
    { id: "tb-c1-ncert-en-math", title: "Joyful Mathematics (Class 1)", board: "NCERT", medium: "EN", classNum: "1", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT (ncert.nic.in)", coverColor: "#ff6b35", status: "Published", offlineDownloaded: true },
    { id: "tb-c1-ncert-en-eng", title: "Mridang (Class 1 English)", board: "NCERT", medium: "EN", classNum: "1", subjectId: "english", subjectName: "English", subjectIcon: "english", session: "2026-27", publisher: "NCERT (ncert.nic.in)", coverColor: "#ec4899", status: "Published", offlineDownloaded: true },
    { id: "tb-c1-ncert-en-hin", title: "Sarangi (Class 1 Hindi)", board: "NCERT", medium: "EN", classNum: "1", subjectId: "hindi", subjectName: "Hindi (हिन्दी)", subjectIcon: "hindi", session: "2026-27", publisher: "NCERT (ncert.nic.in)", coverColor: "#ea580c", status: "Published", offlineDownloaded: false },

    // Class 1 MP Board Hindi Medium
    { id: "tb-c1-mp-hi-hin", title: "सारंगी / भाषा भारती (कक्षा 1)", board: "MP_BOARD", medium: "HI", classNum: "1", subjectId: "hindi", subjectName: "हिन्दी", subjectIcon: "hindi", session: "2026-27", publisher: "SCERT MP / NCERT (mpbse.nic.in)", coverColor: "#ea580c", status: "Published", offlineDownloaded: true },
    { id: "tb-c1-mp-hi-math", title: "आनंददायी गणित (कक्षा 1)", board: "MP_BOARD", medium: "HI", classNum: "1", subjectId: "maths", subjectName: "गणित", subjectIcon: "maths", session: "2026-27", publisher: "SCERT MP / NCERT (mpbse.nic.in)", coverColor: "#2563eb", status: "Published", offlineDownloaded: true },
    { id: "tb-c1-mp-hi-eng", title: "Mridang / English Reader (Class 1)", board: "MP_BOARD", medium: "HI", classNum: "1", subjectId: "english", subjectName: "अंग्रेजी (English)", subjectIcon: "english", session: "2026-27", publisher: "SCERT MP (mpbse.nic.in)", coverColor: "#db2777", status: "Published", offlineDownloaded: false },

    // CLASS 2
    { id: "tb-c2-ncert-en-math", title: "Joyful Mathematics (Class 2)", board: "NCERT", medium: "EN", classNum: "2", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT", coverColor: "#f97316", status: "Published", offlineDownloaded: true },
    { id: "tb-c2-ncert-en-eng", title: "Mridang (Class 2 English)", board: "NCERT", medium: "EN", classNum: "2", subjectId: "english", subjectName: "English", subjectIcon: "english", session: "2026-27", publisher: "NCERT", coverColor: "#ec4899", status: "Published", offlineDownloaded: true },

    // CLASS 3
    { id: "tb-c3-cbse-en-math", title: "Maths Mela (Class 3)", board: "CBSE", medium: "EN", classNum: "3", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT / CBSE", coverColor: "#8b5cf6", status: "Published", offlineDownloaded: true },
    { id: "tb-c3-cbse-en-evs", title: "Our Wondrous World (Class 3 EVS)", board: "CBSE", medium: "EN", classNum: "3", subjectId: "evs", subjectName: "Environmental Studies", subjectIcon: "evs", session: "2026-27", publisher: "NCERT / CBSE", coverColor: "#10b981", status: "Published", offlineDownloaded: true },

    // CLASS 4
    { id: "tb-c4-cbse-en-math", title: "Maths Mela (Class 4)", board: "CBSE", medium: "EN", classNum: "4", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT / CBSE", coverColor: "#7c3aed", status: "Published", offlineDownloaded: true },
    { id: "tb-c4-mp-hi-evs", title: "पर्यावरण अध्ययन (कक्षा 4)", board: "MP_BOARD", medium: "HI", classNum: "4", subjectId: "evs", subjectName: "पर्यावरण अध्ययन", subjectIcon: "evs", session: "2026-27", publisher: "SCERT MP", coverColor: "#059669", status: "Published", offlineDownloaded: true },

    // CLASS 5 (CBSE English Medium + MP Board)
    { id: "tb-c5-cbse-en-math", title: "Maths Mela (Class 5)", board: "CBSE", medium: "EN", classNum: "5", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT / CBSE (ncert.nic.in)", coverColor: "#0ea5e9", status: "Published", offlineDownloaded: true },
    { id: "tb-c5-cbse-en-eng", title: "Santoor (Class 5 English)", board: "CBSE", medium: "EN", classNum: "5", subjectId: "english", subjectName: "English", subjectIcon: "english", session: "2026-27", publisher: "NCERT / CBSE", coverColor: "#ec4899", status: "Published", offlineDownloaded: true },
    { id: "tb-c5-cbse-en-evs", title: "Our Wondrous World (Class 5 EVS)", board: "CBSE", medium: "EN", classNum: "5", subjectId: "evs", subjectName: "The World Around Us (EVS)", subjectIcon: "evs", session: "2026-27", publisher: "NCERT / CBSE", coverColor: "#10b981", status: "Published", offlineDownloaded: true },
    { id: "tb-c5-cbse-en-hin", title: "Veena (Class 5 Hindi)", board: "CBSE", medium: "EN", classNum: "5", subjectId: "hindi", subjectName: "Hindi (हिन्दी)", subjectIcon: "hindi", session: "2026-27", publisher: "NCERT / CBSE", coverColor: "#f97316", status: "Published", offlineDownloaded: false }
  ];

  const chapters = [
    // CLASS 1 MP BOARD HINDI MEDIUM (Used in TEST 1!)
    {
      id: "ch-c1-mp-hi-hin-1",
      bookId: "tb-c1-mp-hi-hin",
      board: "MP_BOARD",
      medium: "HI",
      classNum: "1",
      subjectId: "hindi",
      sequence: 1,
      title: "पाठ 1: मीना का परिवार",
      sourceType: "Original Supplementary Content (aligned with NCERT/SCERT Class 1 पाठ 1: मीना का परिवार)",
      status: "Published",
      intro: "इस पाठ में हम मीना और उसके प्यारे परिवार के सदस्यों के बारे में पढ़ेंगे।",
      objectives: ["परिवार के सदस्यों के नाम पहचानना", "सरल हिन्दी शब्द पढ़ना और बोलना", "छोटे वाक्यों को समझना"],
      explanation: "मीना के परिवार में कुल सात लोग हैं: दादा, दादी, माता, पिता, चाचा, भाई दिवाकर और मीना। दादा-दादी कहानियाँ सुनाते हैं। मीना अपने भाई दिवाकर के साथ खेलती है। परिवार में सब एक-दूसरे की मदद करते हैं।",
      concepts: [
        { term: "परिवार (Family)", def: "जहाँ माता-पिता, दादा-दादी और बच्चे एक साथ प्यार से रहते हैं।" },
        { term: "रिश्ते (Relations)", def: "दादा-दादी, माता-पिता, भाई-बहन हमारे परिवार के सदस्य हैं।" }
      ],
      examples: [
        { q: "मीना के भाई का नाम क्या है?", a: "मीना के भाई का नाम दिवाकर है।" }
      ],
      diagramType: "",
      facts: ["परिवार में मिल-जुलकर रहने से खुशी बढ़ती है।"],
      revision: ["मीना के परिवार में 7 सदस्य हैं।", "भाई का नाम दिवाकर है।"],
      exercises: [
        { qNo: "1", marks: 1, q: "मीना के परिवार में कौन-कौन रहता है?", hint: "पाठ के पहले वाक्य को याद करें।", ans: "दादा, दादी, माता, पिता, चाचा, भाई दिवाकर और मीना।", steps: "1. पाठ में परिवार के सात सदस्यों का वर्णन है।\n2. उनके नाम: दादा, दादी, माता, पिता, चाचा, दिवाकर और मीना।" },
        { qNo: "2", marks: 1, q: "मीना अपने भाई के साथ क्या करती है?", hint: "मीना और दिवाकर क्या करते हैं?", ans: "मीना अपने भाई दिवाकर के साथ खेलती है।", steps: "1. भाई दिवाकर छोटा है।\n2. दोनों साथ में मिलकर खेलते हैं।" }
      ]
    },
    {
      id: "ch-c1-mp-hi-math-1",
      bookId: "tb-c1-mp-hi-math",
      board: "MP_BOARD",
      medium: "HI",
      classNum: "1",
      subjectId: "maths",
      sequence: 1,
      title: "पाठ 1: आकृतियाँ और स्थान (अंदर-बाहर, ऊपर-नीचे)",
      sourceType: "Original Supplementary Content (aligned with SCERT MP / NCERT Class 1 गणित)",
      status: "Published",
      intro: "आओ अपने आस-पास की चीज़ों के आकार और स्थान (ऊपर, नीचे, अंदर, बाहर) पहचानें।",
      objectives: ["गोल, चौकोर और तिकोनी आकृतियाँ पहचानना", "अंदर-बाहर और ऊपर-नीचे का अंतर समझना"],
      explanation: "गेंद और रोटी गोल (Circle) होते हैं। किताब और खिड़की चौकोर (Square/Rectangle) होते हैं। समोसा तिकोना (Triangle) होता है। जब बिल्ली टोकरी में बैठती है तो वह 'अंदर' होती है।",
      concepts: [
        { term: "गोल (Circle)", def: "बिना कोने वाली गोल आकृति, जैसे सूर्य और गेंद।" },
        { term: "त्रिकोण (Triangle)", def: "तीन भुजाओं और तीन कोनों वाली आकृति।" }
      ],
      examples: [
        { q: "रोटी का आकार कैसा होता है?", a: "रोटी का आकार गोल (Circle) होता है।" }
      ],
      diagramType: "shapes_c1",
      facts: ["हमारे आस-पास हर वस्तु का एक निश्चित आकार होता है।"],
      revision: ["गोल = 0 कोने", "त्रिकोण = 3 कोने", "वर्ग = 4 बराबर भुजाएँ"],
      exercises: [
        { qNo: "1", marks: 1, q: "तीन कोनों वाली आकृति को क्या कहते हैं?", hint: "समोसे का आकार याद करें।", ans: "त्रिकोण / त्रिभुज (Triangle)", steps: "1. तिकोनी आकृति में 3 किनारे और 3 कोने होते हैं।\n2. इसे त्रिभुज या त्रिकोण कहते हैं।" }
      ]
    },

    // CLASS 1 NCERT ENGLISH MEDIUM
    {
      id: "ch-c1-ncert-en-math-1",
      bookId: "tb-c1-ncert-en-math",
      board: "NCERT",
      medium: "EN",
      classNum: "1",
      subjectId: "maths",
      sequence: 1,
      title: "Chapter 1: Finding the Furry Cat! (Pre-number & Shapes)",
      sourceType: "Original Supplementary Content (aligned with NCERT Joyful Mathematics Class 1 Ch 1)",
      status: "Published",
      intro: "Let us learn words like inside, outside, top, bottom, and basic shapes while looking for a cute furry cat!",
      objectives: ["Identify inside/outside and on/under positions", "Recognize Circle, Square, Triangle, and Rectangle"],
      explanation: "Look around your room. A ball is round like a Circle. A slate is like a Rectangle. When a cat sits on a mat, it is ON the mat. When it hides in a basket, it is INSIDE the basket.",
      concepts: [
        { term: "Inside / Outside", def: "Inside means within a space (cat in a box); Outside means out of it." },
        { term: "Circle", def: "A round shape with no corners, like a wheel or coin." }
      ],
      examples: [{ q: "How many corners does a triangle have?", a: "A triangle has 3 corners." }],
      diagramType: "shapes_c1",
      facts: ["A circle has 0 corners!"],
      revision: ["Circle = round", "Triangle = 3 sides", "Square = 4 equal sides"],
      exercises: [
        { qNo: "1", marks: 1, q: "Name two round objects you see at home.", hint: "Think of things you eat or play with.", ans: "Ball and Chapati (or Coin/Plate).", steps: "1. Look for objects with no straight sides.\n2. Examples: Ball, Coin, Chapati." }
      ]
    },
    {
      id: "ch-c1-ncert-en-eng-1",
      bookId: "tb-c1-ncert-en-eng",
      board: "NCERT",
      medium: "EN",
      classNum: "1",
      subjectId: "english",
      sequence: 1,
      title: "Chapter 1: Two Little Hands",
      sourceType: "Original Supplementary Content (aligned with NCERT Mridang Class 1 Unit 1 Ch 1)",
      status: "Published",
      intro: "A fun action rhyme about our hands, eyes, ears, nose, and legs!",
      objectives: ["Name body parts in English", "Follow simple action words like clap, tap, look"],
      explanation: "We have two little hands to clap, two little legs to tap, two little eyes to look around, and one little nose to smell flowers.",
      concepts: [{ term: "Clap", def: "To hit your two hands together to make a sound." }],
      examples: [{ q: "What do we do with our eyes?", a: "We see and look around with our eyes." }],
      diagramType: "",
      facts: ["We have 2 hands, 2 eyes, 2 ears, and 1 nose."],
      revision: ["Hands -> Clap", "Legs -> Tap", "Eyes -> Look"],
      exercises: [
        { qNo: "1", marks: 1, q: "How many hands do you have?", hint: "Count your left and right hands.", ans: "I have two hands.", steps: "1. One left hand + one right hand = two hands." }
      ]
    },

    // CLASS 2, 3, 4 SAMPLE CHAPTERS
    {
      id: "ch-c2-ncert-en-math-1",
      bookId: "tb-c2-ncert-en-math",
      board: "NCERT",
      medium: "EN",
      classNum: "2",
      subjectId: "maths",
      sequence: 1,
      title: "Chapter 1: A Day at the Beach (Counting in Tens)",
      sourceType: "Original Supplementary Content (aligned with NCERT Joyful Mathematics Class 2)",
      status: "Published",
      intro: "Learn to count large groups quickly by making bundles of 10!",
      objectives: ["Group objects into tens and ones", "Read and write 2-digit numbers up to 99"],
      explanation: "Counting one by one takes time. If we make groups of 10 shells, 3 groups of 10 and 4 loose shells make 34!",
      concepts: [{ term: "Tens and Ones", def: "In 47, 4 is in the Tens place (40) and 7 is in the Ones place (7)." }],
      examples: [{ q: "Write 5 tens and 6 ones as a number.", a: "50 + 6 = 56." }],
      diagramType: "",
      facts: ["10 ones make 1 ten."],
      revision: ["Place value of 3 in 38 is 30."],
      exercises: [{ qNo: "1", marks: 1, q: "How many tens and ones are in 64?", hint: "Split 64 into 60 + 4.", ans: "6 tens and 4 ones.", steps: "1. 64 = 60 + 4\n2. 60 = 6 tens, 4 = 4 ones." }]
    },
    {
      id: "ch-c3-cbse-en-math-1",
      bookId: "tb-c3-cbse-en-math",
      board: "CBSE",
      medium: "EN",
      classNum: "3",
      subjectId: "maths",
      sequence: 1,
      title: "Chapter 1: What's in a Name? (Patterns & Numbers)",
      sourceType: "Original Supplementary Content (aligned with NCERT Maths Mela Class 3)",
      status: "Published",
      intro: "Explore letter counts, tally marks, and 3-digit number patterns.",
      objectives: ["Count letters and compare lengths", "Read 3-digit numbers up to 999"],
      explanation: "Every name has a number of letters. Comparing letter counts helps us learn greater than (>), less than (<), and data tables.",
      concepts: [{ term: "Hundreds", def: "10 tens make 1 hundred (100)." }],
      examples: [{ q: "Which number is greater: 245 or 254?", a: "254 is greater than 245." }],
      diagramType: "",
      facts: ["100 is the smallest 3-digit number."],
      revision: ["100 = 10 tens"],
      exercises: [{ qNo: "1", marks: 2, q: "Write the expanded form of 348.", hint: "Break into Hundreds, Tens, Ones.", ans: "300 + 40 + 8", steps: "1. 3 is in hundreds = 300\n2. 4 is in tens = 40\n3. 8 is in ones = 8." }]
    },
    {
      id: "ch-c4-cbse-en-math-1",
      bookId: "tb-c4-cbse-en-math",
      board: "CBSE",
      medium: "EN",
      classNum: "4",
      subjectId: "maths",
      sequence: 1,
      title: "Chapter 1: Shapes Around Us (Perimeter & Symmetry)",
      sourceType: "Original Supplementary Content (aligned with NCERT Maths Mela Class 4)",
      status: "Published",
      intro: "Discover boundaries, perimeter of rectangles, and mirror symmetry.",
      objectives: ["Calculate perimeter of simple polygons", "Identify lines of symmetry"],
      explanation: "Perimeter is the total length of the boundary of a closed shape. For a rectangle, Perimeter = 2 × (Length + Breadth).",
      concepts: [{ term: "Perimeter", def: "Total distance around the outer boundary of a figure." }],
      examples: [{ q: "Find perimeter of a square of side 5 cm.", a: "4 × 5 = 20 cm." }],
      diagramType: "",
      facts: ["A square has 4 lines of symmetry."],
      revision: ["Perimeter of square = 4 × side"],
      exercises: [{ qNo: "1", marks: 2, q: "A rectangular garden is 12 m long and 8 m wide. Find its perimeter.", hint: "Add all 4 sides.", ans: "40 m", steps: "1. Perimeter = 2 × (12 + 8)\n2. = 2 × 20 = 40 m." }]
    },

    // CLASS 5 CBSE ENGLISH MEDIUM (Used in TEST 2!)
    {
      id: "ch-c5-cbse-en-math-1",
      bookId: "tb-c5-cbse-en-math",
      board: "CBSE",
      medium: "EN",
      classNum: "5",
      subjectId: "maths",
      sequence: 1,
      title: "Chapter 1: We the Travellers - I (Large Numbers & Operations)",
      sourceType: "Original Supplementary Content (aligned with NCERT Class 5 Maths Mela Ch 1)",
      status: "Published",
      intro: "Travel across India with 5-digit and 6-digit numbers, place value, and real-world travel math.",
      objectives: ["Read and write numbers up to Lakhs", "Solve multi-step travel addition and subtraction problems"],
      explanation: "When travelling between cities, distances and populations run into thousands and lakhs. In the Indian Place Value System, we group digits as Ones, Tens, Hundreds | Thousands, Ten Thousands | Lakhs. Example: 1,24,560 is read as One Lakh Twenty-Four Thousand Five Hundred Sixty.",
      concepts: [
        { term: "1 Lakh (1,00,000)", def: "100 thousands make 1 Lakh. It is the smallest 6-digit number." },
        { term: "Expanded Form", def: "Writing a number as the sum of the place values of its digits." }
      ],
      examples: [
        { q: "A train travels 425 km on Day 1 and 389 km on Day 2. Total distance?", a: "425 + 389 = 814 km." }
      ],
      diagramType: "",
      facts: ["10,000 × 10 = 1,00,000 (1 Lakh)."],
      revision: ["Indian system commas: 3 digits from right, then every 2 digits."],
      exercises: [
        { qNo: "1", marks: 2, q: "Write 2,45,608 in words using the Indian Place Value System.", hint: "2 is in Lakhs, 45 in Thousands.", ans: "Two Lakh Forty-Five Thousand Six Hundred Eight.", steps: "1. Lakhs period: 2 -> Two Lakh\n2. Thousands period: 45 -> Forty-Five Thousand\n3. Ones period: 608 -> Six Hundred Eight." },
        { qNo: "2", marks: 2, q: "A bus needs to cover 1,250 km. It has covered 785 km. How much distance is left?", hint: "Subtract covered distance from total distance.", ans: "465 km", steps: "1. Total distance = 1,250 km\n2. Covered = 785 km\n3. Remaining = 1250 - 785 = 465 km." }
      ]
    },
    {
      id: "ch-c5-cbse-en-math-2",
      bookId: "tb-c5-cbse-en-math",
      board: "CBSE",
      medium: "EN",
      classNum: "5",
      subjectId: "maths",
      sequence: 2,
      title: "Chapter 2: Fractions",
      sourceType: "Original Supplementary Content (aligned with NCERT Class 5 Maths Mela Ch 2)",
      status: "Published",
      intro: "Understand parts of a whole, equivalent fractions, and comparing fractions visually.",
      objectives: ["Identify numerator and denominator", "Find equivalent fractions", "Compare like and unlike fractions"],
      explanation: "A fraction represents equal parts of a whole. In 3/4, 3 is the Numerator (parts taken) and 4 is the Denominator (total equal parts). Equivalent fractions like 1/2, 2/4, and 4/8 represent the exact same quantity.",
      concepts: [
        { term: "Numerator", def: "The top number showing how many equal parts are selected." },
        { term: "Denominator", def: "The bottom number showing total equal parts in one whole." },
        { term: "Equivalent Fractions", def: "Fractions with different numbers that have the same value (e.g. 1/2 = 2/4)." }
      ],
      examples: [
        { q: "Are 2/3 and 4/6 equivalent?", a: "Yes! Multiply numerator and denominator of 2/3 by 2 to get 4/6." }
      ],
      diagramType: "fractions_c5",
      facts: ["When numerator equals denominator (like 4/4), the fraction equals 1 whole."],
      revision: ["1/2 = 50% = 2/4 = 3/6", "Larger denominator with same numerator means smaller piece."],
      exercises: [
        { qNo: "1", marks: 2, q: "Write two equivalent fractions for 3/5.", hint: "Multiply top and bottom by 2, then by 3.", ans: "6/10 and 9/15", steps: "1. (3×2)/(5×2) = 6/10\n2. (3×3)/(5×3) = 9/15" },
        { qNo: "2", marks: 2, q: "Which is larger: 1/3 or 1/5?", hint: "If you cut a cake into 3 pieces vs 5 pieces, which piece is bigger?", ans: "1/3 is larger than 1/5.", steps: "1. Both have numerator 1.\n2. Fewer total parts (3) means each part is larger than when divided into 5 parts." }
      ]
    },
    {
      id: "ch-c5-cbse-en-evs-1",
      bookId: "tb-c5-cbse-en-evs",
      board: "CBSE",
      medium: "EN",
      classNum: "5",
      subjectId: "evs",
      sequence: 1,
      title: "Chapter 1: Water — Our Precious Resource",
      sourceType: "Original Supplementary Content (aligned with NCERT Class 5 Our Wondrous World)",
      status: "Published",
      intro: "Explore the water cycle, sources of fresh water, and water conservation.",
      objectives: ["Explain evaporation and condensation", "List ways to save water at home and school"],
      explanation: "About 71% of Earth is covered with water, but most of it is salty ocean water. Only a small fraction is fresh water in rivers, lakes, and groundwater. The Water Cycle continuously recycles water through evaporation, condensation, and precipitation.",
      concepts: [
        { term: "Evaporation", def: "Liquid water turning into water vapour due to the sun's heat." },
        { term: "Condensation", def: "Water vapour cooling down to form tiny droplets (clouds)." }
      ],
      examples: [{ q: "Why do wet clothes dry faster on a sunny, windy day?", a: "Heat and wind speed up evaporation." }],
      diagramType: "",
      facts: ["Rainwater harvesting helps recharge underground water."],
      revision: ["Evaporation -> Condensation -> Precipitation"],
      exercises: [
        { qNo: "1", marks: 2, q: "What is rainwater harvesting?", hint: "Think about collecting rain from rooftops.", ans: "Collecting and storing rainwater from roofs and surfaces for future use and groundwater recharge.", steps: "1. Rain falls on rooftops.\n2. Pipes carry it to storage tanks or recharge pits." }
      ]
    }
  ];

  const questions = [
    // Class 1 MP Board Hindi Medium Questions (5+ verified questions)
    { id: "q-c1-mp-1", chapterId: "ch-c1-mp-hi-hin-1", bookId: "tb-c1-mp-hi-hin", board: "MP_BOARD", medium: "HI", classNum: "1", subjectId: "hindi", topic: "परिवार के सदस्य", type: "MCQ", difficulty: "Easy", marks: 1, q: "मीना के परिवार में कुल कितने लोग हैं?", options: ["पाँच", "सात", "तीन", "दस"], ans: "सात", explanation: "पाठ 'मीना का परिवार' में कुल सात सदस्य हैं: दादा, दादी, माता, पिता, चाचा, दिवाकर और मीना।", solution: "सही उत्तर: सात।" },
    { id: "q-c1-mp-2", chapterId: "ch-c1-mp-hi-hin-1", bookId: "tb-c1-mp-hi-hin", board: "MP_BOARD", medium: "HI", classNum: "1", subjectId: "hindi", topic: "परिवार के सदस्य", type: "MCQ", difficulty: "Easy", marks: 1, q: "मीना के छोटे भाई का नाम क्या है?", options: ["राहुल", "दिवाकर", "मोहन", "अमित"], ans: "दिवाकर", explanation: "मीना के भाई का नाम दिवाकर है।", solution: "सही उत्तर: दिवाकर।" },
    { id: "q-c1-mp-3", chapterId: "ch-c1-mp-hi-hin-1", bookId: "tb-c1-mp-hi-hin", board: "MP_BOARD", medium: "HI", classNum: "1", subjectId: "hindi", topic: "वाक्य बोध", type: "TF", difficulty: "Easy", marks: 1, q: "दादा-दादी बच्चों को कहानियाँ सुनाते हैं। (सही या गलत)", options: ["सही", "गलत"], ans: "सही", explanation: "पाठ के अनुसार दादा-दादी कहानियाँ सुनाते हैं।", solution: "सही।" },
    { id: "q-c1-mp-4", chapterId: "ch-c1-mp-hi-math-1", bookId: "tb-c1-mp-hi-math", board: "MP_BOARD", medium: "HI", classNum: "1", subjectId: "maths", topic: "आकृतियाँ", type: "MCQ", difficulty: "Easy", marks: 1, q: "गेंद का आकार कैसा होता है?", options: ["गोल", "चौकोर", "तिकोना", "लम्बा"], ans: "गोल", explanation: "गेंद पूरी तरह गोल (Circle/Sphere) होती है।", solution: "सही उत्तर: गोल।" },
    { id: "q-c1-mp-5", chapterId: "ch-c1-mp-hi-math-1", bookId: "tb-c1-mp-hi-math", board: "MP_BOARD", medium: "HI", classNum: "1", subjectId: "maths", topic: "आकृतियाँ", type: "MCQ", difficulty: "Easy", marks: 1, q: "समोसे में कितने कोने होते हैं?", options: ["2", "3", "4", "0"], ans: "3", explanation: "समोसा तिकोना (Triangle) होता है और इसमें 3 कोने होते हैं।", solution: "सही उत्तर: 3।" },

    // Class 1 NCERT EN Questions
    { id: "q-c1-en-1", chapterId: "ch-c1-ncert-en-math-1", bookId: "tb-c1-ncert-en-math", board: "NCERT", medium: "EN", classNum: "1", subjectId: "maths", topic: "Shapes", type: "MCQ", difficulty: "Easy", marks: 1, q: "Which shape has 0 corners?", options: ["Circle", "Square", "Triangle", "Rectangle"], ans: "Circle", explanation: "A circle is round and has no corners.", solution: "Circle has 0 corners." },
    { id: "q-c1-en-2", chapterId: "ch-c1-ncert-en-math-1", bookId: "tb-c1-ncert-en-math", board: "NCERT", medium: "EN", classNum: "1", subjectId: "maths", topic: "Shapes", type: "MCQ", difficulty: "Easy", marks: 1, q: "How many sides does a square have?", options: ["2", "3", "4", "5"], ans: "4", explanation: "A square has 4 equal sides.", solution: "4 equal sides." },
    { id: "q-c1-en-3", chapterId: "ch-c1-ncert-en-eng-1", bookId: "tb-c1-ncert-en-eng", board: "NCERT", medium: "EN", classNum: "1", subjectId: "english", topic: "Body Parts", type: "MCQ", difficulty: "Easy", marks: 1, q: "We clap with our ___.", options: ["Hands", "Ears", "Nose", "Eyes"], ans: "Hands", explanation: "We clap our two little hands.", solution: "Hands." },

    // Class 5 CBSE EN Questions (Rich bank for Practice & 20-Q Mock!)
    { id: "q-c5-m1-1", chapterId: "ch-c5-cbse-en-math-1", bookId: "tb-c5-cbse-en-math", board: "CBSE", medium: "EN", classNum: "5", subjectId: "maths", topic: "Place Value", type: "MCQ", difficulty: "Easy", marks: 1, q: "How many thousands make 1 Lakh?", options: ["10", "100", "1,000", "10,000"], ans: "100", explanation: "100 × 1,000 = 1,00,000 (1 Lakh).", solution: "100 thousands make 1 Lakh." },
    { id: "q-c5-m1-2", chapterId: "ch-c5-cbse-en-math-1", bookId: "tb-c5-cbse-en-math", board: "CBSE", medium: "EN", classNum: "5", subjectId: "maths", topic: "Large Numbers", type: "MCQ", difficulty: "Medium", marks: 1, q: "What is the smallest 6-digit number?", options: ["10,000", "99,999", "1,00,000", "1,00,001"], ans: "1,00,000", explanation: "99,999 + 1 = 1,00,000, which is the smallest 6-digit number.", solution: "1,00,000." },
    { id: "q-c5-m1-3", chapterId: "ch-c5-cbse-en-math-1", bookId: "tb-c5-cbse-en-math", board: "CBSE", medium: "EN", classNum: "5", subjectId: "maths", topic: "Travel Math", type: "MCQ", difficulty: "Medium", marks: 1, q: "A train travels 425 km on Monday and 389 km on Tuesday. Total distance travelled?", options: ["804 km", "814 km", "714 km", "824 km"], ans: "814 km", explanation: "425 + 389 = 814 km.", solution: "Step 1: 425 + 389 = 814 km." },
    { id: "q-c5-m1-4", chapterId: "ch-c5-cbse-en-math-1", bookId: "tb-c5-cbse-en-math", board: "CBSE", medium: "EN", classNum: "5", subjectId: "maths", topic: "Place Value", type: "FILL", difficulty: "Easy", marks: 1, q: "The place value of 7 in 4,72,510 is ___.", options: [], ans: "70000", explanation: "7 is in the Ten Thousands place, so 7 × 10,000 = 70,000.", solution: "70,000 (or 70000)." },
    { id: "q-c5-m2-1", chapterId: "ch-c5-cbse-en-math-2", bookId: "tb-c5-cbse-en-math", board: "CBSE", medium: "EN", classNum: "5", subjectId: "maths", topic: "Fractions", type: "MCQ", difficulty: "Easy", marks: 1, q: "In the fraction 3/7, what is 3 called?", options: ["Denominator", "Numerator", "Quotient", "Remainder"], ans: "Numerator", explanation: "The top number in a fraction is the Numerator.", solution: "Numerator." },
    { id: "q-c5-m2-2", chapterId: "ch-c5-cbse-en-math-2", bookId: "tb-c5-cbse-en-math", board: "CBSE", medium: "EN", classNum: "5", subjectId: "maths", topic: "Equivalent Fractions", type: "MCQ", difficulty: "Medium", marks: 1, q: "Which fraction is equivalent to 1/2?", options: ["2/5", "3/6", "3/5", "4/6"], ans: "3/6", explanation: "(1×3)/(2×3) = 3/6.", solution: "3/6." },
    { id: "q-c5-m2-3", chapterId: "ch-c5-cbse-en-math-2", bookId: "tb-c5-cbse-en-math", board: "CBSE", medium: "EN", classNum: "5", subjectId: "maths", topic: "Comparing Fractions", type: "MCQ", difficulty: "Medium", marks: 1, q: "Which fraction is the largest among 1/2, 1/4, 1/6, 1/8?", options: ["1/8", "1/6", "1/4", "1/2"], ans: "1/2", explanation: "With the same numerator (1), the smallest denominator gives the largest fraction.", solution: "1/2." },
    { id: "q-c5-m2-4", chapterId: "ch-c5-cbse-en-math-2", bookId: "tb-c5-cbse-en-math", board: "CBSE", medium: "EN", classNum: "5", subjectId: "maths", topic: "Fractions", type: "TF", difficulty: "Easy", marks: 1, q: "5/5 is equal to 1 whole. (True or False)", options: ["True", "False"], ans: "True", explanation: "Any non-zero number divided by itself equals 1.", solution: "True." },
    { id: "q-c5-evs-1", chapterId: "ch-c5-cbse-en-evs-1", bookId: "tb-c5-cbse-en-evs", board: "CBSE", medium: "EN", classNum: "5", subjectId: "evs", topic: "Water Cycle", type: "MCQ", difficulty: "Easy", marks: 1, q: "The process of water changing into water vapour on heating is called:", options: ["Condensation", "Evaporation", "Freezing", "Filtration"], ans: "Evaporation", explanation: "Heat turns liquid water into vapour through evaporation.", solution: "Evaporation." }
  ];

  const games = [
    { id: "game-c1-count", classNum: "1", subjectId: "maths", chapterId: "ch-c1-mp-hi-math-1", title: "गिनो और चुनो / Count & Tap Shapes", gameType: "count_shapes", instructions: "Count the objects or pick the matching shape!", rewardCoins: 15 },
    { id: "game-c1-en-count", classNum: "1", subjectId: "maths", chapterId: "ch-c1-ncert-en-math-1", title: "Shape & Count Safari", gameType: "count_shapes", instructions: "Count the stars and match the right shape!", rewardCoins: 15 },
    { id: "game-c5-frac", classNum: "5", subjectId: "maths", chapterId: "ch-c5-cbse-en-math-2", title: "Fraction Equivalence Sprint", gameType: "fraction_match", instructions: "Match equivalent fractions and compare halves & quarters!", rewardCoins: 25 }
  ];

  return { textbooks, chapters, questions, games };
}
