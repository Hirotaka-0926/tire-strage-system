import { StorageInput } from "@/utils/interface";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function EditForm({
  currentData,
  onSave,
}: {
  currentData: StorageInput;
  onSave: (data: StorageInput) => void;
}) {
  const [formData, setFormData] = useState<StorageInput>(currentData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">顧客名</Label>
          <Input
            id="customer"
            value={formData.client?.client_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                client: {
                  ...formData.client!,
                  client_name: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">電話番号</Label>
          <Input
            id="phone"
            value={formData.client?.post_number}
            onChange={(e) =>
              setFormData({
                ...formData,
                client: {
                  ...formData.client!,
                  post_number: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">住所</Label>
        <Textarea
          id="address"
          value={formData.client?.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              client: {
                ...formData.client!,
                address: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">車種</Label>
          <Input
            id="model"
            value={formData.car?.car_model}
            onChange={(e) =>
              setFormData({
                ...formData,
                car: {
                  ...formData.car!,
                  car_model: e.target.value,
                },
              })
            }
          />
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="year">年式</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>*/}
      </div>

      <div className="space-y-2">
        <Label htmlFor="plateNumber">ナンバープレート</Label>
        <Input
          id="plateNumber"
          value={formData.car?.car_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              car: {
                ...formData.car!,
                car_number: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">タイヤブランド</Label>
          <Input
            id="brand"
            value={formData.state?.tire_maker}
            onChange={(e) =>
              setFormData({
                ...formData,
                state: { ...formData.state!, tire_maker: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">タイヤサイズ</Label>
          <Input
            id="size"
            value={formData.state?.tire_size}
            onChange={(e) =>
              setFormData({
                ...formData,
                state: { ...formData.state!, tire_size: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manufacturingYear">製造年</Label>
          <Input
            id="manufacturingYear"
            value={formData.state?.manufacture_year}
            onChange={(e) =>
              setFormData({
                ...formData,
                state: {
                  ...formData.state!,
                  manufacture_year: Number(e.target.value),
                },
              })
            }
          />
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="tireGroove">タイヤ溝</Label>
          <Input
            id="tireGroove"
            value={formData.tireGroove}
            onChange={(e) =>
              setFormData({ ...formData, tireGroove: e.target.value })
            }
          />
        </div> */}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          保存
        </Button>
      </div>
    </form>
  );
}

export default EditForm;
