import { useState } from "react";
import { Client, ValidationErrors } from "../interface";

const useClientValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // バリデーションルール
  const validate = (data: Client) => {
    const newErrors: ValidationErrors = {};

    // 顧客名チェック
    if (!data.client_name || !data.client_name.trim()) {
      newErrors.client_name = "顧客名は必須です";
    }

    // 顧客名（カナ）チェック
    if (!data.client_name_kana || !data.client_name_kana.trim()) {
      newErrors.client_name_kana = "顧客名（カナ）は必須です";
    }

    // 郵便番号チェック
    if (!data.post_number || !data.post_number.trim()) {
      newErrors.post_number = "郵便番号は必須です";
    } else if (!/^\d{3}-?\d{4}$/.test(data.post_number)) {
      newErrors.post_number =
        "郵便番号の形式が正しくありません（例：123-4567）";
    }

    // 住所チェック
    if (!data.address || !data.address.trim()) {
      newErrors.address = "住所は必須です";
    }

    // 電話番号チェック
    if (!data.phone || !data.phone.trim()) {
      newErrors.phone = "電話番号は必須です";
    } else if (!/^[\d-]+$/.test(data.phone)) {
      newErrors.phone = "電話番号の形式が正しくありません";
    }

    setErrors(newErrors);
    return Object.values(newErrors)[0]; // エラーの最初のメッセージを返す
  };

  // 単一フィールドのエラーをクリア
  const clearError = (fieldName: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  // 全エラーをクリア
  const clearAllErrors = () => {
    setErrors({});
  };

  // エラーメッセージを取得
  const getError = (fieldName: string) => {
    return errors[fieldName] || "";
  };

  // エラーがあるかチェック
  const hasError = (fieldName: string) => {
    return Boolean(errors[fieldName]);
  };

  return {
    errors,
    validate,
    clearError,
    clearAllErrors,
    getError,
    hasError,
  };
};

export default useClientValidation;
