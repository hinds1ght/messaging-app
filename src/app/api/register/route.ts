import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

import { registerSchema } from '@/lib/validator';
import {
  sanitizeDisplayName,
  sanitizeEmail,
  sanitizePassword,
} from '@/lib/sanitize';

import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validator
    const parsed = registerSchema.parse(body);

    // sanitizer
    const displayName = sanitizeDisplayName(parsed.displayName);
    const email = sanitizeEmail(parsed.email);
    const password = sanitizePassword(parsed.password);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { displayName },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        displayName,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: 'User registered',
        user: {
          id: newUser.id,
          name: newUser.displayName,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    console.error('Register Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
