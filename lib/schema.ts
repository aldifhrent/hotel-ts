import * as z from "zod";
export const UserSchema = z.object({
  name: z.string(),
  jenisKelamin: z.string(),
  nomorKtp: z.string(),
  tipeKamar: z.string(),
  harga: z.number(),
  tanggalPesan: z.date(),
  durasi: z.string(),
  isBreakfast: z.boolean(),
  totalHarga: z.string(),
});
