import "@/styles/globals.css";
import { Layouts } from "@/components/layout/layout";

export default function App({ Component, pageProps }) {
  const Layout = Layouts[Component.Layout] || Layouts.Main;
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
