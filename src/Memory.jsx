import { useState, useEffect } from "react";
import { Content } from "./components/Content";
import { Hour } from "./components/Hours";
import { Button } from "./components/Button";
import { Archive } from "./components/Archive";
import { supabase } from "./supabaseClient";

export const Memory = () => {
  const [content, setContent] = useState("");
  const [hour, setHour] = useState("");
  const [totalHours, setTotalHours] = useState(0);
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onChangeHour = (e) => {
    setHour(e.target.value);
  };

  // Supabaseからデータ取得
  const fetchLogs = async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("study-record") // ★ テーブル名を統一
      .select("*")
      // .order("created_at", { ascending: true }); // created_at がないなら…
      .order("id", { ascending: true }); // ← こうでもOK

    if (error) {
      console.error(error);
      setErrorMessage("データの取得に失敗しました");
      setLoading(false);
      return;
    }

    setItems(data || []);

    const total = (data || []).reduce(
      (sum, log) => sum + Number(log.time || 0),
      0
    );
    setTotalHours(total);

    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 登録ボタン
  const onClickEnter = async () => {
    if (content === "" && hour === "") {
      setErrorMessage("学習内容と学習時間を入力してください");
      return;
    } else if (content === "") {
      setErrorMessage("学習内容を入力してください");
      return;
    } else if (hour === "") {
      setErrorMessage("学習時間を入力してください");
      return;
    } else if (isNaN(Number(hour))) {
      setErrorMessage("学習時間は数字で入力してください");
      return;
    }

    const { data, error } = await supabase
      .from("study-record")
      .insert([
        {
          title: content,
          time: Number(hour),
        },
      ])
      .select();

    if (error) {
      console.error(error);
      setErrorMessage("登録に失敗しました");
      return;
    }

    const inserted = data[0];

    setItems((prev) => [...prev, inserted]);
    setTotalHours((prev) => prev + Number(hour));

    setErrorMessage("");
    setContent("");
    setHour("");
  };

  const onClickDelete = async (id) => {
    const target = items.find((item) => item.id === id); //削除する項目を特定
    const { error } = await supabase.from("study-record").delete().eq("id", id);//supabaseから削除

    if (error) {
      console.error(error);
      setErrorMessage("削除に失敗しました");
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (target) {
      setTotalHours((prev) => prev - Number(target.time || 0));//targetで特定した該当時間を合計時間から引いて更新
    }
  };

  if (loading) {
    return <p>データ読み込み中...</p>;
  }

  return (
    <div>
      <h1>学習の記録</h1>

      <Content content={content} onChange={onChangeContent} />
      <Hour hour={hour} onChange={onChangeHour} />

      <br />

      <Button
        onClickEnter={onClickEnter}
        total={totalHours}
        errorMessage={errorMessage}
      />

      <hr />

      <Archive items={items} onClickDelete={onClickDelete} />
    </div>
  );
};
