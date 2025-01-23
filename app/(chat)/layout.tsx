import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { auth } from '../(auth)/auth';
import Script from 'next/script';

import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Stripe Products and Checkout",
  description: "A template to showcase Stripe products, Next.js Server Actions, and a checkout flow.",
}

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <SiteHeader />
      </TooltipProvider>
      <SidebarProvider defaultOpen={!isCollapsed}>
        <TooltipProvider delayDuration={0}>
          <AppSidebar user={session?.user} />
        </TooltipProvider>
        <main className="flex-1">{children}</main>
      </SidebarProvider>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
