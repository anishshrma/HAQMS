const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding HAQMS database...');

  // ─── Users ────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@haqms.com' },
    update: {},
    create: {
      email: 'admin@haqms.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'ADMIN',
    },
  });

  const receptionist = await prisma.user.upsert({
    where: { email: 'reception1@haqms.com' },
    update: {},
    create: {
      email: 'reception1@haqms.com',
      password: hashedPassword,
      name: 'Sarah Connor',
      role: 'RECEPTIONIST',
    },
  });

  const doctorUser1 = await prisma.user.upsert({
    where: { email: 'doctor1@haqms.com' },
    update: {},
    create: {
      email: 'doctor1@haqms.com',
      password: hashedPassword,
      name: 'Dr. Gregory House',
      role: 'DOCTOR',
    },
  });

  const doctorUser2 = await prisma.user.upsert({
    where: { email: 'doctor2@haqms.com' },
    update: {},
    create: {
      email: 'doctor2@haqms.com',
      password: hashedPassword,
      name: 'Dr. Meredith Grey',
      role: 'DOCTOR',
    },
  });

  const doctorUser3 = await prisma.user.upsert({
    where: { email: 'doctor3@haqms.com' },
    update: {},
    create: {
      email: 'doctor3@haqms.com',
      password: hashedPassword,
      name: 'Dr. John Carter',
      role: 'DOCTOR',
    },
  });

  console.log('✅ Users seeded');

  // ─── Doctors ──────────────────────────────────────────────────────────────
  const doctor1 = await prisma.doctor.upsert({
    where: { userId: doctorUser1.id },
    update: {},
    create: {
      userId: doctorUser1.id,
      name: 'Dr. Gregory House',
      specialization: 'Diagnostics',
      department: 'Internal Medicine',
      consultationFee: 250,
      experience: 20,
      availableFrom: '09:00',
      availableTo: '17:00',
    },
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { userId: doctorUser2.id },
    update: {},
    create: {
      userId: doctorUser2.id,
      name: 'Dr. Meredith Grey',
      specialization: 'General Surgery',
      department: 'Surgery',
      consultationFee: 320,
      experience: 12,
      availableFrom: '08:00',
      availableTo: '16:00',
    },
  });

  const doctor3 = await prisma.doctor.upsert({
    where: { userId: doctorUser3.id },
    update: {},
    create: {
      userId: doctorUser3.id,
      name: 'Dr. John Carter',
      specialization: 'Emergency Medicine',
      department: 'Emergency',
      consultationFee: 180,
      experience: 8,
      availableFrom: '10:00',
      availableTo: '18:00',
    },
  });

  // Extra doctors not linked to a login account
  const doctor4 = await prisma.doctor.create({
    data: {
      name: 'Dr. Lisa Cuddy',
      specialization: 'Endocrinology',
      department: 'Internal Medicine',
      consultationFee: 210,
      experience: 15,
      availableFrom: '09:00',
      availableTo: '17:00',
    },
  });

  const doctor5 = await prisma.doctor.create({
    data: {
      name: 'Dr. Perry Cox',
      specialization: 'Cardiology',
      department: 'Cardiology',
      consultationFee: 290,
      experience: 18,
      availableFrom: '08:30',
      availableTo: '16:30',
    },
  });

  console.log('✅ Doctors seeded');

  // ─── Patients ─────────────────────────────────────────────────────────────
  const patients = await Promise.all([
    // Patients WITH medical history
    prisma.patient.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice.j@email.com',
        phoneNumber: '555-0101',
        age: 34,
        gender: 'Female',
        medicalHistory: 'Hypertension, managed with Lisinopril. Seasonal allergies. No known drug allergies.',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Robert Martinez',
        email: 'rob.m@email.com',
        phoneNumber: '555-0102',
        age: 52,
        gender: 'Male',
        medicalHistory: 'Type 2 Diabetes (on Metformin). History of mild angina. Non-smoker.',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Emily Davis',
        phoneNumber: '555-0103',
        age: 28,
        gender: 'Female',
        medicalHistory: 'Asthma (uses Salbutamol inhaler PRN). History of appendectomy (2019).',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Michael Thompson',
        email: 'michael.t@email.com',
        phoneNumber: '555-0104',
        age: 45,
        gender: 'Male',
        medicalHistory: 'Hypercholesterolemia on Atorvastatin. Former smoker. Mild sleep apnea.',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Sophia Williams',
        email: 'sophia.w@email.com',
        phoneNumber: '555-0105',
        age: 61,
        gender: 'Female',
        medicalHistory: 'Osteoarthritis in both knees. Post-menopause HRT. Glaucoma (controlled).',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'James Anderson',
        phoneNumber: '555-0106',
        age: 39,
        gender: 'Male',
        medicalHistory: 'Anxiety disorder (on Sertraline). Eczema flare-ups. No surgical history.',
      },
    }),
    // Patients WITHOUT medical history — triggers frontend crash bug
    prisma.patient.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@wayneenterprises.com',
        phoneNumber: '555-0199',
        age: 35,
        gender: 'Male',
        medicalHistory: null,
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Clark Kent',
        email: 'clark.kent@dailyplanet.com',
        phoneNumber: '555-0198',
        age: 32,
        gender: 'Male',
        medicalHistory: null,
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Diana Prince',
        email: 'diana@themyscira.org',
        phoneNumber: '555-0197',
        age: 29,
        gender: 'Female',
        medicalHistory: null,
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Peter Parker',
        phoneNumber: '555-0196',
        age: 23,
        gender: 'Male',
        medicalHistory: 'History of wrist fractures (bilateral). Heightened sensory response noted.',
      },
    }),
  ]);

  console.log(`✅ ${patients.length} patients seeded`);

  // ─── Appointments ─────────────────────────────────────────────────────────
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const makeDateTime = (base, hour, minute = 0) => {
    const d = new Date(base);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  const appointments = await Promise.all([
    // Today's appointments
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctor1.id,
        appointmentDate: makeDateTime(today, 9, 0),
        reason: 'Routine diagnostic review',
        status: 'PENDING',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctor1.id,
        appointmentDate: makeDateTime(today, 10, 30),
        reason: 'Follow-up on blood sugar management',
        status: 'PENDING',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctor2.id,
        appointmentDate: makeDateTime(today, 9, 30),
        reason: 'Pre-surgical consultation',
        status: 'PENDING',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[3].id,
        doctorId: doctor2.id,
        appointmentDate: makeDateTime(today, 11, 0),
        reason: 'Chest pain evaluation',
        status: 'COMPLETED',
      },
    }),
    // Bruce Wayne — no medical history (crash trigger)
    prisma.appointment.create({
      data: {
        patientId: patients[6].id,
        doctorId: doctor1.id,
        appointmentDate: makeDateTime(today, 14, 0),
        reason: 'General check-up',
        status: 'PENDING',
      },
    }),
    // Clark Kent — no medical history (crash trigger)
    prisma.appointment.create({
      data: {
        patientId: patients[7].id,
        doctorId: doctor3.id,
        appointmentDate: makeDateTime(today, 13, 0),
        reason: 'Annual physical',
        status: 'PENDING',
      },
    }),
    // Yesterday (completed)
    prisma.appointment.create({
      data: {
        patientId: patients[4].id,
        doctorId: doctor1.id,
        appointmentDate: makeDateTime(yesterday, 10, 0),
        reason: 'Knee pain assessment',
        status: 'COMPLETED',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[5].id,
        doctorId: doctor2.id,
        appointmentDate: makeDateTime(yesterday, 14, 0),
        reason: 'Dermatological review',
        status: 'COMPLETED',
      },
    }),
    // Tomorrow
    prisma.appointment.create({
      data: {
        patientId: patients[9].id,
        doctorId: doctor3.id,
        appointmentDate: makeDateTime(tomorrow, 10, 0),
        reason: 'Wrist pain and mobility assessment',
        status: 'PENDING',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[8].id,
        doctorId: doctor2.id,
        appointmentDate: makeDateTime(tomorrow, 11, 30),
        reason: 'Minor laceration suture removal',
        status: 'PENDING',
      },
    }),
    // Cancelled
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctor3.id,
        appointmentDate: makeDateTime(today, 15, 0),
        reason: 'Blood pressure monitoring',
        status: 'CANCELLED',
      },
    }),
  ]);

  console.log(`✅ ${appointments.length} appointments seeded`);

  // ─── Queue Tokens ──────────────────────────────────────────────────────────
  await Promise.all([
    prisma.queueToken.create({
      data: {
        tokenNumber: 1,
        patientId: patients[0].id,
        doctorId: doctor1.id,
        appointmentId: appointments[0].id,
        status: 'CALLING',
      },
    }),
    prisma.queueToken.create({
      data: {
        tokenNumber: 2,
        patientId: patients[1].id,
        doctorId: doctor1.id,
        appointmentId: appointments[1].id,
        status: 'WAITING',
      },
    }),
    prisma.queueToken.create({
      data: {
        tokenNumber: 3,
        patientId: patients[6].id,
        doctorId: doctor1.id,
        status: 'WAITING',
      },
    }),
    prisma.queueToken.create({
      data: {
        tokenNumber: 1,
        patientId: patients[2].id,
        doctorId: doctor2.id,
        appointmentId: appointments[2].id,
        status: 'CALLING',
      },
    }),
    prisma.queueToken.create({
      data: {
        tokenNumber: 2,
        patientId: patients[8].id,
        doctorId: doctor2.id,
        status: 'WAITING',
      },
    }),
    prisma.queueToken.create({
      data: {
        tokenNumber: 1,
        patientId: patients[7].id,
        doctorId: doctor3.id,
        appointmentId: appointments[5].id,
        status: 'WAITING',
      },
    }),
  ]);

  console.log('✅ Queue tokens seeded');
  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Pre-seeded accounts (password: password123):');
  console.log('  ADMIN       → admin@haqms.com');
  console.log('  RECEPTIONIST → reception1@haqms.com');
  console.log('  DOCTOR      → doctor1@haqms.com  (Dr. Gregory House)');
  console.log('  DOCTOR      → doctor2@haqms.com  (Dr. Meredith Grey)');
  console.log('  DOCTOR      → doctor3@haqms.com  (Dr. John Carter)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
