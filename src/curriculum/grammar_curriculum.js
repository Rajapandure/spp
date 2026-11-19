// Class-Specific English Grammar Curriculum (Classes 1 to 10, Independent Per Class)
// Each chapter includes clear definitions, multiple examples, exercises, and verified questions.

const GRAMMAR_SYLLABUS = {
  "1": [
    {
      title: "1. Vowels and Consonants",
      def: "The English alphabet has 26 letters. Five letters (A, E, I, O, U) are Vowels, and the remaining 21 letters are Consonants.",
      examples: ["Vowels: a (apple), e (egg), i (ink), o (orange), u (umbrella)", "Consonants: b (ball), c (cat), d (dog), m (mat)"],
      qs: [
        { q: "How many vowels are there in the English alphabet?", options: ["3", "4", "5", "6"], ans: "5", exp: "A, E, I, O, U are the 5 vowels." },
        { q: "Which of these is a vowel?", options: ["B", "E", "K", "T"], ans: "E", exp: "E is one of the 5 vowels (A, E, I, O, U)." },
        { q: "Which letter is a consonant?", options: ["A", "I", "O", "M"], ans: "M", exp: "M is a consonant." }
      ]
    },
    {
      title: "2. Naming Words (Nouns)",
      def: "A Naming Word (Noun) is the name of a person, place, animal, or thing.",
      examples: ["Person: mother, teacher, Rohan", "Place: school, park, India", "Animal: cat, cow, lion", "Thing: book, ball, pencil"],
      qs: [
        { q: "Which word is a naming word for a place?", options: ["Run", "School", "Happy", "Red"], ans: "School", exp: "School is the name of a place." },
        { q: "Identify the naming word in: 'The cat drinks milk.'", options: ["drinks", "the", "cat", "in"], ans: "cat", exp: "Cat is the name of an animal (noun)." }
      ]
    },
    {
      title: "3. Use of A and An",
      def: "We use 'An' before words starting with a vowel sound (a, e, i, o, u), and 'A' before words starting with a consonant sound.",
      examples: ["an apple, an elephant, an igloo, an owl, an umbrella", "a book, a bat, a tree, a mango"],
      qs: [
        { q: "Choose the correct article: ___ orange", options: ["A", "An"], ans: "An", exp: "'Orange' begins with a vowel sound 'o', so we use 'An'." },
        { q: "Choose the correct article: ___ pencil", options: ["A", "An"], ans: "A", exp: "'Pencil' begins with a consonant sound 'p', so we use 'A'." }
      ]
    },
    {
      title: "4. Action Words (Verbs)",
      def: "An Action Word (Verb) tells us what a person, animal, or thing does.",
      examples: ["Rohan runs fast.", "Birds fly in the sky.", "We read books.", "I sleep at night."],
      qs: [
        { q: "Which word is an action word?", options: ["Table", "Jump", "Blue", "Apple"], ans: "Jump", exp: "'Jump' shows an action." },
        { q: "Find the action word: 'Dogs bark loudly.'", options: ["Dogs", "bark", "loudly"], ans: "bark", exp: "'Bark' tells what dogs do." }
      ]
    }
  ],
  "2": [
    {
      title: "1. Common and Proper Nouns",
      def: "A Common Noun is a general name (boy, city, river). A Proper Noun is the special name of a specific person, place, or day and always starts with a capital letter (Rohan, Bhopal, Monday).",
      examples: ["Common: girl, school, month", "Proper: Meena, Delhi, January, Ganga"],
      qs: [
        { q: "Which of these is a Proper Noun?", options: ["river", "city", "Bhopal", "girl"], ans: "Bhopal", exp: "Bhopal is the specific name of a city and starts with a capital letter." },
        { q: "Which word is a Common Noun?", options: ["Sunday", "India", "book", "Diwali"], ans: "book", exp: "Book is a general name for any book." }
      ]
    },
    {
      title: "2. Pronouns (He, She, It, They)",
      def: "A Pronoun is a word used in place of a noun to avoid repeating the name again and again.",
      examples: ["Rohan is my friend. He plays cricket.", "Sita is kind. She helps everyone.", "The dog is cute. It wags its tail."],
      qs: [
        { q: "Fill in the blank: Priya is my sister. ___ likes to paint.", options: ["He", "She", "It", "We"], ans: "She", exp: "We use 'She' for a female person (Priya)." },
        { q: "Fill in the blank: Look at the bus. ___ is yellow.", options: ["He", "She", "It", "They"], ans: "It", exp: "We use 'It' for things and animals." }
      ]
    },
    {
      title: "3. Describing Words (Adjectives)",
      def: "An Adjective is a word that describes a noun. It tells us about colour, size, shape, or number.",
      examples: ["a red rose, a tall tree, three apples, a sweet mango"],
      qs: [
        { q: "Identify the describing word: 'She has a blue bag.'", options: ["She", "has", "blue", "bag"], ans: "blue", exp: "'Blue' describes the colour of the bag." },
        { q: "Choose the describing word for an elephant:", options: ["huge", "fly", "run", "table"], ans: "huge", exp: "'Huge' describes the size of an elephant." }
      ]
    },
    {
      title: "4. Is, Am, Are",
      def: "Use 'Am' with I. Use 'Is' with singular nouns and He/She/It. Use 'Are' with plural nouns and You/We/They.",
      examples: ["I am a student.", "He is happy.", "They are playing."],
      qs: [
        { q: "I ___ seven years old.", options: ["is", "am", "are"], ans: "am", exp: "'I' always takes 'am'." },
        { q: "The birds ___ flying.", options: ["is", "am", "are"], ans: "are", exp: "'Birds' is plural, so we use 'are'." }
      ]
    }
  ],
  "3": [
    {
      title: "1. Singular and Plural Nouns",
      def: "Singular means one; Plural means more than one. Most plurals are formed by adding -s or -es, or changing -y to -ies.",
      examples: ["book → books", "box → boxes", "baby → babies", "child → children"],
      qs: [
        { q: "What is the plural of 'box'?", options: ["boxs", "boxes", "boxies", "box"], ans: "boxes", exp: "Words ending in -x take -es in plural: boxes." },
        { q: "What is the plural of 'child'?", options: ["childs", "childes", "children", "childrens"], ans: "children", exp: "Children is the irregular plural of child." }
      ]
    },
    {
      title: "2. Gender of Nouns",
      def: "Masculine gender refers to males (king, boy, lion); Feminine gender refers to females (queen, girl, lioness); Neuter refers to non-living things (chair, pen).",
      examples: ["father – mother", "uncle – aunt", "tiger – tigress", "bull – cow"],
      qs: [
        { q: "Feminine gender of 'king' is:", options: ["prince", "queen", "princess", "aunt"], ans: "queen", exp: "King (masculine) → Queen (feminine)." },
        { q: "Masculine gender of 'mare' is:", options: ["horse", "lion", "bull", "cock"], ans: "horse", exp: "Horse is masculine; mare is feminine." }
      ]
    },
    {
      title: "3. Simple Present and Simple Past Tense",
      def: "Simple Present shows daily habits or universal truths (I play, She reads). Simple Past shows actions completed earlier (I played, She read).",
      examples: ["Present: The sun rises in the east.", "Past: Yesterday, we visited the zoo."],
      qs: [
        { q: "Choose the Simple Past form of 'go':", options: ["goes", "going", "went", "gone"], ans: "went", exp: "'Went' is the simple past form of 'go'." },
        { q: "She ___ to school every day.", options: ["walk", "walks", "walked", "walking"], ans: "walks", exp: "With singular subject 'She' in simple present, we add -s: walks." }
      ]
    },
    {
      title: "4. Conjunctions (And, But, Or)",
      def: "A Conjunction is a joining word. 'And' joins similar ideas, 'But' joins opposite ideas, and 'Or' shows a choice.",
      examples: ["Bread and butter", "He is poor but honest.", "Do you want tea or milk?"],
      qs: [
        { q: "Riya is tall ___ her brother is short.", options: ["and", "but", "or"], ans: "but", exp: "'But' joins contrasting ideas (tall vs short)." },
        { q: "I bought apples ___ bananas.", options: ["and", "but", "or"], ans: "and", exp: "'And' joins two similar items." }
      ]
    }
  ],
  "4": [
    {
      title: "1. Kinds of Sentences",
      def: "Sentences are of four kinds: Declarative (states a fact), Interrogative (asks a question), Imperative (gives a command/request), and Exclamatory (shows strong feeling).",
      examples: ["Declarative: The sky is blue.", "Interrogative: Where do you live?", "Imperative: Please close the door.", "Exclamatory: What a beautiful flower!"],
      qs: [
        { q: "Identify the sentence type: 'Please pass me the water.'", options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"], ans: "Imperative", exp: "Requests and commands are Imperative sentences." },
        { q: "Which punctuation mark ends an Interrogative sentence?", options: [".", "!", "?", ","], ans: "?", exp: "Interrogative sentences ask questions and end with '?'." }
      ]
    },
    {
      title: "2. Subject and Predicate",
      def: "The Subject tells who or what the sentence is about. The Predicate tells what the subject does or is.",
      examples: ["[The little puppy] (Subject) | [chased the ball.] (Predicate)", "[India] (Subject) | [is our motherland.] (Predicate)"],
      qs: [
        { q: "Identify the Subject in: 'The bright sun shines in the sky.'", options: ["shines", "in the sky", "The bright sun", "sun shines"], ans: "The bright sun", exp: "The sentence is about 'The bright sun'." },
        { q: "Identify the Predicate in: 'Birds build nests in trees.'", options: ["Birds", "build nests in trees", "nests", "trees"], ans: "build nests in trees", exp: "Everything said about the subject 'Birds' is the Predicate." }
      ]
    },
    {
      title: "3. Adverbs (Manner, Time, Place)",
      def: "An Adverb modifies a verb, adjective, or another adverb. It tells how (quickly), when (yesterday), or where (here) an action happens.",
      examples: ["Manner: She sang sweetly.", "Time: We will leave tomorrow.", "Place: Please sit here."],
      qs: [
        { q: "Identify the Adverb in: 'The tortoise walked slowly.'", options: ["tortoise", "walked", "slowly", "The"], ans: "slowly", exp: "'Slowly' tells how the tortoise walked (Adverb of Manner)." },
        { q: "Which is an Adverb of Time?", options: ["loudly", "yesterday", "outside", "happily"], ans: "yesterday", exp: "'Yesterday' tells when an action occurred." }
      ]
    },
    {
      title: "4. Collective and Abstract Nouns",
      def: "A Collective Noun names a group (a flock of birds, a team of players). An Abstract Noun names a quality, feeling, or idea you cannot touch (honesty, bravery, joy).",
      examples: ["Collective: a bunch of keys, a herd of cows", "Abstract: wisdom, kindness, freedom"],
      qs: [
        { q: "A ___ of players won the match.", options: ["flock", "team", "bunch", "herd"], ans: "team", exp: "A group of players is called a 'team'." },
        { q: "Which word is an Abstract Noun?", options: ["Honesty", "Chair", "Apple", "River"], ans: "Honesty", exp: "Honesty is a quality/idea that cannot be physically touched." }
      ]
    }
  ],
  "5": [
    {
      title: "1. Degrees of Comparison (Adjectives)",
      def: "Adjectives have three degrees: Positive (tall), Comparative (taller — compares two), and Superlative (tallest — compares three or more).",
      examples: ["good – better – best", "fast – faster – fastest", "beautiful – more beautiful – most beautiful"],
      qs: [
        { q: "Mount Everest is the ___ peak in the world.", options: ["high", "higher", "highest"], ans: "highest", exp: "Superlative degree ('highest') is used with 'the' to compare all peaks." },
        { q: "This book is ___ than that one.", options: ["good", "better", "best"], ans: "better", exp: "Comparative degree ('better') is used with 'than' for two items." }
      ]
    },
    {
      title: "2. Subject-Verb Agreement",
      def: "A singular subject takes a singular verb (He runs, The boy is); a plural subject takes a plural verb (They run, The boys are).",
      examples: ["The dog barks at strangers.", "The dogs bark at strangers.", "Each of the students has a notebook."],
      qs: [
        { q: "Each of the players ___ given a medal.", options: ["was", "were"], ans: "was", exp: "'Each' is singular, so it takes the singular verb 'was'." },
        { q: "My friends ___ coming to my birthday party.", options: ["is", "are", "was"], ans: "are", exp: "Plural subject 'friends' takes plural verb 'are'." }
      ]
    },
    {
      title: "3. Continuous Tenses (Present, Past, Future)",
      def: "Continuous tenses show ongoing actions using (is/am/are + V-ing) for Present, (was/were + V-ing) for Past, and (will be + V-ing) for Future.",
      examples: ["Present Continuous: I am reading.", "Past Continuous: She was writing.", "Future Continuous: They will be travelling."],
      qs: [
        { q: "Choose the Past Continuous sentence:", options: ["He plays cricket.", "He was playing cricket.", "He will play cricket."], ans: "He was playing cricket.", exp: "was + V-ing indicates Past Continuous tense." },
        { q: "Tomorrow at 5 PM, we ___ for Bhopal.", options: ["will be leaving", "left", "are leave"], ans: "will be leaving", exp: "Future Continuous uses 'will be + verb-ing'." }
      ]
    },
    {
      title: "4. Prefixes and Suffixes",
      def: "A Prefix is added before a root word (un + happy = unhappy). A Suffix is added after a root word (kind + ness = kindness).",
      examples: ["Prefixes: dis-like, re-write, im-possible", "Suffixes: care-ful, help-less, teach-er"],
      qs: [
        { q: "Add a prefix to 'possible' to form its opposite:", options: ["unpossible", "impossible", "dispossible"], ans: "impossible", exp: "The prefix 'im-' forms 'impossible'." },
        { q: "In 'careless', '-less' is a:", options: ["Prefix", "Suffix", "Noun"], ans: "Suffix", exp: "'-less' is attached at the end of 'care', so it is a suffix." }
      ]
    }
  ],
  "6": [
    {
      title: "1. Determiners and Articles",
      def: "Determiners are words placed before nouns to clarify reference: Articles (a, an, the), Demonstratives (this, that, these, those), Possessives (my, your, their), and Quantifiers (some, many, few, much).",
      examples: ["The Ganga is a sacred river.", "I have some books, but not much time."],
      qs: [
        { q: "Choose the correct determiner: ___ sun rises in the east.", options: ["A", "An", "The"], ans: "The", exp: "Unique celestial bodies take 'The'." },
        { q: "How ___ water is left in the bottle?", options: ["many", "much", "few"], ans: "much", exp: "'Water' is uncountable, so we use 'much'." }
      ]
    },
    {
      title: "2. Perfect Tenses (Present & Past Perfect)",
      def: "Present Perfect (has/have + V3) shows an action just completed or linked to the present. Past Perfect (had + V3) shows an action completed before another past action.",
      examples: ["She has finished her homework.", "The train had left before we reached the station."],
      qs: [
        { q: "They ___ already visited Agra.", options: ["has", "have", "had been"], ans: "have", exp: "Plural subject 'They' takes 'have + V3' in Present Perfect." },
        { q: "The patient ___ before the doctor arrived.", options: ["died", "had died", "has died"], ans: "had died", exp: "The earlier of two past actions uses Past Perfect (had + V3)." }
      ]
    },
    {
      title: "3. Transitive and Intransitive Verbs",
      def: "A Transitive Verb requires a direct object to complete its meaning (She kicked the ball). An Intransitive Verb does not need an object (The baby slept peacefully).",
      examples: ["Transitive: He wrote a letter.", "Intransitive: Birds fly high."],
      qs: [
        { q: "In 'Rohan opened the door', the verb 'opened' is:", options: ["Transitive", "Intransitive"], ans: "Transitive", exp: "'The door' is the direct object receiving the action." },
        { q: "In 'The child laughed loudly', 'laughed' is:", options: ["Transitive", "Intransitive"], ans: "Intransitive", exp: "There is no direct object after 'laughed'." }
      ]
    },
    {
      title: "4. Prepositions of Time and Place",
      def: "Use 'at' for exact times/points (at 7 AM, at the gate), 'on' for days/surfaces (on Monday, on the table), and 'in' for months/years/enclosed spaces (in July, in India).",
      examples: ["The exam starts at 9:00 AM on Monday in March."],
      qs: [
        { q: "We celebrate Independence Day ___ 15th August.", options: ["in", "on", "at"], ans: "on", exp: "Specific dates and days take 'on'." },
        { q: "The train arrives ___ 6:30 PM.", options: ["in", "on", "at"], ans: "at", exp: "Exact clock time takes 'at'." }
      ]
    }
  ],
  "7": [
    {
      title: "1. Modals (Can, Could, May, Might, Must, Should)",
      def: "Modal auxiliaries express ability (can/could), permission/possibility (may/might), advice (should), or strong obligation (must). They are always followed by the base verb (V1).",
      examples: ["You must wear a helmet.", "May I come in?", "We should respect our elders."],
      qs: [
        { q: "You ___ obey traffic rules for your safety.", options: ["must", "might", "could"], ans: "must", exp: "'Must' expresses strong obligation/necessity." },
        { q: "___ I borrow your pen, please?", options: ["Must", "May", "Should"], ans: "May", exp: "'May' is used to ask polite permission." }
      ]
    },
    {
      title: "2. Active and Passive Voice",
      def: "In Active Voice, the subject performs the action (Ram wrote a letter). In Passive Voice, the object becomes the subject (A letter was written by Ram), using (be + V3).",
      examples: ["Active: She sings a song. → Passive: A song is sung by her.", "Active: They built a bridge. → Passive: A bridge was built by them."],
      qs: [
        { q: "Passive voice of 'The cat chased the mouse' is:", options: ["The mouse is chased by the cat.", "The mouse was chased by the cat.", "The mouse chased the cat."], ans: "The mouse was chased by the cat.", exp: "Simple Past Active ('chased') becomes 'was + V3' ('was chased')." },
        { q: "Passive voice of 'He writes a poem' is:", options: ["A poem is written by him.", "A poem was written by him.", "A poem is writing by him."], ans: "A poem is written by him.", exp: "Simple Present Active becomes 'is/are + V3'." }
      ]
    },
    {
      title: "3. Direct and Indirect (Reported) Speech",
      def: "Direct Speech quotes exact words inside quotation marks. Indirect Speech reports the meaning without quotes, shifting pronouns and tenses back when the reporting verb is in the past.",
      examples: ["Direct: He said, \"I am tired.\" → Indirect: He said that he was tired."],
      qs: [
        { q: "Indirect speech of: She said, \"I like mangoes.\"", options: ["She said that she liked mangoes.", "She said that I like mangoes.", "She says she liked mangoes."], ans: "She said that she liked mangoes.", exp: "Simple present 'like' shifts to simple past 'liked', and 'I' becomes 'she'." },
        { q: "In Indirect Speech, 'today' changes to:", options: ["yesterday", "that day", "tomorrow"], ans: "that day", exp: "'Today' shifts to 'that day' in reported speech." }
      ]
    },
    {
      title: "4. Conditional Sentences (Zero & First)",
      def: "Zero Conditional (If + Present, Present) states general truths. First Conditional (If + Present, will + V1) expresses real future possibilities.",
      examples: ["Zero: If you heat ice, it melts.", "First: If it rains, we will stay indoors."],
      qs: [
        { q: "If you study hard, you ___ good marks.", options: ["will get", "got", "would got"], ans: "will get", exp: "First Conditional uses 'If + Present Simple, will + V1'." },
        { q: "If you mix red and blue, you ___ purple.", options: ["get", "will got", "getting"], ans: "get", exp: "Zero Conditional states a scientific/general fact using Present Simple." }
      ]
    }
  ],
  "8": [
    {
      title: "1. Finite and Non-Finite Verbs (Infinitives, Gerunds, Participles)",
      def: "Finite verbs change with tense and subject (He goes, They went). Non-finite verbs do not change: Infinitive (to + V1), Gerund (V-ing acting as noun), and Participle (V-ing/V3 acting as adjective).",
      examples: ["Infinitive: I like to swim.", "Gerund: Swimming is good exercise.", "Participle: Look at the falling leaves."],
      qs: [
        { q: "In 'Reading is my favourite hobby', 'Reading' is a:", options: ["Infinitive", "Gerund", "Finite Verb"], ans: "Gerund", exp: "A verb+ing functioning as the subject noun is a Gerund." },
        { q: "Identify the Infinitive in: 'She wants to become a doctor.'", options: ["wants", "to become", "doctor"], ans: "to become", exp: "'to + base verb' (to become) is an Infinitive." }
      ]
    },
    {
      title: "2. Voice of Imperative and Interrogative Sentences",
      def: "Imperatives in Passive use 'Let + object + be + V3' or 'You are requested/ordered to...'. Interrogatives keep question order with auxiliary before subject.",
      examples: ["Open the door. → Let the door be opened.", "Did he help you? → Were you helped by him?"],
      qs: [
        { q: "Passive of 'Close the window' is:", options: ["Let the window be closed.", "The window closed.", "Let close the window."], ans: "Let the window be closed.", exp: "Imperative passive structure: Let + object + be + V3." },
        { q: "Passive of 'Who wrote this book?' is:", options: ["By whom was this book written?", "Who was written this book?", "Whom wrote this book?"], ans: "By whom was this book written?", exp: "'Who' changes to 'By whom' in passive questions." }
      ]
    },
    {
      title: "3. Phrases and Clauses (Noun, Adjective, Adverb Clauses)",
      def: "A Phrase is a group of words without a finite verb. A Clause has both a subject and a finite verb. Subordinate clauses act as Noun, Adjective (Relative), or Adverb clauses.",
      examples: ["Adjective Clause: The boy who won the prize is my friend.", "Adverb Clause: Wait here until I return."],
      qs: [
        { q: "In 'The house that Jack built is old', 'that Jack built' is:", options: ["Noun Clause", "Adjective Clause", "Adverb Clause"], ans: "Adjective Clause", exp: "It describes the noun 'house', so it is an Adjective (Relative) Clause." },
        { q: "Which of these is a Phrase (no finite verb)?", options: ["in the morning", "when the sun rose", "because she ran"], ans: "in the morning", exp: "'in the morning' has no subject-verb pair, so it is a Phrase." }
      ]
    },
    {
      title: "4. Transformation of Sentences",
      def: "Transforming sentences changes their grammatical structure (Simple, Compound, Complex; Affirmative/Negative; Too...to / So...that) without changing the meaning.",
      examples: ["He is too weak to walk. → He is so weak that he cannot walk."],
      qs: [
        { q: "Transform using 'so...that': 'The tea is too hot to drink.'", options: ["The tea is so hot that I cannot drink it.", "The tea is very hot to drink.", "The tea is hot so drink it."], ans: "The tea is so hot that I cannot drink it.", exp: "'Too...to' transforms into 'so...that...cannot'." },
        { q: "A Compound sentence joins two independent clauses using:", options: ["Coordinating conjunction (and, but, so)", "Subordinating conjunction (because, although)"], ans: "Coordinating conjunction (and, but, so)", exp: "Compound sentences use coordinating conjunctions (FANBOYS)." }
      ]
    }
  ],
  "9": [
    {
      title: "1. Integrated Tenses & Sequence of Tenses",
      def: "Sequence of Tenses governs verb agreement across main and subordinate clauses. A past tense in the main clause is followed by a past tense in the subordinate clause (except for universal truths).",
      examples: ["He told me that he had completed the project.", "The teacher said that the earth revolves around the sun."],
      qs: [
        { q: "By the time we arrived, the show ___.", options: ["started", "had started", "has started", "starts"], ans: "had started", exp: "Earlier past action uses Past Perfect (had + V3)." },
        { q: "Galileo proved that the earth ___ around the sun.", options: ["revolved", "revolves", "had revolved"], ans: "revolves", exp: "Universal truths always remain in the Simple Present tense." }
      ]
    },
    {
      title: "2. Subject-Verb Concord (Advanced Rules)",
      def: "Collective nouns take singular verbs when acting as a unit. Phrases with 'as well as', 'along with', or 'neither...nor' agree with the first subject (for as well as) or nearest subject (for neither...nor).",
      examples: ["The captain, along with his players, is practicing.", "Neither Riya nor her friends were present."],
      qs: [
        { q: "The teacher, as well as the students, ___ excited about the trip.", options: ["is", "are", "were"], ans: "is", exp: "With 'as well as', the verb agrees with the first subject ('The teacher')." },
        { q: "Neither the manager nor the workers ___ responsible.", options: ["is", "are", "was"], ans: "are", exp: "With 'neither...nor', the verb agrees with the nearer subject ('workers')." }
      ]
    },
    {
      title: "3. Reported Speech (Questions & Commands)",
      def: "When reporting Yes/No questions, use 'if/whether' and statement word order (no 'do/does/did'). For commands/requests, use 'ordered/requested + object + to + V1'.",
      examples: ["Direct: He asked, \"Are you ready?\" → Indirect: He asked if I was ready.", "Direct: She said, \"Please help me.\" → Indirect: She requested me to help her."],
      qs: [
        { q: "Report: Rohan asked me, \"Where do you live?\"", options: ["Rohan asked me where I lived.", "Rohan asked me where did I live.", "Rohan asked me where I live."], ans: "Rohan asked me where I lived.", exp: "Reported wh-questions use statement order and shift present to past." },
        { q: "Report: The doctor said to him, \"Take rest.\"", options: ["The doctor advised him to take rest.", "The doctor said him take rest.", "The doctor told that take rest."], ans: "The doctor advised him to take rest.", exp: "Imperatives use reporting verb + object + to-infinitive." }
      ]
    },
    {
      title: "4. Determiners (Few / A Few / Little / A Little)",
      def: "'Few/Little' mean hardly any (negative). 'A few/A little' mean some, enough (positive). Use 'few' with countable nouns and 'little' with uncountable nouns.",
      examples: ["I have a few close friends (some).", "There is little hope of rain today (almost none)."],
      qs: [
        { q: "___ knowledge is a dangerous thing.", options: ["Little", "A little", "Few", "A few"], ans: "A little", exp: "'A little knowledge' (some incomplete knowledge) is the standard proverb." },
        { q: "He has ___ friends, so he often feels lonely.", options: ["few", "a few", "little"], ans: "few", exp: "'Few' (hardly any) fits countable 'friends' in a negative sense." }
      ]
    }
  ],
  "10": [
    {
      title: "1. Board Exam Integrated Tenses & Gap Filling",
      def: "Class 10 Board Exams test accurate tense selection in passages: Simple Present for facts, Present Perfect Continuous (has/have been + V-ing + since/for) for ongoing duration, and Past Perfect for earlier past events.",
      examples: ["It has been raining since morning.", "She has lived in Indore for five years."],
      qs: [
        { q: "They ___ in this school since 2021.", options: ["study", "are studying", "have been studying", "studied"], ans: "have been studying", exp: "'Since 2021' requires Present Perfect Continuous (have been + V-ing)." },
        { q: "If I ___ a bird, I would fly across the mountains.", options: ["am", "was", "were", "will be"], ans: "were", exp: "Unreal/hypothetical conditionals use 'were' for all subjects." }
      ]
    },
    {
      title: "2. Reported Speech (Board Exam Conversion)",
      def: "Convert dialogues into formal reported paragraphs: shift tenses back, change time/place markers (now → then, here → there, tomorrow → the next day), and use appropriate reporting verbs.",
      examples: ["Dialogue: Teacher: \"Have you revised Chapter 1?\" → The teacher asked the students whether they had revised Chapter 1."],
      qs: [
        { q: "Convert: Priya said to Aman, \"I will submit the assignment tomorrow.\"", options: ["Priya told Aman that she would submit the assignment the next day.", "Priya told Aman that she will submit the assignment tomorrow.", "Priya asked Aman she would submit."], ans: "Priya told Aman that she would submit the assignment the next day.", exp: "'will' → 'would' and 'tomorrow' → 'the next day'." },
        { q: "Convert: Mother said, \"Don't waste water.\"", options: ["Mother advised us not to waste water.", "Mother said not waste water.", "Mother asked don't waste water."], ans: "Mother advised us not to waste water.", exp: "Negative imperative becomes 'not to + V1'." }
      ]
    },
    {
      title: "3. Modals & Subject-Verb Concord (Board Pattern)",
      def: "Board gap-filling questions test modals (ought to, used to, dare, need) and concord with 'one of the + plural noun + singular verb', 'a number of + plural verb', and 'the number of + singular verb'.",
      examples: ["One of my friends lives in Bhopal.", "The number of participants is increasing."],
      qs: [
        { q: "One of the players ___ injured during practice.", options: ["was", "were", "are"], ans: "was", exp: "'One of the + plural noun' takes a singular verb ('was')." },
        { q: "The number of electric vehicles ___ growing rapidly.", options: ["is", "are", "were"], ans: "is", exp: "'The number of' takes a singular verb ('is')." }
      ]
    },
    {
      title: "4. Editing, Omission & Active-Passive Synthesis",
      def: "Editing tasks require spotting one grammatical error per line (wrong preposition, tense, article, or concord) and supplying the correction.",
      examples: ["Error: 'He is senior than me.' → Correction: 'He is senior to me.'", "Error: 'She did not wrote the letter.' → Correction: 'She did not write the letter.'"],
      qs: [
        { q: "Spot and fix the error: 'He prefers tea than coffee.'", options: ["Replace 'than' with 'to'", "Replace 'prefers' with 'prefer'", "No error"], ans: "Replace 'than' with 'to'", exp: "'Prefer' and 'senior/junior' always take 'to', never 'than'." },
        { q: "Spot and fix the error: 'Did he went to the market?'", options: ["Replace 'went' with 'go'", "Replace 'Did' with 'Was'", "No error"], ans: "Replace 'went' with 'go'", exp: "After 'Did', always use the base verb V1 ('go')." }
      ]
    }
  ]
};

export function generateEnglishGrammarCurriculum() {
  const boards = ["NCERT", "CBSE", "MP_BOARD"];
  const mediums = ["EN", "HI"];
  const books = [];
  const chapters = [];
  const questions = [];

  for (let classNum = 1; classNum <= 10; classNum++) {
    const cls = String(classNum);
    const topics = GRAMMAR_SYLLABUS[cls] || [];
    for (const board of boards) {
      for (const medium of mediums) {
        const bookId = `tb-c${cls}-${board.toLowerCase()}-${medium.toLowerCase()}-grammar`;
        books.push({
          id: bookId,
          title: medium === "HI" ? `English Grammar (कक्षा ${cls})` : `English Grammar (Class ${cls})`,
          board,
          medium,
          classNum: cls,
          subjectId: "grammar",
          subjectName: "English Grammar",
          subjectIcon: "grammar",
          session: "2026-27",
          publisher: `Scholars Point Academic Grammar (${board} Class ${cls})`,
          coverColor: "#6d28d9",
          status: "Published",
          offlineDownloaded: true
        });

        topics.forEach((t, idx) => {
          const chId = `ch-${bookId}-${idx + 1}`;
          const exercises = t.qs.map((q, qIdx) => ({
            qNo: String(qIdx + 1),
            marks: 1,
            q: q.q,
            hint: t.def,
            ans: q.ans,
            steps: `Rule: ${t.def}\nExplanation: ${q.exp}`
          }));

          chapters.push({
            id: chId,
            bookId,
            board,
            medium,
            classNum: cls,
            subjectId: "grammar",
            sequence: idx + 1,
            title: t.title,
            sourceType: `Original Supplementary Content (Class ${cls} Academic English Grammar)`,
            status: "Published",
            intro: `Master ${t.title.replace(/^\d+\.\s*/, "")} with clear rules, examples, and exercises for Class ${cls}.`,
            objectives: [`Define ${t.title.replace(/^\d+\.\s*/, "")}`, "Apply grammar rules accurately in sentences and exams"],
            explanation: t.def,
            concepts: [{ term: t.title.replace(/^\d+\.\s*/, ""), def: t.def }],
            examples: t.examples.map((ex, i) => ({ q: `Example ${i + 1}`, a: ex })),
            diagramType: "",
            facts: [],
            revision: t.examples,
            exercises
          });

          t.qs.forEach((q, qIdx) => {
            questions.push({
              id: `q-${chId}-${qIdx + 1}`,
              chapterId: chId,
              bookId,
              board,
              medium,
              classNum: cls,
              subjectId: "grammar",
              topic: t.title,
              type: q.options.length === 2 ? "TF" : "MCQ",
              difficulty: "Easy",
              marks: 1,
              q: q.q,
              options: q.options,
              ans: q.ans,
              explanation: q.exp,
              solution: q.exp
            });
          });
        });
      }
    }
  }

  return { books, chapters, questions };
}
