"use client";
import React, { useState, useEffect } from "react";
import { StorageDisplay } from "@/utils/interface";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  BlobProvider,
  Font,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";

interface Props {
  storage: StorageDisplay;
  className?: string;
}

// フォント登録を useEffect で行う（サーバーサイドでは実行されないようにする）
const StorageToPdf: React.FC<Props> = ({ storage, className }) => {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    // フォント登録は必ずクライアントサイドで行う
    try {
      Font.register({
        family: "NotoSansJP",
        format: "truetype",
        src: "https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf",
      });
      setFontsReady(true);
    } catch (error) {
      console.error("フォント登録エラー:", error);
    }
  }, []);

  // フォントが準備できていない場合のフォールバック
  if (!fontsReady) {
    return <div className={className}>フォントを読み込み中...</div>;
  }

  return (
    <div className={className}>
      <BlobProvider document={<PDFDocument storage={storage} />}>
        {({ url, loading, error }) => {
          if (loading) return "PDFを生成中...";
          if (error) return `エラーが発生しました: ${error}`;
          return (
            <Button onClick={() => window.open(url, "_blank")}>
              PDFを表示
            </Button>
          );
        }}
      </BlobProvider>
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    fontFamily: "NotoSansJP",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  textLarge: {
    fontSize: 16,
    marginBottom: 15,
  },
  tireContainer: {
    marginBottom: 10,
    padding: 5,
    borderBottom: "1pt solid #ccc",
  },
});

const PDFDocument = ({ storage }: { storage: StorageDisplay }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>保管庫詳細</Text>
        <Text style={styles.text}>ID: {storage.id}</Text>
        <Text style={styles.text}>名前: {storage.name || "未設定"}</Text>
        <Text style={styles.text}>場所: {storage.location || "未設定"}</Text>
        <Text style={styles.text}>容量: {storage.capacity || "未設定"}</Text>
        <Text style={styles.text}>
          利用可能スペース: {storage.availableSpace || "未設定"}
        </Text>
        <Text style={styles.textLarge}>
          作成日:{" "}
          {storage.createdAt
            ? new Date(storage.createdAt).toLocaleDateString("ja-JP")
            : "未設定"}
        </Text>

        <Text style={styles.subtitle}>保管タイヤ一覧</Text>
        {storage.tires && storage.tires.length > 0 ? (
          storage.tires.map((tire) => (
            <View key={tire.id} style={styles.tireContainer}>
              <Text>タイヤID: {tire.id}</Text>
              <Text>顧客名: {tire.customerName}</Text>
              <Text>車種: {tire.carModel}</Text>
              <Text>サイズ: {tire.size}</Text>
              <Text>状態: {tire.condition}</Text>
            </View>
          ))
        ) : (
          <Text>保管タイヤはありません</Text>
        )}
      </View>
    </Page>
  </Document>
);

export default StorageToPdf;
