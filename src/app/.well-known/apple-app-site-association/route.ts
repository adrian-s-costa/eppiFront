import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appID: 'C64TFULVQR.app.vercel.eppi-front',
            paths: ['/auth/callback*']
          }
        ]
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
