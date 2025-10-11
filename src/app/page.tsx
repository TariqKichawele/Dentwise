
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button>Click me</Button>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignUpButton />
      </SignedOut>
    </div>
  );
}
