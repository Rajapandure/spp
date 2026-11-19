// Verified 2026-27 Curriculum Seed (Part 2: Classes 6 to 10 across NCERT, CBSE, MP Board; EN & HI)
// Official syllabus references: ncert.nic.in/textbook.php & mpbse.nic.in

export function getSeedPart2() {
  const textbooks = [
    // CLASS 6
    { id: "tb-c6-ncert-en-math", title: "Ganita Prakash (Class 6)", board: "NCERT", medium: "EN", classNum: "6", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT (ncert.nic.in)", coverColor: "#2563eb", status: "Published", offlineDownloaded: true },
    { id: "tb-c6-ncert-en-sci", title: "Curiosity (Class 6 Science)", board: "NCERT", medium: "EN", classNum: "6", subjectId: "science", subjectName: "Science", subjectIcon: "science", session: "2026-27", publisher: "NCERT", coverColor: "#4f46e5", status: "Published", offlineDownloaded: true },

    // CLASS 7
    { id: "tb-c7-cbse-en-math", title: "Ganita Prakash Part 1 (Class 7)", board: "CBSE", medium: "EN", classNum: "7", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT / CBSE", coverColor: "#4f46e5", status: "Published", offlineDownloaded: true },

    // CLASS 8
    { id: "tb-c8-mp-hi-hin", title: "भाषा भारती (कक्षा 8 - म.प्र. बोर्ड)", board: "MP_BOARD", medium: "HI", classNum: "8", subjectId: "hindi", subjectName: "हिन्दी (भाषा भारती)", subjectIcon: "hindi", session: "2026-27", publisher: "SCERT MP (mpbse.nic.in)", coverColor: "#ea580c", status: "Published", offlineDownloaded: true },
    { id: "tb-c8-mp-en-eng", title: "English Reader (Class 8 MP Board)", board: "MP_BOARD", medium: "EN", classNum: "8", subjectId: "english", subjectName: "English", subjectIcon: "english", session: "2026-27", publisher: "SCERT MP (mpbse.nic.in)", coverColor: "#0d9488", status: "Published", offlineDownloaded: true },

    // CLASS 9
    { id: "tb-c9-ncert-en-math", title: "Ganita Manjari (Class 9)", board: "NCERT", medium: "EN", classNum: "9", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT", coverColor: "#1d4ed8", status: "Published", offlineDownloaded: true },
    { id: "tb-c9-ncert-en-sci", title: "Exploration (Class 9 Science)", board: "NCERT", medium: "EN", classNum: "9", subjectId: "science", subjectName: "Science", subjectIcon: "science", session: "2026-27", publisher: "NCERT", coverColor: "#4338ca", status: "Published", offlineDownloaded: false },

    // CLASS 10 MP BOARD ENGLISH MEDIUM (Used in TEST 3!) & NCERT/CBSE
    { id: "tb-c10-mp-en-math", title: "Mathematics (Class 10 MP Board / NCERT)", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "MPBSE / NCERT (mpbse.nic.in)", coverColor: "#0f172a", status: "Published", offlineDownloaded: true },
    { id: "tb-c10-mp-en-sci", title: "Science (Class 10 MP Board / NCERT)", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", subjectName: "Science", subjectIcon: "science", session: "2026-27", publisher: "MPBSE / NCERT (mpbse.nic.in)", coverColor: "#1e40af", status: "Published", offlineDownloaded: true },
    { id: "tb-c10-mp-en-eng", title: "First Flight (Class 10 English)", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "english", subjectName: "English", subjectIcon: "english", session: "2026-27", publisher: "MPBSE / NCERT", coverColor: "#be185d", status: "Published", offlineDownloaded: true },
    { id: "tb-c10-mp-en-soc", title: "Contemporary India - II (Class 10 Social Science)", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "social", subjectName: "Social Science", subjectIcon: "social", session: "2026-27", publisher: "MPBSE / NCERT", coverColor: "#b45309", status: "Published", offlineDownloaded: false },

    // CLASS 10 CBSE / NCERT EN
    { id: "tb-c10-cbse-en-math", title: "Mathematics (Class 10 CBSE / NCERT)", board: "CBSE", medium: "EN", classNum: "10", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT / CBSE", coverColor: "#0f172a", status: "Published", offlineDownloaded: true },
    { id: "tb-c10-ncert-en-math", title: "Mathematics (Class 10 NCERT)", board: "NCERT", medium: "EN", classNum: "10", subjectId: "maths", subjectName: "Mathematics", subjectIcon: "maths", session: "2026-27", publisher: "NCERT", coverColor: "#0f172a", status: "Published", offlineDownloaded: true }
  ];

  const chapters = [
    // Class 6
    {
      id: "ch-c6-ncert-en-math-1", bookId: "tb-c6-ncert-en-math", board: "NCERT", medium: "EN", classNum: "6", subjectId: "maths", sequence: 1,
      title: "Chapter 1: Patterns in Mathematics",
      sourceType: "Original Supplementary Content (aligned with NCERT Class 6 Ganita Prakash Ch 1)",
      status: "Published",
      intro: "Mathematics is the study of patterns in numbers and shapes — triangular numbers, square numbers, and powers of 2.",
      objectives: ["Recognize square and triangular number sequences", "Relate number sequences to visual dot patterns"],
      explanation: "Square numbers (1, 4, 9, 16, 25...) are formed by n × n. Triangular numbers (1, 3, 6, 10, 15...) are formed by adding consecutive counting numbers: 1, 1+2, 1+2+3, ...",
      concepts: [{ term: "Square Numbers", def: "1, 4, 9, 16, 25... obtained by multiplying a number by itself." }],
      examples: [{ q: "Find the 5th triangular number.", a: "1 + 2 + 3 + 4 + 5 = 15." }],
      diagramType: "", facts: ["Adding two consecutive triangular numbers always gives a square number!"],
      revision: ["1, 4, 9, 16, 25 = Square numbers", "1, 3, 6, 10, 15 = Triangular numbers"],
      exercises: [{ qNo: "1", marks: 2, q: "What is the sum of the 3rd and 4th triangular numbers?", hint: "3rd = 6, 4th = 10.", ans: "16 (which is 4²)", steps: "1. 3rd triangular = 1+2+3 = 6\n2. 4th triangular = 1+2+3+4 = 10\n3. Sum = 6 + 10 = 16 = 4²." }]
    },
    // Class 7
    {
      id: "ch-c7-cbse-en-math-1", bookId: "tb-c7-cbse-en-math", board: "CBSE", medium: "EN", classNum: "7", subjectId: "maths", sequence: 1,
      title: "Chapter 1: Large Numbers Around Us & Integers",
      sourceType: "Original Supplementary Content (aligned with NCERT Class 7 Ganita Prakash)",
      status: "Published",
      intro: "Extend number operations to negative integers and large numbers in real contexts.",
      objectives: ["Add and subtract positive and negative integers", "Apply sign rules in multiplication"],
      explanation: "Integers include positive numbers, zero, and negative numbers (..., -3, -2, -1, 0, 1, 2, 3, ...). Adding a negative integer moves left on the number line.",
      concepts: [{ term: "Additive Inverse", def: "For any integer a, a + (-a) = 0." }],
      examples: [{ q: "Evaluate (-8) + 13.", a: "5." }],
      diagramType: "", facts: ["Zero is neither positive nor negative."],
      revision: ["(-) × (-) = (+)", "(+) × (-) = (-)"],
      exercises: [{ qNo: "1", marks: 2, q: "Evaluate: (-15) × (-4) + 10", hint: "Product of two negatives is positive.", ans: "70", steps: "1. (-15) × (-4) = +60\n2. 60 + 10 = 70." }]
    },
    // Class 8 MP Board Hindi Medium
    {
      id: "ch-c8-mp-hi-hin-1", bookId: "tb-c8-mp-hi-hin", board: "MP_BOARD", medium: "HI", classNum: "8", subjectId: "hindi", sequence: 1,
      title: "पाठ 1: वर दे (कविता - सूर्यकांत त्रिपाठी 'निराला')",
      sourceType: "Original Supplementary Content (aligned with MP Board कक्षा 8 भाषा भारती पाठ 1)",
      status: "Published",
      intro: "कवि सूर्यकांत त्रिपाठी 'निराला' ने माँ सरस्वती से अज्ञान के अंधकार को दूर कर ज्ञान का प्रकाश फैलाने की प्रार्थना की है।",
      objectives: ["कविता का भावार्थ समझना", "उपमा और अनुप्रास अलंकार पहचानना"],
      explanation: "कवि माँ वीणावादिनी (सरस्वती) से वरदान माँगते हैं कि वे भारतवासियों के हृदय से अज्ञान और जड़ता के बंधन काट दें और नव-ज्ञान का प्रकाश भर दें।",
      concepts: [{ term: "वीणावादिनी", def: "वीणा बजाने वाली अर्थात् माँ सरस्वती।" }],
      examples: [{ q: "'वर दे' कविता के रचयिता कौन हैं?", a: "सूर्यकांत त्रिपाठी 'निराला'।" }],
      diagramType: "", facts: ["'निराला' छायावाद के प्रमुख स्तंभ माने जाते हैं।"],
      revision: ["कवि: सूर्यकांत त्रिपाठी 'निराला'", "मुख्य भाव: स्वतंत्रता और ज्ञान का प्रकाश।"],
      exercises: [{ qNo: "1", marks: 2, q: "कवि माँ सरस्वती से किस प्रकार का वरदान माँग रहा है?", hint: "अंधकार और बंधन से मुक्ति।", ans: "कवि अज्ञान का अंधकार मिटाकर ज्ञान, स्वतंत्रता और नवीनता का वरदान माँग रहा है।", steps: "1. अज्ञान के बंधन काटना।\n2. हृदय में ज्ञान का प्रकाश भरना।" }]
    },
    // Class 9
    {
      id: "ch-c9-ncert-en-math-1", bookId: "tb-c9-ncert-en-math", board: "NCERT", medium: "EN", classNum: "9", subjectId: "maths", sequence: 1,
      title: "Chapter 1: Number Systems (Rational & Irrational Numbers)",
      sourceType: "Original Supplementary Content (aligned with NCERT Class 9 Ganita Manjari / Mathematics)",
      status: "Published",
      intro: "Explore rational numbers, irrational numbers like √2, and laws of exponents for real numbers.",
      objectives: ["Distinguish rational and irrational numbers", "Rationalize denominators"],
      explanation: "A number r is rational if it can be written as p/q where p, q are integers and q ≠ 0. Numbers like √2, √3, π have non-terminating, non-repeating decimal expansions and are irrational.",
      concepts: [{ term: "Rationalization", def: "Multiplying numerator and denominator by a conjugate/surd to make the denominator rational." }],
      examples: [{ q: "Rationalize 1 / √5.", a: "(1 × √5) / (√5 × √5) = √5 / 5." }],
      diagramType: "", facts: ["Every real number is either rational or irrational."],
      revision: ["(a + √b)(a - √b) = a² - b"],
      exercises: [{ qNo: "1", marks: 3, q: "Rationalize the denominator of 1 / (√7 - √6).", hint: "Multiply top and bottom by (√7 + √6).", ans: "√7 + √6", steps: "1. Multiply by (√7 + √6)/(√7 + √6)\n2. Denominator = (√7)² - (√6)² = 7 - 6 = 1\n3. Result = √7 + √6." }]
    },

    // CLASS 10 MP BOARD ENGLISH MEDIUM (Used in TEST 3!)
    {
      id: "ch-c10-mp-en-math-1", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", sequence: 1,
      title: "Chapter 1: Real Numbers",
      sourceType: "Original Supplementary Content (aligned with MPBSE / NCERT Class 10 Mathematics Ch 1)",
      status: "Published",
      intro: "Master the Fundamental Theorem of Arithmetic, HCF & LCM by prime factorization, and proofs of irrationality for Board Exams.",
      objectives: ["Apply Fundamental Theorem of Arithmetic", "Verify HCF(a, b) × LCM(a, b) = a × b", "Prove irrationality of √2, √3, √5"],
      explanation: "Fundamental Theorem of Arithmetic: Every composite number can be expressed (factorised) as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur. For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b.",
      concepts: [
        { term: "Fundamental Theorem of Arithmetic", def: "Unique prime factorization of every composite number." },
        { term: "HCF × LCM Identity", def: "For two positive integers a and b, HCF(a, b) × LCM(a, b) = a × b." }
      ],
      examples: [
        { q: "Find HCF and LCM of 26 and 91, and verify HCF × LCM = Product.", a: "26 = 2 × 13, 91 = 7 × 13. HCF = 13, LCM = 2 × 7 × 13 = 182. Check: 13 × 182 = 2366 and 26 × 91 = 2366." }
      ],
      diagramType: "",
      facts: ["The HCF of two co-prime numbers is always 1."],
      revision: ["HCF = product of smallest powers of common prime factors", "LCM = product of greatest powers of all prime factors"],
      exercises: [
        { qNo: "Ex 1.1 Q1", marks: 2, q: "Express 140 as a product of its prime factors.", hint: "Divide repeatedly by smallest primes 2, 5, 7.", ans: "2² × 5 × 7", steps: "1. 140 ÷ 2 = 70\n2. 70 ÷ 2 = 35\n3. 35 ÷ 5 = 7\n4. 140 = 2 × 2 × 5 × 7 = 2² × 5 × 7." },
        { qNo: "Ex 1.1 Q4", marks: 3, q: "Given that HCF(306, 657) = 9, find LCM(306, 657).", hint: "Use LCM = (a × b) / HCF.", ans: "22338", steps: "1. LCM(306, 657) = (306 × 657) / 9\n2. 306 ÷ 9 = 34\n3. 34 × 657 = 22338." }
      ]
    },
    {
      id: "ch-c10-mp-en-math-8", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", sequence: 8,
      title: "Chapter 8: Introduction to Trigonometry",
      sourceType: "Original Supplementary Content (aligned with MPBSE / NCERT Class 10 Mathematics Ch 8)",
      status: "Published",
      intro: "Learn the six trigonometric ratios, standard angle values (0°, 30°, 45°, 60°, 90°), and fundamental trigonometric identities.",
      objectives: ["Define sin, cos, tan, cosec, sec, cot in a right triangle", "Evaluate expressions using standard angle table", "Apply sin²θ + cos²θ = 1"],
      explanation: "In a right-angled triangle ABC (right-angled at B), for acute angle A: sin A = Opposite / Hypotenuse = BC/AC, cos A = Adjacent / Hypotenuse = AB/AC, tan A = Opposite / Adjacent = BC/AB. Key identities: (1) sin²A + cos²A = 1, (2) 1 + tan²A = sec²A, (3) 1 + cot²A = cosec²A.",
      concepts: [
        { term: "sin²θ + cos²θ = 1", def: "Fundamental Pythagorean trigonometric identity valid for all angles θ." },
        { term: "tan θ", def: "Defined as sin θ / cos θ (for cos θ ≠ 0)." }
      ],
      examples: [
        { q: "If sin A = 3/5, find cos A and tan A.", a: "Let opposite = 3k, hyp = 5k. By Pythagoras, adjacent = √(25k² - 9k²) = 4k. Thus cos A = 4/5, tan A = 3/4." }
      ],
      diagramType: "trigonometry_c10",
      facts: ["sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, sin 90° = 1."],
      revision: ["SOH-CAH-TOA", "1 + tan²θ = sec²θ", "1 + cot²θ = cosec²θ"],
      exercises: [
        { qNo: "Ex 8.2 Q1(i)", marks: 2, q: "Evaluate: sin 60° cos 30° + sin 30° cos 60°.", hint: "Substitute standard values: sin 60° = √3/2, cos 30° = √3/2, sin 30° = 1/2, cos 60° = 1/2.", ans: "1", steps: "1. (√3/2)(√3/2) + (1/2)(1/2)\n2. = 3/4 + 1/4 = 4/4 = 1." }
      ]
    },
    {
      id: "ch-c10-mp-en-sci-1", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", sequence: 1,
      title: "Chapter 1: Chemical Reactions and Equations",
      sourceType: "Original Supplementary Content (aligned with MPBSE / NCERT Class 10 Science Ch 1)",
      status: "Published",
      intro: "Understand balancing chemical equations, types of reactions (combination, decomposition, displacement, redox), corrosion, and rancidity.",
      objectives: ["Balance chemical equations using Law of Conservation of Mass", "Classify the 5 main types of chemical reactions"],
      explanation: "A chemical reaction involves breaking and making of bonds to form new substances. By the Law of Conservation of Mass, total atoms of each element must be equal on both sides. Example: 2Mg + O₂ → 2MgO (Combination & Oxidation).",
      concepts: [
        { term: "Oxidation & Reduction (Redox)", def: "Oxidation is gain of oxygen or loss of hydrogen; Reduction is loss of oxygen or gain of hydrogen." },
        { term: "Rancidity", def: "Oxidation of fats and oils in food causing bad smell and taste; prevented by flushing chips bags with Nitrogen." }
      ],
      examples: [{ q: "Why is respiration considered an exothermic process?", a: "Glucose combines with oxygen in cells to release energy: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy." }],
      diagramType: "",
      facts: ["Quicklime is CaO (Calcium Oxide); Slaked lime is Ca(OH)₂."],
      revision: ["Exothermic = releases heat", "Endothermic = absorbs heat"],
      exercises: [
        { qNo: "Ex Q1", marks: 2, q: "Why should a magnesium ribbon be cleaned before burning in air?", hint: "Think about the oxide layer formed on magnesium.", ans: "To remove the protective layer of basic magnesium oxide/carbonate so it burns easily.", steps: "1. Magnesium reacts with air to form a surface oxide layer.\n2. Rubbing with sandpaper removes it for clean combustion." }
      ]
    },
    {
      id: "ch-c10-mp-en-sci-11", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", sequence: 11,
      title: "Chapter 11: Electricity",
      sourceType: "Original Supplementary Content (aligned with MPBSE / NCERT Class 10 Science Ch 11)",
      status: "Published",
      intro: "Study electric current, potential difference, Ohm's Law, series and parallel resistance, and Joule's law of heating.",
      objectives: ["Apply I = Q/t and V = IR", "Calculate equivalent resistance in series and parallel", "Compute electric power P = VI"],
      explanation: "Electric current I = Q/t (SI unit: Ampere, A). Potential difference V = W/Q (SI unit: Volt, V). Ohm's Law states that at constant temperature, V ∝ I, i.e., V = I × R, where R is Resistance (Ohm, Ω). In series: Rs = R₁ + R₂. In parallel: 1/Rp = 1/R₁ + 1/R₂.",
      concepts: [
        { term: "Ohm's Law", def: "V = I × R at constant temperature." },
        { term: "Joule's Law of Heating", def: "Heat produced H = I²Rt." }
      ],
      examples: [{ q: "A 12 V battery is connected across a 4 Ω resistor. Find current.", a: "I = V / R = 12 / 4 = 3 A." }],
      diagramType: "ohms_law_c10",
      facts: ["SI unit of resistivity is Ω·m; Tungsten is used in bulb filaments due to high melting point."],
      revision: ["1 kWh = 3.6 × 10⁶ Joules"],
      exercises: [
        { qNo: "Ex Q3", marks: 3, q: "How much current will an electric bulb draw from a 220 V source if the resistance of the bulb filament is 1200 Ω?", hint: "Use I = V / R.", ans: "0.18 A", steps: "1. Given V = 220 V, R = 1200 Ω\n2. I = V / R = 220 / 1200 = 11 / 60 ≈ 0.18 A." }
      ]
    },
    {
      id: "ch-c10-mp-en-eng-1", bookId: "tb-c10-mp-en-eng", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "english", sequence: 1,
      title: "Chapter 1: A Letter to God (G.L. Fuentes)",
      sourceType: "Original Supplementary Content (aligned with MPBSE / NCERT Class 10 First Flight Ch 1)",
      status: "Published",
      intro: "Read the story of Lencho, a hardworking farmer whose unwavering faith in God leads to an ironic twist.",
      objectives: ["Analyze character traits of Lencho and the Postmaster", "Understand situational irony in the ending"],
      explanation: "Lencho's cornfield is destroyed by a hailstorm. Having deep faith, he writes a letter to God asking for 100 pesos. The kind postmaster collects 70 pesos from colleagues and signs it 'God'. Lencho, however, suspects the post office employees stole the remaining 30 pesos.",
      concepts: [{ term: "Situational Irony", def: "Lencho calls the very people who helped him 'a bunch of crooks'." }],
      examples: [{ q: "Why did the postmaster send money to Lencho?", a: "He was moved by Lencho's unshakeable faith in God and did not want to shake it." }],
      diagramType: "", facts: ["Author: Gregorio López y Fuentes (Mexican writer)."],
      revision: ["Lencho asked for 100 pesos, received 70 pesos."],
      exercises: [{ qNo: "1", marks: 2, q: "What did Lencho hope for?", hint: "Look at the beginning of the story.", ans: "Lencho hoped for a good rain or at least a shower for his ripe cornfield.", steps: "1. His crops needed water.\n2. He watched the sky hoping for rain." }]
    }
  ];

  // 22+ Class 10 MP Board English Medium Questions so 20-Q Mock Papers work completely!
  const questions = [
    // Class 6
    { id: "q-c6-m1-1", chapterId: "ch-c6-ncert-en-math-1", bookId: "tb-c6-ncert-en-math", board: "NCERT", medium: "EN", classNum: "6", subjectId: "maths", topic: "Number Patterns", type: "MCQ", difficulty: "Easy", marks: 1, q: "Which of the following is a triangular number?", options: ["8", "10", "12", "14"], ans: "10", explanation: "1 + 2 + 3 + 4 = 10 is the 4th triangular number.", solution: "10." },
    // Class 7
    { id: "q-c7-m1-1", chapterId: "ch-c7-cbse-en-math-1", bookId: "tb-c7-cbse-en-math", board: "CBSE", medium: "EN", classNum: "7", subjectId: "maths", topic: "Integers", type: "MCQ", difficulty: "Easy", marks: 1, q: "What is the value of (-6) × (-5)?", options: ["-30", "30", "-11", "11"], ans: "30", explanation: "Product of two negative integers is positive.", solution: "(-6) × (-5) = +30." },
    // Class 8 MP HI
    { id: "q-c8-mp-1", chapterId: "ch-c8-mp-hi-hin-1", bookId: "tb-c8-mp-hi-hin", board: "MP_BOARD", medium: "HI", classNum: "8", subjectId: "hindi", topic: "कवि परिचय", type: "MCQ", difficulty: "Easy", marks: 1, q: "'वर दे' कविता के कवि कौन हैं?", options: ["मैथिलीशरण गुप्त", "सूर्यकांत त्रिपाठी 'निराला'", "जयशंकर प्रसाद", "महादेवी वर्मा"], ans: "सूर्यकांत त्रिपाठी 'निराला'", explanation: "'वर दे' कविता निराला जी द्वारा रचित है।", solution: "सूर्यकांत त्रिपाठी 'निराला'।" },
    // Class 9
    { id: "q-c9-m1-1", chapterId: "ch-c9-ncert-en-math-1", bookId: "tb-c9-ncert-en-math", board: "NCERT", medium: "EN", classNum: "9", subjectId: "maths", topic: "Irrational Numbers", type: "MCQ", difficulty: "Medium", marks: 1, q: "Which of the following is an irrational number?", options: ["√4", "0.25", "√2", "22/7"], ans: "√2", explanation: "√2 has a non-terminating, non-repeating decimal expansion.", solution: "√2." },

    // CLASS 10 MP BOARD ENGLISH MEDIUM — MATHS (12 questions)
    { id: "q-c10-m1-1", chapterId: "ch-c10-mp-en-math-1", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "Prime Factorization", type: "MCQ", difficulty: "Easy", marks: 1, q: "The prime factorisation of 96 is:", options: ["2⁵ × 3", "2⁴ × 3²", "2³ × 3", "2⁵ × 3²"], ans: "2⁵ × 3", explanation: "96 = 32 × 3 = 2⁵ × 3.", solution: "96 = 2 × 2 × 2 × 2 × 2 × 3 = 2⁵ × 3." },
    { id: "q-c10-m1-2", chapterId: "ch-c10-mp-en-math-1", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "HCF & LCM", type: "MCQ", difficulty: "Easy", marks: 1, q: "What is the HCF of two consecutive even numbers?", options: ["1", "2", "4", "0"], ans: "2", explanation: "Two consecutive even numbers (like 4 and 6) share only 2 as their highest common factor.", solution: "2." },
    { id: "q-c10-m1-3", chapterId: "ch-c10-mp-en-math-1", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "HCF & LCM", type: "MCQ", difficulty: "Medium", marks: 1, q: "If HCF(26, 91) = 13, then LCM(26, 91) is:", options: ["91", "182", "364", "13"], ans: "182", explanation: "LCM = (26 × 91) / 13 = 2 × 91 = 182.", solution: "182." },
    { id: "q-c10-m1-4", chapterId: "ch-c10-mp-en-math-1", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "Irrationality", type: "TF", difficulty: "Easy", marks: 1, q: "The product of a non-zero rational number and an irrational number is always irrational.", options: ["True", "False"], ans: "True", explanation: "Multiplying a non-zero rational with an irrational number always yields an irrational number.", solution: "True." },
    { id: "q-c10-m1-5", chapterId: "ch-c10-mp-en-math-1", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "HCF & LCM", type: "FILL", difficulty: "Easy", marks: 1, q: "For any two positive integers a and b, HCF(a, b) × LCM(a, b) = ___.", options: [], ans: "a*b", explanation: "Product of HCF and LCM equals the product of the two numbers (a × b).", solution: "a × b (or a*b)." },
    { id: "q-c10-m1-6", chapterId: "ch-c10-mp-en-math-1", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "HCF & LCM", type: "SHORT", difficulty: "Medium", marks: 2, q: "Find the LCM and HCF of 12, 15, and 21 by the prime factorisation method.", options: [], ans: "HCF = 3, LCM = 420", explanation: "12 = 2²×3, 15 = 3×5, 21 = 3×7. Common factor = 3; LCM = 4×3×5×7 = 420.", solution: "HCF = 3, LCM = 420." },
    { id: "q-c10-m8-1", chapterId: "ch-c10-mp-en-math-8", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "Trigonometric Ratios", type: "MCQ", difficulty: "Easy", marks: 1, q: "If sin A = 1/2, then the value of angle A (0° ≤ A ≤ 90°) is:", options: ["0°", "30°", "45°", "60°"], ans: "30°", explanation: "From the standard trigonometry table, sin 30° = 1/2.", solution: "30°." },
    { id: "q-c10-m8-2", chapterId: "ch-c10-mp-en-math-8", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "Trigonometric Identities", type: "MCQ", difficulty: "Medium", marks: 1, q: "What is the value of 9 sec²A - 9 tan²A?", options: ["1", "9", "8", "0"], ans: "9", explanation: "9(sec²A - tan²A) = 9(1) = 9.", solution: "9." },
    { id: "q-c10-m8-3", chapterId: "ch-c10-mp-en-math-8", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "Standard Angles", type: "MCQ", difficulty: "Medium", marks: 1, q: "The value of (1 - tan²45°) / (1 + tan²45°) is:", options: ["tan 90°", "1", "sin 45°", "0"], ans: "0", explanation: "tan 45° = 1, so (1 - 1)/(1 + 1) = 0/2 = 0.", solution: "0." },
    { id: "q-c10-m8-4", chapterId: "ch-c10-mp-en-math-8", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "Trigonometric Ratios", type: "MCQ", difficulty: "Hard", marks: 1, q: "In ΔABC right-angled at B, AB = 24 cm, BC = 7 cm. Find sin A.", options: ["7/25", "24/25", "7/24", "24/7"], ans: "7/25", explanation: "AC = √(24² + 7²) = √625 = 25 cm. sin A = BC/AC = 7/25.", solution: "7/25." },
    { id: "q-c10-m8-5", chapterId: "ch-c10-mp-en-math-8", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "Trigonometric Identities", type: "TF", difficulty: "Easy", marks: 1, q: "sin²θ + cos²θ = 1 is true for all values of θ.", options: ["True", "False"], ans: "True", explanation: "It is the fundamental Pythagorean identity.", solution: "True." },
    { id: "q-c10-m8-6", chapterId: "ch-c10-mp-en-math-8", bookId: "tb-c10-mp-en-math", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "maths", topic: "Trigonometric Identities", type: "LONG", difficulty: "Hard", marks: 3, q: "Prove that (sec A + tan A)(1 - sin A) = cos A.", options: [], ans: "cos A", explanation: "Convert sec A = 1/cos A and tan A = sin A/cos A, multiply by (1 - sin A) to get (1 - sin²A)/cos A = cos²A/cos A = cos A.", solution: "LHS = (1/cos A + sin A/cos A)(1 - sin A) = (1 + sin A)(1 - sin A)/cos A = (1 - sin²A)/cos A = cos²A/cos A = cos A." },

    // CLASS 10 MP BOARD ENGLISH MEDIUM — SCIENCE (10 questions)
    { id: "q-c10-s1-1", chapterId: "ch-c10-mp-en-sci-1", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", topic: "Chemical Reactions", type: "MCQ", difficulty: "Easy", marks: 1, q: "Which gas is flushed into bags of potato chips to prevent rancidity?", options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon dioxide"], ans: "Nitrogen", explanation: "Nitrogen is an unreactive gas that prevents oxidation of fats and oils.", solution: "Nitrogen." },
    { id: "q-c10-s1-2", chapterId: "ch-c10-mp-en-sci-1", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", topic: "Types of Reactions", type: "MCQ", difficulty: "Medium", marks: 1, q: "Fe₂O₃ + 2Al → Al₂O₃ + 2Fe is an example of a:", options: ["Combination reaction", "Double displacement reaction", "Decomposition reaction", "Displacement reaction"], ans: "Displacement reaction", explanation: "More reactive Aluminium displaces Iron from Fe₂O₃.", solution: "Displacement reaction." },
    { id: "q-c10-s1-3", chapterId: "ch-c10-mp-en-sci-1", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", topic: "Chemical Equations", type: "MCQ", difficulty: "Easy", marks: 1, q: "Calcium oxide (CaO) is commonly known as:", options: ["Slaked lime", "Quicklime", "Limestone", "Baking soda"], ans: "Quicklime", explanation: "CaO is quicklime; Ca(OH)₂ is slaked lime.", solution: "Quicklime." },
    { id: "q-c10-s11-1", chapterId: "ch-c10-mp-en-sci-11", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", topic: "Electric Current", type: "MCQ", difficulty: "Easy", marks: 1, q: "The SI unit of electric current is:", options: ["Volt", "Ohm", "Ampere", "Watt"], ans: "Ampere", explanation: "Electric current is measured in Amperes (A).", solution: "Ampere." },
    { id: "q-c10-s11-2", chapterId: "ch-c10-mp-en-sci-11", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", topic: "Ohm's Law", type: "MCQ", difficulty: "Medium", marks: 1, q: "If a 12 V battery is connected to a 4 Ω resistor, the current flowing is:", options: ["48 A", "3 A", "0.33 A", "8 A"], ans: "3 A", explanation: "By Ohm's Law, I = V / R = 12 / 4 = 3 A.", solution: "3 A." },
    { id: "q-c10-s11-3", chapterId: "ch-c10-mp-en-sci-11", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", topic: "Resistance", type: "MCQ", difficulty: "Medium", marks: 1, q: "Two resistors of 4 Ω and 4 Ω connected in parallel have equivalent resistance:", options: ["8 Ω", "4 Ω", "2 Ω", "1 Ω"], ans: "2 Ω", explanation: "1/Rp = 1/4 + 1/4 = 2/4 = 1/2, so Rp = 2 Ω.", solution: "2 Ω." },
    { id: "q-c10-s11-4", chapterId: "ch-c10-mp-en-sci-11", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", topic: "Electric Power", type: "MCQ", difficulty: "Easy", marks: 1, q: "1 kilowatt-hour (kWh) is equal to:", options: ["3.6 × 10⁵ J", "3.6 × 10⁶ J", "3.6 × 10⁴ J", "1000 J"], ans: "3.6 × 10⁶ J", explanation: "1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J.", solution: "3.6 × 10⁶ J." },
    { id: "q-c10-s11-5", chapterId: "ch-c10-mp-en-sci-11", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", topic: "Heating Effect", type: "FILL", difficulty: "Easy", marks: 1, q: "According to Joule's law of heating, heat H = I² × ___ × t.", options: [], ans: "R", explanation: "H = I²Rt.", solution: "R (Resistance)." },
    { id: "q-c10-s11-6", chapterId: "ch-c10-mp-en-sci-11", bookId: "tb-c10-mp-en-sci", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "science", topic: "Ohm's Law", type: "SHORT", difficulty: "Medium", marks: 2, q: "State Ohm's Law and define 1 Ohm.", options: [], ans: "V = IR at constant temperature; 1 Ohm is resistance when 1 V produces 1 A current.", explanation: "At constant temperature, current is directly proportional to potential difference.", solution: "V = IR. 1 Ω = 1 V / 1 A." },

    // CLASS 10 ENGLISH (2 questions)
    { id: "q-c10-e1-1", chapterId: "ch-c10-mp-en-eng-1", bookId: "tb-c10-mp-en-eng", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "english", topic: "Reading Comprehension", type: "MCQ", difficulty: "Easy", marks: 1, q: "How many pesos did Lencho ask God for in his letter?", options: ["50 pesos", "70 pesos", "100 pesos", "150 pesos"], ans: "100 pesos", explanation: "Lencho needed 100 pesos to sow his field again and live until the next crop.", solution: "100 pesos." },
    { id: "q-c10-e1-2", chapterId: "ch-c10-mp-en-eng-1", bookId: "tb-c10-mp-en-eng", board: "MP_BOARD", medium: "EN", classNum: "10", subjectId: "english", topic: "Reading Comprehension", type: "MCQ", difficulty: "Easy", marks: 1, q: "How much money did the postmaster manage to collect for Lencho?", options: ["30 pesos", "70 pesos", "100 pesos", "50 pesos"], ans: "70 pesos", explanation: "The postmaster collected 70 pesos from his employees and friends.", solution: "70 pesos." }
  ];

  // Also mirror Class 10 Maths Ch 1 & Ch 8 for CBSE & NCERT so Class 10 CBSE/NCERT students also have rich content
  const extraBooks = [];
  const games = [
    { id: "game-c6-pattern", classNum: "6", subjectId: "maths", chapterId: "ch-c6-ncert-en-math-1", title: "Number Pattern Sequence Builder", gameType: "pattern_sprint", instructions: "Identify the next number in square & triangular sequences!", rewardCoins: 25 },
    { id: "game-c10-trig", classNum: "10", subjectId: "maths", chapterId: "ch-c10-mp-en-math-8", title: "Trigonometry Value & Identity Sprint", gameType: "trig_sprint", instructions: "Match standard trigonometric values and identities against the clock!", rewardCoins: 35 },
    { id: "game-c10-ohm", classNum: "10", subjectId: "science", chapterId: "ch-c10-mp-en-sci-11", title: "Ohm's Law Circuit Calculator Race", gameType: "ohms_race", instructions: "Calculate V, I, or R rapidly using V = I × R!", rewardCoins: 35 }
  ];

  return { textbooks: [...textbooks, ...extraBooks], chapters, questions, games };
}
