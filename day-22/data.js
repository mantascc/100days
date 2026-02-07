const nodes = [
    // Diagnostic loop
    {id: "d1", label: "Detect", group: "cyan"},
    {id: "d2", label: "Interpret", group: "cyan"},
    {id: "d3", label: "Act", group: "cyan"},
    {id: "d4", label: "Verify", group: "cyan"},
    
    // Reflective loop
    {id: "r1", label: "Act", group: "blue"},
    {id: "r2", label: "Observe", group: "blue"},
    {id: "r3", label: "Evaluate", group: "blue"},
    {id: "r4", label: "Adjust", group: "blue"},
    
    // Experimental loop
    {id: "e1", label: "Hypothesize", group: "purple"},
    {id: "e2", label: "Test", group: "purple"},
    {id: "e3", label: "Measure", group: "purple"},
    {id: "e4", label: "Conclude", group: "purple"},
    
    // Planning loop
    {id: "p1", label: "Goal", group: "yellow"},
    {id: "p2", label: "Plan", group: "yellow"},
    {id: "p3", label: "Execute", group: "yellow"},
    {id: "p4", label: "Monitor", group: "yellow"},
    {id: "p5", label: "Replan", group: "yellow"},
    
    // Prescriptive loop
    {id: "pr1", label: "Detect", group: "red"},
    {id: "pr2", label: "Diagnose", group: "red"},
    {id: "pr3", label: "Prescribe", group: "red"},
    {id: "pr4", label: "Implement", group: "red"},
    
    // Sensemaking loop
    {id: "s1", label: "Collect", group: "cyan"},
    {id: "s2", label: "Interpret", group: "cyan"},
    {id: "s3", label: "Frame", group: "cyan"},
    {id: "s4", label: "Decide", group: "cyan"},
    
    // Creative loop
    {id: "c1", label: "Explore", group: "purple"},
    {id: "c2", label: "Generate", group: "purple"},
    {id: "c3", label: "Evaluate", group: "purple"},
    {id: "c4", label: "Refine", group: "purple"},
    
    // Negotiation loop
    {id: "n1", label: "Propose", group: "blue"},
    {id: "n2", label: "Evaluate", group: "blue"},
    {id: "n3", label: "Align", group: "blue"},
    {id: "n4", label: "Commit", group: "blue"},
    
    // Maintenance loop
    {id: "m1", label: "Monitor", group: "yellow"},
    {id: "m2", label: "Detect Drift", group: "yellow"},
    {id: "m3", label: "Correct", group: "yellow"},
    {id: "m4", label: "Stabilize", group: "yellow"},
    
    // Meta-cognitive loop
    {id: "mc1", label: "Observe Process", group: "red"},
    {id: "mc2", label: "Diagnose Bias", group: "red"},
    {id: "mc3", label: "Reframe", group: "red"},
    {id: "mc4", label: "Redesign", group: "red"}
  ];
  
  const edges = [
    // Diagnostic loop
    {source: "d1", target: "d2"},
    {source: "d2", target: "d3"},
    {source: "d3", target: "d4"},
    {source: "d4", target: "d1"},
    
    // Reflective loop
    {source: "r1", target: "r2"},
    {source: "r2", target: "r3"},
    {source: "r3", target: "r4"},
    {source: "r4", target: "r1"},
    
    // Experimental loop
    {source: "e1", target: "e2"},
    {source: "e2", target: "e3"},
    {source: "e3", target: "e4"},
    {source: "e4", target: "e1"},
    
    // Planning loop
    {source: "p1", target: "p2"},
    {source: "p2", target: "p3"},
    {source: "p3", target: "p4"},
    {source: "p4", target: "p5"},
    {source: "p5", target: "p2"},
    
    // Prescriptive loop
    {source: "pr1", target: "pr2"},
    {source: "pr2", target: "pr3"},
    {source: "pr3", target: "pr4"},
    {source: "pr4", target: "pr1"},
    
    // Sensemaking loop
    {source: "s1", target: "s2"},
    {source: "s2", target: "s3"},
    {source: "s3", target: "s4"},
    {source: "s4", target: "s1"},
    
    // Creative loop
    {source: "c1", target: "c2"},
    {source: "c2", target: "c3"},
    {source: "c3", target: "c4"},
    {source: "c4", target: "c1"},
    
    // Negotiation loop
    {source: "n1", target: "n2"},
    {source: "n2", target: "n3"},
    {source: "n3", target: "n4"},
    {source: "n4", target: "n1"},
    
    // Maintenance loop
    {source: "m1", target: "m2"},
    {source: "m2", target: "m3"},
    {source: "m3", target: "m4"},
    {source: "m4", target: "m1"},
    
    // Meta-cognitive loop
    {source: "mc1", target: "mc2"},
    {source: "mc2", target: "mc3"},
    {source: "mc3", target: "mc4"},
    {source: "mc4", target: "mc1"}
  ];
  
  const colorMap = {
    red: "#ff6b6b",
    cyan: "#4ecdc4",
    yellow: "#ffe66d",
    blue: "#a8dadc",
    purple: "#c77dff"
  };