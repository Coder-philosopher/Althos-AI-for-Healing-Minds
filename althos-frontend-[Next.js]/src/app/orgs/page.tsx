import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function OrgsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-8 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-[#BE5985] pt-10 mb-8 border-b-4 border-[#EC7FA9] pb-4 tracking-tight">
          Organization Dashboard
        </h1>
        <p className="text-xl text-[#8B658B] mb-6 leading-relaxed border-l-4 border-[#BE5985] pl-6 italic max-w-3xl mx-auto">
          Welcome to the Organization Dashboard! Here admins can securely view aggregate analytics on user moods, login trends, alert counts, and share feature usage — all without any personal details shared.  
        </p>
        <p className="text-lg text-[#A07AA7] mb-12 max-w-xl mx-auto leading-relaxed tracking-wide">
          The dashboard shows multiple beautiful graphs from October 11 till today, giving a clear picture of your organization's well-being and engagement over time.
        </p>
        <Link href="/orgs/dashboard" aria-label="Try Organization Dashboard">
          <p className="inline-block bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-bold px-10 py-4 shadow-md hover:shadow-lg border-2 border-[#BE5985] transition-transform hover:scale-[1.05] cursor-pointer select-none">
            Try it out &rarr;
          </p>
        </Link>
      </main>
    </>
  )
}
