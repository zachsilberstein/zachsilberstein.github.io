const Button = ({ text, buttonClick }) => {
  return (
    <div>
      <button onClick={buttonClick} className="btn btn-primary m-1">
        {text}
      </button>
    </div>
  );
};

export default Button;
