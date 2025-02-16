// import Layout from "../../components/Layout";
// import "../../styles/globals.css";
// import { ReactNode } from "react";

// interface RootLayoutProps {
//   children: ReactNode;
// }

// export default function RootLayout({ children }: RootLayoutProps) {
//   return (
//     <html lang="en">
//       <body>
//         <Layout>{children}</Layout>
//       </body>
//     </html>
//   );
// }
// 
import Layout from "../../components/Layout";
import "../../styles/globals.css";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}