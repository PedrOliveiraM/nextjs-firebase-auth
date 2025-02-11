/* eslint-disable prettier/prettier */
import { DownloadSchema } from '@/@types/downloadsDto';
import { db } from '@/lib/firebase';
import { AggregateField, FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const downloadsRef = db.collection('downloads');
    const sumAggregateQuery = downloadsRef.aggregate({
      totalQuantity: AggregateField.sum('quantity'),
    });
    const snapshotDownloads = await sumAggregateQuery.get();

    const usersRef = db.collection('users')
    const snapshotUsers = await usersRef.count().get()

    const accessRef = db.collection('page_access')
    const snapshotAccess = await accessRef.count().get()

    return NextResponse.json(
      {
        totalDownloads: snapshotDownloads.data().totalQuantity,
        totalUsers: snapshotUsers.data().count,
        totalAccess: snapshotAccess.data().count
      },
      { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    const validationResult = DownloadSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const downloadData = validationResult.data;

    const result = await db.collection('downloads').add(downloadData);

    return NextResponse.json(
      { message: 'Download registered successfully', downloadId: result.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error ${error}` },
      { status: 500 }
    );
  }
}

// Rota PATCH: Incrementa +1 na quantidade de um documento com {filename}
export async function PATCH(request: NextRequest) {
  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const downloadsRef = db.collection('downloads')
    const query = downloadsRef.where('filename', '==', filename)

    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const docRef = querySnapshot.docs[0].ref;

    const docUpdate = await docRef.update({
      quantity: FieldValue.increment(1),
    })

    if (!docUpdate) throw new Error('Error updating quantity');

    return NextResponse.json({ message: 'Quantity updated successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error ${error}` }, { status: 500 });
  }
}