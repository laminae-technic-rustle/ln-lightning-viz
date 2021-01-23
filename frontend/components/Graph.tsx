import React from "react";
import type { graphAndStatistics, nodeId } from "shared";
import type { options, state } from "../pages/index";
import { fold, none, some, Option } from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";

import dynamic from "next/dynamic";
const ForceGraph3D = dynamic(() =>
  import("react-force-graph").then(
    (x) => x.ForceGraph3D,
    (_) => null as never
  )
);

type Props = {
  graphAndStatistics: graphAndStatistics;
  options: options;
  setState: React.Dispatch<React.SetStateAction<state>>;
};

type graphData = {
  nodes: Array<{ id: nodeId }>;
  links: Array<{ source: nodeId; target: nodeId }>;
};

const Graph = ({ graphAndStatistics, options, setState }: Props) => {
  const { graph, statistics } = graphAndStatistics;
  let [graphData, setGraphData] = React.useState<Option<graphData>>(none);

  const handleClick = (id: nodeId) =>
    setState((state) => ({ ...state, selected: some(id) }));

  React.useEffect(() => {
    /* Filter the set of node connections by their connection amount */
    const included: { [key: string]: boolean } = {};
    for (let [key, value] of Object.entries(statistics.nodeConnectionCount)) {
      included[key] = value >= options.min && value <= options.max;
    }

    /* Filter the nodes by those that are included in the set */
    const nodes: Array<{ id: string }> = [];
    for (let [id] of graph.nodes) {
      if (included[id]) {
        nodes.push({ id });
      }
    }

    /* Filter the edges that belong to those nodes */
    const links: Array<{ source: string; target: string }> = [];
    for (let [source, target] of graph.edges) {
      if (included[source] && included[target]) {
        links.push({ source, target });
      }
    }

    /* Update graph with new data */
    setGraphData(some({ nodes, links }));
  }, [options]);

  return pipe(
    graphData,
    fold(constant(<>Loading...</>), (graphData) => (
      <ForceGraph3D
        linkColor={"#2c3b7c"}
        nodeOpacity={1}
        nodeAutoColorBy={"#95dffd"}
        linkVisibility={true}
        linkCurvature={0.1}
        nodeResolution={6}
        nodeRelSize={Math.sqrt(graphData.nodes.length) / 5}
        warmupTicks={25}
        cooldownTicks={1}
        numDimensions={3}
        dagMode={options.forceMode}
        onNodeClick={(n, _) =>
          n.id && typeof n.id == "string" && handleClick(n.id)
        }
        onNodeHover={(n) =>
          n
            ? (document.body.style.cursor = "pointer")
            : (document.body.style.cursor = "default")
        }
        enablePointerInteraction={true}
        enableNodeDrag={false}
        rendererConfig={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        graphData={graphData}
      />
    ))
  );
};

export { Graph };
