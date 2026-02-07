// Widget type definitions and rendering

// Widget Types Registry
const WidgetTypes = {
    CHART: 'chart',
    METRIC: 'metric',
    MOONPHASE: 'moonphase',
    AGENT: 'agent'
};

// Widget Type Configuration
const widgetConfig = {
    [WidgetTypes.CHART]: {
        title: 'Chart',
        hasModal: true
    },
    [WidgetTypes.METRIC]: {
        title: 'Metric',
        hasModal: true
    },
    [WidgetTypes.MOONPHASE]: {
        title: 'Moon Phase',
        hasModal: true
    },
    [WidgetTypes.AGENT]: {
        title: 'Agent Usage',
        hasModal: true
    }
};

// Get widget title
function getWidgetTitle(type) {
    return widgetConfig[type]?.title || type.charAt(0).toUpperCase() + type.slice(1);
}

// Check if widget has modal
function hasWidgetModal(type) {
    return widgetConfig[type]?.hasModal ?? true;
}

// Render widget body content
function renderWidgetBody(type, data = null) {
    switch (type) {
        case WidgetTypes.MOONPHASE:
            return renderMoonPhaseWidget(data);
        case WidgetTypes.AGENT:
            return renderAgentUsageWidget(data);
        case WidgetTypes.CHART:
            return renderChartWidget();
        case WidgetTypes.METRIC:
            return renderMetricWidget();
        default:
            return '<div>Unknown widget type</div>';
    }
}

// Render chart widget
function renderChartWidget() {
    return 'No data available';
}

// Render metric widget
function renderMetricWidget() {
    return 'No data available';
}

// Render agent usage widget (heatmap)
function renderAgentUsageWidget(agentData) {
    if (!agentData || !agentData.interactions) {
        return '<div style="color: #a8aab8; padding: 8px;">No agent usage data available</div>';
    }

    // Process data to create heatmap by day and agent
    const heatmapData = processAgentData(agentData);
    const agents = agentData.agents || [];

    // Render compact heatmap (last 7 days)
    const days = 7;
    const maxDay = Math.max(...heatmapData.map(d => d.day));
    const startDay = Math.max(1, maxDay - days + 1);

    return renderHeatmapGrid(agents, heatmapData, startDay, maxDay, true);
}

// Process agent data into heatmap format
function processAgentData(agentData) {
    const map = new Map();

    agentData.interactions.forEach(interaction => {
        const key = `${interaction.target}_${interaction.day}`;
        if (!map.has(key)) {
            map.set(key, { agent: interaction.target, day: interaction.day, count: 0 });
        }
        map.get(key).count++;
    });

    return Array.from(map.values());
}

// Render heatmap grid
function renderHeatmapGrid(agents, heatmapData, startDay, endDay, compact = false) {
    const maxCount = Math.max(...heatmapData.map(d => d.count), 1);

    const cellSize = compact ? '16px' : '24px';
    const fontSize = compact ? '10px' : '11px';

    let html = `<div style="display: flex; flex-direction: column; gap: 4px;">`;

    // Header with day numbers
    if (!compact) {
        html += `<div style="display: flex; gap: 2px; margin-left: 60px;">`;
        for (let day = startDay; day <= endDay; day++) {
            html += `<div style="width: ${cellSize}; text-align: center; font-size: ${fontSize}; color: #6b6d7f;">${day}</div>`;
        }
        html += `</div>`;
    }

    // Rows for each agent
    agents.forEach(agent => {
        html += `<div style="display: flex; gap: 2px; align-items: center;">`;

        if (!compact) {
            html += `<div style="width: 55px; font-size: ${fontSize}; color: #a8aab8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${agent.name}</div>`;
        }

        for (let day = startDay; day <= endDay; day++) {
            const dataPoint = heatmapData.find(d => d.agent === agent.id && d.day === day);
            const count = dataPoint ? dataPoint.count : 0;
            const intensity = count > 0 ? Math.min(count / maxCount, 1) : 0;

            // Color scale from dark to bright
            const backgroundColor = count === 0
                ? 'rgba(255, 255, 255, 0.05)'
                : `rgba(99, 102, 241, ${0.3 + intensity * 0.7})`;

            html += `<div style="width: ${cellSize}; height: ${cellSize}; background: ${backgroundColor}; border-radius: 2px; border: 1px solid rgba(255,255,255,0.1);" title="Day ${day}: ${count} uses"></div>`;
        }

        html += `</div>`;
    });

    html += `</div>`;

    return html;
}

// Render moon phase widget
function renderMoonPhaseWidget(moonPhaseData) {
    if (!moonPhaseData || !moonPhaseData.phase) {
        return '<div>No moon phase data available</div>';
    }

    const phase = moonPhaseData.phase;
    const illumination = phase.illumination_fraction;

    // Create moon phase SVG
    const moonSvg = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: auto; padding: 8px;">
            <defs>
                <mask id="moonMask">
                    <rect width="100" height="100" fill="white"/>
                    <ellipse cx="${50 + (50 - illumination * 100)}" cy="50" rx="${Math.abs(50 - illumination * 100)}" ry="50" fill="black"/>
                </mask>
            </defs>
            <circle cx="50" cy="50" r="45" fill="#4a4d62" stroke="#6b6d7f" stroke-width="2"/>
            <circle cx="50" cy="50" r="45" fill="#f5f5f7" mask="url(#moonMask)"/>
        </svg>
    `;

    return `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: start;">
            <div style="display: flex; justify-content: center; align-items: center;">
                ${moonSvg}
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="font-size: 16px; font-weight: 600; color: #f5f5f7; line-height: 1.3;">${phase.name}</div>
                <div style="color: #a8aab8; font-size: 13px;">${phase.age_days} days</div>
                <div style="color: #a8aab8; font-size: 13px;">${phase.phase_angle_deg}°</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="font-size: 20px; font-weight: 600; color: #f5f5f7;">${phase.illumination_percent}%</div>
                ${phase.energy.keywords.map(keyword =>
                    `<div style="background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #c8cadb; text-align: center;">${keyword}</div>`
                ).join('')}
            </div>
        </div>
    `;
}

// Render modal content
function renderModalContent(type, data = null) {
    switch (type) {
        case WidgetTypes.MOONPHASE:
            return renderMoonPhaseModal(data);
        case WidgetTypes.AGENT:
            return renderAgentUsageModal(data);
        case WidgetTypes.CHART:
            return renderChartModal();
        case WidgetTypes.METRIC:
            return renderMetricModal();
        default:
            return '<div>Unknown widget type</div>';
    }
}

// Render chart modal
function renderChartModal() {
    return 'No data available';
}

// Render metric modal
function renderMetricModal() {
    return 'No data available';
}

// Render agent usage modal (full heatmap with 30 days)
function renderAgentUsageModal(agentData) {
    if (!agentData || !agentData.interactions) {
        return '<div style="color: #a8aab8;">No agent usage data available</div>';
    }

    const heatmapData = processAgentData(agentData);
    const agents = agentData.agents || [];
    const maxDay = Math.max(...heatmapData.map(d => d.day));
    const startDay = 1;

    // Calculate total usage stats
    const totalInteractions = agentData.interactions.length;
    const agentStats = agents.map(agent => {
        const count = heatmapData.filter(d => d.agent === agent.id).reduce((sum, d) => sum + d.count, 0);
        return { ...agent, count };
    }).sort((a, b) => b.count - a.count);

    return `
        <div style="display: flex; flex-direction: column; gap: 24px;">
            <div>
                <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 8px;">Total Interactions</div>
                <div style="font-size: 32px; font-weight: 600; color: #f5f5f7;">${totalInteractions.toLocaleString()}</div>
            </div>

            <div>
                <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 12px;">Usage by Agent</div>
                ${agentStats.map(agent => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <div style="color: #a8aab8;">${agent.name}</div>
                        <div style="color: #f5f5f7; font-weight: 600;">${agent.count}</div>
                    </div>
                `).join('')}
            </div>

            <div>
                <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 12px;">30-Day Activity Heatmap</div>
                ${renderHeatmapGrid(agents, heatmapData, startDay, maxDay, false)}
            </div>
        </div>
    `;
}

// Render moon phase modal
function renderMoonPhaseModal(moonPhaseData) {
    if (!moonPhaseData || !moonPhaseData.phase) {
        return '<div>No moon phase data available</div>';
    }

    const phase = moonPhaseData.phase;

    return `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="font-size: 24px; font-weight: 600; color: #f5f5f7;">${phase.name}</div>
            <div style="display: flex; gap: 40px; flex-wrap: wrap;">
                <div>
                    <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 8px;">Illumination</div>
                    <div style="font-size: 32px; font-weight: 600; color: #f5f5f7;">${phase.illumination_percent}%</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 8px;">Age</div>
                    <div style="font-size: 32px; font-weight: 600; color: #f5f5f7;">${phase.age_days} days</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 8px;">Phase Angle</div>
                    <div style="font-size: 32px; font-weight: 600; color: #f5f5f7;">${phase.phase_angle_deg}°</div>
                </div>
            </div>
            <div>
                <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 8px;">Energy</div>
                <div style="color: #a8aab8; font-size: 16px; margin-bottom: 12px;">${phase.energy.energy}</div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
                    ${phase.energy.keywords.map(keyword =>
                        `<span style="background: rgba(255,255,255,0.08); padding: 6px 12px; border-radius: 6px; font-size: 14px; color: #c8cadb;">${keyword}</span>`
                    ).join('')}
                </div>
            </div>
            <div>
                <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 8px;">Focus Areas</div>
                <ul style="color: #a8aab8; padding-left: 20px; line-height: 1.8;">
                    ${phase.energy.focus.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div style="display: flex; gap: 40px;">
                <div>
                    <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 8px;">Polarity</div>
                    <div style="color: #a8aab8; text-transform: capitalize;">${phase.energy.polarity}</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: #6b6d7f; text-transform: uppercase; margin-bottom: 8px;">Cycle Stage</div>
                    <div style="color: #a8aab8; text-transform: capitalize;">${phase.energy.cycle_stage}</div>
                </div>
            </div>
        </div>
    `;
}
