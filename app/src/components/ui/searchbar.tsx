import * as React from "react"

import { cn } from "../../lib/utils"
import { Search } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchBar = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
        <>
          <Search className="absolute ml-3 h-4 w-4 pointer-events-none" />
          <input
            type={type}
            className={cn(
              "flex h-10 w-full text-black rounded-md border border-input bg-background py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
        </>
    )
  }
)
SearchBar.displayName = "Input"

export { SearchBar }
