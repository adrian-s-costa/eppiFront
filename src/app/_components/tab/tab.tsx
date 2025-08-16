'use client'

import React, { useState } from 'react';

const PricingToggle = ({isAnnual, setIsAnnual}: any) => {

    return (
      <div className="flex justify-center w-full m-auto mb-8 lg:mb-16">
        <div className="relative flex w-full p-1 bg-gray-200 dark:bg-slate-900 rounded-md">
          <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
            <span className={`absolute inset-0 w-1/2 bg-white rounded-md shadow-sm shadow-indigo-950/10 transform transition-transform duration-150 ease-in-out ${isAnnual ? 'translate-x-0' : 'translate-x-full'}`}></span>
          </span>
          <button 
            className={`relative flex-1 text-sm font-medium h-8 rounded-md focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-slate-600 transition-colors duration-150 ease-in-out ${isAnnual ? 'text-black' : 'text-slate-500 dark:text-slate-400'}`} 
            onClick={() => setIsAnnual(true)} 
            aria-pressed={isAnnual}
          >
            Entrar <span className={isAnnual ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}></span>
          </button>
          <button 
            className={`relative flex-1 text-sm font-medium h-8 rounded-md focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-slate-600 transition-colors duration-150 ease-in-out ${isAnnual ? 'text-slate-500 dark:text-slate-400' : 'text-black'}`} 
            onClick={() => setIsAnnual(false)} 
            aria-pressed={!isAnnual}
          >
            Registrar
          </button>
        </div>
      </div>
    );
}

export default PricingToggle;
