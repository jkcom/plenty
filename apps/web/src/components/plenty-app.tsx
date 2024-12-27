interface PlentyAppProps {
  initialContext?: App.Locals;
}
export const PlentyApp = (props: PlentyAppProps) => {
  return (
    <div className="p-2">
      <h1>{props.initialContext?.account?.name}</h1>
    </div>
  );
};
