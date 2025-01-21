import React from "react";

const TireForm: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10 border border-black p-6">
      {/* Header */}
      <div className="text-center border-b border-black pb-4">
        <h1 className="text-2xl font-bold">タイヤお預かり申込書</h1>
        <div className="flex justify-between mt-4 text-lg">
          <span>新規・継続</span>
          <div className="flex space-x-2">
            <span>申込日</span>
            <input
              type="text"
              className="border border-black w-16 text-center"
              placeholder="年"
            />
            <input
              type="text"
              className="border border-black w-12 text-center"
              placeholder="月"
            />
            <input
              type="text"
              className="border border-black w-12 text-center"
              placeholder="日"
            />
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-bold">フリガナ</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
          <div>
            <label className="block font-bold">お名前</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
          <div>
            <label className="block font-bold">車種</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block font-bold">ナンバー</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
          <div>
            <label className="block font-bold">ご住所</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
          <div>
            <label className="block font-bold">電話番号</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* Tire Information */}
      <div className="mt-8">
        <h2 className="text-lg font-bold border-b border-black pb-2">
          タイヤ情報
        </h2>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block font-bold">タイヤメーカー</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
          <div>
            <label className="block font-bold">タイヤパターン</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
          <div>
            <label className="block font-bold">サイズ</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
          <div>
            <label className="block font-bold">製造年</label>
            <input
              type="text"
              className="border border-black w-full"
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* Inspection Information */}
      <div className="mt-8">
        <h2 className="text-lg font-bold border-b border-black pb-2">
          検査項目
        </h2>
        <table className="table-auto border-collapse border border-black w-full text-center mt-4">
          <thead>
            <tr>
              <th className="border border-black">タイヤ</th>
              <th className="border border-black">状態</th>
              <th className="border border-black">交換</th>
              <th className="border border-black">備考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black">エンジンオイル</td>
              <td className="border border-black">3 2 1</td>
              <td className="border border-black">
                <input type="checkbox" />
              </td>
              <td className="border border-black"></td>
            </tr>
            <tr>
              <td className="border border-black">バッテリー</td>
              <td className="border border-black">3 2 1</td>
              <td className="border border-black">
                <input type="checkbox" />
              </td>
              <td className="border border-black"></td>
            </tr>
            <tr>
              <td className="border border-black">ワイパーゴム</td>
              <td className="border border-black">3 2 1</td>
              <td className="border border-black">
                <input type="checkbox" />
              </td>
              <td className="border border-black"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8">
        <h2 className="text-lg font-bold border-b border-black pb-2">備考</h2>
        <textarea
          className="border border-black w-full h-24"
          placeholder=""
        ></textarea>
      </div>
    </div>
  );
};

export default TireForm;
