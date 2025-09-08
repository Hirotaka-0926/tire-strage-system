"use client";

import { useState } from "react";

export default function CSVOptimizationTest() {
  const [csvData, setCsvData] = useState("");
  const [optimizedCsvData, setOptimizedCsvData] = useState("");
  const [fileName, setFileName] = useState("");

  const optimizeStorageId = (originalId: string): string => {
    if (!originalId) return "";

    const trimmedId = originalId.trim();
    
    // 日本語テキストを削除して数字のみを抽出
    const numbersOnly = trimmedId.replace(/[^\d]/g, "");
    
    // B_1のような形式をチェック（英字_数字の形式）
    const prefixMatch = trimmedId.match(/^([A-Z])_?(\d+)/i);
    
    if (prefixMatch) {
      const prefix = prefixMatch[1].toUpperCase();
      const number = parseInt(prefixMatch[2]);
      
      if (prefix === "B") {
        // B_1形式をB_001～B_050形式に変換
        const optimizedNumber = Math.min(Math.max(number, 1), 50);
        return `${prefix}_${optimizedNumber.toString().padStart(3, "0")}`;
      } else {
        // その他のプレフィックスはそのまま3桁ゼロパディング
        const optimizedNumber = Math.min(Math.max(number, 1), 999);
        return `${prefix}_${optimizedNumber.toString().padStart(3, "0")}`;
      }
    }
    
    // 数字のみの場合はA_001～A_999形式に変換
    if (numbersOnly) {
      const number = parseInt(numbersOnly);
      const optimizedNumber = Math.min(Math.max(number, 1), 999);
      return `A_${optimizedNumber.toString().padStart(3, "0")}`;
    }

    // 数字が見つからない場合は元のIDをそのまま返す
    return originalId;
  };

  const optimizeCSV = () => {
    if (!csvData.trim()) {
      setOptimizedCsvData("");
      return;
    }

    const lines = csvData.split("\n");
    const optimizedLines = lines.map((line, index) => {
      if (index === 0) {
        // ヘッダー行はそのまま返す
        return line;
      }
      
      const columns = line.split(",");
      if (columns.length === 0) return line;
      
      // 1列目（ストレージID）を最適化
      const originalId = columns[0].replace(/"/g, "");
      const optimizedId = optimizeStorageId(originalId);
      
      // 最適化されたIDで1列目を置き換え
      columns[0] = `"${optimizedId}"`;
      
      return columns.join(",");
    });

    setOptimizedCsvData(optimizedLines.join("\n"));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvData(text);
      setOptimizedCsvData("");
    };
    
    reader.readAsText(file, "UTF-8");
  };

  const downloadOptimizedCSV = () => {
    if (!optimizedCsvData) return;

    const BOM = "\uFEFF";
    const csvWithBOM = BOM + optimizedCsvData;
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const downloadFileName = fileName 
      ? `optimized_${fileName}` 
      : "optimized_storage.csv";
    
    link.setAttribute("href", url);
    link.setAttribute("download", downloadFileName);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const testData = `ストレージID,顧客名,顧客住所
"1",田中太郎,東京都
"123",佐藤花子,大阪府
"ストレージ456",鈴木一郎,愛知県
"B_1",山田次郎,福岡県
"B_25",高橋三郎,北海道
"C_5",渡辺四郎,沖縄県`;

  const loadTestData = () => {
    setCsvData(testData);
    setFileName("");
  };

  const clearData = () => {
    setCsvData("");
    setOptimizedCsvData("");
    setFileName("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CSV最適化テスト</h1>
      
      <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">CSVファイルをアップロード:</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {fileName && (
            <p className="mt-2 text-sm text-green-600 font-medium">
              ✓ 読み込み済み: {fileName}
            </p>
          )}
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">または、テストデータを使用:</p>
          <div className="space-x-2">
            <button
              onClick={loadTestData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              テストデータを読み込み
            </button>
            <button
              onClick={clearData}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              データをクリア
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">元のCSVデータ</h2>
          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm"
            placeholder="CSVデータを入力するか、ファイルをアップロードしてください..."
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">最適化されたCSVデータ</h2>
          <textarea
            value={optimizedCsvData}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50"
            placeholder="最適化されたCSVデータがここに表示されます..."
          />
        </div>
      </div>

      <div className="mt-6 space-x-4">
        <button
          onClick={optimizeCSV}
          disabled={!csvData.trim()}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          CSV最適化実行
        </button>
        
        <button
          onClick={downloadOptimizedCSV}
          disabled={!optimizedCsvData}
          className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          最適化されたCSVをダウンロード
        </button>
      </div>

      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">最適化ルール:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>数字のみの場合: A_001～A_999形式に変換</li>
          <li>日本語テキスト込みの場合: 日本語を削除して数字のみ抽出後、A_001～A_999形式に変換</li>
          <li>B_1のような形式: B_001～B_050形式に変換</li>
          <li>その他の英字プレフィックス（C_5など）: 3桁ゼロパディング形式に変換</li>
          <li>2列目以降はそのまま出力</li>
        </ul>
        
        <div className="mt-4 text-sm text-gray-600">
          <h4 className="font-medium text-gray-800 mb-1">使用方法:</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>CSVファイルをアップロードするか、テストデータを読み込み</li>
            <li>「CSV最適化実行」ボタンをクリック</li>
            <li>右側に最適化されたCSVデータが表示される</li>
            <li>「最適化されたCSVをダウンロード」ボタンで結果をダウンロード</li>
          </ol>
        </div>
      </div>
    </div>
  );
}