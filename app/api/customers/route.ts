import prismaService from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const data = await prismaService.user.findMany({});

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
};

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();

    const {
      nama,
      jenisKelamin,
      nomorKtp,
      tipeKamar,
      harga,
      tanggalPesan,
      durasi,
      isBreakfast,
      totalHarga,
    } = body;

    let hargaPerMalam: number;
    switch (tipeKamar) {
      case "standar":
        hargaPerMalam = 500000;
        break;
      case "deluxe":
        hargaPerMalam = 3000000;
        break;
      case "luxury":
        hargaPerMalam = 10000000;
        break;
      default:
        hargaPerMalam = 0; // Set default harga jika tipe kamar tidak valid
    }
    // Hitung total harga kamar berdasarkan harga per malam
    let totalHargaKamar = hargaPerMalam * parseInt(durasi);

    // Jika lama menginap lebih dari 3 hari, berikan diskon 10%
    if (parseInt(durasi) > 3) {
      totalHargaKamar *= 0.9; // Diskon 10%
    }

    // Jika memilih sarapan, tambahkan biaya tambahan 80.000 per malam
    if (isBreakfast) {
      totalHargaKamar += 80000 * parseInt(durasi);
    }
    const user = await prismaService.user.create({
      data: {
        nama,
        jenisKelamin,
        nomorKtp,
        tipeKamar,
        harga,
        tanggalPesan,
        durasi,
        isBreakfast,
        totalHarga: totalHargaKamar,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
  }
};
