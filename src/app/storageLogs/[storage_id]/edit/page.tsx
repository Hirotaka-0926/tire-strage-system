// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// import { StorageDisplay } from "@/utils/interface";
// import { getStorageById } from "@/utils/supabaseFunction";
// import { useToast } from "@/components/ui/use-toast";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // Define the form schema
// const formSchema = z.object({
//   location: z.enum(["A", "B"], {
//     required_error: "保管場所を選択してください",
//   }),
//   storage_id: z.coerce.number({
//     required_error: "保管庫IDを入力してください",
//   }),
//   year: z.coerce.number({
//     required_error: "年を入力してください",
//   }),
//   season: z.enum(["summer", "winter"], {
//     required_error: "シーズンを選択してください",
//   }),
//   tire_maker: z.string().min(1, "タイヤメーカーを入力してください"),
//   tire_pattern: z.string().min(1, "タイヤパターンを入力してください"),
//   tire_size: z.string().min(1, "タイヤサイズを入力してください"),
// });

// type FormValues = z.infer<typeof formSchema>;

// const StorageEditPage: React.FC = () => {
//   const params = useParams();
//   const router = useRouter();
//   const storageId =
//     typeof params.storage_id === "string" ? parseInt(params.storage_id) : null;
//   const [storage, setStorage] = useState<StorageDisplay | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Initialize the form
//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       location: "A",
//       storage_id: 0,
//       year: 2024,
//       season: "summer",
//       tire_maker: "",
//       tire_pattern: "",
//       tire_size: "",
//     },
//   });

//   // Fetch the storage data
//   useEffect(() => {
//     const fetchStorage = async () => {
//       if (!storageId) {
//         setError("無効な保管庫IDです");
//         setLoading(false);
//         return;
//       }

//       try {
//         const data = await getStorageById(storageId);
//         setStorage(data);

//         // Set form values
//         form.reset({
//           location: data.location,
//           storage_id: data.storage_id,
//           year: data.year,
//           season: data.season,
//           tire_maker: data.state.tire_maker || "",
//           tire_pattern: data.state.tire_pattern || "",
//           tire_size: data.state.tire_size || "",
//         });
//       } catch (err) {
//         console.error("Error fetching storage:", err);
//         setError("保管庫情報の取得に失敗しました");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStorage();
//   }, [storageId, form]);

//   // Handle form submission
//   const onSubmit = async (values: FormValues) => {
//     if (!storage) return;

//     try {
//       // TODO: Implement the update function in supabaseFunction.ts
//       // await updateStorage(storageId, values);

//       console.log("保存するデータ:", values);
//       toast({
//         title: "保存完了",
//         description: "保管庫情報が更新されました",
//       });
//       router.push(`/storage/${storageId}`);
//     } catch (err) {
//       console.error("Error updating storage:", err);
//       toast({
//         title: "エラー",
//         description: "保管庫情報の更新に失敗しました",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleCancel = () => {
//     router.push(`/storage/${storageId}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         読み込み中...
//       </div>
//     );
//   }

//   if (error || !storage) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen">
//         <p className="text-red-500">
//           {error || "保管庫データが見つかりません"}
//         </p>
//         <Button onClick={() => router.push("/storage")} className="mt-4">
//           戻る
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <Button onClick={handleCancel} className="mb-4">
//         ← キャンセル
//       </Button>

//       <h1 className="text-2xl font-bold mb-6">保管庫情報編集</h1>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>保管庫情報</CardTitle>
//               <CardDescription>保管庫の基本情報を編集します</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="location"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>保管庫タイプ</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="保管庫タイプを選択" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="A">A</SelectItem>
//                           <SelectItem value="B">B</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="storage_id"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>保管庫ID</FormLabel>
//                       <FormControl>
//                         <Input type="number" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="year"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>年</FormLabel>
//                       <FormControl>
//                         <Input type="number" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="season"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>シーズン</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="シーズンを選択" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="summer">夏タイヤ</SelectItem>
//                           <SelectItem value="winter">冬タイヤ</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>タイヤ情報</CardTitle>
//               <CardDescription>保管タイヤの情報を編集します</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="tire_maker"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>タイヤメーカー</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="tire_pattern"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>タイヤパターン</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="tire_size"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>タイヤサイズ</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <div className="flex justify-end space-x-4">
//             <Button type="button" variant="outline" onClick={handleCancel}>
//               キャンセル
//             </Button>
//             <Button type="submit">保存</Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default StorageEditPage;
