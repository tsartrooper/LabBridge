import React from "react";

type Props = {
  children?: React.ReactNode;
  title: string;
};

export const PageHeader = ({ title, children }: Props) => {
  return (
    <div className="top-0 left-0 md:z-[10] md:sticky flex justify-between items-center backdrop-blur-md mb-6 p-4 border-b w-full">
      <h1 className="font-bold text-3xl text-gray-800">{title}</h1>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
};