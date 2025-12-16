export const Hour = (props) => {
  const { hour, onChange } = props;
  return (
    <div>
      <p>学習時間</p>
      <input
        type="text"
        value={hour}
        placeholder="学習時間を入力してください"
        onChange={onChange}
      />
      時間
    </div>
  );
};
