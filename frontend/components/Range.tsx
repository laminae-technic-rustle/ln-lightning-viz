import styled from 'styled-components'
import { LabelTitle } from './SidebarElements';

const RangeContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  & h4 {
    padding: 0 0.5rem;
  }
  & input {
    outline: none;
    flex-grow: 2;
  }
`;

type Props = {
  title: string,
  prop: string,
  min: number,
  max: number,
  defaultValue: number,
  handleUpdate: (x: string) => (y: React.MouseEvent) => void
};

const Range = ({ title, prop, min, max, defaultValue, handleUpdate }: Props) => {
  return (
    <>
      <LabelTitle htmlFor={prop}>
        {title} ({defaultValue})
      </LabelTitle>
      <RangeContainer>
        <h4>{min}</h4>
        <input type="range" onMouseUp={handleUpdate(prop)} min={min} max={max} defaultValue={defaultValue} id={prop} />
        <h4>{max}</h4>
      </RangeContainer>
    </>
  );
};

export { Range };
