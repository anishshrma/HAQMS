const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/appointments
// List all appointments
// PERFORMANCE BUG: Classic N+1 Query Issue!
// Instead of using Prisma's include, it loops through each appointment and executes
// individual select statements for Patient and Doctor details.
router.get('/', authenticate, async (req, res) => {
  try {
    const { doctorId, status } = req.query;

    const where = {};
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    // Fetch appointments with patient and doctor details eager-loaded in a single query (N+1 resolved)
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });

    const detailedAppointments = appointments.map((app) => ({
      ...app,
      patient: app.patient ? { 
        id: app.patient.id, 
        name: app.patient.name, 
        phoneNumber: app.patient.phoneNumber, 
        age: app.patient.age, 
        medicalHistory: app.patient.medicalHistory 
      } : null,
      doctor: app.doctor ? { 
        id: app.doctor.id, 
        name: app.doctor.name, 
        specialization: app.doctor.specialization 
      } : null,
    }));

    res.json({
      success: true,
      count: detailedAppointments.length,
      appointments: detailedAppointments,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments', details: error.message });
  }
});

// POST /api/appointments
// Book an appointment
// DESIGN BUG: Duplicate-prone schema. No unique index blocks duplicate appointment bookings.
// In this API, we have a half-hearted verification that is easily bypassed or logically flawed,
// allowing multiple bookings for the exact same date and doctor.
router.post('/', authenticate, async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, reason } = req.body;

    if (!patientId || !doctorId || !appointmentDate) {
      return res.status(400).json({ error: 'Patient, Doctor, and Appointment Date are required.' });
    }

    const appDate = new Date(appointmentDate);
    const bufferMinutes = 15;
    const startTime = new Date(appDate.getTime() - bufferMinutes * 60 * 1000);
    const endTime = new Date(appDate.getTime() + bufferMinutes * 60 * 1000);

    // Robust slot double-booking check: prevents booking within 15 minutes of an existing appointment
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: {
          gte: startTime,
          lte: endTime,
        },
        status: { not: 'CANCELLED' },
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        error: 'Double booking blocked. Doctor already has an appointment scheduled within 15 minutes of this slot.',
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: appDate,
        reason: reason || '',
        status: 'PENDING',
      },
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }
});

// PATCH /api/appointments/:id
// Update appointment status (COMPLETED, CANCELLED, etc.)
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment', details: error.message });
  }
});

module.exports = router;
