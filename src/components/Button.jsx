export const Button = (props) => {
  const { onClickEnter, total, errorMessage } = props;
  return (
    <div>
      <button onClick={onClickEnter}>登録</button>
      <p>合計時間 {total}/1000h</p>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};
