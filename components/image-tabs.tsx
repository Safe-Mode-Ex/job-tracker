'use client';

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TABS } from "@/lib/data";

export default function ImageTabs() {
  const [{title, image}, setActiveTab] = useState(TABS[0]);

  return (
    <section className="border-t bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-2 justify-center mb-8">
            {TABS.map((tab) => (
              <Button
                key={tab.title}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${title === tab.title
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {tab.title}
              </Button>
            ))}
          </div>

          <div
            className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl"
          >
            <Image
              key={image}
              src={image}
              alt={title}
              width="1200"
              height="800"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
