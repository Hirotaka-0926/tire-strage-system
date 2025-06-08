import { StorageInput, ValidationErrors } from "../interface";
import { useNotification } from "./useNotification";

const useStorageValidation = () => {
  const { showNotification, NotificationComponent } = useNotification();
  // バリデーションルール
  const validate = (data: StorageInput) => {
    const newErrors: ValidationErrors = {};

    // 顧客名チェック
    if (!data.client.client_name || !data.client.client_name.trim()) {
      newErrors.client_name = "顧客名は必須です";
    }

    // 顧客名（カナ）チェック
    if (!data.client.client_name_kana || !data.client.client_name_kana.trim()) {
      newErrors.client_name_kana = "顧客名（カナ）は必須です";
    }

    // 住所チェック
    if (!data.client.address || !data.client.address.trim()) {
      newErrors.address = "住所は必須です";
    }

    // 電話番号チェック
    if (!data.client.phone || !data.client.phone.trim()) {
      newErrors.phone = "電話番号は必須です";
    } else if (!/^[\d-]+$/.test(data.client.phone)) {
      newErrors.phone = "電話番号の形式が正しくありません";
    }

    if (newErrors && Object.keys(newErrors).length > 0) {
      showNotification("error", newErrors[0]!); // エラーの最初のメッセージを返す
    }

    return newErrors;
  };

  const ValidateComponent = () => {
    return <NotificationComponent />;
  };

  return {
    validate,
    ValidateComponent,
  };
};

export default useStorageValidation;
