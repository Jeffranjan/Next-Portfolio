import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagneticCursor from "@/components/common/MagneticCursor";
import ClientLoader from "@/components/layout/ClientLoader";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClientLoader>
            <Navbar />
            <MagneticCursor />
            {children}
            <Footer />
        </ClientLoader>
    );
}
