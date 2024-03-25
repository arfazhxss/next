import { Navbar } from "@/components/navbar";

interface ChatLayoutProps { children: React.ReactNode; }

/**
 * Renders the chat layout component.
 *
 * @param {ChatLayoutProps} children - The children components to be rendered within the chat layout.
 * @return {JSX.Element} The rendered chat layout component.
 */
export default function ChatLayout({ children }: ChatLayoutProps) {
    return (
        <div className="bg-slate-950">
            <Navbar />
            <main className="flex h-full">
                <div className="h-full w-full"> {children} </div>
            </main>
        </div>
    );
};