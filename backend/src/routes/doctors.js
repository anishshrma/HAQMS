const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/doctors
// Retrieve list of doctors with special search filtering
// SECURITY BUG: SQL Injection vulnerability in the search parameter!
// Uses queryRawUnsafe with string concatenation instead of parameterized inputs.
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, specialization } = req.query;

    const where = {};
    if (specialization && specialization !== 'All') {
      where.specialization = specialization;
    }
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Safe from SQL Injection, database-agnostic ORM call
    const doctors = await prisma.doctor.findMany({
      where,
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve doctors', details: error.message });
  }
});

// GET /api/doctors/stats
// Returns aggregation details about available doctors
// PERFORMANCE BUG: Sequential async calls instead of Promise.all()
router.get('/stats', authenticate, async (req, res) => {
  try {
    const start = Date.now();

    // Query aggregates concurrently using Promise.all()
    const [
      totalDoctors,
      surgeonsCount,
      averageFeeResult,
      highestExperienceResult
    ] = await Promise.all([
      prisma.doctor.count(),
      prisma.doctor.count({ where: { department: 'Surgery' } }),
      prisma.doctor.aggregate({ _avg: { consultationFee: true } }),
      prisma.doctor.aggregate({ _max: { experience: true } })
    ]);

    const durationMs = Date.now() - start;

    res.json({
      success: true,
      data: {
        total: totalDoctors,
        surgeons: surgeonsCount,
        averageFee: Math.round(averageFeeResult._avg.consultationFee || 0),
        maxExperience: highestExperienceResult._max.experience || 0,
      },
      debugInfo: {
        executionTimeMs: durationMs,
        notes: 'Loaded concurrently using Promise.all() for maximum throughput.'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/doctors/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
