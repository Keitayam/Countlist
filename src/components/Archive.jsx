import styled from "styled-components";

export const Archive = (props) => {
  const { items, onClickDelete } = props;

  return (
    <Container>
      <ul>
        {items.map((item, id) => (
          <li key={item.id}>
            内容 {item.title}:{item.time}時間
            <button onClick={() => onClickDelete(item.id)}>削除</button>
          </li>
        ))}
      </ul>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 20px;
  ul {
    list-style: none;
    padding: 0;
  }
`;
