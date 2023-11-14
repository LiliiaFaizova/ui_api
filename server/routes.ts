import { Router } from 'express';

import Wallet from './models';
import { Transaction } from './types';

const router = Router();

/**
 * GET: /api/wallet
 */
router.get('/', async (_, response) => {
    const wallet = await Wallet.getWallet();
    return response.json(wallet);
});

/**
 * POST: /api/wallet
 */
router.post('/', async (request, response) => {
    const transaction: Transaction  = request.body;

    const result = await Wallet.makeTransaction(transaction);

    return response.json(result);
});

/**
 * POST: /api/wallet/reset
 */
router.post('/reset', async (_, response) => {
    await Wallet.reset();

    return response.status(204).json();
});

export default router;