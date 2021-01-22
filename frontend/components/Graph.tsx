import React from "react";
import type { graphAndMetaData, nodeId } from "shared";
import type { options, state } from "../pages/index";
import { fold, none, some, Option } from "fp-ts/Option";
import { identity, constant, pipe } from "fp-ts/function";

import dynamic from "next/dynamic";
const ForceGraph3D = dynamic(() =>
  import("react-force-graph").then(
    (x) => x.ForceGraph3D,
    (_) => null as never
  )
);

type Props = {
  graphAndMetaData: graphAndMetaData;
  options: options;
  state: state;
  setState: React.Dispatch<React.SetStateAction<state>>;
};

const Graph = ({ graphAndMetaData, state, options, setState }: Props) => {
  const { graph, metadata } = graphAndMetaData;
  let [graphComponent, setGraphComponent] = React.useState<Option<JSX.Element>>(
    none
  );

  const handleClick = (id: nodeId) =>
    setState((state) => ({ ...state, selected: some(id) }));
  const handleHover = (id: nodeId) =>
    setState((state) => ({ ...state, hovered: some(id) }));

  React.useEffect(() => {
    /* Filter the set of node connections by their connection amount */
    const included: { [key: string]: boolean } = {};
    for (let [key, value] of Object.entries(metadata.nodeConnections)) {
      included[key] = value >= options.min && value <= options.max;
    }

    /* Filter the nodes by those that are included in the set */
    const nodes: Array<{ id: string }> = [];
    for (let [id, _] of graph.nodes) {
      if (included[id]) {
        nodes.push({ id });
      }
    }

    /* Filter the edges that belong to those nodes */
    const links: Array<{ source: string; target: string }> = [];
    for (let [_, source, target] of graph.edges) {
      if (included[source] && included[target]) {
        links.push({ source, target });
      }
    }

    setGraphComponent(
      some(
        <ForceGraph3D
          linkColor={"#2c3b7c"}
          nodeOpacity={1}
          nodeAutoColorBy={"#95dffd"}
          linkVisibility={true}
          linkCurvature={0.1}
          nodeResolution={6}
          nodeRelSize={Math.sqrt(nodes.length) / 5}
          warmupTicks={25}
          cooldownTicks={1}
          numDimensions={3}
          dagMode={options.forceMode}
          onNodeClick={(n, _) =>
            n.id && typeof n.id == "string" && handleClick(n.id)
          }
          onNodeHover={(n, _) =>
            n && n.id && typeof n.id == "string" && handleHover(n.id)
          }
          enablePointerInteraction={true}
          enableNodeDrag={false}
          rendererConfig={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
          graphData={{ nodes, links }}
        />
      )
    );
  }, [options]);

  return pipe(graphComponent, fold(constant(<>Loading...</>), identity));
};

export { Graph };
