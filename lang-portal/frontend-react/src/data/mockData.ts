
// Mock data for development purposes
export const words = [
  {
    id: 1,
    portuguese: "Navegador",
    kimbundu: "Mulambi",
    english: "Browser",
    correctCount: 12,
    wrongCount: 3,
    groups: [1, 3]
  },
  {
    id: 2,
    portuguese: "Computador",
    kimbundu: "Komputadol",
    english: "Computer",
    correctCount: 8,
    wrongCount: 2,
    groups: [1, 2]
  },
  {
    id: 3,
    portuguese: "Rato",
    kimbundu: "Mbatu",
    english: "Mouse",
    correctCount: 15,
    wrongCount: 1,
    groups: [1]
  },
  {
    id: 4,
    portuguese: "Teclado",
    kimbundu: "Mbandu",
    english: "Keyboard",
    correctCount: 7,
    wrongCount: 5,
    groups: [1, 2]
  },
  {
    id: 5,
    portuguese: "Janela",
    kimbundu: "Diulu",
    english: "Window",
    correctCount: 10,
    wrongCount: 2,
    groups: [3]
  },
  {
    id: 6,
    portuguese: "Arquivo",
    kimbundu: "Mukanda",
    english: "File",
    correctCount: 5,
    wrongCount: 3,
    groups: [3]
  },
  {
    id: 7,
    portuguese: "Internet",
    kimbundu: "Lusanzu",
    english: "Internet",
    correctCount: 20,
    wrongCount: 0,
    groups: [2, 3]
  },
  {
    id: 8,
    portuguese: "Correr",
    kimbundu: "Kulambalala",
    english: "To run",
    correctCount: 9,
    wrongCount: 4,
    groups: [4]
  },
  {
    id: 9,
    portuguese: "Andar",
    kimbundu: "Kuenda",
    english: "To walk",
    correctCount: 14,
    wrongCount: 2,
    groups: [4]
  },
  {
    id: 10,
    portuguese: "Falar",
    kimbundu: "Kuzuela",
    english: "To speak",
    correctCount: 16,
    wrongCount: 1,
    groups: [4]
  }
];

export const groups = [
  {
    id: 1,
    name: "Technology Basics",
    wordCount: 4
  },
  {
    id: 2,
    name: "Internet Terms",
    wordCount: 3
  },
  {
    id: 3,
    name: "Computer Interface",
    wordCount: 4
  },
  {
    id: 4,
    name: "Core Verbs",
    wordCount: 3
  }
];

export const studyActivities = [
  {
    id: 1,
    title: "Adventure MUD",
    description: "Text-based adventure game that teaches vocabulary in context",
    thumbnail: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWR2ZW50dXJlJTIwZ2FtZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 2,
    title: "Typing Tutor",
    description: "Practice typing in Portuguese and Kimbundu with instant feedback",
    thumbnail: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHlwaW5nfGVufDB8fDB8fHww"
  },
  {
    id: 3,
    title: "Flashcard Challenge",
    description: "Traditional flashcard learning with spaced repetition system",
    thumbnail: "https://images.unsplash.com/photo-1613203008597-358df6e2c8e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zmxhc2hjYXJkfGVufDB8fDB8fHww"
  },
  {
    id: 4,
    title: "Conversation Simulator",
    description: "Practice realistic conversations with AI conversation partners",
    thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29udmVyc2F0aW9ufGVufDB8fDB8fHww"
  }
];

export const studySessions = [
  {
    id: 1,
    groupName: "Technology Basics",
    groupId: 1,
    studyActivityId: 1,
    studyActivityName: "Adventure MUD",
    startTime: "2024-05-10 09:30",
    endTime: "2024-05-10 10:15",
    reviewItemsCount: 15
  },
  {
    id: 2,
    groupName: "Internet Terms",
    groupId: 2,
    studyActivityId: 2,
    studyActivityName: "Typing Tutor",
    startTime: "2024-05-09 14:20",
    endTime: "2024-05-09 15:00",
    reviewItemsCount: 20
  },
  {
    id: 3,
    groupName: "Core Verbs",
    groupId: 4,
    studyActivityId: 3,
    studyActivityName: "Flashcard Challenge",
    startTime: "2024-05-08 11:00",
    endTime: "2024-05-08 11:40",
    reviewItemsCount: 30
  },
  {
    id: 4,
    groupName: "Computer Interface",
    groupId: 3,
    studyActivityId: 4,
    studyActivityName: "Conversation Simulator",
    startTime: "2024-05-07 16:15",
    endTime: "2024-05-07 17:00",
    reviewItemsCount: 12
  }
];

export const getWordsByGroupId = (groupId: number) => {
  return words.filter(word => word.groups.includes(groupId));
};

export const getGroupById = (groupId: number) => {
  return groups.find(group => group.id === groupId);
};

export const getWordById = (wordId: number) => {
  return words.find(word => word.id === wordId);
};

export const getGroupsForWord = (wordId: number) => {
  const word = getWordById(wordId);
  if (!word) return [];
  return groups.filter(group => word.groups.includes(group.id));
};

export const getStudyActivityById = (activityId: number) => {
  return studyActivities.find(activity => activity.id === activityId);
};

export const getSessionsByActivityId = (activityId: number) => {
  return studySessions.filter(session => session.studyActivityId === activityId);
};

export const getStudySessionById = (sessionId: number) => {
  return studySessions.find(session => session.id === sessionId);
};
