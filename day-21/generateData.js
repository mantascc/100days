// Generate realistic mock data for 30-day agent-user interaction network

function generateData() {
  const now = Math.floor(Date.now() / 1000);
  const startTime = now - (30 * 86400); // 30 days ago
  const endTime = now;

  // 5 Agents with different specialties and popularity
  const agents = [
    { id: "agent_a", name: "Data Agent", specialty: "data", popularity: 3.0 },
    { id: "agent_b", name: "Search Agent", specialty: "search", popularity: 2.5 },
    { id: "agent_c", name: "Analysis Agent", specialty: "analysis", popularity: 1.8 },
    { id: "agent_d", name: "Report Agent", specialty: "reporting", popularity: 2.2 },
    { id: "agent_e", name: "Query Agent", specialty: "querying", popularity: 1.5 }
  ];

  // 100 Users with different activity patterns
  const users = [];
  for (let i = 1; i <= 100; i++) {
    users.push({
      id: `user_${i}`,
      // Activity levels: high users interact daily, medium weekly, low sporadic
      activityLevel: i <= 15 ? "high" : i <= 50 ? "medium" : "low",
      // Preferred agents (some users have favorites)
      preferredAgent: i % 3 === 0 ? agents[Math.floor(Math.random() * agents.length)].id : null
    });
  }

  // Temporal patterns by hour (0-23)
  function getHourMultiplier(hour) {
    if (hour >= 0 && hour < 6) return 0.1; // Night: very low
    if (hour >= 6 && hour < 9) return 0.7; // Morning: ramping up
    if (hour >= 9 && hour < 12) return 1.5; // Late morning: peak
    if (hour >= 12 && hour < 13) return 0.5; // Lunch: dip
    if (hour >= 13 && hour < 17) return 1.4; // Afternoon: peak
    if (hour >= 17 && hour < 20) return 0.6; // Evening: decline
    return 0.3; // Late evening: low
  }

  // Day-of-week patterns (0=Sunday, 6=Saturday)
  function getDayOfWeekMultiplier(dayOfWeek) {
    if (dayOfWeek === 0 || dayOfWeek === 6) return 0.3; // Weekend: low
    if (dayOfWeek === 1) return 1.1; // Monday: high
    if (dayOfWeek === 5) return 0.8; // Friday: moderate
    return 1.0; // Tue-Thu: normal
  }

  // Generate multi-day incidents
  const incidents = [
    // agent_c outage on day 8-9
    {
      agent: "agent_c",
      startDay: 8,
      endDay: 9,
      failureRate: 0.9,
      redirectTo: "agent_d"
    },
    // agent_b degraded performance on day 15-17
    {
      agent: "agent_b",
      startDay: 15,
      endDay: 17,
      failureRate: 0.3,
      redirectTo: null
    },
    // agent_a brief outage on day 22
    {
      agent: "agent_a",
      startDay: 22,
      endDay: 22,
      failureRate: 0.8,
      redirectTo: "agent_e"
    }
  ];

  function getIncident(agentId, day) {
    return incidents.find(inc =>
      inc.agent === agentId && day >= inc.startDay && day <= inc.endDay
    );
  }

  // Generate interactions
  const interactions = [];
  const targetInteractions = 4000;

  for (let i = 0; i < targetInteractions; i++) {
    // Pick a random user weighted by activity level
    const userWeights = users.map(u => {
      if (u.activityLevel === "high") return 5;
      if (u.activityLevel === "medium") return 2;
      return 1;
    });

    const totalWeight = userWeights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    let userIdx = 0;

    for (let j = 0; j < userWeights.length; j++) {
      rand -= userWeights[j];
      if (rand <= 0) {
        userIdx = j;
        break;
      }
    }

    const user = users[userIdx];

    // Generate timestamp with realistic distribution
    let timestamp;
    let attempts = 0;

    do {
      timestamp = startTime + Math.random() * (endTime - startTime);
      const date = new Date(timestamp * 1000);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();

      const hourMult = getHourMultiplier(hour);
      const dayMult = getDayOfWeekMultiplier(dayOfWeek);
      const probability = hourMult * dayMult;

      // Accept or reject based on temporal patterns
      if (Math.random() < probability * 0.5) break;

      attempts++;
    } while (attempts < 5);

    const date = new Date(timestamp * 1000);
    const day = Math.floor((timestamp - startTime) / 86400) + 1;

    // Pick agent
    let agentIdx;

    // Use preferred agent 60% of the time if user has one
    if (user.preferredAgent && Math.random() < 0.6) {
      agentIdx = agents.findIndex(a => a.id === user.preferredAgent);
    } else {
      // Weight by popularity
      const agentWeights = agents.map(a => a.popularity);
      const totalAgentWeight = agentWeights.reduce((a, b) => a + b, 0);
      rand = Math.random() * totalAgentWeight;

      for (let j = 0; j < agentWeights.length; j++) {
        rand -= agentWeights[j];
        if (rand <= 0) {
          agentIdx = j;
          break;
        }
      }
    }

    let agent = agents[agentIdx];
    let outcome = "success";

    // Check for incidents
    const incident = getIncident(agent.id, day);

    if (incident) {
      if (Math.random() < incident.failureRate) {
        if (incident.redirectTo && Math.random() < 0.7) {
          // User retries with redirect agent
          agent = agents.find(a => a.id === incident.redirectTo);
        } else {
          outcome = "failure";
        }
      }
    }

    // Baseline failure rate (1-2%)
    if (outcome === "success" && Math.random() < 0.015) {
      outcome = "failure";
    }

    interactions.push({
      source: user.id,
      target: agent.id,
      timestamp: Math.floor(timestamp),
      day: day,
      outcome: outcome
    });
  }

  // Sort by timestamp
  interactions.sort((a, b) => a.timestamp - b.timestamp);

  // Clean up output
  const cleanUsers = users.map(({ id }) => ({ id }));
  const cleanAgents = agents.map(({ id, name, specialty }) => ({ id, name, specialty }));

  return {
    agents: cleanAgents,
    users: cleanUsers,
    interactions: interactions,
    metadata: {
      timeRange: {
        start: startTime,
        end: endTime
      },
      days: 30,
      userCount: users.length,
      agentCount: agents.length,
      interactionCount: interactions.length,
      incidents: incidents.map(({ agent, startDay, endDay, redirectTo }) => ({
        agent,
        startDay,
        endDay,
        redirectTo
      }))
    }
  };
}

// Generate and export
const data = generateData();
console.log(JSON.stringify(data, null, 2));
