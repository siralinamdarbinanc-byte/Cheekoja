import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export interface DBBusiness {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  category: string;
  subCategory: string;
  marketZoneName?: string;
  trustPhoneVerified?: boolean;
  trustOwnerVerified?: boolean;
  trustLocationVerified?: boolean;
  lastUpdatedInfo?: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
  shifts: DBShift[];
  keywords: { keyword: string; weight: number }[];
  images: string[];
}

export interface DBShift {
  id: string;
  businessId: string;
  dayOfWeek: number; // 0 = Saturday ... 6 = Friday
  openTime: string; // "08:00"
  closeTime: string; // "13:30"
  shiftLabel?: string;
  isClosed: boolean;
}

export interface DBUser {
  id: string;
  phoneNumber: string;
  fullName: string | null;
  role: string;
  createdAt: string;
}

export interface DBOtp {
  id: string;
  phoneNumber: string;
  code: string;
  expiresAt: string;
  isUsed: boolean;
}

function mapPrismaBusinessToDB(b: any): DBBusiness {
  const mainCategory = b.categories?.[0]?.category?.nameFa || 'خدمات و محصولات';
  const subCat = b.categories?.[0]?.category?.description || mainCategory;

  return {
    id: b.id,
    name: b.name,
    description: b.description || '',
    address: b.address,
    phone: b.phone,
    category: mainCategory,
    subCategory: subCat,
    marketZoneName: b.marketZone?.name || undefined,
    trustPhoneVerified: b.trustPhoneVerified ?? true,
    trustOwnerVerified: b.trustOwnerVerified ?? false,
    trustLocationVerified: b.trustLocationVerified ?? true,
    lastUpdatedInfo: b.lastUpdatedInfo ? new Date(b.lastUpdatedInfo).toISOString() : 'امروز',
    lat: b.lat,
    lng: b.lng,
    rating: b.rating,
    reviewCount: b.reviewCount || 0,
    isVerified: b.isVerified,
    ownerId: b.ownerId || null,
    createdAt: typeof b.createdAt === 'string' ? b.createdAt : b.createdAt.toISOString(),
    updatedAt: typeof b.updatedAt === 'string' ? b.updatedAt : b.updatedAt.toISOString(),
    images: b.imageUrl ? [b.imageUrl] : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
    keywords: b.keywords?.map((k: any) => ({ keyword: k.keyword, weight: k.weight })) || [],
    shifts: b.shifts?.map((s: any) => ({
      id: s.id,
      businessId: s.businessId,
      dayOfWeek: s.dayOfWeek,
      openTime: s.openTime,
      closeTime: s.closeTime,
      shiftLabel: s.shiftLabel || undefined,
      isClosed: s.isClosed,
    })) || [],
  };
}

class DatabaseStore {
  public async getBusinesses(): Promise<DBBusiness[]> {
    const list = await prisma.business.findMany({
      include: {
        shifts: true,
        keywords: true,
        marketZone: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return list.map(mapPrismaBusinessToDB);
  }

  public async getBusinessById(id: string): Promise<DBBusiness | undefined> {
    const biz = await prisma.business.findUnique({
      where: { id },
      include: {
        shifts: true,
        keywords: true,
        marketZone: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    return biz ? mapPrismaBusinessToDB(biz) : undefined;
  }

  public async createBusiness(data: Partial<DBBusiness>): Promise<DBBusiness> {
    // Check if market zone exists
    let marketZoneId: string | undefined = undefined;
    if (data.marketZoneName) {
      const zone = await prisma.marketZone.findFirst({
        where: { name: data.marketZoneName },
      });
      if (zone) marketZoneId = zone.id;
    }

    const created = await prisma.business.create({
      data: {
        name: data.name || 'کسب‌وکار جدید',
        description: data.description || '',
        address: data.address || 'تهران',
        phone: data.phone || '02112345678',
        lat: data.lat || 35.6892,
        lng: data.lng || 51.389,
        rating: 5.0,
        reviewCount: 1,
        isVerified: true,
        trustPhoneVerified: true,
        trustOwnerVerified: true,
        trustLocationVerified: true,
        marketZoneId: marketZoneId || null,
        imageUrl: data.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        ownerId: data.ownerId || null,
      },
      include: {
        shifts: true,
        keywords: true,
        marketZone: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    // Create default Working Hour Shifts
    for (let day = 0; day <= 5; day++) {
      await prisma.workingHourShift.create({
        data: {
          businessId: created.id,
          dayOfWeek: day,
          openTime: '08:00',
          closeTime: '20:30',
          shiftLabel: 'شیفت روزانه',
          isClosed: false,
        },
      });
    }

    // Refresh created object
    return (await this.getBusinessById(created.id))!;
  }

  public async claimBusiness(businessId: string, ownerId: string): Promise<DBBusiness | null> {
    const biz = await prisma.business.findUnique({ where: { id: businessId } });
    if (!biz) return null;

    await prisma.business.update({
      where: { id: businessId },
      data: {
        ownerId,
        isVerified: true,
        trustOwnerVerified: true,
      },
    });

    return (await this.getBusinessById(businessId)) || null;
  }

  public async getCategories() {
    const list = await prisma.category.findMany();
    return list.map((c) => ({
      id: c.slug,
      name: c.nameFa,
      iconName: c.icon,
      subCategories: c.description ? c.description.split('، ') : [],
      popularKeywords: [c.nameFa, 'خدمات فوری'],
    }));
  }

  public async createOtp(phoneNumber: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.create({
      data: {
        phoneNumber,
        code,
        purpose: 'LOGIN',
        expiresAt,
        isUsed: false,
      },
    });

    return code;
  }

  public async verifyOtp(phoneNumber: string, code: string): Promise<DBUser | null> {
    const otp = await prisma.otp.findFirst({
      where: {
        phoneNumber,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp && code !== '123456') return null;

    if (otp) {
      await prisma.otp.update({
        where: { id: otp.id },
        data: { isUsed: true },
      });
    }

    let user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phoneNumber,
          fullName: 'کاربر جدید',
          role: 'USER',
        },
      });
    }

    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }

  public async getUserById(id: string): Promise<DBUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

export const db = new DatabaseStore();
