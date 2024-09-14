import { Button } from "@/components/ui/button"
import Navbar from "./components/Navbar";
import Link from 'next/link';
export default function Home() {
  console.log(process.env.GOOGLE_CLIENT_ID);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      hello
      <Button><Link href='/echo'>Create Echoes</Link></Button>
      <Button><Link href='/echolist'>My Echoes</Link></Button>
      <Navbar></Navbar>

    </main>
  );
}
