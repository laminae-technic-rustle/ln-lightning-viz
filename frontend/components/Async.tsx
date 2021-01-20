import React from "react";
import Errors from "./Errors";
import { none, some, Option, fold } from "fp-ts/option";
import { constant, pipe } from "fp-ts/function";

enum State {
  Initial,
  Loading,
  Success,
  Error,
}

interface Props<Data> {
  url: string;
  callback: (x: Data) => void;
  children: JSX.Element;
}

const baseUrl = "http://localhost:8080"; // FIXME -- get from Dockerfile
const Async = <Data extends unknown>({
  url,
  callback,
  children,
}: Props<Data>): JSX.Element => {
  let [state, setState] = React.useState(State.Initial);
  let [errMessage, setErrMessage] = React.useState<Option<string>>(none);

  React.useEffect(() => {
    setState(State.Loading);
    fetch(`${baseUrl}${url}`)
      .then((res) => res.json())
      .then((data: Data) => {
        callback(data);
        setState(State.Success);
      })
      .catch((err: string) => {
        setErrMessage(some(err));
        setState(State.Error);
      });
  }, []);

  switch (state) {
    case State.Initial:
    case State.Loading:
      return <>Loading</>;
    case State.Success:
      return children;
    case State.Error:
    default:
      return (
        <>{pipe(errMessage,
          fold(
            constant(<Errors.Unknown />),
            ((message: string) => <Errors.FromString message={message} />)
          ))}</>
      );
  }
};

export default Async;