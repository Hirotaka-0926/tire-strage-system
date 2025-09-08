import { useState, useEffect } from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Font,
  PDFDownloadLink,
  BlobProvider,
} from "@react-pdf/renderer";
import { StorageLogInput } from "@/utils/interface";
import { Button } from "@/components/ui/button";

// PDFのスタイル定義

const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    fontFamily: "NotoSansJP",
    padding: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2pt solid #000",
    paddingBottom: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
  },
  clientInfo: {
    fontSize: 10,
  },
  companyInfo: {
    fontSize: 10,
    textAlign: "right",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 8,
    border: "1pt solid #000",
  },
  customerSection: {
    border: "1pt solid #000",
    padding: 10,
    marginBottom: 15,
  },
  customerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "#e0e0e0",
    padding: 5,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  infoItem: {
    width: "50%",
    flexDirection: "row",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "bold",
    width: "40%",
  },
  infoValue: {
    fontSize: 12,
    width: "60%",
    borderBottom: "0.5pt solid #ccc",
    paddingBottom: 2,
  },
  tireSection: {
    border: "1pt solid #000",
    padding: 10,
    marginBottom: 15,
  },
  tireTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "#e0e0e0",
    padding: 5,
  },
  tireGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tireItem: {
    width: "50%",
    flexDirection: "row",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  campaignSection: {
    border: "1pt solid #000",
    padding: 10,
    marginTop: 20,
    backgroundColor: "#f9f9f9",
  },
  campaignTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  campaignText: {
    fontSize: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: "center",
    borderTop: "1pt solid #ccc",
    paddingTop: 10,
  },
});

// PDF文書コンポーネント - 単一のストレージページを生成
const StoragePage: React.FC<{ storage: StorageLogInput }> = ({
  storage,
}: {
  storage: StorageLogInput;
}) => (
  <Page size="A4" style={pdfStyles.page}>
    {/* ヘッダー */}
    <View style={pdfStyles.header}>
      <View style={pdfStyles.clientInfo}>
        <Text>{storage.client.address}</Text>
        <Text>{storage.client.client_name}様</Text>
      </View>

      <View style={pdfStyles.companyInfo}>
        <Text style={pdfStyles.logo}>TAKEUCHI PARTS</Text>
        <Text>〒321-4521 栃木県真岡市久下田1234-5</Text>
        <Text>TEL: 0285-74-0011 FAX: 0285-74-0012</Text>
        <Text>営業時間: 9:00～18:00</Text>
      </View>
    </View>

    {/* タイトル */}
    <Text style={pdfStyles.title}>タイヤお預かりのお客様へ</Text>

    {/* 顧客情報セクション */}
    <View style={pdfStyles.customerSection}>
      <Text style={pdfStyles.customerTitle}>お客様情報</Text>
      <View style={pdfStyles.infoGrid}>
        <View style={pdfStyles.infoItem}>
          <Text style={pdfStyles.infoLabel}>お名前:</Text>
          <Text style={pdfStyles.infoValue}>
            {storage.client?.client_name || "未設定"}
          </Text>
        </View>
        <View style={pdfStyles.infoItem}>
          <Text style={pdfStyles.infoLabel}>保管庫ID:</Text>
          <Text style={pdfStyles.infoValue}>
            {storage.storage?.id || "未設定"}
          </Text>
        </View>
        <View style={pdfStyles.infoItem}>
          <Text style={pdfStyles.infoLabel}>車種:</Text>
          <Text style={pdfStyles.infoValue}>
            {storage.car?.car_model || "未設定"}
          </Text>
        </View>
        <View style={pdfStyles.infoItem}>
          <Text style={pdfStyles.infoLabel}>車番:</Text>
          <Text style={pdfStyles.infoValue}>
            {storage.car?.car_number || "未設定"}
          </Text>
        </View>
        <View style={pdfStyles.infoItem}>
          <Text style={pdfStyles.infoLabel}>年:</Text>
          <Text style={pdfStyles.infoValue}>{storage.year}年</Text>
        </View>
        <View style={pdfStyles.infoItem}>
          <Text style={pdfStyles.infoLabel}>シーズン:</Text>
          <Text style={pdfStyles.infoValue}>
            {storage.season === "summer" ? "夏" : "冬"}
          </Text>
        </View>
      </View>
    </View>

    {/* タイヤ情報セクション */}
    <View style={pdfStyles.tireSection}>
      <Text style={pdfStyles.tireTitle}>保管タイヤ詳細</Text>
      {storage.state ? (
        <View style={pdfStyles.tireGrid}>
          <View style={pdfStyles.tireItem}>
            <Text style={pdfStyles.infoLabel}>メーカー:</Text>
            <Text style={pdfStyles.infoValue}>
              {storage.state.tire_maker || "未設定"}
            </Text>
          </View>
          <View style={pdfStyles.tireItem}>
            <Text style={pdfStyles.infoLabel}>パターン:</Text>
            <Text style={pdfStyles.infoValue}>
              {storage.state.tire_pattern || "未設定"}
            </Text>
          </View>
          <View style={pdfStyles.tireItem}>
            <Text style={pdfStyles.infoLabel}>サイズ:</Text>
            <Text style={pdfStyles.infoValue}>
              {storage.state.tire_size || "未設定"}
            </Text>
          </View>
          <View style={pdfStyles.tireItem}>
            <Text style={pdfStyles.infoLabel}>製造年:</Text>
            <Text style={pdfStyles.infoValue}>
              {storage.state.manufacture_year || "未設定"}
            </Text>
          </View>
          <View style={pdfStyles.tireItem}>
            <Text style={pdfStyles.infoLabel}>次回テーマ:</Text>
            <Text style={pdfStyles.infoValue}>
              {storage.state.next_theme || "未設定"}
            </Text>
          </View>
        </View>
      ) : (
        <Text>保管タイヤ情報がありません</Text>
      )}
    </View>

    {/* フッター */}
    <Text style={pdfStyles.footer}>
      いつもTAKEUCHI PARTSをご利用いただき誠にありがとうございます。
      これからもご利用していただくと社長の機嫌が良くなります。
    </Text>
  </Page>
);
// 複数のストレージに対応するPDF文書コンポーネント
const StoragePDFDocument: React.FC<{
  storages: StorageLogInput | StorageLogInput[];
}> = ({ storages }: { storages: StorageLogInput | StorageLogInput[] }) => {
  const storageArray = Array.isArray(storages) ? storages : [storages];

  return (
    <Document>
      {storageArray.map((storage, index) => (
        <StoragePage key={storage.id || index} storage={storage} />
      ))}
    </Document>
  );
};

// フックの型定義
interface UseStorageToPdfReturn {
  isLoading: boolean;
  error: Error | null;
  StoragePDFDocument: React.FC<{
    storages: StorageLogInput | StorageLogInput[];
  }>;
  renderPDFDownloadLink: (
    storages: StorageLogInput | StorageLogInput[],
    fileName?: string,
    linkText?: string
  ) => JSX.Element | null;
  renderBlobProvider: (
    storages: StorageLogInput | StorageLogInput[],
    children: (params: {
      blob: Blob | null;
      url: string | null;
      loading: boolean;
      error: Error | null;
    }) => React.ReactNode
  ) => JSX.Element;
}

/**
 * StorageLogsToDisplayオブジェクトからPDFを生成するためのカスタムフック
 */
export const useStorageToPdf = (): UseStorageToPdfReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // フォントの読み込み
  useEffect(() => {
    try {
      Font.register({
        family: "NotoSansJP",
        src: "https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf",
      });
      setIsLoading(false);
    } catch (err) {
      console.error("フォント登録エラー:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  }, []);

  // PDFダウンロードリンクをレンダリングする関数
  const renderPDFDownloadLink = (
    storages: StorageLogInput | StorageLogInput[],
    fileName = `保管庫_${
      Array.isArray(storages) ? "まとめ" : storages.id || "不明"
    }.pdf`,
    linkText = "PDFをダウンロード"
  ): JSX.Element | null => {
    if (isLoading || error) return null;

    return (
      <BlobProvider document={<StoragePDFDocument storages={storages} />}>
        {({ blob, url, loading, error }) => (
          <Button
            onClick={() => {
              if (url) {
                const link = document.createElement("a");
                link.href = url;
                link.download = fileName;
                link.click();
              }
            }}
            disabled={loading || !!error}
          >
            {loading
              ? "PDF生成中..."
              : error
              ? `エラーが発生しました: ${error.message}`
              : linkText}
          </Button>
        )}
      </BlobProvider>
    );
  };

  // BlobProviderも同様に修正
  const renderBlobProvider = (
    storages: StorageLogInput | StorageLogInput[],
    children: (params: {
      blob: Blob | null;
      url: string | null;
      loading: boolean;
      error: Error | null;
    }) => React.ReactNode
  ): JSX.Element => {
    return (
      <BlobProvider document={<StoragePDFDocument storages={storages} />}>
        {children}
      </BlobProvider>
    );
  };

  return {
    isLoading,
    error,
    StoragePDFDocument,
    renderPDFDownloadLink,
    renderBlobProvider,
  };
};
