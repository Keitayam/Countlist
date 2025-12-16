export const Content = (props) => {
  const { content, onChange } = props;
  return (
    <div>
      <p>学習内容</p>
      <input
        type="text"
        value={content}
        placeholder="学習内容を入力してください"
        onChange={onChange}
      />
    </div>
  );
};
