const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, 'backend', file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// Index
write('src/index.ts', `
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import benefitRoutes from './routes/benefit.routes';
import savedBenefitRoutes from './routes/savedBenefit.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api/benefits', benefitRoutes);
app.use('/api/me/saved-benefits', savedBenefitRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`);

// Auth Middleware
write('src/middlewares/auth.middleware.ts', `
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
`);

// Auth routes (mock)
write('src/routes/auth.routes.ts', `
import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();
router.post('/login', (req, res) => {
  const token = jwt.sign({ id: 'user-1' }, process.env.JWT_SECRET || 'change-me');
  res.json({ token, user: { id: 'user-1', name: '홍길동', email: 'test@test.com' } });
});
export default router;
`);

// Benefit Routes & Controllers & Services
write('src/routes/benefit.routes.ts', `
import { Router } from 'express';
import { getBenefits, getBenefitById } from '../controllers/benefit.controller';
const router = Router();
router.get('/', getBenefits);
router.get('/:id', getBenefitById);
export default router;
`);

write('src/controllers/benefit.controller.ts', `
import { Request, Response } from 'express';
import * as benefitService from '../services/benefit.service';
export const getBenefits = async (req: Request, res: Response) => {
  try {
    const { category, q, recommended, deadlineSoon } = req.query;
    const benefits = await benefitService.findBenefits({ 
      category: category as string, 
      q: q as string, 
      recommended: recommended === 'true',
      deadlineSoon: deadlineSoon === 'true'
    });
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const getBenefitById = async (req: Request, res: Response) => {
  try {
    const benefit = await benefitService.findBenefitById(req.params.id);
    if (!benefit) return res.status(404).json({ error: 'Not found' });
    res.json(benefit);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
`);

write('src/services/benefit.service.ts', `
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const findBenefits = async (filters: { category?: string, q?: string, recommended?: boolean, deadlineSoon?: boolean }) => {
  let where: any = {};
  if (filters.category && filters.category !== 'all') where.category = filters.category;
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { description: { contains: filters.q } },
      { agency: { contains: filters.q } }
    ];
  }
  if (filters.recommended) where.isRecommended = true;
  if (filters.deadlineSoon) where.deadline = { not: null };
  return prisma.benefit.findMany({ where });
};
export const findBenefitById = async (id: string) => prisma.benefit.findUnique({ where: { id } });
`);

// SavedBenefit Routes & Controllers & Services
write('src/routes/savedBenefit.routes.ts', `
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/savedBenefit.controller';
const router = Router();
router.use(authMiddleware);
router.get('/', ctrl.getSavedBenefits);
router.post('/', ctrl.saveBenefit);
router.delete('/:id', ctrl.removeSavedBenefit);
router.patch('/:id/status', ctrl.updateStatus);
router.patch('/:id/checklist', ctrl.updateChecklist);
export default router;
`);

write('src/controllers/savedBenefit.controller.ts', `
import { Request, Response } from 'express';
import * as service from '../services/savedBenefit.service';
export const getSavedBenefits = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const items = await service.getSaved(userId);
    res.json(items);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
};
export const saveBenefit = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { benefitId } = req.body;
    const item = await service.save(userId, benefitId);
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
};
export const removeSavedBenefit = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await service.remove(userId, req.params.id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
};
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { status } = req.body;
    const item = await service.updateStatus(userId, req.params.id, status);
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
};
export const updateChecklist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { checklist } = req.body;
    const item = await service.updateChecklist(userId, req.params.id, checklist);
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
};
`);

write('src/services/savedBenefit.service.ts', `
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getSaved = async (userId: string) => prisma.savedBenefit.findMany({ where: { userId }, include: { benefit: true, checklist: true } });
export const save = async (userId: string, benefitId: string) => {
  return prisma.savedBenefit.create({
    data: { userId, benefitId, checklist: { create: [{ label: '서류 준비', checked: false }] } },
    include: { benefit: true, checklist: true }
  });
};
export const remove = async (userId: string, id: string) => prisma.savedBenefit.deleteMany({ where: { id, userId } });
export const updateStatus = async (userId: string, id: string, status: string) => {
  const exists = await prisma.savedBenefit.findFirst({ where: { id, userId } });
  if (!exists) throw new Error('Not found');
  return prisma.savedBenefit.update({ where: { id }, data: { status }, include: { benefit: true, checklist: true } });
};
export const updateChecklist = async (userId: string, id: string, checklist: any[]) => {
  const exists = await prisma.savedBenefit.findFirst({ where: { id, userId } });
  if (!exists) throw new Error('Not found');
  // Simple replacement logic for mock
  await prisma.checklistItem.deleteMany({ where: { savedBenefitId: id } });
  return prisma.savedBenefit.update({
    where: { id },
    data: { checklist: { create: checklist.map(c => ({ label: c.label, checked: c.checked })) } },
    include: { benefit: true, checklist: true }
  });
};
`);

console.log('Script 3 done.');
