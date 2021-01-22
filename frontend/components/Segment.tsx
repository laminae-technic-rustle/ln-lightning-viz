import styled from "styled-components";
import { LabelTitle } from "./SidebarElements";

const SegmentContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 1rem 0;
  justify-content: center;
`;
const SegmentGroup = styled.div`
  border: 2px solid #2c3b7c;
  border-radius: 0.5rem;
  overflow: hidden;
`;
const SegmentButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  outline: none;
  border: none;
  background-color: ${({ active }) => (active ? `#2c3b7c` : `#fff`)};
  color: ${({ active }) => (active ? `#fff` : `#2c3b7c`)};
  cursor: pointer;
  &:hover {
    background-color: ${({ active }) =>
      active ? `rgba(44, 59, 124, 0.9)` : `rgba(44, 59, 124, 0.1)`};
  }
`;

type SegmentItem<T extends string> = {
  name: string;
  value: T;
};

type Props<Segment extends string> = {
  title: string;
  current: Segment;
  segments: Array<SegmentItem<Segment>>;
  handleUpdate: (y: Segment) => void;
};

const Segment = <Segment extends string>({
  title,
  current,
  segments,
  handleUpdate,
}: Props<Segment>) => {
  return (
    <>
      <LabelTitle>{title}</LabelTitle>
      <SegmentContainer>
        <SegmentGroup>
          {segments.map((segment: SegmentItem<Segment>) => (
            <SegmentButton
              key={segment.value}
              active={current === segment.value}
              onClick={(_) => handleUpdate(segment.value)}
            >
              {segment.name}
            </SegmentButton>
          ))}
        </SegmentGroup>
      </SegmentContainer>
    </>
  );
};

export { Segment };
