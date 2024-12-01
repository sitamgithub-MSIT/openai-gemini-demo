"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";

/**
 * ThemeProvider component that wraps its children with the NextThemesProvider.
 *
 * @param {ThemeProviderProps} props - The properties passed to the ThemeProvider.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the ThemeProvider.
 * @returns {JSX.Element} The NextThemesProvider component wrapping the children.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
