const nodes = [

    // Source
    {id: "11", label: "Mintis", group: "yellow"},

    // Actions
    {id: "21", label: "Classify", group: "cyan"},
    {id: "22", label: "Expand", group: "cyan"},
    {id: "23", label: "Simplify", group: "cyan"},
    {id: "24", label: "Evaluate", group: "cyan"},

    // Classes
    {id: "31", label: "Task", group: "blue"},
    {id: "32", label: "Floater", group: "blue"},
    {id: "33", label: "Signal", group: "blue"},
    {id: "34", label: "Noise", group: "blue"}, // Distraction
    {id: "35", label: "Note", group: "blue"}, // for later use

    // Evalutions
    {id: "41", label: "Entropy", group: "blue"},
    {id: "42", label: "Importance", group: "blue"}

  ];
  
  const edges = [

    //classify to level 3
    {source: "21", target: "31"},
    {source: "21", target: "32"},
    {source: "21", target: "33"},
    {source: "21", target: "34"},
    {source: "21", target: "35"},

    //evaluations to level 4
    {source: "24", target: "41"},
    {source: "24", target: "42"}

  ];
  
  const colorMap = {
    red: "#ff6b6b",
    cyan: "#4ecdc4",
    yellow: "#ffe66d",
    blue: "#a8dadc",
    purple: "#c77dff"
  };