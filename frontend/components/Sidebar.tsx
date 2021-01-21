import React from "react";
import styled from 'styled-components'
import type { metadata, graphAndMetaData, node, edge } from "shared";
import type { options } from "../pages/index";
import { Range } from "./Range";
import { Segment } from "./Segment";
import { fold, none, some, Option } from "fp-ts/option";
import { identity, constant, pipe } from "fp-ts/function";

// The setOptions is just a function from Option<option> to void, not sure what the need for that function signature is..
type Props = {
  metadata: metadata,
  options: options
  setOptions: React.Dispatch<React.SetStateAction<Option<options>>>
}

const Container = styled.div`
  z-index: 999;
  position: fixed;
  width: 20vw;
  top: 1rem;
  padding: 0.25rem 1.5rem 0.75rem;
  right: 1rem;
  background: white;
  border-radius: 1rem;
`;

const FootNote = styled.p`
  color: #333344;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 400;
`;

const Sidebar = ({ metadata, options, setOptions }: Props) => {

  const handleRangeUpdate = (prop: string) => (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement; // Wet? This should really be inferrable... 
    setOptions(some({ ...options, [prop]: target.value }))
  }

  const handleForceModeUpdate = (forceMode: options["forceMode"]) =>
    setOptions(some({ ...options, forceMode }))

  return (
    <Container>
      <h2>Options</h2>
      <Range
        title="Minimum Connections"
        prop={"min"}
        min={metadata.min}
        max={options.max}
        defaultValue={options.min}
        handleUpdate={handleRangeUpdate}
      />
      <Range
        title="Maximum Connections"
        prop={"max"}
        min={options.min}
        max={metadata.max}
        defaultValue={options.max}
        handleUpdate={handleRangeUpdate}
      />
      <Segment
        title="Force Mode"
        current={options.forceMode}
        handleUpdate={handleForceModeUpdate}
        segments={[{ name: "Radial In", value: "radialin"}, {name: "Radial Out", value: "radialout"}]}
      />
      <FootNote>Big ranges may result in slow rendering</FootNote>
    </Container>
  )
};


export { Sidebar };