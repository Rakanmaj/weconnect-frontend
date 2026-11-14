import * as React from "react";
import { cn } from "@/lib/utils";
const Label = React.forwardRef(({ className, required, children, ...props }, ref) => {
    return (<label ref={ref} className={cn("text-label text-navy block", className)} {...props}>
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>);
});
Label.displayName = "Label";
export { Label };
