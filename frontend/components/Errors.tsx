// Simple Error components for consistency.

const Errors = {
  Unknown: () => <>"Unknown Error Occured"</>,
  FromString: ({ message }: { message: string }) => <>{message}</>,
};

export default Errors;
