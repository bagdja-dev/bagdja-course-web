import Head from "next/head";
import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({
  children,
  title = "Bagdja Course",
  description = "Online & offline courses, plus curated eBooks."
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-14">{children}</main>
        <Footer />
      </div>
    </>
  );
}

