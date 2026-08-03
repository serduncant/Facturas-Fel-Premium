import express from 'express';
import multer from 'multer';
import prisma from './prismaClient';

const router = express.Router();

// Configuración multer para guardar archivos en 'uploads/'
const upload = multer({ dest: 'uploads/' });

// Endpoint POST para subir comprobantes de pago
router.post('/upload-payment-proof', upload.single('proof'), async (req, res) => {
  try {
    const { userId, subscriptionId, amount } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Archivo requerido' });
    }

    const paymentProof = await prisma.paymentProof.create({
      data: {
        userId: Number(userId),
        subscriptionId: Number(subscriptionId),
        amount: parseFloat(amount),
        proofFileUrl: req.file.path,
        status: 'pending'
      }
    });

    res.json(paymentProof);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir comprobante' });
  }
});

export default router;
