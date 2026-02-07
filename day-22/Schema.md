Graph SchemaNodes

id (string): Unique identifier
label (string): Display text
group (string): Color category key
Edges

source (string): Origin node id
target (string): Destination node id
Color Map
Predefined palette mapping group names to hex colors.

Example:javascriptconst nodes = [
  {id: "01", label: "Detect", group: "cyan"},
  {id: "02", label: "Interpret", group: "cyan"},
  {id: "03", label: "Act", group: "yellow"}
];

const edges = [
  {source: "01", target: "02"},
  {source: "02", target: "03"}
];

const colorMap = {
  cyan: "#4ecdc4",
  yellow: "#ffe66d",
  red: "#ff6b6b"
};