// Knowledge-Graph Fact Generator
const entities = [
    { id: "gpu", name: "GPUs", type: "hardware" },
    { id: "transformer", name: "Transformer models", type: "ai" },
    { id: "neural_network", name: "Neural networks", type: "ai" },
    { id: "quantum_computer", name: "Quantum computers", type: "science" },
    { id: "satellite", name: "Satellites", type: "space" },
    { id: "data_center", name: "Data centers", type: "infrastructure" },
    { id: "octopus", name: "Octopuses", type: "animal" },
    { id: "black_hole", name: "Black holes", type: "space" },
    { id: "graph_theory", name: "Graph theory", type: "math" },
    { id: "internet", name: "The internet", type: "tech" },
    { id: "blockchain", name: "Blockchain tech", type: "tech" },
    { id: "cloud", name: "Cloud computing", type: "tech" },
    { id: "api", name: "APIs", type: "tech" },
    { id: "llm", name: "Large Language Models", type: "ai" },
    { id: "silicon", name: "Silicon chips", type: "hardware" },
    { id: "fiber", name: "Fiber optics", type: "infrastructure" },
    { id: "algorithm", name: "Algorithms", type: "math" },
    { id: "tardigrade", name: "Tardigrades", type: "nature" },
    { id: "supernova", name: "Supernovas", type: "space" },
    { id: "cpu", name: "CPUs", type: "hardware" },
    { id: "dataset", name: "Massive datasets", type: "data" },
    { id: "encryption", name: "Encryption protocols", type: "tech" }
];

const relations = [
    ["gpu", "power", "transformer"],
    ["gpu", "accelerate", "neural_network"],
    ["neural_network", "enable", "llm"],
    ["data_center", "host", "cloud"],
    ["satellite", "collect data for", "internet"],
    ["black_hole", "warp", "space"],
    ["octopus", "demonstrate decentralized intelligence like", "neural_network"],
    ["graph_theory", "underpin", "algorithm"],
    ["internet", "connect", "data_center"],
    ["blockchain", "decentralize", "internet"],
    ["api", "interface with", "cloud"],
    ["llm", "parse", "dataset"],
    ["silicon", "build", "gpu"],
    ["fiber", "transmit data for", "internet"],
    ["algorithm", "optimize", "neural_network"],
    ["quantum_computer", "threaten", "encryption"],
    ["supernova", "create heavy elements for", "silicon"],
    ["cpu", "manage operations in", "data_center"],
    ["dataset", "train", "transformer"],
    ["encryption", "secure", "blockchain"]
];

const templates = [
    (rel) => `<strong>${rel.subject}</strong> help <span class="highlight">${rel.predicate}</span> ${rel.object}.`,
    (rel) => `Modern ${rel.object} increasingly rely on <strong>${rel.subject}</strong> to <span class="highlight">${rel.predicate}</span> them.`,
    (rel) => `The primary role of <strong>${rel.subject}</strong> in this context is to <span class="highlight">${rel.predicate}</span> ${rel.object}.`,
    (rel) => `Without <strong>${rel.subject}</strong>, it would be impossible to effectively <span class="highlight">${rel.predicate}</span> ${rel.object} at scale.`,
    (rel) => `Engineers use <strong>${rel.subject}</strong> specifically to <span class="highlight">${rel.predicate}</span> ${rel.object}.`
];

function buildGraph() {
    const nodes = {};
    entities.forEach(e => nodes[e.id] = e);

    return relations.map(r => ({
        subject: nodes[r[0]].name,
        predicate: r[1],
        object: nodes[r[2]] ? nodes[r[2]].name : r[2],
        category: nodes[r[0]].type
    }));
}

const edges = buildGraph();

window.generateRandomFact = function () {
    const rel = edges[Math.floor(Math.random() * edges.length)];
    const template = templates[Math.floor(Math.random() * templates.length)];

    let icon = '💡';
    let label = 'INSIGHT';

    if (rel.category === 'ai' || rel.category === 'math') { icon = '🤖'; label = 'AI & COMPUTE'; }
    if (rel.category === 'hardware' || rel.category === 'infrastructure') { icon = '⚙️'; label = 'SYSTEMS'; }
    if (rel.category === 'space' || rel.category === 'science') { icon = '🚀'; label = 'SCIENCE'; }
    if (rel.category === 'tech' || rel.category === 'data') { icon = '💾'; label = 'TECH LORE'; }

    return {
        cat: rel.category,
        icon: icon,
        label: label,
        text: template(rel)
    };
};

window.generateRandomSnippet = function () {
    const rel = edges[Math.floor(Math.random() * edges.length)];
    return `${rel.subject} ${rel.predicate} ${rel.object}`;
};
