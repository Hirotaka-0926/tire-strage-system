"use client";
import React, { useRef } from "react";
import { StorageDisplay } from "@/utils/interface";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  BlobProvider,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";

interface Props {
  storage: StorageDisplay;
  className?: string;
}

const StorageToPdf: React.FC<Props> = ({ storage, className }) => {
  return (
    <div className={className}>
      <BlobProvider document={<PDFDocument storage={storage} />}>
        {({ url, loading }) =>
          loading ? (
            "PDFを生成中..."
          ) : (
            <Button onClick={() => window.open(url, "_blank")}>
              PDFを表示
            </Button>
          )
        }
      </BlobProvider>
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const PDFDocument = ({ storage }: { storage: StorageDisplay }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={{ fontSize: 24, marginBottom: 10, fontWeight: "bold" }}>
          保管庫詳細
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>ID: {storage.id}</Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>
          名前: {storage.name}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>
          場所: {storage.location}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>
          容量: {storage.capacity}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>
          利用可能スペース: {storage.availableSpace}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 15 }}>
          作成日: {new Date(storage.createdAt).toLocaleDateString("ja-JP")}
        </Text>

        <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}>
          保管タイヤ一覧
        </Text>
        {storage.tires && storage.tires.length > 0 ? (
          storage.tires.map((tire) => (
            <View
              key={tire.id}
              style={{
                marginBottom: 10,
                padding: 5,
                borderBottom: "1pt solid #ccc",
              }}
            >
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
