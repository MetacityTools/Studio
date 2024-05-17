"use server";

import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <h1>Studio Public</h1>
      <Link href="/secret">Open Secret Page</Link>
    </div>
  );
}
