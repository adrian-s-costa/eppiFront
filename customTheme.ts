import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite } from "flowbite-react";

const customTheme: CustomFlowbiteTheme = {
    tabs:{
        base: "flex flex-col gap-2",
        tablist: {
        base: "flex text-center flex-wrap space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400",
            
        tabitem: {
            base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
            styles: {
                pills: {
                    base: "",
                    active: {
                        on: "rounded-lg bg-cyan-600 text-white",
                        off: "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                    }
                },
            }
        }
    }
}
}
