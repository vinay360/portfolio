import Image from "next/image";
import { Suspense } from "react";

import { SocialMedia } from "@/components/common/SocialMedia";
import { HeroEmailCopy } from "@/components/home/HeroEmailCopy";
import { Spotify, SpotifySkeleton } from "@/components/home/Spotify";

export function Hero() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Image
          src="/assets/avatar.avif"
          alt="Vinay Agarwal - Software Development Engineer"
          width={192}
          height={192}
          priority
          className="size-24 rounded-full dark:bg-yellow-300 bg-blue-300"
        />
        <div>
          <h1 className="text-lg font-bold whitespace-nowrap sm:text-2xl">
            Vinay Agarwal
          </h1>
          <p className="text-base text-secondary flex flex-wrap items-center gap-x-1 gap-y-1">
            <span>Engineer · Backend &amp; AI</span>
            <span>·</span>
            <HeroEmailCopy />
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground max-w-xl">
        I build backends that hold up under load, and AI systems that stay grounded.
      </p>
      <Suspense fallback={<SpotifySkeleton />}>
        <Spotify />
      </Suspense>
      <SocialMedia instant className="my-0 gap-0.5" />
    </div>
  );
}
