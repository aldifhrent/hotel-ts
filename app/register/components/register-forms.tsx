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
    { value: "standar", label: "Standar", harga: 500000 },
    { value: "deluxe", label: "Deluxe", harga: 3000000 },
    { value: "luxury", label: "Luxury", harga: 10000000 },
  ];

  const [selectedTipeKamar, setSelectedTipeKamar] = useState("");
  const [hargaKamar, setHargaKamar] = useState(0);
  const [totalHarga, setTotalHarga] = useState(0);
  const [date, setDate] = React.useState<Date>();
  const handleTipeKamarChange = (
    selectedValue: React.SetStateAction<string>
  ) => {
    const selectedTipeKamarData = tipeKamarData.find(
      (item) => item.value === selectedValue
    );
    setSelectedTipeKamar(selectedValue);
    setHargaKamar(selectedTipeKamarData ? selectedTipeKamarData.harga : 0);
    form.setValue(
      "harga",
      selectedTipeKamarData ? selectedTipeKamarData.harga : 0
    );

    let hargaSetelahDiskon = selectedTipeKamarData
      ? selectedTipeKamarData.harga
      : 0;
    const durasiNumber = parseInt(form.getValues("durasi"));
    const totalHargaKamar = hargaSetelahDiskon * durasiNumber;
    if (durasiNumber > 3) {
      hargaSetelahDiskon *= 0.9; // Diskon 10%
    }
    const isBreakfast = form.getValues("isBreakfast");
    const biayaSarapan = isBreakfast ? 80000 * durasiNumber : 0;

    // Hitung total harga yang harus dibayar
    const totalHarga = totalHargaKamar + biayaSarapan;
    setHargaKamar(hargaSetelahDiskon);
    form.setValue("harga", hargaSetelahDiskon);
    form.setValue("totalHarga", totalHarga.toString());
  };
  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      jenisKelamin: "",
      nomorKtp: "",
      tipeKamar: "",
      harga: 0,
      tanggalPesan: date ? date.format("YYYY-MM-DD") : "",
      durasi: "",
      isBreakfast: false,
      totalHarga: "",
    },
  });
  const { mutateAsync: createCustomer, isError } = useCreateUser();

  async function onSubmit(values: z.infer<typeof UserSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel>Name Pemesan</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Laki-laki" />
                    <Label>Laki-laki</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Perempuan" />
                    <Label>Perempuan</Label>
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
                  handleTipeKamarChange(value);
                }}
                value={selectedTipeKamar}
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
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input type="number" value={hargaKamar} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tanggalPesan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Pesan</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
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
            <FormItem className="flex items-center gap-x-1">
              <FormLabel>Durasi Menginap</FormLabel>
              <FormControl>
                <Input type="number" />
              </FormControl>
              <FormLabel>Hari</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isBreakfast"
          render={() => (
            <FormItem className="flex items-center gap-x-4">
              <FormLabel>Termasuk Breakfast</FormLabel>
              <FormControl>
                <Checkbox />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalHarga"
          render={() => (
            <FormItem>
              <FormLabel>Total Harga</FormLabel>
              <FormControl>
                <Input value={totalHarga.toString()} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mx-auto items-center text-center">
          <Button type="submit">Register</Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
