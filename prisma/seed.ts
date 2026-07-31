import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import { districts, vehicleTypeNames } from "../lib/catalog";

const prisma = new PrismaClient();
const image =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85";
const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
async function main() {
  const passwordHash = await bcrypt.hash("DevOnly-ChangeMe123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@renthub.local" },
    update: {},
    create: {
      name: "RentHub Administrator",
      email: "admin@renthub.local",
      passwordHash,
      role: Role.ADMIN,
      phone: "+94770000001",
    },
  });
  const customer = await prisma.user.upsert({
    where: { email: "customer@renthub.local" },
    update: {},
    create: {
      name: "Nimal Perera",
      email: "customer@renthub.local",
      passwordHash,
      role: Role.CUSTOMER,
      phone: "+94770000002",
    },
  });
  const providers = await Promise.all(
    [
      ["Colombo Drive Rentals", "provider.colombo@renthub.local", "Colombo", "Colombo 03"],
      ["Southern Coast Mobility", "provider.galle@renthub.local", "Galle", "Hikkaduwa"],
    ].map(async ([name, email, district, city]) => {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name: `${name} Owner`,
          email,
          passwordHash,
          phone: "+94770000003",
          role: Role.PROVIDER,
        },
      });
      return prisma.rentalCompany.upsert({
        where: { ownerId: user.id },
        update: {},
        create: {
          ownerId: user.id,
          name,
          slug: slug(name),
          district,
          city,
          address: `${city}, Sri Lanka`,
          whatsapp: "+94770000003",
          telephone: "+94110000000",
          email,
          description: `A verified ${district} rental provider offering dependable vehicles for every journey.`,
          status: "VERIFIED",
          verifiedAt: new Date(),
        },
      });
    }),
  );
  for (const [index, name] of vehicleTypeNames.entries())
    await prisma.vehicleType.upsert({
      where: { name },
      update: { active: true, displayOrder: index },
      create: { name, slug: slug(name), displayOrder: index },
    });
  const carType = await prisma.vehicleType.findUniqueOrThrow({ where: { name: "Car" } });
  const suvType = await prisma.vehicleType.findUniqueOrThrow({ where: { name: "SUV" } });
  const vanType = await prisma.vehicleType.findUniqueOrThrow({ where: { name: "Van" } });
  const plans = [
    {
      name: "Monthly",
      code: "MONTHLY",
      durationMonths: 1,
      price: 2500,
      listingLimit: 5,
      featuredListingLimit: 1,
      description: "Start reaching local customers.",
      features: ["5 vehicle listings", "Booking enquiries", "District visibility"],
      displayOrder: 1,
    },
    {
      name: "Six Months",
      code: "SIX_MONTHS",
      durationMonths: 6,
      price: 13200,
      listingLimit: 25,
      featuredListingLimit: 4,
      description: "For steadily growing rental businesses.",
      features: ["25 vehicle listings", "Featured positions", "Simple analytics"],
      recommended: true,
      displayOrder: 2,
    },
    {
      name: "Annual",
      code: "ANNUAL",
      durationMonths: 12,
      price: 22500,
      listingLimit: 100,
      featuredListingLimit: 12,
      description: "The best value for established providers.",
      features: ["100 vehicle listings", "Priority support", "Advanced visibility"],
      displayOrder: 3,
    },
  ];
  for (const plan of plans)
    await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
  const vehicles = [
    {
      title: "Toyota Raize 2023",
      typeId: suvType.id,
      companyId: providers[0].id,
      district: "Colombo",
      city: "Colombo",
      pickupLocation: "Colombo 03",
      brand: "Toyota",
      model: "Raize",
      year: 2023,
      dailyRate: 8500,
      weeklyRate: 53500,
      seats: 5,
      transmission: "AUTOMATIC" as const,
      fuelType: "PETROL" as const,
      selfDrive: true,
      driverAvailable: true,
      isFeatured: true,
    },
    {
      title: "Suzuki Alto 2022",
      typeId: carType.id,
      companyId: providers[0].id,
      district: "Colombo",
      city: "Dehiwala",
      pickupLocation: "Dehiwala",
      brand: "Suzuki",
      model: "Alto",
      year: 2022,
      dailyRate: 4200,
      weeklyRate: 26000,
      seats: 4,
      transmission: "AUTOMATIC" as const,
      fuelType: "PETROL" as const,
      selfDrive: true,
      driverAvailable: false,
      isFeatured: false,
    },
    {
      title: "Toyota KDH High Roof",
      typeId: vanType.id,
      companyId: providers[1].id,
      district: "Galle",
      city: "Hikkaduwa",
      pickupLocation: "Hikkaduwa",
      brand: "Toyota",
      model: "KDH",
      year: 2021,
      dailyRate: 12000,
      weeklyRate: 76000,
      seats: 10,
      transmission: "MANUAL" as const,
      fuelType: "DIESEL" as const,
      selfDrive: false,
      driverAvailable: true,
      isFeatured: true,
    },
    {
      title: "Mitsubishi Montero Sport",
      typeId: suvType.id,
      companyId: providers[1].id,
      district: "Matara",
      city: "Matara",
      pickupLocation: "Matara town",
      brand: "Mitsubishi",
      model: "Montero Sport",
      year: 2020,
      dailyRate: 15500,
      weeklyRate: 99000,
      seats: 7,
      transmission: "AUTOMATIC" as const,
      fuelType: "DIESEL" as const,
      selfDrive: true,
      driverAvailable: true,
      isFeatured: false,
    },
  ];
  for (const item of vehicles) {
    const vehicle = await prisma.vehicle.upsert({
      where: { slug: slug(item.title) },
      update: {},
      create: {
        ...item,
        slug: slug(item.title),
        status: "PUBLISHED",
        description:
          "Well maintained, comfortable, and ready for your next journey across Sri Lanka.",
        terms:
          "Valid driving licence and refundable security deposit are required. Please return the vehicle with the agreed fuel level.",
      },
    });
    await prisma.vehicleImage.upsert({
      where: { id: `${vehicle.id}-cover` },
      update: {},
      create: { id: `${vehicle.id}-cover`, vehicleId: vehicle.id, url: image, alt: item.title },
    });
  }
  const firstVehicle = await prisma.vehicle.findFirstOrThrow({ where: { status: "PUBLISHED" } });
  await prisma.booking.upsert({
    where: { id: "seed-booking" },
    update: {},
    create: {
      id: "seed-booking",
      vehicleId: firstVehicle.id,
      customerId: customer.id,
      pickupDate: new Date("2027-01-10"),
      returnDate: new Date("2027-01-13"),
      pickupLocation: "Colombo 03",
      customerName: customer.name,
      phone: customer.phone || "",
      email: customer.email,
      estimatedTotal: firstVehicle.dailyRate * 3,
      status: "COMPLETED",
    },
  });
  await prisma.platformSetting.upsert({
    where: { key: "brandName" },
    update: { value: "RentHub LK" },
    create: { key: "brandName", value: "RentHub LK" },
  });
  console.log(
    `Seeded ${districts.length} districts and demo marketplace accounts. Admin: ${admin.email}`,
  );
}
main().finally(async () => prisma.$disconnect());
