import express from 'express';

const router = express.Router();

router.get('/:id?', (req, res) => {
  res.json({ title: 'users' });
});

export default router;
