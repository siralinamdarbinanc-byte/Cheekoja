import { PrismaClient } from '@prisma/client';
import { CATEGORIES } from '../src/data/categories';
import { IRAN_MARKET_ZONES } from '../src/data/marketZones';
import { INITIAL_BUSINESSES } from '../src/data/mockBusinesses';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CheKoja Prisma Database Seed...');

  // 1. Seed Categories
  console.log('📦 Seeding Categories...');
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.id },
      update: {
        nameFa: cat.name,
        nameEn: cat.id,
        icon: cat.iconName,
        description: cat.subCategories.join('، '),
      },
      create: {
        id: cat.id,
        nameFa: cat.name,
        nameEn: cat.id,
        slug: cat.id,
        icon: cat.iconName,
        description: cat.subCategories.join('، '),
      },
    });
  }

  // 2. Seed Market Zones
  console.log('🏛️ Seeding Market Zones (راسته‌های بازار)...');
  for (const zone of IRAN_MARKET_ZONES) {
    await prisma.marketZone.upsert({
      where: { slug: zone.slug },
      update: {
        name: zone.name,
        city: zone.city,
        specialty: zone.specialty,
        description: zone.description,
        lat: zone.lat,
        lng: zone.lng,
      },
      create: {
        id: zone.id,
        name: zone.name,
        slug: zone.slug,
        city: zone.city,
        specialty: zone.specialty,
        description: zone.description,
        lat: zone.lat,
        lng: zone.lng,
      },
    });
  }

  // 3. Seed Users
  console.log('👤 Seeding Users...');
  const defaultOwner = await prisma.user.upsert({
    where: { phoneNumber: '09121112233' },
    update: {
      fullName: 'علی محمدی (مدیر کاسبی)',
      role: 'BUSINESS_OWNER',
    },
    create: {
      id: 'user-owner-1',
      phoneNumber: '09121112233',
      fullName: 'علی محمدی (مدیر کاسبی)',
      role: 'BUSINESS_OWNER',
    },
  });

  await prisma.user.upsert({
    where: { phoneNumber: '09359998877' },
    update: {
      fullName: 'رضا حسینی',
      role: 'USER',
    },
    create: {
      id: 'user-default-1',
      phoneNumber: '09359998877',
      fullName: 'رضا حسینی',
      role: 'USER',
    },
  });

  // 4. Seed Businesses with Shifts and Keywords
  console.log('🏪 Seeding Businesses...');
  const allZones = await prisma.marketZone.findMany();
  const allCats = await prisma.category.findMany();

  for (const b of INITIAL_BUSINESSES) {
    // Find matching zone if any
    const zone = allZones.find((z) => z.name === b.marketZoneName);

    const business = await prisma.business.upsert({
      where: { id: b.id },
      update: {
        name: b.name,
        description: b.shortDescription,
        address: b.address,
        phone: b.phone,
        imageUrl: b.images?.[0] || null,
        rating: b.rating,
        lat: b.lat,
        lng: b.lng,
        marketZoneId: zone?.id || null,
        trustPhoneVerified: b.trustPhoneVerified ?? true,
        trustOwnerVerified: b.trustOwnerVerified ?? false,
        trustLocationVerified: b.trustLocationVerified ?? true,
        ownerId: b.id === 'biz-1' ? defaultOwner.id : null,
      },
      create: {
        id: b.id,
        name: b.name,
        description: b.shortDescription,
        address: b.address,
        phone: b.phone,
        imageUrl: b.images?.[0] || null,
        rating: b.rating,
        lat: b.lat,
        lng: b.lng,
        marketZoneId: zone?.id || null,
        trustPhoneVerified: b.trustPhoneVerified ?? true,
        trustOwnerVerified: b.trustOwnerVerified ?? false,
        trustLocationVerified: b.trustLocationVerified ?? true,
        ownerId: b.id === 'biz-1' ? defaultOwner.id : null,
      },
    });

    // Seed Category Relation
    const matchedCategory = allCats.find(
      (c) => c.nameFa === b.category || c.slug === b.category
    ) || allCats[0];

    if (matchedCategory) {
      await prisma.businessCategory.upsert({
        where: {
          businessId_categoryId: {
            businessId: business.id,
            categoryId: matchedCategory.id,
          },
        },
        update: {},
        create: {
          businessId: business.id,
          categoryId: matchedCategory.id,
        },
      });
    }

    // Seed Working Hour Shifts (Saturday - Thursday: 0..5, Friday: 6)
    await prisma.workingHourShift.deleteMany({ where: { businessId: business.id } });

    const isFullDay = b.workingHours.open === '00:00' && b.workingHours.close === '23:59';

    if (isFullDay) {
      for (let day = 0; day <= 6; day++) {
        await prisma.workingHourShift.create({
          data: {
            businessId: business.id,
            dayOfWeek: day,
            openTime: '00:00',
            closeTime: '23:59',
            shiftLabel: 'شبانه‌روزی',
            isClosed: false,
          },
        });
      }
    } else {
      for (let day = 0; day <= 5; day++) { // Saturday to Thursday
        await prisma.workingHourShift.create({
          data: {
            businessId: business.id,
            dayOfWeek: day,
            openTime: b.workingHours.open,
            closeTime: b.workingHours.close,
            shiftLabel: 'شیفت روزانه',
            isClosed: false,
          },
        });
      }
      // Friday
      await prisma.workingHourShift.create({
        data: {
          businessId: business.id,
          dayOfWeek: 6,
          openTime: '10:00',
          closeTime: '14:00',
          shiftLabel: 'شیفت جمعه',
          isClosed: b.id === 'biz-2' || b.id === 'biz-6',
        },
      });
    }

    // Seed Keywords
    await prisma.businessKeyword.deleteMany({ where: { businessId: business.id } });
    if (b.tags && b.tags.length > 0) {
      for (const tag of b.tags) {
        await prisma.businessKeyword.create({
          data: {
            businessId: business.id,
            keyword: tag,
            weight: 1.5,
          },
        });
      }
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
