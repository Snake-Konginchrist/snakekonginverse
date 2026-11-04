import { NextRequest, NextResponse } from 'next/server';
import { cms } from '@/lib/content';
import { newVisitor, validVisitor, visitorCookie } from '@/lib/novel-view-identity';
import { recordView } from '@/lib/novel-views';

export async function POST(request: NextRequest) {
  if (request.headers.get('sec-fetch-site') === 'cross-site' || !sameOrigin(request))
    return new NextResponse(null, { status: 403 });
  let body;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (
    !body ||
    typeof body.book !== 'string' ||
    !/^n-[a-z0-9]+$/.test(body.book) ||
    (body.chapter !== undefined &&
      (typeof body.chapter !== 'string' || !/^c-[a-z0-9]+$/.test(body.chapter)))
  )
    return new NextResponse(null, { status: 400 });
  const payload = await cms();
  const books = await payload.find({
    collection: 'novels',
    where: { slug: { equals: body.book } },
    overrideAccess: false,
    depth: 0,
    limit: 1,
  });
  const book = books.docs[0];
  if (!book) return new NextResponse(null, { status: 404 });
  const targets = [`novel:${book.id}`];
  if (body.chapter) {
    const chapters = await payload.find({
      collection: 'chapters',
      where: { and: [{ novel: { equals: book.id } }, { slug: { equals: body.chapter } }] },
      overrideAccess: false,
      depth: 0,
      limit: 1,
    });
    if (!chapters.docs[0]) return new NextResponse(null, { status: 404 });
    targets.push(`chapter:${chapters.docs[0].id}`);
  }
  const secret = payload.secret;
  const visitor = request.cookies.get(visitorCookie)?.value;
  if (!validVisitor(visitor, secret)) {
    const response = NextResponse.json(
      { retry: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
    response.cookies.set(visitorCookie, newVisitor(secret), {
      httpOnly: true,
      sameSite: 'lax',
      secure: request.nextUrl.protocol === 'https:',
      path: '/',
      maxAge: 31536000,
    });
    return response;
  }
  const counts = await recordView(payload, visitor, targets);
  return NextResponse.json(
    { views: counts[targets.at(-1)!] ?? 0 },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

function sameOrigin(request: NextRequest) {
  try {
    const origin = new URL(request.headers.get('origin') || '');
    return (
      ['https:', 'http:'].includes(origin.protocol) && origin.host === request.headers.get('host')
    );
  } catch {
    return false;
  }
}
