"use client";
import React, { useEffect, useState } from "react";
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

const StorageToPdf: React.FC<Props> = ({ storage, className }) => {
  const [isRoadFont, setIsRoadFont] = useState<boolean>(false);

  useEffect(() => {
    try {
      Font.register({
        family: "NotoSansJP",
        src: "https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf",
      });
      setIsRoadFont(true);
    } catch (err) {
      console.error("フォント登録エラー:", err);
    }
  }, []);

  if (!isRoadFont) {
    return <div className={className}>フォントを読み込み中...</div>;
  }
  return (
    <div className={className}>
      <BlobProvider document={<PDFDocument storage={storage} />}>
        {({ url, loading, error }) => {
          if (loading) return "PDF生成中...";
          if (error) return "エラーが発生しました : " + error;
          return (
            <Button onClick={() => window.open(url!, "_blank")}>
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
    fontSite: 20,
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
        <Text style={styles.text}>
          名前: {storage.state.car.client.client_name || "未設定"}
        </Text>
        <Text style={styles.text}>場所: {storage.location || "未設定"}</Text>
        <Text style={styles.text}>
          保管庫ID: {storage.storage.storage_number || "未設定"}
        </Text>
        <Text style={styles.textLarge}>
          作成日:{" "}
          {storage.state.car.client.created_at
            ? new Date(storage.state.car.client.created_at).toLocaleDateString(
                "ja-JP"
              )
            : "未設定"}
        </Text>

        <Text style={styles.subtitle}>保管タイヤ一覧</Text>
        {storage.state ? (
          <View key={storage.state.id} style={styles.tireContainer}>
            <Text>タイヤID: {storage.state.id}</Text>
            <Text>車種: {storage.state.car.car_model}</Text>
            <Text>サイズ: {storage.state.tire_size}</Text>
          </View>
        ) : (
          <Text>保管タイヤはありません</Text>
        )}
      </View>
    </Page>
  </Document>
);

export default StorageToPdf;
