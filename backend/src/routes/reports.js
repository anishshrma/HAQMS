const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reports/doctor-stats
// Highly inefficient nested loop aggregate reporting for admin/receptionists dashboard
// PERFORMANCE BUG: Performs multiple nested DB queries inside a loop for every doctor.
// Runs sequentially, blocking/scaling terrible with doctors count.
router.get('/doctor-stats', authenticate, async (req, res) => {
  try {
    const start = Date.now();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Eager load relations in a single database query to resolve the N+1 bottleneck
    const doctors = await prisma.doctor.findMany({
      include: {
        appointments: true,
        queueTokens: {
          where: {
            createdAt: { gte: today },
          },
        },
      },
    });

    // Aggregate values in-memory over eager-loaded relationships
    const reportData = doctors.map((doc) => {
      const totalAppointments = doc.appointments.length;
      const completedAppointments = doc.appointments.filter((a) => a.status === 'COMPLETED').length;
      const cancelledAppointments = doc.appointments.filter((a) => a.status === 'CANCELLED').length;
      const todayQueueSize = doc.queueTokens.length;
      const revenue = completedAppointments * doc.consultationFee;

      return {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        department: doc.department,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        todayQueueSize,
        revenue,
      };
    });

    const durationMs = Date.now() - start;

    res.json({
      success: true,
      timeTakenMs: durationMs,
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }
});

module.exports = router;
