import { Router } from 'express';
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import {
  authMiddleware,
  internalOnly,
  rbacAdminOnly,
  rbacClient,
} from '../middleware/internal.middleware';

const router = Router();

router.use(internalOnly);

router.get('/users', getUsers);
router.post('/add_users', addUser);
router.put('/update_users/:id', updateUser);
router.delete('/delete_users/:id', deleteUser);
router.get('/api/users', authMiddleware, rbacAdminOnly, async (_, res) => {
  const result = await rbacClient.get('/users');
  res.json(result.data);
});

export default router;
