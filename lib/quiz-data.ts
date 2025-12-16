export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Quiz {
  id: string
  courseId: string
  title: string
  questions: QuizQuestion[]
}

export const quizzes: Quiz[] = [
  {
    id: "html-quiz-1",
    courseId: "html-quiz",
    title: "HTML Knowledge Check",
    questions: [
      {
        id: "q1",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink Text Management Language",
        ],
        correctIndex: 0,
        explanation: "HTML stands for Hyper Text Markup Language. It's the standard language for creating web pages.",
      },
      {
        id: "q2",
        question: "Which tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctIndex: 1,
        explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML.",
      },
      {
        id: "q3",
        question: "What is the correct HTML element for the largest heading?",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        correctIndex: 2,
        explanation: "<h1> is the largest heading element. Headings go from <h1> (largest) to <h6> (smallest).",
      },
      {
        id: "q4",
        question: "Which attribute specifies an image source?",
        options: ["href", "src", "link", "source"],
        correctIndex: 1,
        explanation: "The 'src' attribute is used to specify the source URL of an image in the <img> tag.",
      },
      {
        id: "q5",
        question: "What does the <br> tag do?",
        options: ["Creates a bold text", "Inserts a line break", "Creates a border", "Makes text bigger"],
        correctIndex: 1,
        explanation: "The <br> tag inserts a single line break in HTML content.",
      },
    ],
  },
  {
    id: "phishing-quiz-1",
    courseId: "phishing-101",
    title: "Phishing Detection Quiz",
    questions: [
      {
        id: "q1",
        question: "What is a common sign of a phishing email?",
        options: [
          "Personalized greeting with your name",
          "Urgent language demanding immediate action",
          "Sent from a verified company domain",
          "Contains useful information",
        ],
        correctIndex: 1,
        explanation: "Phishing emails often use urgent language to pressure you into acting quickly without thinking.",
      },
      {
        id: "q2",
        question: "What should you check before clicking a link in an email?",
        options: [
          "The color of the link",
          "The actual URL by hovering over it",
          "How many words are in the link",
          "If it's underlined",
        ],
        correctIndex: 1,
        explanation:
          "Always hover over links to see the actual URL destination before clicking. Phishers often disguise malicious links.",
      },
      {
        id: "q3",
        question: "A bank emails asking for your password. What should you do?",
        options: [
          "Reply with your password",
          "Click the link and enter your details",
          "Ignore it - banks never ask for passwords via email",
          "Forward it to friends",
        ],
        correctIndex: 2,
        explanation: "Legitimate banks NEVER ask for passwords via email. This is always a phishing attempt.",
      },
    ],
  },
  {
    id: "react-quiz-1",
    courseId: "react-intro",
    title: "React Fundamentals",
    questions: [
      {
        id: "q1",
        question: "What is JSX?",
        options: [
          "JavaScript XML",
          "Java Syntax Extension",
          "JSON Style Export",
          "JavaScript X-files",
        ],
        correctIndex: 0,
        explanation: "JSX stands for JavaScript XML. It allows us to write HTML-like code in JavaScript.",
      },
      {
        id: "q2",
        question: "Which hook is used for side effects?",
        options: ["useState", "useContext", "useEffect", "useReducer"],
        correctIndex: 2,
        explanation: "useEffect is used to perform side effects in functional components, like data fetching or subscriptions.",
      },
      {
        id: "q3",
        question: "How do you pass data to child components?",
        options: ["State", "Props", "Context", "Redux"],
        correctIndex: 1,
        explanation: "Props (short for properties) are used to pass data from parent to child components.",
      },
    ],
  },
]
