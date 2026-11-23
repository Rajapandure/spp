// Complete 2026-27 Official Chapter Lists across Classes 1-10 (NCERT, CBSE, MP Board; EN & HI)
// Official references: ncert.nic.in/textbook.php & mpbse.nic.in

const CHAPTER_CATALOG = {
  "1": {
    maths: {
      enBook: "Joyful Mathematics (Class 1)", hiBook: "आनंदमय गणित (कक्षा 1)",
      en: ["1. Finding the Furry Cat! (Pre-number & Shapes)", "2. What is Long? What is Round?", "3. Mango Treat (Numbers 1 to 9)", "4. Making 10 (Number 10 & Zero)", "5. How Many? (Addition up to 9)", "6. Vegetable Farm (Addition & Subtraction up to 20)", "7. Lina's Family (Measurement)", "8. Fun with Numbers (21 to 99)", "9. Utsav (Patterns)", "10. How do I Spend my Day? (Time)", "11. How Many Times? (Multiplication Readiness)", "12. How Much Can We Spend? (Money)"],
      hi: ["1. आकृतियाँ और स्थान", "2. लंबा क्या, गोल क्या?", "3. आम की दावत (1 से 9 तक गिनती)", "4. दस बनाना (शून्य और 10)", "5. कितने हैं? (जोड़)", "6. सब्जी का खेत (जोड़ और घटाव)", "7. लीना का परिवार (मापन)", "8. संख्याओं से खेल (21 से 99)", "9. उत्सव (पैटर्न)", "10. समय और दिनचर्या", "11. कितनी बार? (गुणा की समझ)", "12. रुपये और पैसे"]
    },
    english: {
      enBook: "Mridang (Class 1 English)", hiBook: "Mridang / English Reader (Class 1)",
      en: ["1. Two Little Hands", "2. Greetings", "3. Picture Time", "4. The Cap-seller and the Monkeys", "5. A Farm", "6. Fun with Pictures", "7. The Food We Eat", "8. The Four Seasons", "9. Anandi's Rainbow"],
      hi: ["1. Two Little Hands", "2. Greetings", "3. Picture Time", "4. The Cap-seller and the Monkeys", "5. A Farm", "6. Fun with Pictures", "7. The Food We Eat", "8. The Four Seasons", "9. Anandi's Rainbow"]
    },
    hindi: {
      enBook: "Sarangi (Class 1 Hindi)", hiBook: "सारंगी / भाषा भारती (कक्षा 1)",
      en: ["1. मीना का परिवार", "2. दादा-दादी", "3. रीना का दिन", "4. रानी भी", "5. मिठाई", "6. तीन साथी", "7. वाह, मेरे घोड़े!", "8. खतरे में साँप", "9. आलू की सड़क", "10. झूलम-झूली"],
      hi: ["1. मीना का परिवार", "2. दादा-दादी", "3. रीना का दिन", "4. रानी भी", "5. मिठाई", "6. तीन साथी", "7. वाह, मेरे घोड़े!", "8. खतरे में साँप", "9. आलू की सड़क", "10. झूलम-झूली"]
    }
  },
  "2": {
    maths: {
      enBook: "Joyful Mathematics (Class 2)", hiBook: "आनंदमय गणित (कक्षा 2)",
      en: ["1. A Day at the Beach (Counting in Tens)", "2. Shapes Around Us", "3. Fun with Numbers (up to 100)", "4. Shadow Story (2D Shapes)", "5. Playing with Lines", "6. Decoration for Festival (Addition & Subtraction)", "7. Rani's Gift (Measurement)", "8. Grouping and Sharing", "9. Which Season is it? (Calendar)", "10. Fun at the Fair (Money)", "11. Data Handling"],
      hi: ["1. समुद्र तट पर एक दिन (दहाई में गिनती)", "2. हमारे आस-पास की आकृतियाँ", "3. संख्याओं के साथ मज़ा", "4. परछाई की कहानी", "5. रेखाओं से खेल", "6. त्योहार की सजावट (जोड़-घटाव)", "7. रानी का उपहार (मापन)", "8. समूह बनाना और बाँटना", "9. कौन-सा मौसम है? (कैलेंडर)", "10. मेले में मज़ा (मुद्रा)", "11. आँकड़ों का प्रबंधन"]
    },
    english: {
      enBook: "Mridang (Class 2 English)", hiBook: "English Reader (Class 2)",
      en: ["1. My Bicycle", "2. Picture Reading", "3. It is Fun", "4. Seeing without Seeing", "5. Come Back Soon", "6. Between Home and School", "7. This is My Town", "8. A Show of Clouds", "9. My Name"],
      hi: ["1. My Bicycle", "2. Picture Reading", "3. It is Fun", "4. Seeing without Seeing", "5. Come Back Soon", "6. Between Home and School", "7. This is My Town", "8. A Show of Clouds", "9. My Name"]
    },
    hindi: {
      enBook: "Sarangi (Class 2 Hindi)", hiBook: "सारंगी / भाषा भारती (कक्षा 2)",
      en: ["1. नीमा की दादी", "2. घर", "3. माला की चाँदी की पायल", "4. माँ", "5. थाथू और मैं", "6. चींटा", "7. टिल्लू जी", "8. तीन दोस्त", "9. दुनिया रंग-बिरंगी"],
      hi: ["1. नीमा की दादी", "2. घर", "3. माला की चाँदी की पायल", "4. माँ", "5. थाथू और मैं", "6. चींटा", "7. टिल्लू जी", "8. तीन दोस्त", "9. दुनिया रंग-बिरंगी"]
    }
  },
  "3": {
    maths: {
      enBook: "Maths Mela (Class 3)", hiBook: "गणित मेला (कक्षा 3)",
      en: ["1. What's in a Name?", "2. Toy Joy", "3. Double Century", "4. Vacation with My Nani Maa", "5. Fun with Shapes", "6. House of Hundreds - I", "7. Raksha Bandhan", "8. Fair Share (Fractions)", "9. House of Hundreds - II", "10. Fun at Class Party", "11. Filling and Lifting", "12. Give and Take", "13. Time Goes On", "14. The Surajkund Fair"],
      hi: ["1. नाम में क्या है?", "2. खिलौनों का आनंद", "3. दोहरा शतक", "4. नानी माँ के साथ छुट्टियाँ", "5. आकृतियों का मज़ा", "6. सैकड़ों का घर - I", "7. रक्षा बंधन", "8. बराबर बँटवारा", "9. सैकड़ों का घर - II", "10. कक्षा की पार्टी", "11. भरना और उठाना", "12. लेना और देना", "13. समय चलता जाता है", "14. सूरजकुंड का मेला"]
    },
    english: {
      enBook: "Santoor (Class 3 English)", hiBook: "English Reader (Class 3)",
      en: ["1. Colours", "2. Badal and Moti", "3. Best Friends", "4. Out in the Garden", "5. Talking Toys", "6. Paper Boats", "7. The Big Laddoo", "8. Thank God", "9. Madhu's Wish"],
      hi: ["1. Colours", "2. Badal and Moti", "3. Best Friends", "4. Out in the Garden", "5. Talking Toys", "6. Paper Boats", "7. The Big Laddoo", "8. Thank God", "9. Madhu's Wish"]
    },
    hindi: {
      enBook: "Veena (Class 3 Hindi)", hiBook: "वीणा / भाषा भारती (कक्षा 3)",
      en: ["1. सीखो", "2. चींटी", "3. कितने पैर?", "4. बया हमारी चिड़िया रानी", "5. आम का पेड़", "6. बीरबल की खिचड़ी", "7. मित्र को पत्र", "8. चतुर गीदड़"],
      hi: ["1. सीखो", "2. चींटी", "3. कितने पैर?", "4. बया हमारी चिड़िया रानी", "5. आम का पेड़", "6. बीरबल की खिचड़ी", "7. मित्र को पत्र", "8. चतुर गीदड़"]
    },
    evs: {
      enBook: "Our Wondrous World (Class 3 EVS)", hiBook: "पर्यावरण अध्ययन (कक्षा 3)",
      en: ["1. Family and Friends", "2. Going to the Mela", "3. Celebrating Festivals", "4. Getting to Know Plants", "5. Plants and Animals Live Together", "6. Living in Harmony", "7. Water — A Precious Gift", "8. Food We Eat", "9. Staying Healthy and Happy"],
      hi: ["1. परिवार और मित्र", "2. मेले की सैर", "3. त्योहार मनाना", "4. पौधों को जानें", "5. पौधे और जंतु साथ-साथ", "6. प्रकृति के साथ तालमेल", "7. जल — अमूल्य उपहार", "8. हमारा भोजन", "9. स्वस्थ और प्रसन्न रहना"]
    }
  },
  "4": {
    maths: {
      enBook: "Maths Mela (Class 4)", hiBook: "गणित मेला (कक्षा 4)",
      en: ["1. Shapes Around Us", "2. Hide and Seek", "3. Patterns Around Us", "4. Thousands Around Us", "5. Sharing and Measuring", "6. Measuring Length", "7. The Cleanest Village", "8. Weigh it, Pour it", "9. Equal Groups", "10. Elephants, Tigers, and Leopards", "11. Fun with Symmetry", "12. Ticking Clocks and Turning Calendar"],
      hi: ["1. हमारे आस-पास की आकृतियाँ", "2. लुका-छिपी", "3. हमारे आस-पास के पैटर्न", "4. हजारों की संख्याएँ", "5. बाँटना और मापना", "6. लंबाई का मापन", "7. सबसे स्वच्छ गाँव", "8. तौलना और मापना", "9. बराबर समूह", "10. हाथी, बाघ और तेंदुआ", "11. सममिति का आनंद", "12. घड़ी और कैलेंडर"]
    },
    english: {
      enBook: "Santoor (Class 4 English)", hiBook: "English Reader (Class 4)",
      en: ["1. Together We Can", "2. The Tinkling Bells", "3. Be Smart, Be Safe", "4. One Thing at a Time", "5. The Old Stag", "6. Braille", "7. Fit Body, Fit Mind, Fit Nation", "8. The Lagori Champions"],
      hi: ["1. Together We Can", "2. The Tinkling Bells", "3. Be Smart, Be Safe", "4. One Thing at a Time", "5. The Old Stag", "6. Braille", "7. Fit Body, Fit Mind, Fit Nation", "8. The Lagori Champions"]
    },
    hindi: {
      enBook: "Veena (Class 4 Hindi)", hiBook: "वीणा / भाषा भारती (कक्षा 4)",
      en: ["1. चिड़िया का गीत", "2. बगीचे का घोंघा", "3. नीम का पेड़", "4. नकली हीरे", "5. अपना गाँव", "6. आसमान में महल", "7. भारत की नदियाँ", "8. समय का मोल"],
      hi: ["1. चिड़िया का गीत", "2. बगीचे का घोंघा", "3. नीम का पेड़", "4. नकली हीरे", "5. अपना गाँव", "6. आसमान में महल", "7. भारत की नदियाँ", "8. समय का मोल"]
    },
    evs: {
      enBook: "Our Wondrous World (Class 4 EVS)", hiBook: "पर्यावरण अध्ययन (कक्षा 4)",
      en: ["1. Living Together", "2. Exploring Our Neighbourhood", "3. Nature Trail", "4. Growing Up with Nature", "5. Food for All", "6. Happy and Healthy Living", "7. How Things Work", "8. Our Sky"],
      hi: ["1. साथ-साथ रहना", "2. हमारा पड़ोस", "3. प्रकृति की सैर", "4. प्रकृति के साथ बढ़ना", "5. सबके लिए भोजन", "6. स्वस्थ जीवन", "7. चीजें कैसे काम करती हैं", "8. हमारा आकाश"]
    }
  },
  "5": {
    maths: {
      enBook: "Maths Mela (Class 5)", hiBook: "गणित मेला (कक्षा 5)",
      en: ["1. We the Travellers - I", "2. Fractions", "3. Angles as Turns", "4. We the Travellers - II", "5. Far and Near", "6. The Dairy Farm", "7. Shapes and Patterns", "8. Weight and Capacity", "9. Coconut Farm", "10. Symmetrical Designs", "11. Grandmother's Quilt", "12. Racing Seconds", "13. Animal Jumps", "14. Maps and Locations", "15. Data Through Pictures"],
      hi: ["1. हम यात्री - I", "2. भिन्न", "3. घुमाव के रूप में कोण", "4. हम यात्री - II", "5. दूर और पास", "6. डेयरी फार्म", "7. आकृतियाँ और पैटर्न", "8. भार और धारिता", "9. नारियल का खेत", "10. सममित डिज़ाइन", "11. दादी माँ की रजाई", "12. दौड़ते सेकंड", "13. जानवरों की छलाँग", "14. नक्शे और स्थान", "15. चित्रों द्वारा आँकड़े"]
    },
    english: {
      enBook: "Santoor (Class 5 English)", hiBook: "English Reader (Class 5)",
      en: ["1. Papa's Spectacles", "2. Gone with the Scooter", "3. The Rainbow", "4. The Wise Parrot", "5. The Frog", "6. What a Tank!", "7. Gilli Danda", "8. The Decision of the Panchayat"],
      hi: ["1. Papa's Spectacles", "2. Gone with the Scooter", "3. The Rainbow", "4. The Wise Parrot", "5. The Frog", "6. What a Tank!", "7. Gilli Danda", "8. The Decision of the Panchayat"]
    },
    hindi: {
      enBook: "Veena (Class 5 Hindi)", hiBook: "वीणा / भाषा भारती (कक्षा 5)",
      en: ["1. पुष्प की अभिलाषा", "2. ईदगाह", "3. हम सब सुमन एक उपवन के", "4. पन्ना का त्याग", "5. मैं हूँ इंद्रधनुष", "6. दोहे और नीति वचन", "7. कबीर की साखियाँ", "8. राष्ट्र गौरव"],
      hi: ["1. पुष्प की अभिलाषा", "2. ईदगाह", "3. हम सब सुमन एक उपवन के", "4. पन्ना का त्याग", "5. मैं हूँ इंद्रधनुष", "6. दोहे और नीति वचन", "7. कबीर की साखियाँ", "8. राष्ट्र गौरव"]
    },
    evs: {
      enBook: "Our Wondrous World (Class 5 EVS)", hiBook: "पर्यावरण अध्ययन (कक्षा 5)",
      en: ["1. Water — Our Precious Resource", "2. Journey of a River", "3. The Mystery of Food", "4. Our School — A Happy Place", "5. Rhythms of Nature", "6. Earth, Our Shared Home", "7. Energy — How Things Work", "8. Clothes We Wear"],
      hi: ["1. जल — हमारा अमूल्य संसाधन", "2. नदी की यात्रा", "3. भोजन का रहस्य", "4. हमारा विद्यालय", "5. प्रकृति की लय", "6. पृथ्वी — हमारा साझा घर", "7. ऊर्जा", "8. हमारे वस्त्र"]
    }
  },
  "6": {
    maths: {
      enBook: "Ganita Prakash (Class 6)", hiBook: "गणित प्रकाश (कक्षा 6)",
      en: ["1. Patterns in Mathematics", "2. Lines and Angles", "3. Number Play", "4. Data Handling and Presentation", "5. Prime Time", "6. Perimeter and Area", "7. Fractions", "8. Playing with Constructions", "9. Symmetry", "10. The Other Side of Zero"],
      hi: ["1. गणित में पैटर्न", "2. रेखाएँ और कोण", "3. संख्याओं का खेल", "4. आँकड़ों का प्रबंधन", "5. अभाज्य संख्याएँ", "6. परिमाप और क्षेत्रफल", "7. भिन्न", "8. रचनाओं के साथ खेल", "9. सममिति", "10. शून्य के दूसरी ओर (ऋणात्मक संख्याएँ)"]
    },
    science: {
      enBook: "Curiosity (Class 6 Science)", hiBook: "जिज्ञासा / विज्ञान (कक्षा 6)",
      en: ["1. The Wonderful World of Science", "2. Diversity in the Living World", "3. Mindful Eating: A Path to a Healthy Body", "4. Exploring Magnets", "5. Measurement of Length and Motion", "6. Materials Around Us", "7. Temperature and its Measurement", "8. A Journey through States of Water", "9. Methods of Separation in Everyday Life", "10. Living Creatures: Exploring their Characteristics", "11. Nature's Treasures", "12. Beyond Earth"],
      hi: ["1. विज्ञान की अद्भुत दुनिया", "2. सजीव जगत में विविधता", "3. उचित आहार: स्वस्थ शरीर का आधार", "4. चुंबकों को जानें", "5. लंबाई एवं गति का मापन", "6. हमारे आस-पास की सामग्री", "7. तापमान एवं उसका मापन", "8. जल की अवस्थाओं की यात्रा", "9. पृथक्करण की विधियाँ", "10. सजीवों के लक्षण", "11. प्रकृति के अमूल्य खजाने", "12. पृथ्वी से परे"]
    },
    social: {
      enBook: "Exploring Society: India and Beyond (Class 6)", hiBook: "सामाजिक विज्ञान (कक्षा 6)",
      en: ["1. Locating Places on the Earth", "2. Oceans and Continents", "3. Landforms and Life", "4. Timeline and Sources of History", "5. India, That Is Bharat", "6. The Beginnings of Indian Civilisation", "7. India's Cultural Roots", "8. Unity in Diversity", "9. Family and Community", "10. Grassroots Democracy — Governance"],
      hi: ["1. पृथ्वी पर स्थानों की स्थिति", "2. महासागर और महाद्वीप", "3. स्थलरूप और जीवन", "4. इतिहास की समयरेखा और स्रोत", "5. इंडिया, अर्थात भारत", "6. भारतीय सभ्यता का प्रारंभ", "7. भारत की सांस्कृतिक जड़ें", "8. विविधता में एकता", "9. परिवार और समुदाय", "10. स्थानीय स्वशासन"]
    },
    english: {
      enBook: "Poorvi (Class 6 English)", hiBook: "English Reader (Class 6)",
      en: ["1. A Bottle of Dew", "2. The Raven and the Fox", "3. Rama to the Rescue", "4. The Unlikely Best Friends", "5. A Friend's Prayer", "6. The Chair", "7. Neem Baba", "8. What a Bird Thought"],
      hi: ["1. A Bottle of Dew", "2. The Raven and the Fox", "3. Rama to the Rescue", "4. The Unlikely Best Friends", "5. A Friend's Prayer", "6. The Chair", "7. Neem Baba", "8. What a Bird Thought"]
    },
    hindi: {
      enBook: "Malhar (Class 6 Hindi)", hiBook: "मल्हार / भाषा भारती (कक्षा 6)",
      en: ["1. मातृभूमि", "2. गोल", "3. पहली बूँद", "4. हार की जीत", "5. रहीम के दोहे", "6. मेरी माँ", "7. जलाते चलो", "8. सत्रिया और बिहू नृत्य"],
      hi: ["1. मातृभूमि", "2. गोल", "3. पहली बूँद", "4. हार की जीत", "5. रहीम के दोहे", "6. मेरी माँ", "7. जलाते चलो", "8. सत्रिया और बिहू नृत्य"]
    },
    sanskrit: {
      enBook: "Deepakam (Class 6 Sanskrit)", hiBook: "दीपकम् / संस्कृत (कक्षा 6)",
      en: ["1. वयं वर्णमाला पठामः", "2. एषः कः ? एषा का ?", "3. अहं च त्वं च", "4. अहं प्रातः उत्तिष्ठामि", "5. शूराः वयं धीराः वयम्", "6. सः एव महान् चित्रकारः"],
      hi: ["1. वयं वर्णमाला पठामः", "2. एषः कः ? एषा का ?", "3. अहं च त्वं च", "4. अहं प्रातः उत्तिष्ठामि", "5. शूराः वयं धीराः वयम्", "6. सः एव महान् चित्रकारः"]
    }
  },
  "7": {
    maths: {
      enBook: "Ganita Prakash (Class 7)", hiBook: "गणित प्रकाश (कक्षा 7)",
      en: ["1. Large Numbers Around Us", "2. Arithmetic Expressions", "3. A Peek Beyond the Point (Decimals)", "4. Expressions using Letter-Numbers", "5. Parallel and Intersecting Lines", "6. Number Play", "7. A Tale of Three Intersecting Lines (Triangles)", "8. Working with Fractions"],
      hi: ["1. हमारे आस-पास की बड़ी संख्याएँ", "2. अंकगणितीय व्यंजक", "3. दशमलव की समझ", "4. बीजीय व्यंजक", "5. समांतर और प्रतिच्छेदी रेखाएँ", "6. संख्याओं का खेल", "7. त्रिभुज के गुण", "8. भिन्नों के साथ संक्रियाएँ"]
    },
    science: {
      enBook: "Curiosity (Class 7 Science)", hiBook: "विज्ञान (कक्षा 7)",
      en: ["1. The Ever-Evolving World of Science", "2. Exploring Substances: Acidic, Basic, and Neutral", "3. Electricity: Circuits and their Components", "4. The World of Metals and Non-metals", "5. Changes Around Us: Physical and Chemical", "6. Adolescence: A Stage of Growth", "7. Heat Transfer in Nature", "8. Measurement of Time and Motion", "9. Life Processes in Animals", "10. Life Processes in Plants", "11. Light: Shadows and Reflections", "12. Earth, Moon, and the Sun"],
      hi: ["1. विज्ञान की बदलती दुनिया", "2. अम्ल, क्षार और लवण", "3. विद्युत परिपथ और घटक", "4. धातु और अधातु", "5. भौतिक एवं रासायनिक परिवर्तन", "6. किशोरावस्था", "7. ऊष्मा का स्थानांतरण", "8. समय और गति का मापन", "9. जंतुओं में जैव प्रक्रम", "10. पादपों में जैव प्रक्रम", "11. प्रकाश: छाया और परावर्तन", "12. पृथ्वी, चंद्रमा और सूर्य"]
    },
    social: {
      enBook: "Exploring Society (Class 7 Social Science)", hiBook: "सामाजिक विज्ञान (कक्षा 7)",
      en: ["1. Geographical Diversity of India", "2. Understanding the Weather", "3. Climates of India", "4. New Beginnings: Cities and States", "5. The Rise of Empires", "6. The Age of Reorganisation", "7. From the Rulers to the Ruled: Types of Governments", "8. The Constitution of India"],
      hi: ["1. भारत की भौगोलिक विविधता", "2. मौसम को समझना", "3. भारत की जलवायु", "4. नगर और राज्य", "5. साम्राज्यों का उदय", "6. पुनर्गठन का युग", "7. शासन के प्रकार", "8. भारत का संविधान"]
    },
    english: {
      enBook: "Poorvi (Class 7 English)", hiBook: "English Reader (Class 7)",
      en: ["1. The Day the River Spoke", "2. Try Again", "3. Three Days to See", "4. Animals, Birds, and Dr. Dolittle", "5. A Funny Man", "6. Say the Right Thing", "7. My Brother's Great Invention", "8. Paper Boats"],
      hi: ["1. The Day the River Spoke", "2. Try Again", "3. Three Days to See", "4. Animals, Birds, and Dr. Dolittle", "5. A Funny Man", "6. Say the Right Thing", "7. My Brother's Great Invention", "8. Paper Boats"]
    },
    hindi: {
      enBook: "Malhar (Class 7 Hindi)", hiBook: "मल्हार / भाषा भारती (कक्षा 7)",
      en: ["1. माँ, कह एक कहानी", "2. तीन बुद्धिमान", "3. फूल और काँटा", "4. पानी की कहानी", "5. नहीं होना बीमार", "6. गिरिधर की कुंडलियाँ", "7. वर्षा बहार", "8. बिरसा मुंडा"],
      hi: ["1. माँ, कह एक कहानी", "2. तीन बुद्धिमान", "3. फूल और काँटा", "4. पानी की कहानी", "5. नहीं होना बीमार", "6. गिरिधर की कुंडलियाँ", "7. वर्षा बहार", "8. बिरसा मुंडा"]
    },
    sanskrit: {
      enBook: "Deepakam (Class 7 Sanskrit)", hiBook: "संस्कृत (कक्षा 7)",
      en: ["1. वयं प्रहसन्तः पठामः", "2. न हि ज्ञानेन सदृशं पवित्रमिह विद्यते", "3. कः श्रेष्ठः", "4. वर्षागीतम्", "5. सङ्गच्छध्वं संवदध्वम्"],
      hi: ["1. वयं प्रहसन्तः पठामः", "2. न हि ज्ञानेन सदृशं पवित्रमिह विद्यते", "3. कः श्रेष्ठः", "4. वर्षागीतम्", "5. सङ्गच्छध्वं संवदध्वम्"]
    }
  },
  "8": {
    maths: {
      enBook: "Ganita Prakash (Class 8)", hiBook: "गणित (कक्षा 8)",
      en: ["1. Rational Numbers", "2. Linear Equations in One Variable", "3. Understanding Quadrilaterals", "4. Data Handling", "5. Squares and Square Roots", "6. Cubes and Cube Roots", "7. Comparing Quantities", "8. Algebraic Expressions and Identities", "9. Mensuration", "10. Exponents and Powers", "11. Direct and Inverse Proportions", "12. Factorisation"],
      hi: ["1. परिमेय संख्याएँ", "2. एक चर वाले रैखिक समीकरण", "3. चतुर्भुजों को समझना", "4. आँकड़ों का प्रबंधन", "5. वर्ग और वर्गमूल", "6. घन और घनमूल", "7. राशियों की तुलना", "8. बीजीय व्यंजक एवं सर्वसमिकाएँ", "9. क्षेत्रमिति", "10. घातांक और घात", "11. सीधा और प्रतिलोम समानुपात", "12. गुणनखंडन"]
    },
    science: {
      enBook: "Curiosity (Class 8 Science)", hiBook: "विज्ञान (कक्षा 8)",
      en: ["1. Crop Production and Management", "2. Microorganisms: Friend and Foe", "3. Coal and Petroleum", "4. Combustion and Flame", "5. Conservation of Plants and Animals", "6. Reproduction in Animals", "7. Force and Pressure", "8. Friction", "9. Sound", "10. Chemical Effects of Electric Current", "11. Some Natural Phenomena", "12. Light"],
      hi: ["1. फसल उत्पादन एवं प्रबंध", "2. सूक्ष्मजीव: मित्र एवं शत्रु", "3. कोयला और पेट्रोलियम", "4. दहन और ज्वाला", "5. पौधे एवं जंतुओं का संरक्षण", "6. जंतुओं में जनन", "7. बल तथा दाब", "8. घर्षण", "9. ध्वनि", "10. विद्युत धारा के रासायनिक प्रभाव", "11. कुछ प्राकृतिक परिघटनाएँ", "12. प्रकाश"]
    },
    social: {
      enBook: "Exploring Society (Class 8 Social Science)", hiBook: "सामाजिक विज्ञान (कक्षा 8)",
      en: ["1. Resources", "2. Land, Soil, Water, Natural Vegetation", "3. Agriculture", "4. Industries", "5. Human Resources", "6. How, When and Where", "7. The Indian Constitution", "8. Parliament and Law Making"],
      hi: ["1. संसाधन", "2. भूमि, मृदा, जल और प्राकृतिक वनस्पति", "3. कृषि", "4. उद्योग", "5. मानव संसाधन", "6. कैसे, कब और कहाँ", "7. भारतीय संविधान", "8. संसद और कानून निर्माण"]
    },
    english: {
      enBook: "Poorvi / English Reader (Class 8)", hiBook: "English Reader (Class 8)",
      en: ["1. Another Chance", "2. Thrills of Kanha Kisli", "3. The Ungrateful Jeweller", "4. Trees Our Saviours", "5. The Miser and His Gold", "6. Measure for Measure", "7. Water, Water Everywhere"],
      hi: ["1. Another Chance", "2. Thrills of Kanha Kisli", "3. The Ungrateful Jeweller", "4. Trees Our Saviours", "5. The Miser and His Gold", "6. Measure for Measure", "7. Water, Water Everywhere"]
    },
    hindi: {
      enBook: "Malhar / Bhasha Bharti (Class 8)", hiBook: "भाषा भारती (कक्षा 8 - म.प्र. बोर्ड)",
      en: ["1. वर दे", "2. आत्मविश्वास", "3. मध्यप्रदेश की संगीत विरासत", "4. अपराजिता", "5. श्री मुफ़्तानंद जी से मिलिए", "6. भक्ति के पद", "7. भेड़ाघाट", "8. बिरसा मुंडा"],
      hi: ["1. वर दे", "2. आत्मविश्वास", "3. मध्यप्रदेश की संगीत विरासत", "4. अपराजिता", "5. श्री मुफ़्तानंद जी से मिलिए", "6. भक्ति के पद", "7. भेड़ाघाट", "8. बिरसा मुंडा"]
    },
    sanskrit: {
      enBook: "Deepakam / Sanskrit (Class 8)", hiBook: "संस्कृत (कक्षा 8)",
      en: ["1. लोकहितं मम करणीयम्", "2. कालज्ञो वराहमिहिरः", "3. गणतन्त्रदिवसः", "4. नीतिश्लोकाः", "5. अहम् ओरछा अस्मि"],
      hi: ["1. लोकहितं मम करणीयम्", "2. कालज्ञो वराहमिहिरः", "3. गणतन्त्रदिवसः", "4. नीतिश्लोकाः", "5. अहम् ओरछा अस्मि"]
    }
  },
  "9": {
    maths: {
      enBook: "Ganita Manjari / Mathematics (Class 9)", hiBook: "गणित (कक्षा 9)",
      en: ["1. Number Systems", "2. Polynomials", "3. Coordinate Geometry", "4. Linear Equations in Two Variables", "5. Introduction to Euclid's Geometry", "6. Lines and Angles", "7. Triangles", "8. Quadrilaterals", "9. Circles", "10. Heron's Formula", "11. Surface Areas and Volumes", "12. Statistics"],
      hi: ["1. संख्या पद्धति", "2. बहुपद", "3. निर्देशांक ज्यामिति", "4. दो चरों वाले रैखिक समीकरण", "5. यूक्लिड की ज्यामिति का परिचय", "6. रेखाएँ और कोण", "7. त्रिभुज", "8. चतुर्भुज", "9. वृत्त", "10. हीरोन का सूत्र", "11. पृष्ठीय क्षेत्रफल और आयतन", "12. सांख्यिकी"]
    },
    science: {
      enBook: "Exploration / Science (Class 9)", hiBook: "विज्ञान (कक्षा 9)",
      en: ["1. Matter in Our Surroundings", "2. Is Matter Around Us Pure?", "3. Atoms and Molecules", "4. Structure of the Atom", "5. The Fundamental Unit of Life", "6. Tissues", "7. Motion", "8. Force and Laws of Motion", "9. Gravitation", "10. Work and Energy", "11. Sound", "12. Improvement in Food Resources"],
      hi: ["1. हमारे आस-पास के पदार्थ", "2. क्या हमारे आस-पास के पदार्थ शुद्ध हैं?", "3. परमाणु एवं अणु", "4. परमाणु की संरचना", "5. जीवन की मौलिक इकाई", "6. ऊतक", "7. गति", "8. बल तथा गति के नियम", "9. गुरुत्वाकर्षण", "10. कार्य तथा ऊर्जा", "11. ध्वनि", "12. खाद्य संसाधनों में सुधार"]
    },
    social: {
      enBook: "Understanding Society (Class 9 Social Science)", hiBook: "सामाजिक विज्ञान (कक्षा 9)",
      en: ["1. India — Size and Location", "2. Physical Features of India", "3. Drainage", "4. Climate", "5. The French Revolution", "6. Socialism in Europe and the Russian Revolution", "7. What is Democracy? Why Democracy?", "8. Constitutional Design"],
      hi: ["1. भारत — आकार और स्थिति", "2. भारत का भौतिक स्वरूप", "3. अपवाह", "4. जलवायु", "5. फ्रांसीसी क्रांति", "6. यूरोप में समाजवाद एवं रूसी क्रांति", "7. लोकतंत्र क्या? लोकतंत्र क्यों?", "8. संविधान निर्माण"]
    },
    english: {
      enBook: "Kaveri / Beehive (Class 9 English)", hiBook: "Beehive (Class 9 English)",
      en: ["1. The Fun They Had", "2. The Sound of Music", "3. The Little Girl", "4. A Truly Beautiful Mind", "5. The Snake and the Mirror", "6. My Childhood", "7. Reach for the Top", "8. Kathmandu", "9. If I Were You"],
      hi: ["1. The Fun They Had", "2. The Sound of Music", "3. The Little Girl", "4. A Truly Beautiful Mind", "5. The Snake and the Mirror", "6. My Childhood", "7. Reach for the Top", "8. Kathmandu", "9. If I Were You"]
    },
    hindi: {
      enBook: "Ganga / Kshitij (Class 9 Hindi)", hiBook: "क्षितिज भाग-1 (कक्षा 9 हिन्दी)",
      en: ["1. दो बैलों की कथा", "2. ल्हासा की ओर", "3. उपभोक्तावाद की संस्कृति", "4. साँवले सपनों की याद", "5. प्रेमचंद के फटे जूते", "6. मेरे बचपन के दिन", "7. कबीर की साखियाँ एवं सबद", "8. वाख (ललद्यद)"],
      hi: ["1. दो बैलों की कथा", "2. ल्हासा की ओर", "3. उपभोक्तावाद की संस्कृति", "4. साँवले सपनों की याद", "5. प्रेमचंद के फटे जूते", "6. मेरे बचपन के दिन", "7. कबीर की साखियाँ एवं सबद", "8. वाख (ललद्यद)"]
    },
    sanskrit: {
      enBook: "Shemushi Part I (Class 9 Sanskrit)", hiBook: "शेमुषी भाग-1 (कक्षा 9 संस्कृत)",
      en: ["1. भारतीवसन्तगीतिः", "2. स्वर्णकाकः", "3. गोदोहनम्", "4. सूक्तिमौक्तिकम्", "5. भ्रान्तो बालः"],
      hi: ["1. भारतीवसन्तगीतिः", "2. स्वर्णकाकः", "3. गोदोहनम्", "4. सूक्तिमौक्तिकम्", "5. भ्रान्तो बालः"]
    }
  },
  "10": {
    maths: {
      enBook: "Mathematics (Class 10)", hiBook: "गणित (कक्षा 10)",
      en: ["1. Real Numbers", "2. Polynomials", "3. Pair of Linear Equations in Two Variables", "4. Quadratic Equations", "5. Arithmetic Progressions", "6. Triangles", "7. Coordinate Geometry", "8. Introduction to Trigonometry", "9. Some Applications of Trigonometry", "10. Circles", "11. Areas Related to Circles", "12. Surface Areas and Volumes", "13. Statistics", "14. Probability"],
      hi: ["1. वास्तविक संख्याएँ", "2. बहुपद", "3. दो चर वाले रैखिक समीकरण युग्म", "4. द्विघात समीकरण", "5. समांतर श्रेढ़ियाँ", "6. त्रिभुज", "7. निर्देशांक ज्यामिति", "8. त्रिकोणमिति का परिचय", "9. त्रिकोणमिति के कुछ अनुप्रयोग", "10. वृत्त", "11. वृत्तों से संबंधित क्षेत्रफल", "12. पृष्ठीय क्षेत्रफल और आयतन", "13. सांख्यिकी", "14. प्रायिकता"]
    },
    science: {
      enBook: "Science (Class 10)", hiBook: "विज्ञान (कक्षा 10)",
      en: ["1. Chemical Reactions and Equations", "2. Acids, Bases and Salts", "3. Metals and Non-metals", "4. Carbon and Its Compounds", "5. Life Processes", "6. Control and Coordination", "7. How do Organisms Reproduce?", "8. Heredity", "9. Light — Reflection and Refraction", "10. The Human Eye and the Colourful World", "11. Electricity", "12. Magnetic Effects of Electric Current", "13. Our Environment"],
      hi: ["1. रासायनिक अभिक्रियाएँ एवं समीकरण", "2. अम्ल, क्षारक एवं लवण", "3. धातु एवं अधातु", "4. कार्बन एवं उसके यौगिक", "5. जैव प्रक्रम", "6. नियंत्रण एवं समन्वय", "7. जीव जनन कैसे करते हैं?", "8. आनुवंशिकता", "9. प्रकाश — परावर्तन तथा अपवर्तन", "10. मानव नेत्र तथा रंगबिरंगा संसार", "11. विद्युत", "12. विद्युत धारा के चुंबकीय प्रभाव", "13. हमारा पर्यावरण"]
    },
    social: {
      enBook: "Contemporary India II & History (Class 10)", hiBook: "सामाजिक विज्ञान (कक्षा 10)",
      en: ["1. Resources and Development", "2. Forest and Wildlife Resources", "3. Water Resources", "4. Agriculture", "5. Minerals and Energy Resources", "6. Manufacturing Industries", "7. Lifelines of National Economy", "8. The Rise of Nationalism in Europe", "9. Nationalism in India", "10. Power-sharing", "11. Federalism", "12. Sectors of the Indian Economy"],
      hi: ["1. संसाधन एवं विकास", "2. वन एवं वन्य जीव संसाधन", "3. जल संसाधन", "4. कृषि", "5. खनिज तथा ऊर्जा संसाधन", "6. विनिर्माण उद्योग", "7. राष्ट्रीय अर्थव्यवस्था की जीवन रेखाएँ", "8. यूरोप में राष्ट्रवाद का उदय", "9. भारत में राष्ट्रवाद", "10. सत्ता की साझेदारी", "11. संघवाद", "12. भारतीय अर्थव्यवस्था के क्षेत्रक"]
    },
    english: {
      enBook: "First Flight (Class 10 English)", hiBook: "First Flight (Class 10 English)",
      en: ["1. A Letter to God", "2. Nelson Mandela: Long Walk to Freedom", "3. Two Stories about Flying", "4. From the Diary of Anne Frank", "5. Glimpses of India", "6. Mijbil the Otter", "7. Madam Rides the Bus", "8. The Sermon at Benares", "9. The Proposal"],
      hi: ["1. A Letter to God", "2. Nelson Mandela: Long Walk to Freedom", "3. Two Stories about Flying", "4. From the Diary of Anne Frank", "5. Glimpses of India", "6. Mijbil the Otter", "7. Madam Rides the Bus", "8. The Sermon at Benares", "9. The Proposal"]
    },
    hindi: {
      enBook: "Kshitij Part II (Class 10 Hindi)", hiBook: "क्षितिज भाग-2 (कक्षा 10 हिन्दी)",
      en: ["1. सूरदास के पद", "2. राम-लक्ष्मण-परशुराम संवाद", "3. आत्मकथ्य", "4. उत्साह और अट नहीं रही है", "5. नेताजी का चश्मा", "6. बालगोबिन भगत", "7. लखनवी अंदाज़", "8. एक कहानी यह भी"],
      hi: ["1. सूरदास के पद", "2. राम-लक्ष्मण-परशुराम संवाद", "3. आत्मकथ्य", "4. उत्साह और अट नहीं रही है", "5. नेताजी का चश्मा", "6. बालगोबिन भगत", "7. लखनवी अंदाज़", "8. एक कहानी यह भी"]
    },
    sanskrit: {
      enBook: "Shemushi Part II (Class 10 Sanskrit)", hiBook: "शेमुषी भाग-2 (कक्षा 10 संस्कृत)",
      en: ["1. शुचिपर्यावरणम्", "2. बुद्धिर्बलवती सदा", "3. शिशुलालनम्", "4. जननी तुल्यवत्सला", "5. सुभाषितानि", "6. सौहार्दं प्रकृतेः शोभा"],
      hi: ["1. शुचिपर्यावरणम्", "2. बुद्धिर्बलवती सदा", "3. शिशुलालनम्", "4. जननी तुल्यवत्सला", "5. सुभाषितानि", "6. सौहार्दं प्रकृतेः शोभा"]
    }
  }
};

const SUB_META = {
  maths: { en: "Mathematics", hi: "गणित", color: "#2563eb" },
  english: { en: "English", hi: "अंग्रेजी (English)", color: "#db2777" },
  hindi: { en: "Hindi (हिन्दी)", hi: "हिन्दी", color: "#ea580c" },
  evs: { en: "Environmental Studies", hi: "पर्यावरण अध्ययन", color: "#059669" },
  science: { en: "Science", hi: "विज्ञान", color: "#4f46e5" },
  social: { en: "Social Science", hi: "सामाजिक विज्ञान", color: "#d97706" },
  sanskrit: { en: "Sanskrit (संस्कृत)", hi: "संस्कृत", color: "#7c3aed" }
};


export function buildMathsChapterContent(classNum, medium, chTitle) {
  const c = Number(classNum);
  const isHi = medium === "HI";
  const title = chTitle.replace(/^\d+\.\s*/, "");
  const key = title.toLowerCase();
  const q = (en, hi, options, ans, explanation, topic) => ({
    q: isHi ? hi : en, options, ans, explanation, topic: topic || title
  });
  let concepts = [], examples = [], questions = [], topic = title;

  if (/coordinate|निर्देशांक|cartesian/.test(key)) {
    topic = "Coordinate Geometry";
    if (c >= 10) {
      concepts = [
        { term: "Distance Formula", def: "d = √[(x₂−x₁)²+(y₂−y₁)²]" },
        { term: "Section Formula", def: "For ratio m:n, P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))." },
        { term: "Area of Triangle", def: "½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|." }
      ];
      examples = [{ q: "Find the distance between A(2,3) and B(5,7).", a: "√[(5−2)²+(7−3)²] = √25 = 5 units." }];
      questions = [
        q("Distance between (0,0) and (3,4) is:", "(0,0) और (3,4) के बीच दूरी है:", ["3","4","5","7"], "5", "√(3²+4²)=5."),
        q("Distance between (1,2) and (4,6) is:", "(1,2) और (4,6) के बीच दूरी है:", ["3","4","5","6"], "5", "√(3²+4²)=5."),
        q("Midpoint of (2,4) and (6,8) is:", "(2,4) और (6,8) का मध्यबिंदु है:", ["(4,6)","(8,12)","(2,6)","(6,4)"], "(4,6)", "Average the x-coordinates and y-coordinates."),
        q("The point dividing (0,0) and (6,0) internally in ratio 1:2 is:", "(0,0) और (6,0) को 1:2 में बाँटने वाला बिंदु है:", ["(2,0)","(3,0)","(4,0)","(6,0)"], "(2,0)", "Section formula gives x=(1×6+2×0)/3=2 and y=0."),
        q("Distance of (−3,4) from the origin is:", "(−3,4) की मूल बिंदु से दूरी है:", ["3","4","5","7"], "5", "√[(-3)²+4²]=5."),
        q("The x-coordinate of every point on the y-axis is:", "y-अक्ष पर प्रत्येक बिंदु का x-निर्देशांक है:", ["0","1","−1","Depends on y"], "0", "Every point on the y-axis has x=0."),
        q("Area of triangle with vertices (0,0),(4,0),(0,3) is:", "(0,0),(4,0),(0,3) शीर्षों वाले त्रिभुज का क्षेत्रफल है:", ["6","7","12","24"], "6", "½×4×3=6 square units."),
        q("If the distance between two points is zero, the points are:", "यदि दो बिंदुओं के बीच दूरी शून्य है, तो वे हैं:", ["Coincident","Parallel","Perpendicular","On different axes"], "Coincident", "Both coordinates are equal.")
      ];
    } else {
      concepts = [
        { term: "Cartesian Plane", def: "The x-axis and y-axis are perpendicular number lines that form the coordinate plane." },
        { term: "Ordered Pair", def: "In (x,y), x is the abscissa and y is the ordinate." },
        { term: "Quadrants", def: "The axes divide the plane into four quadrants." }
      ];
      examples = [{ q: "Plot the point (3,−2).", a: "Move 3 units right and 2 units down from the origin." }];
      questions = [
        q("Coordinates of the origin are:", "मूल बिंदु के निर्देशांक हैं:", ["(0,0)","(1,0)","(0,1)","(1,1)"], "(0,0)", "The axes intersect at (0,0)."),
        q("A point with x>0 and y>0 lies in:", "जिस बिंदु के x और y दोनों धनात्मक हों, वह है:", ["Quadrant I","Quadrant II","Quadrant III","Quadrant IV"], "Quadrant I", "Both coordinates are positive in Quadrant I."),
        q("The x-coordinate is also called:", "x-निर्देशांक को कहते हैं:", ["Abscissa","Ordinate","Origin","Axis"], "Abscissa", "The x-coordinate is the abscissa."),
        q("The y-coordinate is also called:", "y-निर्देशांक को कहते हैं:", ["Ordinate","Abscissa","Origin","Quadrant"], "Ordinate", "The y-coordinate is the ordinate."),
        q("A point on the x-axis has y-coordinate:", "x-अक्ष पर स्थित बिंदु का y-निर्देशांक है:", ["0","1","−1","Any value"], "0", "Every point on the x-axis has y=0."),
        q("The point (−2,3) lies in:", "बिंदु (−2,3) स्थित है:", ["Quadrant II","Quadrant I","Quadrant III","Quadrant IV"], "Quadrant II", "Negative x and positive y means Quadrant II."),
        q("The point (4,−1) lies in:", "बिंदु (4,−1) स्थित है:", ["Quadrant IV","Quadrant I","Quadrant II","Quadrant III"], "Quadrant IV", "Positive x and negative y means Quadrant IV."),
        q("In (5,−3), the ordinate is:", "(5,−3) में कोटि है:", ["−3","5","3","−5"], "−3", "The ordinate is the second coordinate.")
      ];
    }
  } else if (/real number|prime|factor|hcf|lcm|संख्या पद्धति|वास्तविक संख्या|अभाज्य/.test(key)) {
    topic = "Number Systems";
    concepts = [{ term: "Prime Factorisation", def: "Express a composite number as a product of prime numbers." }, { term: "HCF and LCM", def: "HCF is the greatest common factor; LCM is the least common multiple." }];
    examples = [{ q: "Find the HCF of 18 and 24.", a: "The common factors are 1,2,3,6; HCF=6." }];
    questions = [
      q("Prime factorisation of 60 is:", "60 का अभाज्य गुणनखंडन है:", ["2²×3×5","2×3×10","2×2×15","3×20"], "2²×3×5", "60=2×2×3×5."),
      q("HCF of 18 and 24 is:", "18 और 24 का महत्तम समापवर्तक है:", ["3","6","12","72"], "6", "The greatest common factor is 6."),
      q("LCM of 4 and 6 is:", "4 और 6 का लघुत्तम समापवर्त्य है:", ["10","12","18","24"], "12", "12 is the smallest common multiple."),
      q("Which number is prime?", "इनमें से कौन-सी संख्या अभाज्य है?", ["21","27","29","33"], "29", "29 has only 1 and 29 as factors."),
      q("HCF × LCM of 12 and 15 equals:", "12 और 15 के HCF × LCM का मान है:", ["27","60","180","3"], "180", "HCF×LCM=12×15=180."),
      q("The decimal expansion of 1/8 is:", "1/8 का दशमलव प्रसार है:", ["Terminating","Recurring","Non-recurring","Irrational"], "Terminating", "1/8=0.125."),
      q("Which is irrational?", "इनमें से कौन अपरिमेय है?", ["√2","√9","0.5","3/4"], "√2", "√2 cannot be expressed as a ratio of integers."),
      q("If HCF(a,b)=1, the numbers are:", "यदि HCF(a,b)=1 है, तो संख्याएँ हैं:", ["Co-prime","Even","Equal","Composite"], "Co-prime", "Numbers with HCF 1 are co-prime.")
    ];
  } else if (/polynomial|बहुपद/.test(key)) {
    topic = "Polynomials";
    concepts = [{ term: "Zero of a Polynomial", def: "α is a zero of p(x) when p(α)=0." }, { term: "Degree", def: "The highest power of the variable with a non-zero coefficient." }];
    examples = [{ q: "For p(x)=x²−5x+6, find p(2).", a: "4−10+6=0." }];
    questions = [
      q("If p(x)=x²−5x+6, p(2) is:", "यदि p(x)=x²−5x+6, तो p(2) है:", ["0","1","2","4"], "0", "4−10+6=0."),
      q("Degree of 7x³+2x−1 is:", "7x³+2x−1 की घात है:", ["1","2","3","7"], "3", "The highest power is 3."),
      q("A zero of x−4 is:", "x−4 का एक शून्यक है:", ["−4","0","4","1"], "4", "4−4=0."),
      q("Coefficient of x in 3x²−7x+2 is:", "3x²−7x+2 में x का गुणांक है:", ["3","−7","2","7"], "−7", "The coefficient multiplying x is −7."),
      q("Sum of zeroes of x²−5x+6 is:", "x²−5x+6 के शून्यकों का योग है:", ["5","6","−5","−6"], "5", "Sum=−b/a."),
      q("Product of zeroes of x²−5x+6 is:", "x²−5x+6 के शून्यकों का गुणनफल है:", ["5","6","−5","−6"], "6", "Product=c/a."),
      q("(x+2)(x−2) equals:", "(x+2)(x−2) बराबर है:", ["x²−4","x²+4","x²−2","x²+2"], "x²−4", "Difference of squares."),
      q("A non-zero constant polynomial has degree:", "एक अशून्य अचर बहुपद की घात है:", ["0","1","2","Undefined"], "0", "A non-zero constant has degree zero.")
    ];
  } else if (/linear equation|linear equations|रैखिक समीकरण/.test(key)) {
    topic = "Linear Equations";
    concepts = [{ term: "Linear Equation", def: "An equation in which the highest power of each variable is 1." }];
    examples = [{ q: "Solve 2x+3=11.", a: "2x=8, so x=4." }];
    questions = [
      q("Solve 2x+3=11:", "2x+3=11 हल करें:", ["2","3","4","5"], "4", "2x=8, x=4."),
      q("If x+y=7 and x−y=1, x is:", "यदि x+y=7 और x−y=1, तो x है:", ["2","3","4","5"], "4", "Add equations: 2x=8."),
      q("Graph of a linear equation in two variables is a:", "दो चरों वाले रैखिक समीकरण का आलेख है:", ["Straight line","Circle","Parabola","Curve"], "Straight line", "A linear equation graphs as a straight line."),
      q("A solution of x+y=5 is:", "x+y=5 का एक हल है:", ["(2,3)","(1,1)","(5,5)","(0,0)"], "(2,3)", "2+3=5."),
      q("If 3x=21, x equals:", "यदि 3x=21, तो x है:", ["6","7","8","9"], "7", "Divide both sides by 3."),
      q("Parallel distinct lines have:", "भिन्न समांतर रेखाओं के:", ["No solution","One solution","Two solutions","Infinite solutions"], "No solution", "Parallel distinct lines never intersect."),
      q("If x=2 in 2x+y=9, y is:", "2x+y=9 में x=2 रखने पर y है:", ["3","4","5","6"], "5", "4+y=9."),
      q("The pair x+y=4 and 2x+2y=8 has:", "x+y=4 और 2x+2y=8 के:", ["Infinitely many solutions","No solution","One solution","Exactly two"], "Infinitely many solutions", "Both equations represent the same line.")
    ];
  } else if (/quadratic|द्विघात/.test(key)) {
    topic = "Quadratic Equations";
    concepts = [{ term: "Quadratic Equation", def: "An equation ax²+bx+c=0 where a≠0." }, { term: "Discriminant", def: "D=b²−4ac determines the nature of roots." }];
    examples = [{ q: "Solve x²−9=0.", a: "x²=9, so x=±3." }];
    questions = [
      q("Roots of x²−9=0 are:", "x²−9=0 के मूल हैं:", ["±3","±9","3 only","0 and 3"], "±3", "x²=9."),
      q("Discriminant of x²−5x+6=0 is:", "x²−5x+6=0 का विविक्तकर है:", ["1","−1","25","49"], "1", "D=25−24=1."),
      q("If D>0, the roots are:", "यदि D>0 हो, तो मूल होते हैं:", ["Real and distinct","Real and equal","Not real","Zero"], "Real and distinct", "A positive discriminant gives two distinct real roots."),
      q("Product of roots of 2x²−3x+4=0 is:", "2x²−3x+4=0 के मूलों का गुणनफल है:", ["2","3/2","4","−2"], "2", "Product=c/a=4/2=2."),
      q("A quadratic equation has degree:", "द्विघात समीकरण की घात है:", ["1","2","3","4"], "2", "The highest power is 2."),
      q("Which is a quadratic equation?", "कौन-सा द्विघात समीकरण है?", ["x²+3x+2=0","2x+1=0","x³−1=0","x=5"], "x²+3x+2=0", "Its highest power is 2."),
      q("Sum of roots of x²−7x+10=0 is:", "x²−7x+10=0 के मूलों का योग है:", ["7","10","−7","−10"], "7", "Sum=−b/a=7."),
      q("If roots are equal, the discriminant is:", "यदि मूल समान हों, तो विविक्तकर है:", ["0","1","Negative","Positive"], "0", "Equal roots occur when D=0.")
    ];
  } else if (/arithmetic progression|progression|समांतर श्रेणी|समांतर श्रेढ़ी/.test(key)) {
    topic = "Arithmetic Progressions";
    concepts = [{ term: "Common Difference", def: "The difference between consecutive terms of an arithmetic progression." }, { term: "nth Term", def: "aₙ=a+(n−1)d." }];
    examples = [{ q: "Find the 10th term of 2,5,8,...", a: "a₁₀=2+9×3=29." }];
    questions = [
      q("Common difference of 2,5,8,11,... is:", "2,5,8,11,... का सार्व अंतर है:", ["2","3","4","5"], "3", "5−2=3."),
      q("The 10th term of 2,5,8,... is:", "2,5,8,... का 10वाँ पद है:", ["26","27","29","30"], "29", "a₁₀=2+9×3=29."),
      q("Next term of 7,11,15,... is:", "7,11,15,... का अगला पद है:", ["17","18","19","20"], "19", "Add common difference 4."),
      q("If a=4 and d=2, the 5th term is:", "यदि a=4 और d=2, तो पाँचवाँ पद है:", ["10","12","14","16"], "12", "a₅=4+4×2=12."),
      q("An AP has common difference zero when:", "AP का सार्व अंतर शून्य कब होता है:", ["All terms equal","Terms increase","Terms decrease","Terms alternate"], "All terms equal", "Each consecutive term is the same."),
      q("Sum of first n terms is:", "पहले n पदों का योग है:", ["n/2[2a+(n−1)d]","a+(n−1)d","ad","n+d"], "n/2[2a+(n−1)d]", "Standard AP sum formula."),
      q("If a=3, d=4, the 4th term is:", "यदि a=3, d=4, तो चौथा पद है:", ["11","12","15","19"], "15", "a₄=3+3×4=15."),
      q("The sequence 5,5,5,5,... is:", "5,5,5,5,... श्रेणी है:", ["An AP with d=0","Not an AP","A GP only","Neither"], "An AP with d=0", "Consecutive differences are zero.")
    ];
  } else if (/trigonometry|त्रिकोणमिति/.test(key)) {
    topic = "Trigonometry";
    concepts = [{ term: "sin θ", def: "Opposite side / Hypotenuse in a right triangle." }, { term: "Identity", def: "sin²θ+cos²θ=1." }];
    examples = [{ q: "Evaluate sin 30° + cos 60°.", a: "1/2+1/2=1." }];
    questions = [
      q("sin 30° equals:", "sin 30° का मान है:", ["1/2","√3/2","1","0"], "1/2", "Standard trigonometric value."),
      q("tan 45° equals:", "tan 45° का मान है:", ["0","1","√3","1/√3"], "1", "tan 45°=1."),
      q("sin²θ+cos²θ equals:", "sin²θ+cos²θ बराबर है:", ["0","1","2","tan θ"], "1", "Fundamental identity."),
      q("cos 0° equals:", "cos 0° का मान है:", ["0","1","1/2","√3/2"], "1", "cos 0°=1."),
      q("sec θ is the reciprocal of:", "sec θ किसका व्युत्क्रम है:", ["cos θ","sin θ","tan θ","cot θ"], "cos θ", "sec θ=1/cos θ."),
      q("If sin θ=3/5 for acute θ, cos θ is:", "न्यूनकोण θ के लिए sin θ=3/5 हो, तो cos θ है:", ["4/5","3/4","5/4","1/5"], "4/5", "Use the 3-4-5 right triangle."),
      q("1+tan²θ equals:", "1+tan²θ बराबर है:", ["sec²θ","cosec²θ","sin²θ","cos²θ"], "sec²θ", "Standard identity."),
      q("cot θ equals:", "cot θ बराबर है:", ["1/tan θ","1/sin θ","1/cos θ","tan θ"], "1/tan θ", "cot θ is reciprocal of tan θ.")
    ];
  } else if (/probability|प्रायिकता/.test(key)) {
    topic = "Probability";
    concepts = [{ term: "Probability", def: "For equally likely outcomes, P(E)=favourable outcomes/total outcomes." }];
    examples = [{ q: "Probability of an even number on a fair die.", a: "3/6=1/2." }];
    questions = [
      q("Probability of getting a 6 on a fair die is:", "एक निष्पक्ष पासे पर 6 आने की प्रायिकता है:", ["1/6","1/3","1/2","1"], "1/6", "One favourable outcome out of six."),
      q("Probability of an impossible event is:", "असंभव घटना की प्रायिकता है:", ["0","1","1/2","−1"], "0", "An impossible event has probability zero."),
      q("Probability of a sure event is:", "निश्चित घटना की प्रायिकता है:", ["0","1","1/2","2"], "1", "A sure event always occurs."),
      q("A coin is tossed once. Probability of heads:", "एक सिक्का उछालने पर चित आने की प्रायिकता:", ["1/2","1/4","1","0"], "1/2", "One of two equally likely outcomes."),
      q("A die has how many possible outcomes?", "एक पासे के कितने संभावित परिणाम हैं?", ["4","5","6","8"], "6", "The outcomes are 1 through 6."),
      q("Probability always lies between:", "प्रायिकता सदैव किसके बीच होती है:", ["0 and 1","−1 and 1","1 and 2","0 and 10"], "0 and 1", "Probability is between 0 and 1 inclusive."),
      q("Probability of an even number on a die:", "पासे पर सम संख्या आने की प्रायिकता:", ["1/2","1/3","1/6","2/3"], "1/2", "Three even outcomes out of six."),
      q("If P(E)=0.25, P(not E) is:", "यदि P(E)=0.25, तो P(E नहीं) है:", ["0.25","0.5","0.75","1"], "0.75", "Complement probability is 1−0.25.")
    ];
  } else if (/statistics|data handling|data through|आँकड़ों|सांख्यिकी/.test(key)) {
    topic = "Statistics and Data";
    concepts = [{ term: "Mean", def: "Sum of observations divided by the number of observations." }, { term: "Median", def: "The middle observation after arranging data in order." }, { term: "Mode", def: "The observation that occurs most often." }];
    examples = [{ q: "Find the mean of 2,4,6.", a: "(2+4+6)/3=4." }];
    questions = [
      q("Mean of 2,4,6 is:", "2,4,6 का माध्य है:", ["3","4","5","6"], "4", "12/3=4."),
      q("Mode of 2,3,3,4,5 is:", "2,3,3,4,5 का बहुलक है:", ["2","3","4","5"], "3", "3 occurs most often."),
      q("Median of 1,3,5 is:", "1,3,5 की माध्यिका है:", ["1","3","5","9"], "3", "The middle value is 3."),
      q("Range of 4,9,2,7 is:", "4,9,2,7 का परिसर है:", ["5","6","7","9"], "7", "Maximum 9 minus minimum 2."),
      q("Mean is calculated by:", "माध्य ज्ञात करने के लिए:", ["Sum ÷ number of observations","Largest − smallest","Most frequent value","Middle value only"], "Sum ÷ number of observations", "Mean is total divided by count."),
      q("Median of 2,4,6,8 is:", "2,4,6,8 की माध्यिका है:", ["4","5","6","7"], "5", "Average of middle values (4+6)/2."),
      q("Mode is the value that appears:", "बहुलक वह मान है जो:", ["Most often","Least often","In the middle","Only once"], "Most often", "Mode is the most frequent value."),
      q("Range equals:", "परिसर बराबर है:", ["Maximum−Minimum","Maximum+Minimum","Mean×Count","Sum÷Count"], "Maximum−Minimum", "Range measures spread.")
    ];
  } else if (/fraction|भिन्न/.test(key)) {
    topic = "Fractions";
    concepts = [{ term: "Equivalent Fractions", def: "Fractions that represent the same value." }];
    examples = [{ q: "Simplify 6/8.", a: "Divide numerator and denominator by 2: 3/4." }];
    questions = [
      q("Simplify 6/8:", "6/8 को सरल करें:", ["1/2","2/3","3/4","4/5"], "3/4", "Divide numerator and denominator by 2."),
      q("1/2 + 1/4 equals:", "1/2 + 1/4 बराबर है:", ["1/4","2/4","3/4","1"], "3/4", "2/4+1/4=3/4."),
      q("Which fraction is equivalent to 2/3?", "2/3 के बराबर भिन्न है:", ["4/6","3/4","2/6","5/6"], "4/6", "Multiply numerator and denominator by 2."),
      q("Numerator of 5/7 is:", "5/7 का अंश है:", ["5","7","12","2"], "5", "The top number is the numerator."),
      q("3/4 of 20 is:", "20 का 3/4 है:", ["10","12","15","18"], "15", "20÷4×3=15."),
      q("Which is greater?", "कौन-सी भिन्न बड़ी है?", ["1/2","1/4","Equal","Cannot compare"], "1/2", "One half is greater than one quarter."),
      q("A fraction with numerator smaller than denominator is:", "जिस भिन्न का अंश हर से छोटा हो वह है:", ["Proper fraction","Improper fraction","Mixed number","Integer"], "Proper fraction", "A proper fraction is less than one."),
      q("5/5 equals:", "5/5 बराबर है:", ["0","1","5","10"], "1", "Any non-zero number divided by itself is 1.")
    ];
  } else if (/area related to circles|वृत्तों से संबंधित क्षेत्रफल/.test(key)) {
    topic = "Areas Related to Circles";
    concepts = [{ term: "Circumference", def: "C=2πr." }, { term: "Area of a Circle", def: "A=πr²." }, { term: "Sector Area", def: "For central angle θ, area=(θ/360°)πr²." }];
    examples = [{ q: "Find the area of a circle of radius 7 cm.", a: "π×7²=49π=154 cm² (using π=22/7)." }];
    questions = [
      q("Area of a circle of radius 7 cm (π=22/7) is:", "7 सेमी त्रिज्या वाले वृत्त का क्षेत्रफल (π=22/7) है:", ["44 cm²","154 cm²","308 cm²","49 cm²"], "154 cm²", "πr²=(22/7)×49=154."),
      q("Circumference of a circle of radius 7 cm (π=22/7) is:", "7 सेमी त्रिज्या वाले वृत्त की परिधि है:", ["22 cm","44 cm","49 cm","154 cm"], "44 cm", "2πr=2×22/7×7=44."),
      q("Area of a semicircle of radius r is:", "r त्रिज्या वाले अर्धवृत्त का क्षेत्रफल है:", ["πr²","½πr²","2πr","πr"], "½πr²", "A semicircle is half a circle."),
      q("A sector of 90° is what fraction of a full circle?", "90° का त्रिज्यखंड पूरे वृत्त का कितना भाग है:", ["1/2","1/3","1/4","1/8"], "1/4", "90/360=1/4."),
      q("If radius is doubled, area becomes:", "यदि त्रिज्या दोगुनी हो, तो क्षेत्रफल हो जाता है:", ["2 times","3 times","4 times","8 times"], "4 times", "Area is proportional to r²."),
      q("Diameter of a circle with radius 5 cm is:", "5 सेमी त्रिज्या वाले वृत्त का व्यास है:", ["5 cm","10 cm","15 cm","25 cm"], "10 cm", "d=2r."),
      q("Length of an arc of 180° is:", "180° के चाप की लंबाई है:", ["¼ circumference","½ circumference","Full circumference","Twice circumference"], "½ circumference", "A 180° arc is a semicircle."),
      q("Area of a ring is:", "वलय का क्षेत्रफल है:", ["π(R²−r²)","π(R+r)²","2πR","πr²"], "π(R²−r²)", "Subtract the inner circle area from the outer circle area.")
    ];
  } else if (/surface area|volume|पृष्ठीय क्षेत्रफल|आयतन/.test(key)) {
    topic = "Surface Areas and Volumes";
    concepts = [{ term: "Cuboid Volume", def: "V=l×b×h." }, { term: "Cylinder Volume", def: "V=πr²h." }, { term: "Sphere Volume", def: "V=4/3πr³." }];
    examples = [{ q: "Find the volume of a cube of side 3 cm.", a: "3³=27 cm³." }];
    questions = [
      q("Volume of a cube of side 3 cm is:", "3 सेमी भुजा वाले घन का आयतन है:", ["9 cm³","18 cm³","27 cm³","36 cm³"], "27 cm³", "V=a³=3³=27."),
      q("Volume of a cuboid is:", "घनाभ का आयतन है:", ["l+b+h","2(lb+bh+hl)","l×b×h","4l"], "l×b×h", "Multiply length, breadth and height."),
      q("Curved surface area of a cylinder is:", "बेलन का वक्र पृष्ठीय क्षेत्रफल है:", ["2πrh","πr²h","4πr²","πrl"], "2πrh", "CSA=2πrh."),
      q("Volume of a cylinder is:", "बेलन का आयतन है:", ["2πrh","πr²h","4πr²","πrl"], "πr²h", "Volume=base area×height."),
      q("Total surface area of a cube of side a is:", "a भुजा वाले घन का कुल पृष्ठीय क्षेत्रफल है:", ["4a²","6a²","a³","2a²"], "6a²", "A cube has six equal square faces."),
      q("Volume of a sphere is:", "गोले का आयतन है:", ["4πr²","4/3πr³","πr²h","2πr"], "4/3πr³", "Standard sphere volume formula."),
      q("The unit of volume is:", "आयतन की इकाई है:", ["cm","cm²","cm³","kg"], "cm³", "Volume is measured in cubic units."),
      q("If each dimension of a cube is doubled, its volume becomes:", "यदि घन की प्रत्येक विमा दोगुनी हो, तो आयतन हो जाता है:", ["2 times","4 times","6 times","8 times"], "8 times", "Volume scales by 2³=8.")
    ];
  } else if (/circle|वृत्त/.test(key)) {
    topic = "Circles";
    concepts = [{ term: "Tangent", def: "A line that touches a circle at exactly one point." }, { term: "Radius and Tangent", def: "The radius through the point of contact is perpendicular to the tangent." }];
    examples = [{ q: "A tangent touches a circle at how many points?", a: "Exactly one point." }];
    questions = [
      q("A tangent touches a circle at:", "स्पर्श रेखा वृत्त को कितने बिंदुओं पर छूती है:", ["One point","Two points","Three points","No point"], "One point", "A tangent has exactly one point of contact."),
      q("The radius through the point of contact is _____ to the tangent:", "स्पर्श बिंदु पर त्रिज्या स्पर्श रेखा पर _____ होती है:", ["Parallel","Perpendicular","Equal","Oblique"], "Perpendicular", "The radius is at 90° to the tangent."),
      q("Number of tangents from an external point to a circle is:", "वृत्त के बाहर स्थित बिंदु से खींची जा सकने वाली स्पर्श रेखाएँ हैं:", ["0","1","2","3"], "2", "Two tangents can be drawn from an external point."),
      q("Tangents drawn from the same external point are:", "एक ही बाहरी बिंदु से खींची गई स्पर्श रेखाएँ होती हैं:", ["Equal","Unequal","Parallel","Perpendicular"], "Equal", "Lengths of tangents from an external point are equal."),
      q("A line intersecting a circle at two points is a:", "वृत्त को दो बिंदुओं पर काटने वाली रेखा है:", ["Tangent","Secant","Radius","Chord only"], "Secant", "A secant intersects the circle at two points."),
      q("The longest chord of a circle is its:", "वृत्त की सबसे लंबी जीवा है:", ["Radius","Diameter","Arc","Tangent"], "Diameter", "The diameter passes through the centre."),
      q("A tangent is perpendicular to the radius at:", "स्पर्श रेखा त्रिज्या पर कहाँ लंब होती है:", ["Centre","Point of contact","Any point","Outside point"], "Point of contact", "The right angle occurs at the point of contact."),
      q("If two tangents from P touch a circle at A and B, then:", "यदि P से खींची गई स्पर्श रेखाएँ A और B पर छूती हैं, तो:", ["PA=PB","PA>PB","PA<PB","PA+PB=0"], "PA=PB", "Tangents from an external point have equal lengths.")
    ];
  } else if (/triangle|त्रिभुज/.test(key)) {
    topic = "Triangles";
    concepts = [{ term: "Similarity", def: "Similar triangles have equal corresponding angles and proportional corresponding sides." }, { term: "Pythagoras Theorem", def: "In a right triangle, hypotenuse² = base² + perpendicular²." }];
    examples = [{ q: "A right triangle has legs 3 cm and 4 cm. Find the hypotenuse.", a: "√(3²+4²)=5 cm." }];
    questions = [
      q("Sum of the interior angles of a triangle is:", "त्रिभुज के आंतरिक कोणों का योग है:", ["90°","180°","270°","360°"], "180°", "The angle sum property is 180°."),
      q("In a right triangle with legs 3 and 4, hypotenuse is:", "3 और 4 भुजाओं वाले समकोण त्रिभुज का कर्ण है:", ["5","6","7","8"], "5", "√(3²+4²)=5."),
      q("Similar triangles have corresponding angles:", "समरूप त्रिभुजों के संगत कोण होते हैं:", ["Equal","Supplementary","Complementary","Unequal"], "Equal", "Corresponding angles are equal."),
      q("If corresponding sides are in ratio 2:3, their perimeters are in ratio:", "यदि संगत भुजाओं का अनुपात 2:3 है, तो परिमापों का अनुपात है:", ["2:3","4:9","3:2","1:1"], "2:3", "Perimeters of similar triangles follow the side ratio."),
      q("A triangle with all three sides equal is:", "तीनों भुजाएँ समान वाला त्रिभुज है:", ["Equilateral","Isosceles","Scalene","Right"], "Equilateral", "All three sides are equal."),
      q("The longest side of a right triangle is called:", "समकोण त्रिभुज की सबसे लंबी भुजा कहलाती है:", ["Base","Altitude","Hypotenuse","Median"], "Hypotenuse", "The hypotenuse is opposite the right angle."),
      q("If two angles are 50° and 60°, the third angle is:", "यदि दो कोण 50° और 60° हैं, तो तीसरा कोण है:", ["60°","70°","80°","90°"], "70°", "180°−50°−60°=70°."),
      q("The area of a triangle is:", "त्रिभुज का क्षेत्रफल है:", ["base×height","½×base×height","2×base×height","base+height"], "½×base×height", "Area is half the product of base and corresponding height.")
    ];
  } else if (/angle|line|geometry|shape|symmetry|circle|triangle|quadrilateral|आकृति|रेखा|कोण|सममिति|वृत्त|त्रिभुज/.test(key)) {
    topic = "Geometry";
    concepts = [{ term: "Angle", def: "An angle is formed by two rays with a common endpoint." }, { term: "Perpendicular Lines", def: "Lines that intersect at 90°." }];
    examples = [{ q: "Find the complement of 35°.", a: "90°−35°=55°." }];
    questions = [
      q("A right angle measures:", "समकोण का माप है:", ["45°","60°","90°","180°"], "90°", "A right angle is 90 degrees."),
      q("A straight angle measures:", "सरल कोण का माप है:", ["90°","120°","180°","360°"], "180°", "A straight angle forms a straight line."),
      q("Sum of angles in a triangle is:", "त्रिभुज के कोणों का योग है:", ["90°","180°","270°","360°"], "180°", "Triangle angle sum property."),
      q("A square has how many lines of symmetry?", "वर्ग में सममिति की कितनी रेखाएँ होती हैं:", ["2","3","4","6"], "4", "A square has four symmetry axes."),
      q("A polygon with 5 sides is a:", "5 भुजाओं वाला बहुभुज है:", ["Pentagon","Hexagon","Triangle","Octagon"], "Pentagon", "Penta means five."),
      q("Diameter is how many times the radius?", "व्यास, त्रिज्या का कितने गुना है:", ["1","2","3","4"], "2", "Diameter=2×radius."),
      q("Complement of 35° is:", "35° का पूरक कोण है:", ["45°","55°","65°","145°"], "55°", "90°−35°=55°."),
      q("Perimeter of a square of side 5 cm is:", "5 सेमी भुजा वाले वर्ग का परिमाप है:", ["10 cm","15 cm","20 cm","25 cm"], "20 cm", "4×5=20 cm.")
    ];
  } else if (/area|perimeter|measurement|length|weight|capacity|volume|क्षेत्रफल|परिमाप|मापन|लंबाई|भार|आयतन/.test(key)) {
    topic = "Measurement";
    concepts = [{ term: "Perimeter", def: "The total length around a closed shape." }, { term: "Area", def: "The measure of the surface enclosed by a plane shape." }];
    examples = [{ q: "Area of a rectangle 6 cm by 4 cm.", a: "6×4=24 cm²." }];
    questions = [
      q("Perimeter of a rectangle 6 cm by 4 cm is:", "6 सेमी × 4 सेमी आयत का परिमाप है:", ["10 cm","20 cm","24 cm","48 cm"], "20 cm", "2(6+4)=20 cm."),
      q("Area of a rectangle 6 cm by 4 cm is:", "6 सेमी × 4 सेमी आयत का क्षेत्रफल है:", ["10 cm²","20 cm²","24 cm²","48 cm²"], "24 cm²", "6×4=24 cm²."),
      q("1 metre equals:", "1 मीटर बराबर है:", ["10 cm","100 cm","1000 cm","10 mm"], "100 cm", "1 m=100 cm."),
      q("Area of a square of side 5 cm is:", "5 सेमी भुजा वाले वर्ग का क्षेत्रफल है:", ["10 cm²","20 cm²","25 cm²","30 cm²"], "25 cm²", "5×5=25 cm²."),
      q("1 kilogram equals:", "1 किलोग्राम बराबर है:", ["100 g","500 g","1000 g","10 g"], "1000 g", "1 kg=1000 g."),
      q("Volume of a cube of side 2 cm is:", "2 सेमी भुजा वाले घन का आयतन है:", ["4 cm³","6 cm³","8 cm³","12 cm³"], "8 cm³", "2³=8 cm³."),
      q("Perimeter is measured in:", "परिमाप मापा जाता है:", ["Linear units","Square units","Cubic units","Litres"], "Linear units", "Perimeter is a length."),
      q("Area is measured in:", "क्षेत्रफल मापा जाता है:", ["Linear units","Square units","Cubic units","Kilograms"], "Square units", "Area uses square units.")
    ];
  } else if (/addition|subtraction|जोड़|घटाव|give and take|making 10|mango treat|vegetable farm/.test(key)) {
    topic = "Addition and Subtraction";
    concepts = [{ term: "Addition", def: "Combining quantities to find a total." }, { term: "Subtraction", def: "Finding the difference or what remains after taking away." }];
    examples = [{ q: "Calculate 458+267.", a: "458+267=725." }];
    questions = [
      q("458+267 equals:", "458+267 बराबर है:", ["715","725","735","745"], "725", "Add ones, tens and hundreds."),
      q("900−375 equals:", "900−375 बराबर है:", ["515","525","535","545"], "525", "900−375=525."),
      q("What must be added to 38 to make 100?", "38 में क्या जोड़ें कि 100 हो जाए:", ["52","62","72","82"], "62", "100−38=62."),
      q("If 125 books are on one shelf and 86 on another, total books are:", "एक शेल्फ पर 125 और दूसरी पर 86 पुस्तकें हैं, कुल कितनी:", ["201","211","221","231"], "211", "125+86=211."),
      q("The difference between 1000 and 648 is:", "1000 और 648 का अंतर है:", ["342","352","362","372"], "352", "1000−648=352."),
      q("Which number makes 47+___=90?", "47+___=90 में रिक्त स्थान का मान है:", ["33","43","53","63"], "43", "90−47=43."),
      q("A shop sold 245 items in the morning and 178 in the evening. Total sold:", "दुकान ने सुबह 245 और शाम 178 वस्तुएँ बेचीं। कुल:", ["413","423","433","443"], "423", "245+178=423."),
      q("Subtracting zero from a number leaves:", "किसी संख्या में से शून्य घटाने पर:", ["0","The same number","1","Double the number"], "The same number", "a−0=a.")
    ];
  } else if (/multiplication|division|grouping and sharing|equal groups|how many times|double century|गुणा|भाग|समूह बनाना|बराबर समूह/.test(key)) {
    topic = "Multiplication and Division";
    concepts = [{ term: "Multiplication", def: "Repeated addition of equal groups." }, { term: "Division", def: "Sharing or grouping a quantity into equal parts." }];
    examples = [{ q: "Find 24×5.", a: "24×5=120." }];
    questions = [
      q("24×5 equals:", "24×5 बराबर है:", ["100","110","120","125"], "120", "24 groups of 5 make 120."),
      q("144÷12 equals:", "144÷12 बराबर है:", ["10","11","12","14"], "12", "12×12=144."),
      q("8 groups of 6 make:", "6 के 8 समूहों में कुल हैं:", ["42","46","48","54"], "48", "8×6=48."),
      q("If 45 sweets are shared equally among 5 children, each gets:", "45 मिठाइयाँ 5 बच्चों में बराबर बाँटने पर प्रत्येक को मिलेंगी:", ["8","9","10","11"], "9", "45÷5=9."),
      q("The product of 13 and 7 is:", "13 और 7 का गुणनफल है:", ["81","91","101","111"], "91", "13×7=91."),
      q("Which number makes 9×___=72?", "9×___=72 में रिक्त स्थान है:", ["6","7","8","9"], "8", "72÷9=8."),
      q("36 objects arranged in 4 equal rows give objects per row:", "36 वस्तुओं को 4 बराबर पंक्तियों में रखने पर प्रत्येक पंक्ति में:", ["8","9","10","12"], "9", "36÷4=9."),
      q("The remainder when 29 is divided by 5 is:", "29 को 5 से भाग देने पर शेषफल है:", ["2","3","4","5"], "4", "29=5×5+4.")
    ];
  } else if (/money|spend|rupee|rupees|fair|मुद्रा|रुपये|पैसे/.test(key)) {
    topic = "Money";
    concepts = [{ term: "Rupee", def: "The basic unit of Indian currency; 1 rupee = 100 paise." }, { term: "Total Cost", def: "Unit price multiplied by quantity." }];
    examples = [{ q: "Three notebooks cost ₹12 each. Find the total.", a: "3×12=₹36." }];
    questions = [
      q("₹10 equals how many paise?", "₹10 में कितने पैसे होते हैं:", ["10","100","1000","10000"], "1000", "1 rupee=100 paise."),
      q("Three notebooks cost ₹12 each. Total cost:", "तीन कॉपियों की कीमत ₹12 प्रति कॉपी है। कुल कीमत:", ["₹24","₹30","₹36","₹42"], "₹36", "3×12=36."),
      q("You pay ₹100 for an item costing ₹68. Change:", "₹68 की वस्तु के लिए ₹100 देने पर वापस मिलेंगे:", ["₹22","₹28","₹32","₹38"], "₹32", "100−68=32."),
      q("₹25+₹17 equals:", "₹25+₹17 बराबर है:", ["₹32","₹42","₹52","₹62"], "₹42", "25+17=42."),
      q("Half of ₹80 is:", "₹80 का आधा है:", ["₹20","₹30","₹40","₹50"], "₹40", "80÷2=40."),
      q("A pencil costs ₹7. Cost of 5 pencils:", "एक पेंसिल ₹7 की है। 5 पेंसिल की कीमत:", ["₹25","₹30","₹35","₹40"], "₹35", "7×5=35."),
      q("₹5.50 is equal to how many paise?", "₹5.50 में कितने पैसे हैं:", ["50","500","550","505"], "550", "5.50 rupees=550 paise."),
      q("Which is the greatest amount?", "सबसे बड़ी राशि कौन-सी है:", ["₹9.75","₹9.50","₹9.25","₹9.05"], "₹9.75", "Compare paise after the rupee value.")
    ];
  } else if (/time|calendar|clock|day|season|समय|कैलेंडर|घड़ी|दिनचर्या/.test(key)) {
    topic = "Time and Calendar";
    concepts = [{ term: "Hour", def: "1 hour = 60 minutes." }, { term: "Day", def: "1 day = 24 hours." }];
    examples = [{ q: "Convert 2 hours into minutes.", a: "2×60=120 minutes." }];
    questions = [
      q("2 hours equals:", "2 घंटे बराबर हैं:", ["60 minutes","90 minutes","120 minutes","180 minutes"], "120 minutes", "2×60=120."),
      q("How many days are in a leap year?", "लीप वर्ष में कितने दिन होते हैं:", ["364","365","366","367"], "366", "A leap year has 366 days."),
      q("Quarter of an hour is:", "एक घंटे का चौथाई भाग है:", ["10 minutes","15 minutes","20 minutes","30 minutes"], "15 minutes", "60÷4=15."),
      q("How many months are in a year?", "एक वर्ष में कितने महीने होते हैं:", ["10","11","12","13"], "12", "A year has 12 months."),
      q("The minute hand completes one turn in:", "मिनट की सुई एक चक्कर पूरा करती है:", ["1 hour","12 hours","24 hours","1 minute"], "1 hour", "One full minute-hand turn is 60 minutes."),
      q("3 weeks equal:", "3 सप्ताह बराबर हैं:", ["14 days","18 days","21 days","28 days"], "21 days", "3×7=21."),
      q("A day has how many hours?", "एक दिन में कितने घंटे होते हैं:", ["12","18","24","36"], "24", "One day has 24 hours."),
      q("30 minutes after 4:15 is:", "4:15 के 30 मिनट बाद समय होगा:", ["4:35","4:45","5:15","5:45"], "4:45", "Add 30 minutes.")
    ];
  } else if (/pattern|number play|number system|numbers|number|integer|integer|गणित में पैटर्न|संख्याओं|पूर्णांक|संख्या/.test(key)) {
    topic = "Number Patterns";
    concepts = [{ term: "Pattern", def: "A sequence that follows a rule." }, { term: "Integer", def: "Positive whole numbers, negative whole numbers, and zero." }];
    examples = [{ q: "Find the next number: 3,6,9,12,...", a: "15; add 3 each time." }];
    questions = [
      q("Next number: 3,6,9,12,...", "अगली संख्या: 3,6,9,12,...", ["13","14","15","16"], "15", "Add 3 each time."),
      q("Value of (−4)+7 is:", "(−4)+7 का मान है:", ["−11","−3","3","11"], "3", "Move 7 units right from −4."),
      q("The smallest whole number is:", "सबसे छोटी पूर्ण संख्या है:", ["−1","0","1","10"], "0", "Whole numbers start at zero."),
      q("Next square number after 16 is:", "16 के बाद अगली वर्ग संख्या है:", ["20","24","25","36"], "25", "5²=25."),
      q("Absolute value of −8 is:", "−8 का निरपेक्ष मान है:", ["−8","0","8","16"], "8", "Absolute value is distance from zero."),
      q("Successor of 999 is:", "999 की परवर्ती संख्या है:", ["998","1000","1001","990"], "1000", "Add one."),
      q("Predecessor of 100 is:", "100 की पूर्ववर्ती संख्या है:", ["98","99","101","110"], "99", "Subtract one."),
      q("Which is an even number?", "इनमें से कौन सम संख्या है:", ["13","17","22","25"], "22", "Even numbers are divisible by 2.")
    ];
  } else {
    return {
      intro: isHi ? "इस अध्याय में दिए गए गणितीय विषय की मूल अवधारणाएँ सीखें।" : "Learn the mathematical ideas specific to this chapter.",
      objectives: isHi ? ["अध्याय की अवधारणाएँ समझना", "उचित विधि से प्रश्न हल करना"] : ["Understand the chapter concepts", "Apply the appropriate mathematical method"],
      explanation: isHi ? "प्रश्न में दी गई जानकारी पहचानें और उसी विषय से संबंधित नियम लागू करें।" : "Identify the given information and apply only the rules relevant to this chapter.",
      concepts: [], examples: [], exercises: [], questions: []
    };
  }

  return {
    intro: isHi ? "इस अध्याय में " + topic + " की अवधारणाएँ और उनका उपयोग सीखें।" : "Learn the core ideas of " + topic + " and how to apply them.",
    objectives: isHi ? [topic + " की मूल अवधारणाएँ समझना", "सही विधि और सूत्र चुनकर प्रश्न हल करना"] : ["Understand the key concepts in " + topic, "Apply the correct method and formula to chapter problems"],
    explanation: isHi ? topic + " के प्रश्नों में दी गई जानकारी पहचानें, उपयुक्त नियम या सूत्र चुनें और चरणबद्ध हल करें।" : "Identify the given information, select the relevant rule or formula, and show each step clearly.",
    concepts, examples, exercises: [], questions
  };
}

function buildChapterSpecificContent(classNum, sub, medium, chTitle) {
  const isHi = medium === "HI" || sub === "hindi" || sub === "sanskrit";
  const cleanName = chTitle.replace(/^\d+\.\s*/, "");
  const c = Number(classNum);

  if (sub === "maths") return buildMathsChapterContent(classNum, medium, chTitle);

  if (sub === "science" || sub === "evs") {
    return {
      intro: isHi
        ? `अध्याय "${cleanName}" (कक्षा ${c}) हमें प्रकृति, वैज्ञानिक सिद्धांतों और प्रयोगों से परिचित कराता है।`
        : `Chapter "${cleanName}" (Class ${c}) explains the key scientific principles, observations, and real-world applications.`,
      objectives: isHi
        ? [`"${cleanName}" के वैज्ञानिक कारण समझना`, "मुख्य परिभाषाएँ और उदाहरण याद रखना"]
        : [`Explain the scientific concepts behind ${cleanName}`, "Relate textbook principles to everyday life"],
      explanation: isHi
        ? `"${cleanName}" में वैज्ञानिक अवलोकन, कारण और प्रभाव को सरल भाषा में समझाया गया है। प्रयोग करते समय सावधानी और सही मापन आवश्यक है।`
        : `"${cleanName}" covers key scientific observations, cause-and-effect relationships, and practical examples appropriate for Class ${c}.`,
      concepts: [{ term: cleanName, def: isHi ? `"${cleanName}" से संबंधित मुख्य वैज्ञानिक सिद्धांत।` : `Core scientific terms and principles for ${cleanName}.` }],
      examples: [{ q: isHi ? `"${cleanName}" का दैनिक जीवन में एक उदाहरण बताइए।` : `Give one real-life application of ${cleanName}.`, a: isHi ? "हमारे आस-पास होने वाले प्राकृतिक और भौतिक परिवर्तन।" : "Observed in everyday natural processes and household science." }],
      exercises: [{ qNo: "1", marks: 2, q: isHi ? `"${cleanName}" के दो मुख्य बिंदु लिखिए।` : `State two key points learned in "${cleanName}".`, hint: isHi ? "अध्याय के मुख्य उद्देश्य देखें।" : "Refer to the chapter explanation and concepts.", ans: isHi ? "वैज्ञानिक अवलोकन और दैनिक जीवन में उपयोग।" : "Scientific observation and real-world application.", steps: "1. Define the core concept.\n2. Give one real-life example." }],
      questions: [
        { q: isHi ? `(${cleanName}) हरे पौधे अपना भोजन किस प्रक्रिया से बनाते हैं?` : `(${cleanName}) Green plants prepare their food by:`, options: ["Respiration", "Photosynthesis", "Evaporation", "Condensation"], ans: "Photosynthesis", explanation: "Green plants use sunlight, CO₂, and water to make food via photosynthesis." },
        { q: isHi ? `(${cleanName}) जल का रासायनिक सूत्र क्या है?` : `(${cleanName}) What is the chemical formula of water?`, options: ["CO₂", "O₂", "H₂O", "NaCl"], ans: "H₂O", explanation: "Each water molecule contains 2 Hydrogen atoms and 1 Oxygen atom (H₂O)." },
        { q: isHi ? `(${cleanName}) ऊर्जा का SI मात्रक जूल (Joule) है।` : `(${cleanName}) The SI unit of energy is Joule.`, options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", explanation: "Work and energy are both measured in Joules (J)." },
        { q: isHi ? `(${cleanName}) पृथ्वी पर ऊर्जा का मुख्य प्राकृतिक स्रोत ___ है।` : `(${cleanName}) The main natural source of energy on Earth is the ___.`, options: [], ans: isHi ? "सूर्य" : "Sun", explanation: "The Sun provides solar energy for life on Earth." }
      ]
    };
  }

  if (sub === "social") {
    return {
      intro: isHi
        ? `अध्याय "${cleanName}" (कक्षा ${c}) में हम समाज, भूगोल, इतिहास और नागरिक जीवन के महत्वपूर्ण पहलुओं को समझेंगे।`
        : `In "${cleanName}" (Class ${c} Social Science), we examine historical, geographical, and civic concepts shaping India and the world.`,
      objectives: isHi
        ? [`"${cleanName}" के ऐतिहासिक और भौगोलिक तथ्य जानना`, "नागरिक और पर्यावरणीय जिम्मेदारी समझना"]
        : [`Analyze key events, locations, and systems in ${cleanName}`, "Connect textbook concepts to India's society and geography"],
      explanation: isHi
        ? `"${cleanName}" कक्षा ${c} सामाजिक विज्ञान का प्रमुख अध्याय है जो हमें मानचित्र, समयरेखा और संवैधानिक मूल्यों की समझ देता है।`
        : `"${cleanName}" builds understanding of timelines, maps, resources, and democratic institutions for Class ${c}.`,
      concepts: [{ term: cleanName, def: isHi ? `"${cleanName}" से जुड़े प्रमुख तथ्य और शब्दावली।` : `Key historical, geographical, or civic concepts in ${cleanName}.` }],
      examples: [{ q: isHi ? `भारत का संविधान कब लागू हुआ?` : `When did the Constitution of India come into effect?`, a: isHi ? "26 जनवरी 1950" : "26 January 1950" }],
      exercises: [{ qNo: "1", marks: 2, q: isHi ? `"${cleanName}" का मुख्य निष्कर्ष लिखिए।` : `Summarize the main theme of "${cleanName}".`, hint: isHi ? "मुख्य बिंदुओं को संक्षेप में लिखें।" : "Focus on key facts and causes.", ans: isHi ? "मानव, समाज और संसाधनों के बीच अंतर्संबंध।" : "Interaction between people, resources, and governance.", steps: "1. State the core theme.\n2. Mention one supporting fact." }],
      questions: [
        { q: isHi ? `(${cleanName}) पृथ्वी का 0° अक्षांश क्या कहलाता है?` : `(${cleanName}) What is the 0° latitude line called?`, options: ["Equator", "Prime Meridian", "Tropic of Cancer", "Arctic Circle"], ans: "Equator", explanation: "The Equator (0°) divides Earth into Northern and Southern Hemispheres." },
        { q: isHi ? `(${cleanName}) भारत की राजधानी कहाँ है?` : `(${cleanName}) How many continents are there on Earth?`, options: [isHi ? "मुंबई" : "5", isHi ? "नई दिल्ली" : "6", isHi ? "भोपाल" : "7", isHi ? "कोलकाता" : "8"], ans: isHi ? "नई दिल्ली" : "7", explanation: isHi ? "नई दिल्ली भारत की राजधानी है।" : "There are 7 continents on Earth." },
        { q: isHi ? `(${cleanName}) भारत का संविधान 26 जनवरी 1950 को लागू हुआ।` : `(${cleanName}) The Constitution of India came into effect on 26 January 1950.`, options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", explanation: "26 January is celebrated as Republic Day in India." },
        { q: isHi ? `(${cleanName}) भारत ___ गोलार्ध में स्थित है।` : `(${cleanName}) India lies in the Northern and ___ Hemispheres.`, options: [], ans: isHi ? "उत्तरी" : "Eastern", explanation: "India is located in the Northern and Eastern Hemispheres." }
      ]
    };
  }

  // English, Hindi, Sanskrit
  return {
    intro: isHi
      ? `पाठ "${cleanName}" (कक्षा ${c}) में हम पाठ का सारांश, कठिन शब्दार्थ, भावार्थ और व्याकरण का अभ्यास करेंगे।`
      : `In "${cleanName}" (Class ${c}), we explore the story/poem's central message, character insights, vocabulary, and comprehension.`,
    objectives: isHi
      ? [`"${cleanName}" का मुख्य भाव समझना`, "शब्दार्थ और व्याकरण का सही प्रयोग सीखना"]
      : [`Understand the theme and characters of ${cleanName}`, "Build vocabulary, grammar, and reading comprehension"],
    explanation: isHi
      ? `"${cleanName}" एक शिक्षाप्रद पाठ है। पाठ को ध्यान से पढ़कर इसके मुख्य संदेश, पात्रों के गुण और संज्ञा-सर्वनाम जैसे व्याकरण बिंदुओं को समझें।`
      : `"${cleanName}" is a core literature lesson for Class ${c}. Read carefully to identify the central theme, literary devices, and key vocabulary in context.`,
    concepts: [{ term: cleanName, def: isHi ? `"${cleanName}" का मुख्य संदेश और साहित्यिक महत्व।` : `Central theme and literary takeaways of ${cleanName}.` }],
    examples: [{ q: isHi ? `"${cleanName}" पाठ से हमें क्या शिक्षा मिलती है?` : `What is the main takeaway from "${cleanName}"?`, a: isHi ? "परिश्रम, सत्य और सद्भाव का महत्व।" : "It teaches empathy, resilience, and thoughtful reflection." }],
    exercises: [{ qNo: "1", marks: 2, q: isHi ? `"${cleanName}" का सारांश अपने शब्दों में लिखिए।` : `Write a brief summary of "${cleanName}" in your own words.`, hint: isHi ? "पाठ की मुख्य घटना लिखें।" : "Mention the main character and key event.", ans: isHi ? "पाठ हमें जीवन में सकारात्मक मूल्यों को अपनाने की प्रेरणा देता है।" : "The lesson highlights important human values through its central story.", steps: "1. Introduce the title and main theme.\n2. Describe the key message." }],
    questions: [
      { q: isHi ? `(${cleanName}) जो शब्द संज्ञा के स्थान पर प्रयुक्त होते हैं, वे कहलाते हैं:` : `(${cleanName}) A word used in place of a noun is called a:`, options: ["Verb", "Pronoun", "Adjective", "Adverb"], ans: "Pronoun", explanation: "Pronouns replace nouns to avoid repetition." },
      { q: isHi ? `(${cleanName}) 'सूर्य' का पर्यायवाची शब्द है:` : `(${cleanName}) Which of these is an action word (Verb)?`, options: [isHi ? "रवि" : "Book", isHi ? "चंद्र" : "Think", isHi ? "जल" : "Happy", isHi ? "वायु" : "School"], ans: isHi ? "रवि" : "Think", explanation: isHi ? "रवि, दिनकर और भास्कर सूर्य के पर्यायवाची हैं।" : "Think represents an action, making it a Verb." },
      { q: isHi ? `(${cleanName}) किसी व्यक्ति, वस्तु या स्थान के नाम को संज्ञा कहते हैं।` : `(${cleanName}) A noun is a naming word for a person, place, or thing.`, options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", explanation: "Nouns name people, places, animals, or things." },
      { q: isHi ? `(${cleanName}) 'सत्य' का विलोम शब्द ___ है।` : `(${cleanName}) Fill in the blank: The opposite of "Brave" is ___.`, options: [], ans: isHi ? "असत्य" : "Coward", explanation: isHi ? "सत्य का विलोम असत्य होता है।" : "Coward (or timid) is the opposite of brave." }
    ]
  };
}


function buildSubjectSpecificProblems(ch) {
  const c = Number(ch.classNum);
  const sub = ch.subjectId;
  const isHi = ch.medium === "HI" || sub === "hindi" || sub === "sanskrit";
  const clean = ch.title.replace(/^\d+\.\s*/, "");

  if (sub === "maths") {
    if (c <= 2) {
      return [
        { q: isHi ? "7 + 5 का योग क्या होगा?" : "What is 7 + 5?", options: ["10", "11", "12", "13"], ans: "12", exp: "7 + 5 = 12." },
        { q: isHi ? "15 - 6 बराबर है:" : "What is 15 - 6?", options: ["8", "9", "10", "7"], ans: "9", exp: "15 - 6 = 9." },
        { q: isHi ? "3 दहाई और 8 इकाई से कौन-सी संख्या बनेगी?" : "Write the number for 3 tens and 8 ones.", options: ["38", "83", "11", "30"], ans: "38", exp: "30 + 8 = 38." },
        { q: isHi ? "कौन-सी आकृति में 4 बराबर भुजाएँ होती हैं?" : "Which shape has 4 equal sides?", options: ["Circle", "Triangle", "Square", "Oval"], ans: "Square", exp: "A square has 4 equal sides." },
        { q: isHi ? "20 में से 8 घटाने पर क्या बचेगा?" : "Subtract 8 from 20:", options: ["10", "12", "14", "11"], ans: "12", exp: "20 - 8 = 12." },
        { q: isHi ? "9 + 9 = ___" : "Fill in the blank: 9 + 9 = ___", options: [], ans: "18", exp: "9 + 9 = 18." },
        { q: isHi ? "एक सप्ताह में 7 दिन होते हैं।" : "There are 7 days in a week.", options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", exp: "A week has 7 days." },
        { q: isHi ? "सबसे छोटी दो अंकों की संख्या कौन-सी है?" : "Which is the smallest 2-digit number?", options: ["9", "10", "11", "99"], ans: "10", exp: "10 is the smallest 2-digit number." }
      ];
    }
    if (c <= 5) {
      return [
        { q: isHi ? "24 × 5 का मान ज्ञात करें:" : "Find the product: 24 × 5", options: ["100", "110", "120", "125"], ans: "120", exp: "24 × 5 = 120." },
        { q: isHi ? "144 ÷ 12 बराबर है:" : "Divide 144 by 12:", options: ["10", "11", "12", "14"], ans: "12", exp: "12 × 12 = 144." },
        { q: isHi ? "12 मी लंबाई और 6 मी चौड़ाई वाले आयत का परिमाप:" : "Perimeter of a rectangle of length 12 m and breadth 6 m:", options: ["18 m", "36 m", "72 m", "24 m"], ans: "36 m", exp: "2 × (12 + 6) = 36 m." },
        { q: isHi ? "3/4 और 6/8 तुल्य भिन्न हैं।" : "3/4 and 6/8 are equivalent fractions.", options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", exp: "(3×2)/(4×2) = 6/8." },
        { q: isHi ? "1 किलोग्राम में ___ ग्राम होते हैं।" : "1 kilogram = ___ grams.", options: [], ans: "1000", exp: "1 kg = 1000 g." },
        { q: isHi ? "450 + 375 का योग:" : "Add 450 + 375:", options: ["815", "825", "725", "835"], ans: "825", exp: "450 + 375 = 825." },
        { q: isHi ? "एक समकोण का माप कितना होता है?" : "What is the measure of a right angle?", options: ["45°", "90°", "180°", "60°"], ans: "90°", exp: "A right angle measures 90°." },
        { q: isHi ? "1000 - 345 का मान:" : "Subtract 345 from 1000:", options: ["655", "665", "755", "645"], ans: "655", exp: "1000 - 345 = 655." }
      ];
    }
    if (c <= 8) {
      return [
        { q: isHi ? "समीकरण 3x - 5 = 16 में x का मान ज्ञात करें:" : "Solve for x: 3x - 5 = 16", options: ["5", "6", "7", "8"], ans: "7", exp: "3x = 21 → x = 7." },
        { q: isHi ? "(-12) × (-4) का मान:" : "Evaluate: (-12) × (-4)", options: ["-48", "48", "-16", "16"], ans: "48", exp: "Product of two negative integers is positive: 48." },
        { q: isHi ? "196 का वर्गमूल (√196) क्या है?" : "What is the square root of 196?", options: ["12", "13", "14", "16"], ans: "14", exp: "14 × 14 = 196." },
        { q: isHi ? "किसी त्रिभुज के तीनों कोणों का योग 180° होता है।" : "The sum of angles of any triangle is 180°.", options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", exp: "Angle sum property of a triangle = 180°." },
        { q: isHi ? "2⁵ ÷ 2² का मान 2^___ होगा।" : "2⁵ ÷ 2² = 2^___ (write exponent).", options: [], ans: "3", exp: "Using a^m ÷ a^n = a^(m-n): 5 - 2 = 3." },
        { q: isHi ? "25% को सरल भिन्न के रूप में लिखें:" : "Express 25% as a fraction in lowest form:", options: ["1/2", "1/4", "1/5", "3/4"], ans: "1/4", exp: "25/100 = 1/4." },
        { q: isHi ? "7 सेमी त्रिज्या वाले वृत्त का व्यास:" : "Diameter of a circle of radius 7 cm is:", options: ["7 cm", "14 cm", "21 cm", "44 cm"], ans: "14 cm", exp: "Diameter = 2 × radius = 14 cm." },
        { q: isHi ? "(x + 3)(x - 3) का प्रसार:" : "Expand (x + 3)(x - 3):", options: ["x² - 9", "x² + 9", "x² - 6x + 9", "x² - 3"], ans: "x² - 9", exp: "(a + b)(a - b) = a² - b² = x² - 9." }
      ];
    }
    // Classes 9-10
    return [
      { q: isHi ? "यदि बहुपद p(x) = x² - 5x + 6 है, तो p(2) का मान:" : "If p(x) = x² - 5x + 6, find p(2):", options: ["0", "2", "4", "-2"], ans: "0", exp: "p(2) = 4 - 10 + 6 = 0." },
      { q: isHi ? "द्विघात समीकरण x² - 9 = 0 के मूल हैं:" : "Roots of quadratic equation x² - 9 = 0 are:", options: ["±3", "±9", "3 only", "0, 3"], ans: "±3", exp: "x² = 9 → x = +3 or -3." },
      { q: isHi ? "समान्तर श्रेढ़ी 2, 5, 8, 11, ... का सार्व अंतर (d):" : "Common difference (d) of the AP 2, 5, 8, 11, ... is:", options: ["2", "3", "4", "5"], ans: "3", exp: "d = 5 - 2 = 3." },
      { q: isHi ? "sin²θ + cos²θ = 1 सभी θ के लिए सत्य है।" : "sin²θ + cos²θ = 1 holds for all real θ.", options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", exp: "Fundamental Pythagorean trigonometric identity." },
      { q: isHi ? "एक पासे को फेंकने पर 4 से बड़ी संख्या आने की प्रायिकता:" : "Probability of getting a number greater than 4 on a fair die:", options: ["1/2", "1/3", "1/6", "2/3"], ans: "1/3", exp: "Favourable: {5, 6} (2 outcomes) out of 6 → 2/6 = 1/3." },
      { q: isHi ? "बिंदु (3, 4) की मूल बिंदु (0, 0) से दूरी ___ इकाई है।" : "Distance of point (3, 4) from origin (0, 0) is ___ units.", options: [], ans: "5", exp: "√(3² + 4²) = √25 = 5." },
      { q: isHi ? "6 सेमी त्रिज्या वाले वृत्त का क्षेत्रफल (π के पदों में):" : "Area of a circle of radius 6 cm in terms of π:", options: ["12π cm²", "36π cm²", "6π cm²", "24π cm²"], ans: "36π cm²", exp: "Area = πr² = π(6)² = 36π cm²." },
      { q: isHi ? "HCF(18, 24) और LCM(18, 24) का गुणनफल:" : "Product of HCF(18, 24) and LCM(18, 24) is:", options: ["42", "432", "72", "216"], ans: "432", exp: "HCF × LCM = 18 × 24 = 432." }
    ];
  }

  if (sub === "science" || sub === "evs") {
    return [
      { q: isHi ? `(${clean}) शुद्ध जल का क्वथनांक कितना होता है?` : `(${clean}) What is the boiling point of pure water at 1 atm?`, options: ["0°C", "50°C", "100°C", "212°C"], ans: "100°C", exp: "Pure water boils at 100°C (373 K)." },
      { q: isHi ? `(${clean}) बल का SI मात्रक क्या है?` : `(${clean}) What is the SI unit of Force?`, options: ["Joule", "Watt", "Newton", "Pascal"], ans: "Newton", exp: "Force is measured in Newtons (N)." },
      { q: isHi ? `(${clean}) श्वसन एक ऊष्माक्षेपी (Exothermic) प्रक्रिया है।` : `(${clean}) Respiration is an exothermic process.`, options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", exp: "Respiration releases energy by oxidizing glucose." },
      { q: isHi ? `(${clean}) कोशिका की खोज किसने की थी?` : `(${clean}) Who discovered the cell in 1665?`, options: ["Robert Hooke", "Isaac Newton", "Charles Darwin", "Louis Pasteur"], ans: "Robert Hooke", exp: "Robert Hooke observed cork cells in 1665." },
      { q: isHi ? `(${clean}) चुंबक के ___ ध्रुव एक-दूसरे को आकर्षित करते हैं।` : `(${clean}) Unlike poles of two magnets ___ each other.`, options: [], ans: isHi ? "असमान" : "attract", exp: "North and South poles attract; like poles repel." },
      { q: isHi ? `(${clean}) मनुष्य में सामान्य शरीर का तापमान लगभग कितना होता है?` : `(${clean}) Normal human body temperature is approximately:`, options: ["37°C", "98°C", "25°C", "100°C"], ans: "37°C", exp: "Normal body temperature is 37°C (98.6°F)." },
      { q: isHi ? `(${clean}) अम्ल नीले लिटमस को किस रंग में बदलते हैं?` : `(${clean}) Acids turn blue litmus paper:`, options: ["Green", "Red", "Yellow", "Black"], ans: "Red", exp: "Acids turn blue litmus red; bases turn red litmus blue." },
      { q: isHi ? `(${clean}) ध्वनि निर्वात (Vacuum) में यात्रा नहीं कर सकती।` : `(${clean}) Sound cannot travel through a vacuum.`, options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", exp: "Sound is a mechanical wave and needs a medium." }
    ];
  }

  if (sub === "social") {
    return [
      { q: isHi ? `(${clean}) कर्क रेखा भारत के कितने राज्यों से गुजरती है?` : `(${clean}) Through how many Indian states does the Tropic of Cancer pass?`, options: ["6", "7", "8", "9"], ans: "8", exp: "It passes through 8 Indian states including Madhya Pradesh." },
      { q: isHi ? `(${clean}) भारतीय संविधान के प्रारूप समिति के अध्यक्ष कौन थे?` : `(${clean}) Who was the Chairman of the Drafting Committee of the Indian Constitution?`, options: ["Dr. B.R. Ambedkar", "Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel"], ans: "Dr. B.R. Ambedkar", exp: "Dr. B.R. Ambedkar chaired the Drafting Committee." },
      { q: isHi ? `(${clean}) भारत एक लोकतांत्रिक गणराज्य है।` : `(${clean}) India is a democratic republic.`, options: isHi ? ["सही", "गलत"] : ["True", "False"], ans: isHi ? "सही" : "True", exp: "Citizens elect their representatives and the head of state is elected." },
      { q: isHi ? `(${clean}) पृथ्वी का सबसे बड़ा महासागर कौन-सा है?` : `(${clean}) Which is the largest ocean on Earth?`, options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], ans: "Pacific Ocean", exp: "The Pacific Ocean is the largest and deepest ocean." },
      { q: isHi ? `(${clean}) भारत में मतदाता बनने की न्यूनतम आयु ___ वर्ष है।` : `(${clean}) Minimum voting age in India is ___ years.`, options: [], ans: "18", exp: "Universal adult franchise in India starts at 18 years." },
      { q: isHi ? `(${clean}) विश्व की सबसे लंबी पर्वत श्रृंखला कौन-सी है?` : `(${clean}) Which plateau is known as the Roof of the World?`, options: ["Deccan Plateau", "Tibetan Plateau", "Chotanagpur Plateau", "Malwa Plateau"], ans: "Tibetan Plateau", exp: "The Tibetan Plateau is the highest and largest plateau." }
    ];
  }

  // Language chapters (English / Hindi / Sanskrit / Grammar): only return chapter exercises, no filler!
  return [];
}

function padChapterToTen(ch, qsForCh) {
  // Maths questions and textbook exercises must never be padded with cross-chapter filler.
  if (ch.subjectId === "maths") return [];

  const problems = buildSubjectSpecificProblems(ch);
  const exs = ch.exercises ? ch.exercises.slice() : [];
  let pIdx = 0;
  while (exs.length < 10 && pIdx < problems.length) {
    const pr = problems[pIdx++];
    exs.push({
      qNo: String(exs.length + 1),
      marks: 1,
      q: pr.q,
      hint: pr.exp,
      ans: pr.ans,
      steps: pr.exp
    });
  }
  ch.exercises = exs;

  const addedQs = [];
  let qIdx = 0;
  while (qsForCh.length + addedQs.length < 10 && qIdx < problems.length) {
    const pr = problems[qIdx++];
    addedQs.push({
      id: `q-sub-${ch.id}-${qsForCh.length + addedQs.length + 1}`,
      chapterId: ch.id, bookId: ch.bookId, board: ch.board, medium: ch.medium,
      classNum: ch.classNum, subjectId: ch.subjectId, topic: ch.title,
      type: pr.options.length === 2 ? "TF" : (pr.options.length === 0 ? "FILL" : "MCQ"),
      difficulty: "Medium", marks: 1,
      q: pr.q, options: pr.options, ans: pr.ans, explanation: pr.exp, solution: pr.exp
    });
  }
  return addedQs;
}

export function generateFullSyllabusCoverage(existingBooks, existingChapters, existingQuestions) {
  const boards = ["NCERT", "CBSE", "MP_BOARD"];
  const mediums = ["EN", "HI"];
  const bookMap = new Map();
  for (const b of existingBooks) {
    bookMap.set(`${b.classNum}|${b.board}|${b.medium}|${b.subjectId}`, b);
  }
  const existingChByBook = new Map();
  for (const c of existingChapters) {
    if (!existingChByBook.has(c.bookId)) existingChByBook.set(c.bookId, []);
    existingChByBook.get(c.bookId).push(c);
  }

  const newBooks = [];
  const newChapters = [];
  const newQuestions = [];

  for (let classNum = 1; classNum <= 10; classNum++) {
    const cls = String(classNum);
    const catalog = CHAPTER_CATALOG[cls] || {};
    for (const board of boards) {
      for (const medium of mediums) {
        for (const [sub, spec] of Object.entries(catalog)) {
          const key = `${cls}|${board}|${medium}|${sub}`;
          let book = bookMap.get(key);
          if (!book) {
            const meta = SUB_META[sub];
            book = {
              id: `tb-c${cls}-${board.toLowerCase()}-${medium.toLowerCase()}-${sub}`,
              title: medium === "HI" ? spec.hiBook : spec.enBook,
              board,
              medium,
              classNum: cls,
              subjectId: sub,
              subjectName: medium === "HI" ? meta.hi : meta.en,
              subjectIcon: sub,
              session: "2026-27",
              publisher: board === "MP_BOARD" ? "MPBSE / SCERT MP (mpbse.nic.in)" : "NCERT / CBSE (ncert.nic.in)",
              coverColor: meta.color,
              status: "Published",
              offlineDownloaded: true
            };
            newBooks.push(book);
            bookMap.set(key, book);
          }

          const existingForBook = existingChByBook.get(book.id) || [];
          const existingSeqs = new Set(existingForBook.map((c) => Number(c.sequence)));
          const chTitles = medium === "HI" ? spec.hi : spec.en;

          chTitles.forEach((chTitle, idx) => {
            const seq = idx + 1;
            if (existingSeqs.has(seq)) return; // keep hand-crafted chapter at this sequence
            const content = buildChapterSpecificContent(cls, sub, medium, chTitle);
            const chId = `ch-${book.id}-${seq}`;
            newChapters.push({
              id: chId,
              bookId: book.id,
              board,
              medium,
              classNum: cls,
              subjectId: sub,
              sequence: seq,
              title: chTitle,
              sourceType: `Original Supplementary Content (aligned with ${board} Class ${cls} ${medium} 2026-27 syllabus)`,
              status: "Published",
              intro: content.intro,
              objectives: content.objectives,
              explanation: content.explanation,
              concepts: content.concepts,
              examples: content.examples,
              diagramType: "",
              facts: [],
              revision: content.objectives,
              exercises: content.exercises
            });
            content.questions.forEach((q, qIdx) => {
              newQuestions.push({
                id: `q-${chId}-${qIdx + 1}`,
                chapterId: chId,
                bookId: book.id,
                board,
                medium,
                classNum: cls,
                subjectId: sub,
                topic: chTitle,
                type: q.options && q.options.length === 2 ? "TF" : (q.options && q.options.length === 0 ? "FILL" : "MCQ"),
                difficulty: "Easy",
                marks: 1,
                q: q.q,
                options: q.options,
                ans: q.ans,
                explanation: q.explanation,
                solution: q.explanation
              });
            });
          });
        }
      }
    }
  }

  
  // Pad all existing + new chapters to >= 10 exercises and >= 10 questions
  const allChs = [...existingChapters, ...newChapters];
  const allQs = [...existingQuestions, ...newQuestions];
  const qsByCh = new Map();
  for (const q of allQs) {
    if (!qsByCh.has(q.chapterId)) qsByCh.set(q.chapterId, []);
    qsByCh.get(q.chapterId).push(q);
  }
  for (const ch of allChs) {
    const extra = padChapterToTen(ch, qsByCh.get(ch.id) || []);
    newQuestions.push(...extra);
  }
  return { newBooks, newChapters, newQuestions };

}
