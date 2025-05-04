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
import { StorageLogsToDisplay } from "@/utils/interface";

// PDFのスタイル定義

const pdfStyles = StyleSheet.create({
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
    fontSize: 20,
    marginBottom: 15,
  },
  tireContainer: {
    marginBottom: 10,
    padding: 5,
    borderBottom: "1pt solid #ccc",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    width: "40%",
  },
  infoValue: {
    fontSize: 14,
    width: "60%",
  },
});

// PDF文書コンポーネント - 単一のストレージページを生成
const StoragePage: React.FC<{ storage: StorageLogsToDisplay }> = ({
  storage,
}) => (
  <Page size="A4" style={pdfStyles.page}>
    <View style={pdfStyles.section}>
      <Text style={pdfStyles.title}>保管庫詳細</Text>

      <View style={pdfStyles.infoRow}>
        <Text style={pdfStyles.infoLabel}>ID:</Text>
        <Text style={pdfStyles.infoValue}>{storage.id}</Text>
      </View>

      <View style={pdfStyles.infoRow}>
        <Text style={pdfStyles.infoLabel}>名前:</Text>
        <Text style={pdfStyles.infoValue}>
          {storage.client?.client_name || "未設定"}
        </Text>
      </View>

      <View style={pdfStyles.infoRow}>
        <Text style={pdfStyles.infoLabel}>場所:</Text>
        <Text style={pdfStyles.infoValue}>
          {storage.storage?.storage_type || "未設定"}
        </Text>
      </View>

      <View style={pdfStyles.infoRow}>
        <Text style={pdfStyles.infoLabel}>保管庫ID:</Text>
        <Text style={pdfStyles.infoValue}>
          {storage.storage?.storage_number || "未設定"}
        </Text>
      </View>

      <View style={pdfStyles.infoRow}>
        <Text style={pdfStyles.infoLabel}>作成日:</Text>
        <Text style={pdfStyles.infoValue}>
          {storage.client?.created_at
            ? new Date(storage.client.created_at).toLocaleDateString("ja-JP")
            : "未設定"}
        </Text>
      </View>

      <Text style={pdfStyles.subtitle}>保管タイヤ情報</Text>
      {storage.state ? (
        <View key={storage.state.id} style={pdfStyles.tireContainer}>
          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>タイヤID:</Text>
            <Text style={pdfStyles.infoValue}>{storage.state.id}</Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>車種:</Text>
            <Text style={pdfStyles.infoValue}>{storage.car?.car_model}</Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>メーカー:</Text>
            <Text style={pdfStyles.infoValue}>{storage.state.tire_maker}</Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>パターン:</Text>
            <Text style={pdfStyles.infoValue}>
              {storage.state.tire_pattern}
            </Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>サイズ:</Text>
            <Text style={pdfStyles.infoValue}>{storage.state.tire_size}</Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>製造年:</Text>
            <Text style={pdfStyles.infoValue}>
              {storage.state.manufacture_year}
            </Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>シーズン:</Text>
            <Text style={pdfStyles.infoValue}>{storage.season}</Text>
          </View>
        </View>
      ) : (
        <Text>保管タイヤはありません</Text>
      )}
    </View>
  </Page>
);

// 複数のストレージに対応するPDF文書コンポーネント
const StoragePDFDocument: React.FC<{
  storages: StorageLogsToDisplay | StorageLogsToDisplay[];
}> = ({ storages }) => {
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
    storages: StorageLogsToDisplay | StorageLogsToDisplay[];
  }>;
  renderPDFDownloadLink: (
    storages: StorageLogsToDisplay | StorageLogsToDisplay[],
    fileName?: string,
    linkText?: string
  ) => JSX.Element | null;
  renderBlobProvider: (
    storages: StorageLogsToDisplay | StorageLogsToDisplay[],
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
    storages: StorageLogsToDisplay | StorageLogsToDisplay[],
    fileName = `保管庫_${
      Array.isArray(storages) ? "まとめ" : storages.id || "不明"
    }.pdf`,
    linkText = "PDFをダウンロード"
  ): JSX.Element | null => {
    if (isLoading || error) return null;

    return (
      <PDFDownloadLink
        document={<StoragePDFDocument storages={storages} />}
        fileName={fileName}
      >
        {({ loading, error }) =>
          loading
            ? "PDF生成中..."
            : error
            ? `エラーが発生しました: ${error.message}`
            : linkText
        }
      </PDFDownloadLink>
    );
  };

  // BlobProviderも同様に修正
  const renderBlobProvider = (
    storages: StorageLogsToDisplay | StorageLogsToDisplay[],
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
