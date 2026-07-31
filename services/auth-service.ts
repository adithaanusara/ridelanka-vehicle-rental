import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { registrationSchema } from "@/lib/validation";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export async function register(input: unknown) {
  const value = registrationSchema.parse(input);
  const exists = await db.user.findUnique({ where: { email: value.email.toLowerCase() } });
  if (exists) throw new Error("EMAIL_EXISTS");
  const passwordHash = await bcrypt.hash(value.password, 12);
  const user = await db.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        name: value.name,
        email: value.email.toLowerCase(),
        phone: value.phone,
        passwordHash,
        role: value.role as Role,
      },
    });
    if (value.role === "PROVIDER" && value.company) {
      const base = slugify(value.company.name);
      const slug = `${base}-${created.id.slice(-6)}`;
      await tx.rentalCompany.create({
        data: {
          ownerId: created.id,
          name: value.company.name,
          slug,
          registrationNumber: value.company.registrationNumber,
          district: value.company.district,
          city: value.company.city,
          address: value.company.address,
          whatsapp: value.company.whatsapp,
          telephone: value.phone,
          email: value.email,
          description: value.company.description,
        },
      });
    }
    return created;
  });
  return user;
}
export async function authenticate(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) return null;
  return user;
}
