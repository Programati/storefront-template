// import { Toaster } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import { Button } from "./components/ui/button";
import { toast } from "sonner";

function App() {
  return (
    <>
      <Toaster />
      <Button onClick={() => toast("Hola")}>Click Me!</Button>
    </>
  );
}

export default App;
