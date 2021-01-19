import Head from "next/head";
import React from "react";
import type { graph, node, edge } from "shared";
import Graph from "../components/Graph";

enum State {
  Initial,
  Loading,
  Success,
  Error,
};

const baseUrl = "http://localhost:8080" // FIXME -- get from Dockerfile

const Home = () => {
  let [state, setState] = React.useState(State.Initial);
  let [graph, setGraph] = React.useState<graph>({nodes: [], edges: []});

  React.useEffect(() => {
    setState(State.Loading);
    fetch(`${baseUrl}/graph`)
      .then(res => res.json())
      .then((graph: graph) => {
        setGraph(graph);
        setState(State.Success);
      })
  }, []);

  return (
    <div>
      <Head>
        <title>LN Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>Some nav</nav>
      <main>
        {state === State.Initial && "..."}
        {state === State.Loading && "Loading"}
        {state === State.Error && "Error Fetching"}
        {state === State.Success && <Graph graph={graph} />}

      </main>
      <footer>Some footer</footer>
    </div>
  );
};

export default Home;
