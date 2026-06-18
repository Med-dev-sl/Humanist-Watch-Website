import Image from "next/image";

export default function Home() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-primary to-primary-dark px-4">
      <div className="animate-slide-up flex flex-col items-center gap-6 text-center">
        <Image
          src="/Huwasal%20Logo.png"
          alt="Humanist Watch Salone"
          width={180}
          height={180}
          className="h-44 w-44 object-contain drop-shadow-lg sm:h-52 sm:w-52"
          priority
        />
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Humanist Watch Salone
        </h1>
        <p className="max-w-md text-lg text-white/70">
          Empowering communities, defending rights, building a better future for
          all.
        </p>
      </div>
    </section>
  );
}
