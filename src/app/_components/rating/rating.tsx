"use client";

import { Rating } from "flowbite-react";

export function RatingComponent() {
  return (
    <Rating>
      <Rating.Star />
      <p className="ml-2 text-sm font-bold text-gray-400">4.95</p>
      <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
      <a href="#" className="text-sm font-medium text-gray-400 underline hover:no-underline">
        (73 reviews)
      </a>
    </Rating>
  );
}