export type McqOption = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type McqQuestion = {
  id: string;
  section: "verb" | "spelling" | "vocab" | "grammar";
  prompt: string;
  options: McqOption[];
  correctId: McqOption["id"];
  explanation: string;
};

export type McqSet = {
  id: string;
  title: string;
  subtitle: string;
  questions: McqQuestion[];
};

export type ShortQuestion = {
  id: string;
  prompt: string;
  modelAnswer: string;
  chapterHint: string;
};

export type TranslationItem = {
  id: string;
  direction: "en-ur" | "ur-en";
  title: string;
  source: string;
  modelAnswer: string;
  /** Board option: rewrite paragraph in simple English (en-ur tasks). */
  simpleEnglishModelAnswer?: string;
  notes: string;
};

export type PairItem = {
  id: string;
  word1: string;
  word2: string;
  modelSentences: [string, string];
  tip: string;
};

export const CHAPTER_CONTEXT = `
Unit 1 – Hazrat Muhammad's (SAW) Social Reforms for the Rights of Women, Orphans and Slaves.
Key ideas: pre-Islamic Arabia had tribal injustice; women, orphans and slaves were oppressed; the Prophet (SAW) introduced reforms based on justice, compassion and equality; women gained inheritance, consent to marriage, divorce/maintenance and education rights; orphans were to be treated kindly and protected; slavery was gradually undermined through emancipation and humane treatment; Tauheed linked to human brotherhood; reforms remain relevant today.
Glossary words: accountable, elevated, emancipation, emphasized, financial, inherit, inseparable, mutual, oppressed, patriarchal, prominent, reforms, relevant, widespread.
`.trim();

export const mcqSets: McqSet[] = [
  {
    id: "set-1",
    title: "Quiz Set 1",
    subtitle: "Grammar · Spelling · Chapter vocab",
    questions: [
      {
        id: "s1q1",
        section: "verb",
        prompt: "She ---- to school an hour ago.",
        options: [
          { id: "A", text: "is going" },
          { id: "B", text: "were going" },
          { id: "C", text: "went" },
          { id: "D", text: "goes" },
        ],
        correctId: "C",
        explanation:
          "“An hour ago” shows a finished past time, so simple past “went” is correct.",
      },
      {
        id: "s1q2",
        section: "verb",
        prompt: "It ---- at present.",
        options: [
          { id: "A", text: "was raining" },
          { id: "B", text: "is raining" },
          { id: "C", text: "have rained" },
          { id: "D", text: "rain" },
        ],
        correctId: "B",
        explanation:
          "“At present” means happening now → present continuous “is raining”.",
      },
      {
        id: "s1q3",
        section: "verb",
        prompt: "He ---- the truth.",
        options: [
          { id: "A", text: "speak" },
          { id: "B", text: "have spoken" },
          { id: "C", text: "speaking" },
          { id: "D", text: "speaks" },
        ],
        correctId: "D",
        explanation:
          "With third-person singular “He”, simple present needs “speaks”.",
      },
      {
        id: "s1q4",
        section: "spelling",
        prompt: "Choose the word with correct spelling:",
        options: [
          { id: "A", text: "Revalation" },
          { id: "B", text: "Revellation" },
          { id: "C", text: "Ravelattion" },
          { id: "D", text: "Revelation" },
        ],
        correctId: "D",
        explanation: "The correct spelling is Revelation.",
      },
      {
        id: "s1q5",
        section: "spelling",
        prompt: "Choose the word with correct spelling:",
        options: [
          { id: "A", text: "Orphene" },
          { id: "B", text: "Orphin" },
          { id: "C", text: "Orphun" },
          { id: "D", text: "Orphan" },
        ],
        correctId: "D",
        explanation:
          "Orphan is the correct spelling — a key word from Unit 1.",
      },
      {
        id: "s1q6",
        section: "vocab",
        prompt: 'The antonym of "oppressed" is:',
        options: [
          { id: "A", text: "cruel" },
          { id: "B", text: "liberated" },
          { id: "C", text: "weak" },
          { id: "D", text: "silent" },
        ],
        correctId: "B",
        explanation:
          "In the chapter, oppressed means treated unfairly. Liberated (freed) is the opposite.",
      },
      {
        id: "s1q7",
        section: "vocab",
        prompt: 'The synonym of "reforms" is:',
        options: [
          { id: "A", text: "destructions" },
          { id: "B", text: "improvements" },
          { id: "C", text: "punishments" },
          { id: "D", text: "arguments" },
        ],
        correctId: "B",
        explanation:
          "Glossary: reforms = changes made to improve a system — so improvements.",
      },
      {
        id: "s1q8",
        section: "vocab",
        prompt: 'The word "patriarchal" means:',
        options: [
          { id: "A", text: "ruled mainly by women" },
          { id: "B", text: "a system where men hold primary power" },
          { id: "C", text: "a system without leaders" },
          { id: "D", text: "related only to children" },
        ],
        correctId: "B",
        explanation:
          "From the Unit 1 glossary: patriarchal = a social system where men hold primary power.",
      },
      {
        id: "s1q9",
        section: "grammar",
        prompt:
          "Maria fell over the cat. The underlined phrase “over the cat” is a/an ---- phrase.",
        options: [
          { id: "A", text: "gerund" },
          { id: "B", text: "prepositional" },
          { id: "C", text: "adjective" },
          { id: "D", text: "noun" },
        ],
        correctId: "B",
        explanation:
          "It begins with the preposition “over” + object → prepositional phrase.",
      },
      {
        id: "s1q10",
        section: "grammar",
        prompt: "I like pears yet I like apples more. This is a ----:",
        options: [
          { id: "A", text: "dependent clause" },
          { id: "B", text: "complex sentence" },
          { id: "C", text: "compound sentence" },
          { id: "D", text: "simple sentence" },
        ],
        correctId: "C",
        explanation:
          "Two independent clauses joined by “yet” → compound sentence.",
      },
    ],
  },
  {
    id: "set-2",
    title: "Quiz Set 2",
    subtitle: "Board-style · Chapter meanings",
    questions: [
      {
        id: "s2q1",
        section: "verb",
        prompt: "She ---- her examination by the next fall.",
        options: [
          { id: "A", text: "take" },
          { id: "B", text: "took" },
          { id: "C", text: "will have taken" },
          { id: "D", text: "taking" },
        ],
        correctId: "C",
        explanation:
          "“By the next fall” points to a future completed action → future perfect “will have taken”.",
      },
      {
        id: "s2q2",
        section: "verb",
        prompt: "They already ---- their home task.",
        options: [
          { id: "A", text: "do" },
          { id: "B", text: "does" },
          { id: "C", text: "have done" },
          { id: "D", text: "doing" },
        ],
        correctId: "C",
        explanation:
          "“Already” with a completed action → present perfect “have done”.",
      },
      {
        id: "s2q3",
        section: "verb",
        prompt: "The baby ---- for milk now.",
        options: [
          { id: "A", text: "cry" },
          { id: "B", text: "is crying" },
          { id: "C", text: "are crying" },
          { id: "D", text: "cried" },
        ],
        correctId: "B",
        explanation: "“Now” = action in progress → “is crying”.",
      },
      {
        id: "s2q4",
        section: "spelling",
        prompt: "Choose the word with correct spelling:",
        options: [
          { id: "A", text: "Priorety" },
          { id: "B", text: "Priority" },
          { id: "C", text: "Priorrety" },
          { id: "D", text: "Prioretty" },
        ],
        correctId: "B",
        explanation: "The correct spelling is Priority.",
      },
      {
        id: "s2q5",
        section: "spelling",
        prompt: "Choose the word with correct spelling:",
        options: [
          { id: "A", text: "Emansipation" },
          { id: "B", text: "Emancipation" },
          { id: "C", text: "Emincipation" },
          { id: "D", text: "Emancipasion" },
        ],
        correctId: "B",
        explanation:
          "Emancipation (freedom from slavery) is the Unit 1 glossary spelling.",
      },
      {
        id: "s2q6",
        section: "vocab",
        prompt: 'The antonym of "elevated" is:',
        options: [
          { id: "A", text: "raised" },
          { id: "B", text: "lowered" },
          { id: "C", text: "noble" },
          { id: "D", text: "important" },
        ],
        correctId: "B",
        explanation:
          "Elevated means raised higher; lowered is the opposite.",
      },
      {
        id: "s2q7",
        section: "vocab",
        prompt: 'The synonym of "widespread" is:',
        options: [
          { id: "A", text: "rare" },
          { id: "B", text: "common / extensive" },
          { id: "C", text: "hidden" },
          { id: "D", text: "tiny" },
        ],
        correctId: "B",
        explanation:
          "Glossary: widespread = found over a large area / among many people.",
      },
      {
        id: "s2q8",
        section: "vocab",
        prompt: 'The word "inherit" means:',
        options: [
          { id: "A", text: "to borrow money" },
          { id: "B", text: "to receive property after someone’s death" },
          { id: "C", text: "to refuse a gift" },
          { id: "D", text: "to sell land" },
        ],
        correctId: "B",
        explanation:
          "From the chapter glossary: inherit = receive property/money after death — a women’s right discussed in Unit 1.",
      },
      {
        id: "s2q9",
        section: "grammar",
        prompt:
          'Our practice usually starts at six o’clock. The underlined word “usually” is an adverb of:',
        options: [
          { id: "A", text: "degree" },
          { id: "B", text: "frequency" },
          { id: "C", text: "place" },
          { id: "D", text: "manner" },
        ],
        correctId: "B",
        explanation: "“Usually” tells how often → adverb of frequency.",
      },
      {
        id: "s2q10",
        section: "grammar",
        prompt: "Everybody enjoys a good movie. The underlined word is a/an ---- pronoun:",
        options: [
          { id: "A", text: "reflexive" },
          { id: "B", text: "relative" },
          { id: "C", text: "indefinite" },
          { id: "D", text: "interrogative" },
        ],
        correctId: "C",
        explanation: "Everybody refers to people in general → indefinite pronoun.",
      },
    ],
  },
  {
    id: "set-3",
    title: "Quiz Set 3",
    subtitle: "Challenge mix · Unit 1 focus",
    questions: [
      {
        id: "s3q1",
        section: "verb",
        prompt: "After you ---- I went to sleep.",
        options: [
          { id: "A", text: "had left" },
          { id: "B", text: "leave" },
          { id: "C", text: "are leaving" },
          { id: "D", text: "leaves" },
        ],
        correctId: "A",
        explanation:
          "One past action before another → past perfect “had left”.",
      },
      {
        id: "s3q2",
        section: "verb",
        prompt: "He ---- here since 1970.",
        options: [
          { id: "A", text: "is coming" },
          { id: "B", text: "coming" },
          { id: "C", text: "have been coming" },
          { id: "D", text: "has been coming" },
        ],
        correctId: "D",
        explanation:
          "“Since 1970” with a continuing action → present perfect continuous; subject He → “has been coming”.",
      },
      {
        id: "s3q3",
        section: "spelling",
        prompt: "Choose the word with correct spelling:",
        options: [
          { id: "A", text: "Difenet" },
          { id: "B", text: "Deffinit" },
          { id: "C", text: "Definite" },
          { id: "D", text: "Definitte" },
        ],
        correctId: "C",
        explanation: "The correct spelling is Definite.",
      },
      {
        id: "s3q4",
        section: "spelling",
        prompt: "Choose the word with correct spelling:",
        options: [
          { id: "A", text: "Proficient" },
          { id: "B", text: "Profecient" },
          { id: "C", text: "Proficiant" },
          { id: "D", text: "Profeceant" },
        ],
        correctId: "A",
        explanation: "The correct spelling is Proficient.",
      },
      {
        id: "s3q5",
        section: "vocab",
        prompt: 'The antonym of "inseparable" is:',
        options: [
          { id: "A", text: "connected" },
          { id: "B", text: "united" },
          { id: "C", text: "separable / divisible" },
          { id: "D", text: "mutual" },
        ],
        correctId: "C",
        explanation:
          "Inseparable = unable to be separated; opposite is separable.",
      },
      {
        id: "s3q6",
        section: "vocab",
        prompt: 'The synonym of "emancipation" is:',
        options: [
          { id: "A", text: "enslavement" },
          { id: "B", text: "freedom / liberation" },
          { id: "C", text: "punishment" },
          { id: "D", text: "silence" },
        ],
        correctId: "B",
        explanation:
          "Glossary: emancipation = being freed from restrictions, especially slavery.",
      },
      {
        id: "s3q7",
        section: "vocab",
        prompt: 'The word "relevant" means:',
        options: [
          { id: "A", text: "unrelated" },
          { id: "B", text: "closely connected to the topic" },
          { id: "C", text: "ancient only" },
          { id: "D", text: "harmful" },
        ],
        correctId: "B",
        explanation:
          "Glossary: relevant = closely connected or appropriate to what is discussed.",
      },
      {
        id: "s3q8",
        section: "vocab",
        prompt: 'The antonym of "mutual" is:',
        options: [
          { id: "A", text: "shared" },
          { id: "B", text: "one-sided" },
          { id: "C", text: "equal" },
          { id: "D", text: "joint" },
        ],
        correctId: "B",
        explanation:
          "Mutual = felt by both sides; one-sided is the opposite.",
      },
      {
        id: "s3q9",
        section: "grammar",
        prompt:
          "The room was full so I had no place to sit. It is a/an ---- sentence:",
        options: [
          { id: "A", text: "simple" },
          { id: "B", text: "compound" },
          { id: "C", text: "complex" },
          { id: "D", text: "exclamatory" },
        ],
        correctId: "B",
        explanation:
          "Two clauses joined by coordinating “so” → compound sentence.",
      },
      {
        id: "s3q10",
        section: "grammar",
        prompt:
          "Keep the balls in the basket. The underlined word “balls” is a/an ---- noun:",
        options: [
          { id: "A", text: "proper" },
          { id: "B", text: "concrete" },
          { id: "C", text: "abstract" },
          { id: "D", text: "collective" },
        ],
        correctId: "B",
        explanation:
          "Balls are physical things you can touch → concrete noun.",
      },
    ],
  },
];

export const shortQuestions: ShortQuestion[] = [
  {
    id: "sq1",
    prompt:
      "What was the social condition of women, orphans, and slaves in pre-Islamic Arabia?",
    modelAnswer:
      "Before Islam, Arabian society was tribal and patriarchal. Women often lacked basic rights and newborn girls were sometimes buried alive. Orphans were exploited and left unprotected. Slavery was widespread and slaves were treated as subhuman with almost no legal recognition.",
    chapterHint:
      "See the opening paragraphs describing pre-Islamic Arabian society.",
  },
  {
    id: "sq2",
    prompt:
      "What are three specific rights that Hazrat Muhammad (SAW) introduced for women?",
    modelAnswer:
      "Women were given rights to (1) own and inherit property, (2) give consent to marriage (no forced marriage), and (3) fair treatment in divorce including maintenance/financial support. Education and seeking knowledge for women was also encouraged.",
    chapterHint: "Look at the numbered rights listed after the Qur’an quotation.",
  },
  {
    id: "sq3",
    prompt:
      "How did Hazrat Muhammad (SAW) promote the emancipation of slaves?",
    modelAnswer:
      "He initiated reforms that gradually undermined slavery: treating slaves with dignity, encouraging freeing of slaves as a virtuous act, and raising their human status so emancipation became a moral and social goal rather than leaving slavery unquestioned.",
    chapterHint: "Focus on the slavery / emancipation section of the unit.",
  },
  {
    id: "sq4",
    prompt:
      "What steps did the Rasoolullah (SAW) take to ensure humane treatment of slaves?",
    modelAnswer:
      "Slaves were to be treated as human beings with dignity, given fair treatment and kindness, and not regarded as subhuman. His teachings linked belief in Allah with justice and mercy toward the weak, including slaves.",
    chapterHint: "Pair humane treatment with the broader justice message of the unit.",
  },
  {
    id: "sq5",
    prompt:
      "What role did the Qur’an play in guiding these social reforms? Give two examples.",
    modelAnswer:
      "The Qur’an provided the moral and legal basis for reforms. Examples: (1) verses on equality and piety (e.g. Qur’an 49:13) supporting dignity of all people; (2) inheritance rights for women (e.g. Surah An-Nisa) and guidance on care for orphans and the weak.",
    chapterHint: "Use the Qur’an quotations and legal rights mentioned in the chapter.",
  },
  {
    id: "sq6",
    prompt:
      "What values in these reforms are still relevant to modern societies?",
    modelAnswer:
      "Justice, compassion, equality, human dignity, protection of the vulnerable (women, orphans, marginalized people), and moral responsibility remain relevant for today’s social justice and human-rights discussions.",
    chapterHint: "See the concluding paragraphs on relevance today.",
  },
];

export const translations: TranslationItem[] = [
  {
    id: "tr1",
    direction: "en-ur",
    title: "Translate into Urdu OR rewrite into simple English",
    source:
      "Hazrat Muhammad (SAW) transformed a deeply tribal and unjust society into one based on justice, compassion, and equality. His reforms uplifted women, orphans, and slaves.",
    modelAnswer:
      "حضرت محمد ﷺ نے ایک گہرے قبائلی اور ناانصاف معاشرے کو عدل، ہمدردی اور مساوات پر مبنی معاشرے میں بدل دیا۔ آپ ﷺ کے اصلاحی اقدامات نے عورتوں، یتیموں اور غلاموں کا مقام بلند کیا۔",
    simpleEnglishModelAnswer:
      "Hazrat Muhammad (SAW) changed an unfair tribal society into a fair one based on justice, kindness, and equality. His reforms helped women, orphans, and slaves.",
    notes:
      "Board style: either upload a photo of your handwritten Urdu, or type a simple English rewrite. Same freedom as the exam.",
  },
  {
    id: "tr2",
    direction: "ur-en",
    title: "Urdu → English",
    source:
      "ہمیں اپنے والدین کا احترام کرنا چاہیے اور ان کی خدمت کرنی چاہیے۔ وہ ہمیں کھانا، کپڑے اور تعلیم فراہم کرتے ہیں۔ ان کی دعاؤں میں ہماری کامیابی پوشیدہ ہے۔",
    modelAnswer:
      "We should respect our parents and serve them. They provide us with food, clothes, and education. Our success is hidden in their prayers.",
    notes: "Board-style paragraph on respect and service to parents.",
  },
];

export const pairs: PairItem[] = [
  {
    id: "p1",
    word1: "Altar",
    word2: "Alter",
    modelSentences: [
      "The couple stood before the altar.",
      "Please do not alter the original document.",
    ],
    tip: "Altar = place of worship; Alter = to change.",
  },
  {
    id: "p2",
    word1: "Cell",
    word2: "Sell",
    modelSentences: [
      "The prisoner sat alone in his cell.",
      "They sell fresh fruit in the market.",
    ],
    tip: "Cell = small room / biological unit; Sell = to exchange for money.",
  },
  {
    id: "p3",
    word1: "Waste",
    word2: "Waist",
    modelSentences: [
      "Do not waste water during the summer.",
      "The belt was tied around her waist.",
    ],
    tip: "Waste = misuse / rubbish; Waist = middle of the body.",
  },
  {
    id: "p4",
    word1: "Role",
    word2: "Roll",
    modelSentences: [
      "Teachers play an important role in society.",
      "Please roll the carpet carefully.",
    ],
    tip: "Role = function/part; Roll = turn over / list.",
  },
  {
    id: "p5",
    word1: "Peace",
    word2: "Piece",
    modelSentences: [
      "The reforms aimed to create peace in society.",
      "He ate a piece of bread.",
    ],
    tip: "Peace = calm/harmony; Piece = a part of something.",
  },
];
