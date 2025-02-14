'use server';
import { NextResponse } from 'next/server';

export async function GET() {
    const users = {
        name: 'test',
        email: 'tset2'
    }
    return NextResponse.json(users);
    
}
