const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, 'backend', file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// 1. .env and .env.example
write('.env.example', `DATABASE_URL="mysql://root:@localhost:3306/chaengim"
JWT_SECRET="change-me"
PORT=4000
CORS_ORIGIN=http://localhost:5173`);

write('.env', `DATABASE_URL="mysql://root:@localhost:3306/chaengim"
JWT_SECRET="change-me"
PORT=4000
CORS_ORIGIN=http://localhost:5173`);

// 2. Prisma schema
write('prisma/schema.prisma', `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  savedBenefits SavedBenefit[]
}

model Benefit {
  id             String   @id @default(uuid())
  title          String
  category       String
  categoryLabel  String
  agency         String
  description    String
  supportContent String   @db.Text
  target         String   @db.Text
  documents      String   @db.Text
  applyMethod    String   @db.Text
  applyUrl       String?
  deadline       String?
  iconType       String
  isRecommended  Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  savedBenefits SavedBenefit[]
}

model SavedBenefit {
  id        String   @id @default(uuid())
  userId    String
  benefitId String
  status    String   @default("preparing") // preparing, applied, waiting, completed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  benefit   Benefit  @relation(fields: [benefitId], references: [id], onDelete: Cascade)
  
  checklist ChecklistItem[]

  @@unique([userId, benefitId])
}

model ChecklistItem {
  id             String   @id @default(uuid())
  savedBenefitId String
  label          String
  checked        Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  savedBenefit   SavedBenefit @relation(fields: [savedBenefitId], references: [id], onDelete: Cascade)
}
`);

// 3. Prisma Seed
write('prisma/seed.ts', `
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const benefits = [
    {
      id: '1',
      title: '국민내일배움카드',
      category: 'education',
      categoryLabel: '교육',
      agency: '고용노동부',
      description: '취업을 준비하는 청년 및 구직자의 직업 훈련비용 지원',
      supportContent: '직업 훈련비용을 최대 500만원까지 지원하는 제도입니다.',
      target: '취업을 준비하는 청년 및 구직자',
      documents: '신분증, 구직등록필증',
      applyMethod: 'HRD-Net 홈페이지 신청 또는 고용센터 방문',
      applyUrl: 'https://www.hrd.go.kr',
      iconType: 'education',
      isRecommended: true
    },
    {
      id: '2',
      title: '중소기업 취직 청년 소득세 감면',
      category: 'finance',
      categoryLabel: '금융',
      agency: '국세청',
      description: '중소기업에 취업한 청년의 소득세를 5년간 최대 90%까지 감면',
      supportContent: '매년 최대 200만원 한도 내에서 소득세 90% 감면',
      target: '만 15세 ~ 34세 이하 중소기업 취업 청년',
      documents: '감면신청서, 주민등록등본, 원천징수영수증',
      applyMethod: '회사에 감면신청서 제출',
      iconType: 'finance',
      isRecommended: true
    },
    {
      id: '3',
      title: '청년 창업 지원금',
      category: 'startup',
      categoryLabel: '창업',
      agency: '중소벤처기업부',
      description: '청년 창업가에게 사업화 자금 및 교육, 멘토링 지원',
      supportContent: '최대 1억원의 창업 사업화 자금 및 멘토링 지원',
      target: '만 39세 이하 예비 창업자 또는 초기 창업자',
      documents: '사업계획서, 주민등록등본',
      applyMethod: 'K-Startup 홈페이지 온라인 신청',
      deadline: '2026-06-30',
      iconType: 'startup',
      isRecommended: false
    },
    {
      id: '4',
      title: '청년 월세 지원',
      category: 'life',
      categoryLabel: '생활',
      agency: '국토교통부',
      description: '저소득 독립 청년에게 최대 20만원씩 12개월간 월세 지원',
      supportContent: '월 최대 20만원 지원 (12개월)',
      target: '만 19세~34세 무주택 청년 (소득요건 충족시)',
      documents: '가족관계증명서, 임대차계약서, 통장사본',
      applyMethod: '복지로 온라인 신청 또는 관할 주민센터 방문',
      deadline: '2026-07-15',
      iconType: 'life',
      isRecommended: false
    }
  ];

  for (const b of benefits) {
    await prisma.benefit.upsert({
      where: { id: b.id },
      update: b,
      create: b
    });
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
`);

// 4. TSConfig update in backend
const tsconfigPath = path.join(__dirname, 'backend', 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  const content = fs.readFileSync(tsconfigPath, 'utf-8');
  fs.writeFileSync(tsconfigPath, content.replace('"outDir": "./"', '"outDir": "./dist"'));
}

console.log('Script 2 done.');
