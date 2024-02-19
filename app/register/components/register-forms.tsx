"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateUser } from "@/app/actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TipeKamarDataItem {
  value: string;
  label: string;
  harga: number;
}

const SignUpForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const tipeKamarData: TipeKamarDataItem[] = [
    { value: "standar", label: "Standar", harga: 10000 },
    { value: "deluxe", label: "Deluxe", harga: 100000 },
    { value: "luxury", label: "Luxury", harga: 1000000 },
  ];

  const [hargaKamar, setHargaKamar] = useState(0);
  const [totalHarga, setTotalHarga] = useState(0);

  const handleTipeKamarChange = (selectedValue: string) => {
    const selectedTipeKamarData = tipeKamarData.find(
      (item) => item.value === selectedValue
    );

    if (selectedTipeKamarData) {
      // Dapatkan nilai durasi, jika belum diisi, defaultkan ke 1
      const durasi = parseInt(form.getValues("durasi") || "1");

      // Dapatkan harga kamar
      const hargaKamar = selectedTipeKamarData.harga;

      // Harga awal sebelum diskon dan biaya sarapan
      let hargaAwal = hargaKamar * durasi;
      let biayaSarapan = form.getValues("isBreakfast") ? 80000 * durasi : 0;

      // Diskon 10% jika durasi lebih dari 3 hari
      if (durasi > 3) {
        hargaAwal *= 0.9;
      }

      // Total harga termasuk diskon dan biaya sarapan
      const totalHarga = hargaAwal + biayaSarapan;

      // Set nilai form total harga
      form.setValue("totalHarga", totalHarga.toString());
      setTotalHarga(totalHarga);
    }
  };

  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      nama: "",
      jenisKelamin: "",
      nomorKtp: "",
      tipeKamar: "",
      harga: 0,
      tanggalPesan: new Date(),
      durasi: "",
      diskon: 0,
      isBreakfast: false,
      totalHarga: "",
    },
  });
  const { mutateAsync: createCustomer, error: errorCreate } = useCreateUser();

  const handleTotalBayar = () => {
    const tipeKamar = form.getValues("tipeKamar");
    handleTipeKamarChange(tipeKamar);
  }
  
  async function onSubmit(values: z.infer<typeof UserSchema>) {
    try {
      console.log(values);

      toast.success("Success Create Customer");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-2 text-center">
              <FormLabel className="">Name Pemesan</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} className="w-72" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jenisKelamin"
          render={({ field }) => (
            <FormItem className="flex gap-x-2">
              <FormLabel>Jenis Kelamin</FormLabel>
              <FormControl className="flex items-center justify-center">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Laki-laki" id="jenis-laki" />
                    <Label htmlFor="jenis-laki">Laki-laki</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Perempuan" id="jenis-perempuan" />
                    <Label htmlFor="jenis-perempuan">Perempuan</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nomorKtp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Identitas</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nomor Identitas"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipeKamar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe Kamar</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Tipe Kamar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {tipeKamarData.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="harga"
          render={({ field }) => (
            <FormItem className="flex gap-x-2 items-center">
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input type="number" value={hargaKamar.toString()} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tanggalPesan"
          render={({ field }) => (
            <FormItem className="flex gap-x-2 items-center">
              <FormLabel>Tanggal Pesan</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durasi"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-8">
              <FormLabel>Durasi</FormLabel>
              <FormControl>
                <Input type="number" {...field} className="w-full" />
              </FormControl>
              <FormLabel>Hari</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isBreakfast"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-4">
              <FormLabel>Termasuk Breakfast</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalHarga"
          render={() => (
            <FormItem className="flex items-center">
              <FormLabel>Total Harga</FormLabel>
              <FormControl>
                <Input
                  value={totalHarga.toString()}
                  disabled
                  className="w-72"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex mx-auto items-center text-center gap-x-8">
          <Button type="submit">Hitung Total Bayar</Button>
          <Button type="submit">Register</Button>
          <Button onClick={() => window.location.reload()}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
